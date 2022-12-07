import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";
import { Photo } from "@prisma/client";
import prisma from '../../../utils/prisma'
import { ObjectId } from "mongodb";

const IMAGE_DIRECTORY = "./public/photos";

const photoIds: { objectId: ObjectId, origName: string }[] = [];

// generate mongodb id for filename
// add filter for jpeg only

const storage = multer.diskStorage({
  destination: IMAGE_DIRECTORY,
  filename: (req, file, cb) => {
    const objectId = new ObjectId();
    photoIds.push({
      objectId,
      origName: file.originalname
    });

    return cb(null, `${objectId.toHexString()}.jpg`);
  },
})

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
        return cb(new Error('Only JPEG images are allowed!'));
    }
    cb(null, true)
  }
});

const handler = nextConnect();

handler.use(upload.any());

handler.post(async (req: NextApiRequest & { files: Express.Multer.File[] }, res: NextApiResponse) => {
  try {
    const uploadedImages: Photo[] = []

    for (const image of req.files) {
      // Save the image to the database
      const uploadedImage = await prisma.photo.create({
        data: {
          id: image.filename.replace('.jpg', ''), // insert mongodb id here
          originalFileName: photoIds.find((obj) => obj.objectId.toHexString() === image.filename)?.origName ?? ""
        }
      });

      uploadedImages.push(uploadedImage);
    }

    return res.json({ message: 'Successfully uploaded photos!', photos: uploadedImages });
    
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;