import { ImageResponse } from 'next/og';

const ALLOWED_SIZES = new Set([180, 192, 512]);

export function GET(_request: Request, { params }: { params: { size: string } }) {
  const size = Number(params.size);
  if (!ALLOWED_SIZES.has(size)) {
    return new Response('Not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #A594FF 0%, #7C5CFF 50%, #5433E6 100%)',
          color: '#FFFFFF',
          fontSize: size * 0.34,
          fontWeight: 800,
          letterSpacing: -size * 0.01,
        }}
      >
        DG
      </div>
    ),
    {
      width: size,
      height: size,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    },
  );
}
