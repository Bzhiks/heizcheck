import React, { useState } from 'react'

const fmt = n => n?.toLocaleString('de-DE') + ' €'

function LivePreview({ name, plz, adresse }) {
  return (
    <div style={{
      background: '#0a0a0a', borderRadius: '16px',
      overflow: 'hidden', position: 'sticky', top: '24px'
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>
          heiz<span style={{ color: '#1D9E75' }}>check</span>
        </div>
        <div style={{ fontSize: '10px', color: '#085041', background: '#E1F5EE', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>
          Wird erstellt...
        </div>
      </div>

      {/* Report Vorschau */}
      <div style={{ padding: '20px' }}>
        {/* Name */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Report für</div>
          <div style={{
            fontSize: '20px', fontWeight: 500, letterSpacing: '-0.3px',
            color: name ? '#fff' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.2s ease'
          }}>
            {name || 'Dein Name'}
          </div>
        </div>

        {/* PLZ */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Region</div>
          <div style={{
            fontSize: '15px', fontWeight: 500,
            color: plz ? '#1D9E75' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.2s ease'
          }}>
            {plz || 'Postleitzahl'}
            {adresse && <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, fontSize: '13px' }}> · {adresse}</span>}
          </div>
        </div>

        {/* Was kommt rein */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Dein Report enthält</div>
          {[
            'Persönliche Wirtschaftlichkeitsberechnung',
            'Heizkosten heute vs. mit Wärmepumpe',
            'Exakte Förderungshöhe (KfW BEG)',
            'Netto-Investition nach Förderung',
            '5 Spartipps von Experten',
            '3 geprüfte Fachbetriebe in deiner Region',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ color: '#1D9E75', fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>✓</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Unten */}
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(29,158,117,0.15)', borderRadius: '10px', border: '1px solid rgba(29,158,117,0.3)' }}>
          <div style={{ fontSize: '11px', color: '#1D9E75', fontWeight: 500, marginBottom: '2px' }}>
            95% der finalen Angebote stimmen überein
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            Basierend auf echten Installationspreisen
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReportEmpfaenger({ onWeiter }) {
  const [name, setName] = useState('')
  const [plz, setPlz] = useState('')
  const [adresse, setAdresse] = useState('')
  const [fehler, setFehler] = useState('')
  const [isMobile] = useState(window.innerWidth < 900)

  function weiter() {
    if (!name.trim()) { setFehler('Bitte gib deinen Vornamen ein.'); return }
    if (!plz.trim() || plz.length < 5) { setFehler('Bitte gib deine Postleitzahl ein.'); return }
    setFehler('')
    onWeiter({ name: name.trim(), plz: plz.trim(), adresse: adresse.trim() || null })
  }

  const formular = (
    <div>
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
        Dein Report wird sofort personalisiert — gib deinen Namen ein und sieh wie er entsteht.
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
            onChange={e => { field.set(e.target.value); setFehler('') }}
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

  if (isMobile) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>
        {formular}
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1100px', margin: '0 auto', padding: '0 6%',
      display: 'grid', gridTemplateColumns: '1fr 400px',
      gap: '60px', alignItems: 'start'
    }}>
      <div>{formular}</div>
      <LivePreview name={name} plz={plz} adresse={adresse} />
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
        {[
          { label: 'Anlagengröße', wert: ergebnis?.wpGroesse?.toUpperCase() },
          { label: 'Durchschnittspreis', wert: fmt(ergebnis?.anlagenPreis) },
          { label: 'Nach Förderung', wert: fmt(ergebnis?.nettoinvest), gruen: true },
        ].map(({ label, wert, gruen }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b6966', marginBottom: '4px' }}>
            <span>{label}</span>
            <span style={{ fontWeight: 500, color: gruen ? '#1D9E75' : '#0a0a0a' }}>{wert}</span>
          </div>
        ))}
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
