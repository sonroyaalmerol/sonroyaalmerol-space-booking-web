import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import prisma from '../../../../../../utils/prisma';
import validate from 'validator';

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]"
import { Photo, Role, User } from '@prisma/client';

/**
   * Assigns the uploaded photo to a specific room type.
   *
   * @remarks
   * This method is part of the hotel management system.
   *
   * @param req - Next API route request object
   * @param res - Next API route response object
   * @returns A JSON object containing the photo's information or an error message.
   *
   */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message,
      photos
    }: {message: string, photos: Photo[]} = JSON.parse(req.body);

    const {
      id: hotelId,
      roomTypeId
    } = req.query;

    // Get the user's session
    // @ts-expect-error
    const session = await unstable_getServerSession(req, res, authOptions)

    // Check if the user is the hotel manager
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId as string
      }
    });

    if (hotel?.managerId !== session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Connect the photos to the room type
    const roomType = await prisma.roomType.update({
      where: {
        id: roomTypeId as string
      },
      data: {
        photos: {
          connect: photos.map(photo => ({
            id: photo.id
          }))
        }
      },
      include: {
        photos: true
      }
    })

    // Connect the photos to the hotel
    await prisma.hotel.update({
      where: {
        id: hotelId as string
      },
      data: {
        photos: {
          connect: photos.map(photo => ({
            id: photo.id
          })),
        }
      }
    })

    return res.json({ message, photos: roomType.photos });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again!" });
  }
}