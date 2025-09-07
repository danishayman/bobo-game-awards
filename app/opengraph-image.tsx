import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Community Gaming Awards'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'linear-gradient(45deg, #000 0%, #1a1a1a 100%)',
          color: 'white',
        }}
      >
        {/* Trophy Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              color: '#000',
            }}
          >
            🏆
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #fff 0%, #ffd700 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Community Gaming Awards
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#ccc',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Vote for your favorite games and celebrate the best in gaming
        </div>

        {/* Bottom decorative elements */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '20px',
            color: '#666',
            fontSize: '20px',
          }}
        >
          <span>🎮</span>
          <span>⭐</span>
          <span>🏅</span>
          <span>🎯</span>
          <span>🔥</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}



