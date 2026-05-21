import React from 'react'

function MetricCard({ label, wert, sub, gruen, gross }) {
  return (
    <div style={{
      background: '#f8f8f7', borderRadius: '12px', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '4px'
    }}>
      <div style={{ fontSize: '12px', color: '#a09e9a' }}>{label}</div>
      <div style={{
        fontSize: gross ? '26px' : '22px', fontWeight: 500,
        color: gruen ? '#1D9E75' : '#0a0a0a', lineHeight: 1.2
      }}>
        {wert}
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#6b6966' }}>{sub}</div>}
    </div>
  )
}

export default function Ergebnis({ ergebnis, onAngebot, onPdfDownload, onNeustart }) {
  const { altKosten, wpKosten, ersparnis, foerderBetrag, foerderProzent, nettoinvest, amortisation, anlagenPreis, pvBonus } = ergebnis
  const fmt = n => n?.toLocaleString('de-DE') + ' €'

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: '0 1rem' }}>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 500, color: '#085041',
        background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem'
      }}>
        ✓ Deine persönliche Einschätzung
      </div>

      <h2 style={{
        fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 500,
        lineHeight: 1.2, marginBottom: '0.4rem', letterSpacing: '-0.3px'
      }}>
        So rechnet sich das für dich
      </h2>
      <p style={{ fontSize: '14px', color: '#a09e9a', marginBottom: '1.75rem' }}>
        Basierend auf deinen Angaben — zu 95% korrekt
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1rem' }}>
        <MetricCard label="Heizkosten heute" wert={fmt(altKosten)} sub="pro Jahr" />
        <MetricCard label="Mit Wärmepumpe" wert={fmt(wpKosten)} sub="pro Jahr" gruen />
        <MetricCard label="Ersparnis" wert={`+${fmt(ersparnis)}`} sub="pro Jahr" gruen gross />
        <MetricCard label="Amortisation" wert={amortisation ? `${amortisation} Jahre` : '–'} sub="nach Förderung" />
      </div>

      {pvBonus > 0 && (
        <div style={{
          padding: '10px 14px', background: '#FFF8E1', borderRadius: '8px',
          fontSize: '13px', color: '#7B6000', marginBottom: '1rem',
          borderLeft: '3px solid #F9A825'
        }}>
          ☀️ Mit deiner Solaranlage sparst du zusätzlich ~{fmt(pvBonus)} pro Jahr
        </div>
      )}

      <div style={{
        border: '1px solid #e2e1de', borderRadius: '12px',
        padding: '16px 20px', marginBottom: '1.5rem', background: '#fff'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#0a0a0a' }}>
          Investitionsübersicht
        </div>
        {[
          { label: 'Anlage (Richtwert)', wert: fmt(anlagenPreis), farbe: '#0a0a0a' },
          { label: `Förderung BEG (${foerderProzent}%)`, wert: `–${fmt(foerderBetrag)}`, farbe: '#1D9E75' },
        ].map(({ label, wert, farbe }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '13px', padding: '5px 0', color: '#6b6966'
          }}>
            <span>{label}</span>
            <span style={{ color: farbe }}>{wert}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '14px', fontWeight: 500,
          padding: '10px 0 4px', marginTop: '4px', borderTop: '1px solid #e2e1de'
        }}>
          <span>Netto-Investition</span>
          <span>{fmt(nettoinvest)}</span>
        </div>
      </div>

      <div style={{
        background: '#f8f8f7', borderRadius: '16px',
        padding: '24px', marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', marginBottom: '4px' }}>
          Was möchtest du jetzt tun?
        </div>
        <p style={{ fontSize: '12px', color: '#a09e9a', marginBottom: '16px' }}>
          95% der finalen Angebote stimmen mit dieser Einschätzung überein.
        </p>

        <button
          onClick={onAngebot}
          style={{
            width: '100%', padding: '14px',
            background: '#0F6E56', color: '#fff',
            border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: 500,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            marginBottom: '10px'
          }}
        >
          3 Firmen anfragen + persönlichen Report erhalten →
        </button>

        <button
          onClick={onPdfDownload}
          style={{
            width: '100%', padding: '13px',
            background: '#fff', color: '#0a0a0a',
            border: '1px solid #e2e1de', borderRadius: '12px',
            fontSize: '14px', fontWeight: 400,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
          }}
        >
          📄 Nur Info-Report herunterladen — kostenlos, anonym
        </button>

        <p style={{ fontSize: '11px', color: '#a09e9a', textAlign: 'center', marginTop: '10px' }}>
          🔒 Keine Weitergabe ohne deine Zustimmung
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onNeustart} style={{
          background: 'none', border: 'none', fontSize: '13px',
          color: '#a09e9a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
        }}>
          Neue Berechnung starten
        </button>
      </div>
    </div>
  )
}
