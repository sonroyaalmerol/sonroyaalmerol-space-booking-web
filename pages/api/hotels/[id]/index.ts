import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import prisma from '../../../../utils/prisma';
import validate from 'validator';

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { Hotel } from '@prisma/client';

/**
   * Updates a hotel's information. This includes the hotel's name, address, and description.
   * This method only allows the hotel's manager to update the hotel's information.
   *
   * @remarks
   * This method is part of the hotel management system.
   *
   * @param req - Next API route request object
   * @param res - Next API route response object
   * @returns A JSON object containing the user's information or an error message.
   *
   */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hotelData: Hotel = JSON.parse(req.body);

    const {
      id: hotelId
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

    // Update the hotel's information
    const updatedHotel = await prisma.hotel.update({
      where: {
        id: hotelId as string
      },
      data: {
        name: hotelData.name,
        description: hotelData.description,
        location: hotelData.location,
      },
      include: {
        photos: true
      }
    })

    return res.json({ message: 'Successfully updated hotel!', hotel: updatedHotel });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again!" });
  }
}