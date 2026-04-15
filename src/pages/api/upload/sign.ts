import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const GET: APIRoute = async () => {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: 'blog-articles', timestamp };
  const signature = cloudinary.utils.api_sign_request(params, import.meta.env.CLOUDINARY_API_SECRET);

  return new Response(JSON.stringify({
    signature,
    timestamp,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  }), { status: 200 });
};
