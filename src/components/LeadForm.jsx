import React, { useState } from 'react'

const FIRMEN = [
  { id: 1, name: 'Heiztech GmbH',         plz: '50xxx', bewertung: 4.8, abschluss: '∅ 3 Tage', badge: 'Empfohlen' },
  { id: 2, name: 'SolarWärme Köln',        plz: '51xxx', bewertung: 4.6, abschluss: '∅ 5 Tage', badge: null },
  { id: 3, name: 'EnergieProfi Rheinland', plz: '52xxx', bewertung: 4.7, abschluss: '∅ 4 Tage', badge: null },
]

export default function LeadForm({ ergebnis, antworten, onErfolg }) {
  const [ausgewaehlt, setAusgewaehlt] = useState([])
  const [form, setForm] = useState({ name: '', plz: '', tel: '' })
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')

  function toggleFirma(id) {
    setAusgewaehlt(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  async function abschicken() {
    if (!form.name || !form.plz || !form.tel) {
      setFehler('Bitte alle Felder ausfüllen.')
      return
    }
    if (ausgewaehlt.length === 0) {
      setFehler('Bitte mindestens eine Firma auswählen.')
      return
    }
    setFehler('')
    setLaden(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kontakt: form, firmen: ausgewaehlt, ergebnis, antworten })
      })
      if (res.ok) {
        onErfolg(form)
      } else {
        setFehler('Fehler beim Senden. Bitte versuche es nochmal.')
      }
    } catch {
      setFehler('Netzwerkfehler. Bitte versuche es nochmal.')
    } finally {
      setLaden(false)
    }
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 500,
        color: '#085041',
        background: '#E1F5EE',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '1.25rem'
      }}>
        ✓ Einschätzung bereit
      </div>
      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 26px)',
        fontWeight: 500,
        lineHeight: 1.2,
        marginBottom: '0.4rem',
        letterSpacing: '-0.3px'
      }}>
        Wähle deine Wunschfirmen
      </h2>
      <p style={{ fontSize: '14px', color: '#a09e9a', marginBottom: '1.75rem' }}>
        Nur die Firmen die du auswählst dürfen dich kontaktieren.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
        {FIRMEN.map(firma => {
          const aktiv = ausgewaehlt.includes(firma.id)
          return (
            <button
              key={firma.id}
              onClick={() => toggleFirma(firma.id)}
              style={{
                width: '100%',
                padding: '16px',
                border: aktiv ? '1.5px solid #0a0a0a' : '1px solid #e2e1de',
                borderRadius: '12px',
                background: aktiv ? '#f8f8f7' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{firma.name}</span>
                    {firma.badge && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#085041',
                        background: '#E1F5EE',
                        padding: '2px 8px',
                        borderRadius: '20px'
                      }}>
                        {firma.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#a09e9a' }}>
                    <span>⭐ {firma.bewertung}</span>
                    <span>📍 PLZ {firma.plz}</span>
                    <span>🕐 {firma.abschluss}</span>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: aktiv ? 'none' : '1.5px solid #e2e1de',
                  background: aktiv ? '#0a0a0a' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'all 0.15s ease'
                }}>
                  {aktiv && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <div style={{ borderTop: '1px solid #e2e1de', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem', color: '#0a0a0a' }}>
          Deine Kontaktdaten
        </div>
        {[
          { key: 'name', label: 'Vorname', placeholder: 'z.B. Thomas', type: 'text' },
          { key: 'plz',  label: 'Postleitzahl', placeholder: 'z.B. 50667', type: 'text' },
          { key: 'tel',  label: 'Telefonnummer', placeholder: 'z.B. 0172 1234567', type: 'tel' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#a09e9a', marginBottom: '5px' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #e2e1de',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#0a0a0a',
                background: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#0a0a0a'}
              onBlur={e => e.target.style.borderColor = '#e2e1de'}
            />
          </div>
        ))}
      </div>
      {fehler && (
        <div style={{
          padding: '10px 14px',
          background: '#FCEBEB',
          border: '1px solid #F09595',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#A32D2D',
          marginBottom: '1rem'
        }}>
          {fehler}
        </div>
      )}
      <button
        onClick={abschicken}
        disabled={laden}
        style={{
          width: '100%',
          padding: '14px',
          background: laden ? '#e2e1de' : '#1D9E75',
          color: laden ? '#a09e9a' : '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: 500,
          cursor: laden ? 'default' : 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: '12px',
          transition: 'all 0.15s ease'
        }}
      >
        {laden ? 'Wird gesendet...' : `Anfrage an ${ausgewaehlt.length || 0} Firma${ausgewaehlt.length !== 1 ? 'en' : ''} senden →`}
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#a09e9a' }}>
        <span>🔒 Kein Spam</span>
        <span>📞 Max. {ausgewaehlt.length || 1} Anruf{ausgewaehlt.length !== 1 ? 'e' : ''}</span>
        <span>✓ Kostenlos</span>
      </div>
    </div>
  )
}
