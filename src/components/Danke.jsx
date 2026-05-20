import React from 'react'

export default function Danke({ kontakt, onNeustart }) {
  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '3rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#E1F5EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        fontSize: '28px'
      }}>
        ✓
      </div>
      <h2 style={{
        fontSize: '26px',
        fontWeight: 500,
        marginBottom: '0.75rem',
        letterSpacing: '-0.3px'
      }}>
        Anfrage gesendet, {kontakt.name}!
      </h2>
      <p style={{
        fontSize: '15px',
        color: '#6b6966',
        lineHeight: 1.6,
        marginBottom: '2rem'
      }}>
        Die ausgewählten Firmen melden sich innerhalb von 24 Stunden bei dir.
        Du hörst genau von den Firmen die du ausgewählt hast — von keiner anderen.
      </p>
      <div style={{
        background: '#f8f8f7',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '2rem',
        textAlign: 'left'
      }}>
        <div style={{ fontSize: '12px', color: '#a09e9a', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Was jetzt passiert
        </div>
        {[
          'Firma erhält deine Einschätzung mit allen Details',
          'Anruf innerhalb von 24 Stunden',
          'Konkretes Angebot basierend auf deiner Berechnung',
          'Kein Verkaufsdruck — nur Fakten'
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '10px',
            fontSize: '13px',
            color: '#6b6966',
            padding: '5px 0',
            alignItems: 'flex-start'
          }}>
            <span style={{ color: '#1D9E75', fontWeight: 500, flexShrink: 0 }}>{i + 1}.</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onNeustart}
        style={{
          background: 'none',
          border: '1px solid #e2e1de',
          borderRadius: '10px',
          padding: '11px 24px',
          fontSize: '14px',
          color: '#6b6966',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        Neue Berechnung starten
      </button>
    </div>
  )
}
