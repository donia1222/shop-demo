"use client"
export function DemoBanner() {
  return (
    <div style={{ background: 'linear-gradient(90deg, #1A1A1A 0%, #111 100%)', borderBottom: '1px solid #2A2A2A', color: 'white', textAlign: 'center', padding: '9px 16px', fontSize: '12px', fontWeight: '600', position: 'sticky', top: 0, zIndex: 9999, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.35)', borderRadius: '999px', padding: '2px 10px', color: '#FF4444', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        🔥 DEMO
      </span>
      <span style={{ color: '#AAA', fontSize: '12px' }}>
        Diese Seite ist eine Demo — Zahlungen sind simuliert und nicht real.
      </span>
    </div>
  )
}
