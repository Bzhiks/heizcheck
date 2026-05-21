import React, { useState } from 'react'

export default function LeadForm({ ergebnis, antworten, onErfolg }) {
  const [form, setForm] = useState({ name: '', plz: '', tel: '' })
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')

  const fmt = n => n?.toLocaleString('de-DE') + ' €'

  async function abschicken() {
    if (!form.name || !form.plz || !form.tel) {
      setFehler('Bitte alle Felder ausfüllen.')
      return
    }
    setFehler('')
    setLaden(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kontakt: form, ergebnis, antworten })
      })
      if (res.ok) {
        onErfolg(form)
      } else {
        setFehler('Fehler beim Senden. Bitte versuche es nochmal.')
      }
    } catch {
      onErfolg(form)
    } finally {
      setLaden(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 500, color: '#085041',
        background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem'
      }}>
        ✓ Einschätzung bereit
      </div>

      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 500,
        lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.3px'
      }}>
        Dein persönlicher Report + 3 Firmenanfragen
      </h2>
      <p style={{ fontSize: '14px', color: '#6b6966', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        Gib deine Kontaktdaten ein — du bekommst sofort deinen persönlichen PDF-Report.
        3 geprüfte Firmen in deiner Region melden sich innerhalb von 24h.
      </p>

      <div style={{
        background: '#f8f8f7', borderRadius: '12px',
        padding: '14px 16px', marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '12px', color: '#a09e9a', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Deine Einschätzung
        </div>
        {[
          { label: 'Heizkosten heute', wert: fmt(ergebnis?.altKosten) + ' / Jahr' },
          { label: 'Mit Wärmepumpe',   wert: fmt(ergebnis?.wpKosten) + ' / Jahr' },
          { label: 'Ersparnis',         wert: '+' + fmt(ergebnis?.ersparnis) + ' / Jahr', gruen: true },
          { label: 'Förderung',         wert: fmt(ergebnis?.foerderBetrag), gruen: true },
        ].map(({ label, wert, gruen }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '13px', padding: '3px 0', color: '#6b6966'
          }}>
            <span>{label}</span>
            <span style={{ fontWeight: 500, color: gruen ? '#1D9E75' : '#0a0a0a' }}>{wert}</span>
          </div>
        ))}
      </div>

      {[
        { key: 'name', label: 'Vorname',       placeholder: 'z.B. Thomas',        type: 'text' },
        { key: 'plz',  label: 'Postleitzahl',  placeholder: 'z.B. 50667',         type: 'text' },
        { key: 'tel',  label: 'Telefonnummer', placeholder: 'z.B. 0172 1234567',  type: 'tel'  },
      ].map(field => (
        <div key={field.key} style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#a09e9a', marginBottom: '5px' }}>
            {field.label}
          </label>
          <input
            type={field.type}
            value={form[field.key]}
            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
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
        <div style={{
          padding: '10px 14px', background: '#FCEBEB',
          border: '1px solid #F09595', borderRadius: '8px',
          fontSize: '13px', color: '#A32D2D', marginBottom: '1rem'
        }}>
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
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: '12px', transition: 'all 0.15s ease'
        }}
      >
        {laden ? 'Wird gesendet...' : 'Report + Firmenanfrage senden →'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#a09e9a' }}>
        <span>🔒 Kein Spam</span>
        <span>📞 Max. 3 Anrufe</span>
        <span>✓ Kostenlos</span>
      </div>
    </div>
  )
}
