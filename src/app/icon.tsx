import { readFile } from 'fs/promises';
import { resolve } from 'path';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  try {
    const imageBuffer = await readFile(resolve('./public/cli.png'));
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Failed to load favicon:', error);
    // Fallback to a simple generated icon
    throw new Error('Icon file not found');
  }
}