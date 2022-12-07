import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      hotelId,
      startDate,
      endDate,
      adults,
      children,
      rooms,
    } = JSON.parse(req.body);
    
    const roomTypes = await prisma.roomType.findMany({
      where: {
        hotelId,
        bookings: {
          every: {
            OR: [
              {
                checkIn: {
                  gte: new Date(startDate as string),
                  lte: new Date(endDate as string),
                }
              },
              {
                checkOut: {
                  gte: new Date(startDate as string),
                  lte: new Date(endDate as string),
                }
              }
            ],
          }
        },
        maxGuests: {
          gte: adults + children,
        },
        availableRooms: {
          gte: rooms,
        }
      },
      include: {
        photos: true,
      }
    })

    return res.json(roomTypes);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again!" });
  }
}