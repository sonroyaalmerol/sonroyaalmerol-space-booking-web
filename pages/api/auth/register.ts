import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import prisma from '../../../utils/prisma';
import validate from 'validator';

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // @ts-expect-error
    const session = await unstable_getServerSession(req, res, authOptions)

    if (session) {
      return res.status(400).json({ error: 'You are already logged in!' });
    }

    const { firstName, lastName, email, contactNumber, password, confirmPassword } = JSON.parse(req.body);

    console.log(req.body)

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
      },
    });

    return res.json({ user, message: `Successfully registered ${user.firstName}! You may login now.` });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong with the registration. Please try again!" });
  }
}