import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050816',
          borderRadius: '8px',
          color: '#38bdf8',
          fontSize: '20px',
          fontWeight: 'bold',
          border: '2px solid #38bdf8',
        }}
      >
        H
      </div>
    ),
    { ...size }
  );
}