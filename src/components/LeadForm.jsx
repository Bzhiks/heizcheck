import React, { useState } from 'react'

const fmt = n => n?.toLocaleString('de-DE') + ' €'

export function ReportEmpfaenger({ onWeiter }) {
  const [name, setName] = useState('')
  const [plz, setPlz] = useState('')
  const [adresse, setAdresse] = useState('')
  const [fehler, setFehler] = useState('')

  function weiter() {
    if (!name.trim()) { setFehler('Bitte gib deinen Vornamen ein.'); return }
    if (!plz.trim() || plz.length < 5) { setFehler('Bitte gib deine Postleitzahl ein.'); return }
    setFehler('')
    onWeiter({ name: name.trim(), plz: plz.trim(), adresse: adresse.trim() || null })
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 500, color: '#085041',
        background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem'
      }}>
        ✓ Kostenlos & unverbindlich
      </div>

      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 500,
        lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.3px', color: '#0a0a0a'
      }}>
        Für wen erstellen wir den Report?
      </h2>
      <p style={{ fontSize: '14px', color: '#6b6966', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        Dein Report wird persönlich auf dich zugeschnitten — mit deinen Zahlen, deiner Region.
      </p>

      {[
        { key: 'name', label: 'Vorname', placeholder: 'z.B. Thomas', value: name, set: setName, type: 'text', pflicht: true },
        { key: 'plz', label: 'Postleitzahl', placeholder: 'z.B. 50667', value: plz, set: setPlz, type: 'text', maxLength: 5, pflicht: true },
        { key: 'adresse', label: 'Straße & Hausnummer', placeholder: 'z.B. Musterstraße 12', value: adresse, set: setAdresse, type: 'text', pflicht: false },
      ].map(field => (
        <div key={field.key} style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#a09e9a', marginBottom: '5px' }}>
            {field.label}{' '}
            {field.pflicht
              ? <span style={{ color: '#E24B4A' }}>*</span>
              : <span style={{ color: '#e2e1de' }}>— optional</span>
            }
          </label>
          <input
            type={field.type}
            value={field.value}
            onChange={e => field.set(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            style={{
              width: '100%', padding: '13px 14px',
              border: '1px solid #e2e1de', borderRadius: '10px',
              fontSize: '15px', color: '#0a0a0a', background: '#fff',
              fontFamily: "'DM Sans', sans-serif", outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#0a0a0a'}
            onBlur={e => e.target.style.borderColor = '#e2e1de'}
          />
        </div>
      ))}

      {fehler && (
        <div style={{ padding: '10px 14px', background: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px', fontSize: '13px', color: '#A32D2D', marginBottom: '1rem' }}>
          {fehler}
        </div>
      )}

      <button
        onClick={weiter}
        style={{
          width: '100%', padding: '14px',
          background: '#0a0a0a', color: '#fff',
          border: 'none', borderRadius: '12px',
          fontSize: '15px', fontWeight: 500,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          marginBottom: '10px', marginTop: '4px'
        }}
      >
        Berechnung starten →
      </button>

      <div style={{ textAlign: 'center', fontSize: '11px', color: '#a09e9a' }}>
        🔒 Deine Daten werden nicht ohne deine Zustimmung weitergegeben
      </div>
    </div>
  )
}

export function FirmenAnfrage({ kontakt, ergebnis, onErfolg }) {
  const [tel, setTel] = useState('')
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')

  async function abschicken() {
    if (!tel) { setFehler('Telefonnummer ist erforderlich.'); return }
    setFehler('')
    setLaden(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kontakt: { ...kontakt, tel }, ergebnis, typ: 'firmen' })
      })
    } catch {}
    setLaden(false)
    onErfolg({ ...kontakt, tel })
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 500, color: '#085041',
        background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem'
      }}>
        ✓ 3 Firmen in deiner Region gefunden
      </div>

      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 500,
        lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.3px', color: '#0a0a0a'
      }}>
        {kontakt?.name ? `${kontakt.name}, fast` : 'Fast'} geschafft —
        <span style={{ color: '#1D9E75' }}> wie erreichen wir dich?</span>
      </h2>
      <p style={{ fontSize: '14px', color: '#6b6966', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        Die 3 Fachbetriebe in {kontakt?.plz || 'deiner Region'} melden sich innerhalb von 24h bei dir.
      </p>

      <div style={{ background: '#f8f8f7', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b6966', marginBottom: '4px' }}>
          <span>Anlagengröße</span>
          <span style={{ fontWeight: 500, color: '#0a0a0a' }}>{ergebnis?.wpGroesse?.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b6966', marginBottom: '4px' }}>
          <span>Durchschnittspreis</span>
          <span style={{ fontWeight: 500, color: '#0a0a0a' }}>{fmt(ergebnis?.anlagenPreis)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b6966' }}>
          <span>Nach Förderung</span>
          <span style={{ fontWeight: 500, color: '#1D9E75' }}>{fmt(ergebnis?.nettoinvest)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#a09e9a', marginBottom: '5px' }}>
          Telefonnummer <span style={{ color: '#E24B4A' }}>*</span>
        </label>
        <input
          type="tel"
          value={tel}
          onChange={e => setTel(e.target.value)}
          placeholder="z.B. 0172 1234567"
          style={{
            width: '100%', padding: '13px 14px',
            border: '1px solid #e2e1de', borderRadius: '10px',
            fontSize: '15px', color: '#0a0a0a', background: '#fff',
            fontFamily: "'DM Sans', sans-serif", outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.borderColor = '#0a0a0a'}
          onBlur={e => e.target.style.borderColor = '#e2e1de'}
        />
      </div>

      {fehler && (
        <div style={{ padding: '10px 14px', background: '#FCEBEB', border: '1px solid #F09595', borderRadius: '8px', fontSize: '13px', color: '#A32D2D', marginBottom: '1rem' }}>
          {fehler}
        </div>
      )}

      <button
        onClick={abschicken}
        disabled={laden}
        style={{
          width: '100%', padding: '14px',
          background: laden ? '#e2e1de' : '#1D9E75',
          color: laden ? '#a09e9a' : '#fff',
          border: 'none', borderRadius: '12px',
          fontSize: '15px', fontWeight: 500,
          cursor: laden ? 'default' : 'pointer',
          fontFamily: "'DM Sans', sans-serif", marginBottom: '12px'
        }}
      >
        {laden ? 'Wird gesendet...' : '3 Firmen anfragen →'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#a09e9a' }}>
        <span>🔒 Kein Spam</span>
        <span>📞 Max. 3 Anrufe</span>
        <span>✓ Kostenlos</span>
      </div>
    </div>
  )
}

export default FirmenAnfrage
