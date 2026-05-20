import React from 'react'

export default function ProgressBar({ aktuell, gesamt }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
        {Array.from({ length: gesamt }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              background: i < aktuell ? '#1D9E75' : i === aktuell ? '#0a0a0a' : '#e2e1de',
              transition: 'background 0.3s ease'
            }}
          />
        ))}
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#a09e9a'
      }}>
        Schritt {aktuell + 1} von {gesamt}
      </span>
    </div>
  )
}
