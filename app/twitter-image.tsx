import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Iruka - Open data signals for smarter agents';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function SocialImage() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundColor: '#f7f1e8',
        color: '#43362d',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(146, 124, 104, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(146, 124, 104, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: '0 auto auto 0',
          width: '100%',
          height: '150px',
          backgroundColor: 'rgba(175, 139, 101, 0.08)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          width: '100%',
          gap: '28px',
        }}
      >
        <div
          style={{
            width: '54%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                border: '1px solid rgba(146, 124, 104, 0.32)',
                backgroundColor: '#fffaf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '999px',
                  border: '4px solid rgba(164, 118, 76, 0.72)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '999px', backgroundColor: '#a46f47' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '58px', lineHeight: 1, fontWeight: 500 }}>Iruka</span>
              <span style={{ fontSize: '16px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8e7c6b' }}>
                Open Data Signals
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '52px', lineHeight: 1.02, fontWeight: 500 }}>
              Listen through chain noise until the exact pattern resolves.
            </div>
            <div style={{ fontSize: '22px', lineHeight: 1.5, color: '#6f5f51' }}>
              State, indexed history, and raw events for agents built on open data.
            </div>
          </div>
        </div>

        <div
          style={{
            width: '46%',
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              width: '100%',
              borderRadius: '14px',
              border: '1px solid rgba(146, 124, 104, 0.28)',
              backgroundColor: '#fffaf4',
              overflow: 'hidden',
              boxShadow: '0 18px 32px -24px rgba(85, 63, 42, 0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '1px solid rgba(146, 124, 104, 0.2)',
                backgroundColor: 'rgba(247, 241, 232, 0.92)',
              }}
            >
              <span style={{ fontSize: '15px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8e7c6b' }}>
                Watch Loop
              </span>
              <span style={{ fontSize: '14px', color: '#8b6a4c' }}>Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '22px 20px' }}>
              {[
                'State: ERC4626.Position.shares dropped 22%',
                'Indexed: net supply turned negative over 6h',
                'Raw: USDC transfer burst crossed the threshold',
              ].map((line, index) => (
                <div
                  key={line}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid rgba(146, 124, 104, 0.22)',
                    backgroundColor: index === 0 ? 'rgba(226, 211, 195, 0.55)' : 'rgba(248, 243, 236, 0.95)',
                    padding: '16px',
                    fontSize: '18px',
                    lineHeight: 1.45,
                    color: '#4c3e34',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Image() {
  return new ImageResponse(<SocialImage />, { ...size });
}
