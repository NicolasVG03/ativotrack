export function DashMockup() {
  return (
    <div style={{
      transform: 'perspective(1400px) rotateX(5deg)',
      transformOrigin: 'center top',
    }}>
      <img
        src="/dashboard-preview.png"
        alt="AtivoTrack dashboard"
        style={{
          width: '100%',
          maxWidth: 720,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  )
}
