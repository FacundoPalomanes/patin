import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_secret_api_key,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
[key: string]: string | number | boolean | undefined;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}



export async function uploadToCloudinary(fileBuffer: Buffer, userId: string): Promise<string> {
  if (!userId) throw new Error('No userId');

  const folderPath = `potentialUsers/${userId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        public_id: 'profile',
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
        transformation: [
          {
            width: 500,
            height: 500,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result: CloudinaryUploadResult | undefined) => {
        if (error || !result?.secure_url) return reject(error || 'No URL returned');
        resolve(result.secure_url);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

export async function moveCloudinaryImage(userId: string): Promise<string | null> {
  const fromPublicId = `potentialUsers/${userId}/profile`;
  const toPublicId = `users/${userId}/profile`;

  try {
    const resource = await cloudinary.api.resource(fromPublicId).catch(() => null);
    if (!resource?.secure_url) return null;

    const uploadResult = await cloudinary.uploader.upload(resource.secure_url, {
      public_id: toPublicId,
      overwrite: true,
    });

    await cloudinary.uploader.destroy(fromPublicId);

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error moving image:', error);
    throw error;
  }
}

export async function updatePhoto(file: MulterFile, userId: string): Promise<string> {
  if (!file || !userId) throw new Error('Faltan archivo o userId');

  const folderPath = `users/${userId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        public_id: 'profile',
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
        transformation: [
          {
            width: 500,
            height: 500,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result: CloudinaryUploadResult | undefined) => {
        if (error || !result?.secure_url) return reject(error || 'No URL returned');
        resolve(result.secure_url);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
}

export async function uploadPostsPhotos(files: { buffer: Buffer; originalFilename: string }[]): Promise<string[]> {
  const uploadPromises = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'posts',
          },
          (error, result: CloudinaryUploadResult | undefined) => {
            if (error || !result?.secure_url) return reject(error || 'No URL returned');
            resolve(result.secure_url);
          }
        );

        Readable.from(file.buffer).pipe(uploadStream);
      })
  );

  return await Promise.all(uploadPromises);
}
