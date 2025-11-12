import { ImageResponse } from 'next/og';
import { siteMetadata } from '@/data/metadata';

// Image metadata
export const alt = `${siteMetadata.name} - ${siteMetadata.title}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
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
          backgroundColor: '#ffffff',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
            }}
          >
            {siteMetadata.name}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: 30,
            }}
          >
            {siteMetadata.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: '#6b7280',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Building production infrastructure, cloud security systems, and payment integrations
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 40,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              borderRadius: 9999,
              fontSize: 24,
              fontWeight: '600',
              color: 'white',
            }}
          >
            💼 Available for Work
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            color: '#9ca3af',
          }}
        >
          🌐 danielchen.dev
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
