import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import prisma from '../../../../utils/prisma';
import validate from 'validator';

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"
import { Hotel } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const hotelData: Hotel = JSON.parse(req.body);

    const {
      id: hotelId
    } = req.query;

    // @ts-expect-error
    const session = await unstable_getServerSession(req, res, authOptions)

    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId as string
      }
    });

    if (hotel?.managerId !== session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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