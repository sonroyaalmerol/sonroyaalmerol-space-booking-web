import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from '../../../utils/prisma'

const IMAGE_DIRECTORY = "./public/photos";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const filePath = path.join(IMAGE_DIRECTORY, `${id as string}.jpg`);

  const photo = await prisma.photo.findUnique({
    where: {
      id: id as string
    }
  })

  // Check if the image exists
  if (!fs.existsSync(filePath)) {
    await prisma.photo.delete({
      where: {
        id: id as string
      }
    });

    return res.status(404).send("Image not found");
  }

  if (!photo) {
    fs.unlinkSync(filePath);

    return res.status(404).send("Image not found");
  }

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
  

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler