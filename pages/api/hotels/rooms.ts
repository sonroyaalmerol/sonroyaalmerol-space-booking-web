import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../utils/prisma';

/**
   * Searches for available rooms in a specific hotel.
   * This method is given a hotel ID, start date, end date, number of adults, number of children, and number of rooms.
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
    const {
      hotelId,
      startDate,
      endDate,
      adults,
      children,
      rooms,
    } = JSON.parse(req.body);
    
    // Get all room types that are available for the given dates, number of guests, and number of rooms.
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