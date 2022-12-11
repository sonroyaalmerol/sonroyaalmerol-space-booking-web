import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import prisma from '../../../utils/prisma';
import validate from 'validator';

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { Role, User } from '@prisma/client';

/**
   * Registers both a new hotel and a new hotel manager user.
   * If the user is already authenticated, it will only create a new hotel.
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
    // Destructure the request body
    const {
      user: {
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        confirmPassword
      },
      hotel: {
        name,
        location,
        description,
      }
    } = JSON.parse(req.body);

    // Get the user's session
    // @ts-expect-error
    const session = await unstable_getServerSession(req, res, authOptions)

    let user: User | null = null;

    // If the user is not authenticated, create a new user
    if (!session) {
      if (!firstName || !email || !contactNumber || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!validate.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
  
      if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          contactNumber,
          password: hashedPassword,
          role: Role.HOTEL_MANAGER
        },
      });
    } else {
      // If the user is authenticated, get the user's information
      user = await prisma.user.findUnique({
        where: {
          email: session?.user?.email ?? undefined
        }
      })
    }

    // If the hotel information is not provided, return an error
    if (!name || !location || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // If the user is not a hotel manager, update the user's role
    if (user?.role !== Role.HOTEL_MANAGER) {
      user = await prisma.user.update({
        where: {
          id: user?.id ?? undefined
        },
        data: {
          role: Role.HOTEL_MANAGER
        }
      })
    }

    // Create the hotel
    const hotel = await prisma.hotel.create({ data: {
      name,
      location,
      description,
      manager: {
        connect: {
          id: user?.id ?? undefined
        }
      }
    }})

    return res.json({ user, hotel });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong with the registration. Please try again!" });
  }
}