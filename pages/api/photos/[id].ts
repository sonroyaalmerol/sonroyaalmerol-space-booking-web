import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from '../../../utils/prisma'
import { Photo } from "@prisma/client";

const IMAGE_DIRECTORY = "./public/photos";

/**
   * Streams the image to the client.
   * This takes the image from the public/photos directory.
   *
   * @remarks
   * This method is part of the image upload system.
   *
   * @param req - Next API route request object
   * @param res - Next API route response object
   * @returns A JSON object containing the user's information or an error message.
   *
   */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const filePath = path.join(IMAGE_DIRECTORY, `${id as string}.jpg`);

  // Check if the image exists
  let photo: Photo | null = null;

  // Check if the image exists in the database
  try {
    photo = await prisma.photo.findUnique({
      where: {
        id: id as string
      }
    })
  } catch (err) {
    return res.status(404).send("Image not found");
  }
  

  // Check if the image exists
  if (!fs.existsSync(filePath)) {
    // If it doesn't exist in the directory, delete it from the database
    await prisma.photo.delete({
      where: {
        id: id as string
      }
    });

    return res.status(404).send("Image not found");
  }

  // If it doesn't exist in the database, delete it from the directory
  if (!photo) {
    fs.unlinkSync(filePath);

    return res.status(404).send("Image not found");
  }

  // If the image exists, stream it to the client
  if (req.method === 'GET') {
    try {
      // Serve the image
      const data = fs.readFileSync(filePath);
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader('Content-Disposition', `inline; filename="${photo?.originalFileName.length > 0 ? photo?.originalFileName : `${id as string}.jpg`}"`);
      return res.send(data);
  
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      }
  
      return res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    // Delete the image from the directory
    try {
      fs.unlinkSync(filePath);

      return res.status(200).json({ message: 'Image deleted' });
  
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
  
      return res.status(500).json({ error });
    }
  }
  
  // If the method is not GET or DELETE, return an error
  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler