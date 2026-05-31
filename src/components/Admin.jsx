import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'

const fmt = n => n?.toLocaleString('de-DE') + ' €'

const STATUS_FARBEN = {
  neu:          { bg: '#E1F5EE', text: '#085041' },
  kontaktiert:  { bg: '#FFF8E1', text: '#7B6000' },
  abgeschlossen:{ bg: '#f8f8f7', text: '#6b6966' },
}

export default function Admin() {
  const [passwort, setPasswort] = useState('')
  const [eingeloggt, setEingeloggt] = useState(false)
  const [leads, setLeads] = useState([])
  const [firmen, setFirmen] = useState([])
  const [ausgewaehlt, setAusgewaehlt] = useState(null)
  const [laden, setLaden] = useState(false)

  const ADMIN_PW = 'heizcheck2026'

  async function ladeDaten() {
    setLaden(true)
    const { data: l } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    const { data: f } = await supabase.from('firmen').select('*').eq('aktiv', true)
    setLeads(l || [])
    setFirmen(f || [])
    setLaden(false)
  }

  useEffect(() => {
    if (eingeloggt) ladeDaten()
  }, [eingeloggt])

  async function statusAendern(id, status) {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (ausgewaehlt?.id === id) setAusgewaehlt(prev => ({ ...prev, status }))
  }

  if (!eingeloggt) {
    return (
      <div style={{ maxWidth: '360px', margin: '4rem auto', padding: '0 1rem' }}>
        <div style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a', marginBottom: '0.5rem', letterSpacing: '-0.3px' }}>
          heiz<span style={{ color: '#1D9E75' }}>check</span> Admin
        </div>
        <p style={{ fontSize: '14px', color: '#a09e9a', marginBottom: '1.5rem' }}>Bitte einloggen</p>
        <input
          type="password"
          value={passwort}
          onChange={e => setPasswort(e.target.value)}
          placeholder="Passwort"
          onKeyDown={e => e.key === 'Enter' && passwort === ADMIN_PW && setEingeloggt(true)}
          style={{ width: '100%', padding: '12px 14px', border: '1px solid #e2e1de', borderRadius: '10px', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
        />
        <button
          onClick={() => passwort === ADMIN_PW ? setEingeloggt(true) : alert('Falsches Passwort')}
          style={{ width: '100%', padding: '13px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
        >
          Einloggen
        </button>
      </div>
    )
  }

  const stats = {
    gesamt:    leads.length,
    neu:       leads.filter(l => l.status === 'neu').length,
    kontakt:   leads.filter(l => l.status === 'kontaktiert').length,
    abgeschl:  leads.filter(l => l.status === 'abgeschlossen').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff' }}>heiz<span style={{ color: '#1D9E75' }}>check</span> <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 400 }}>Admin</span></div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={ladeDaten} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Aktualisieren
          </button>
          <button onClick={() => setEingeloggt(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Ausloggen
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Gesamt Leads', wert: stats.gesamt, farbe: '#0a0a0a' },
            { label: 'Neu', wert: stats.neu, farbe: '#1D9E75' },
            { label: 'Kontaktiert', wert: stats.kontakt, farbe: '#F9A825' },
            { label: 'Abgeschlossen', wert: stats.abgeschl, farbe: '#a09e9a' },
          ].map(({ label, wert, farbe }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e2e1de', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#a09e9a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: 500, color: farbe }}>{wert}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: ausgewaehlt ? '1fr 400px' : '1fr', gap: '16px' }}>

          {/* Lead Liste */}
          <div style={{ background: '#fff', border: '1px solid #e2e1de', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e1de', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>Leads</div>
              {laden && <div style={{ fontSize: '12px', color: '#a09e9a' }}>Lädt...</div>}
            </div>

            {leads.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#a09e9a', fontSize: '14px' }}>
                Noch keine Leads vorhanden
              </div>
            ) : (
              leads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => setAusgewaehlt(ausgewaehlt?.id === lead.id ? null : lead)}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid #f0efed', cursor: 'pointer',
                    background: ausgewaehlt?.id === lead.id ? '#FAFAF8' : '#fff',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'background 0.15s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{lead.name || 'Anonym'}</span>
                      <span style={{ fontSize: '11px', color: '#a09e9a' }}>PLZ {lead.plz}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '20px',
                        background: STATUS_FARBEN[lead.status]?.bg || '#f8f8f7',
                        color: STATUS_FARBEN[lead.status]?.text || '#6b6966'
                      }}>{lead.status}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b6966' }}>
                      {lead.wp_groesse?.toUpperCase()} · {fmt(lead.ersparnis)} Ersparnis/Jahr · {fmt(lead.foerder_betrag)} Förderung
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#a09e9a', textAlign: 'right' }}>
                    {new Date(lead.created_at).toLocaleDateString('de-DE')}<br />
                    {new Date(lead.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Lead Detail */}
          {ausgewaehlt && (
            <div style={{ background: '#fff', border: '1px solid #e2e1de', borderRadius: '12px', overflow: 'hidden', height: 'fit-content', position: 'sticky', top: '24px' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e1de', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{ausgewaehlt.name}</div>
                <button onClick={() => setAusgewaehlt(null)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#a09e9a', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ padding: '16px 20px' }}>

                {/* Kontakt */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Kontakt</div>
                  {[
                    { label: 'Telefon', wert: ausgewaehlt.telefon || '—' },
                    { label: 'Adresse', wert: [ausgewaehlt.adresse, ausgewaehlt.plz, ausgewaehlt.stadt].filter(Boolean).join(' ') || '—' },
                  ].map(({ label, wert }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid #f0efed' }}>
                      <span style={{ color: '#a09e9a' }}>{label}</span>
                      <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{wert}</span>
                    </div>
                  ))}
                </div>

                {/* Berechnung */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Berechnung</div>
                  {[
                    { label: 'WP Größe', wert: ausgewaehlt.wp_groesse?.toUpperCase() },
                    { label: 'Anlagenpreis', wert: fmt(ausgewaehlt.anlage_preis) },
                    { label: 'Förderung', wert: `${ausgewaehlt.foerder_prozent}% = ${fmt(ausgewaehlt.foerder_betrag)}` },
                    { label: 'Netto-Invest', wert: fmt(ausgewaehlt.netto_invest) },
                    { label: 'Ersparnis/Jahr', wert: fmt(ausgewaehlt.ersparnis), gruen: true },
                  ].map(({ label, wert, gruen }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid #f0efed' }}>
                      <span style={{ color: '#a09e9a' }}>{label}</span>
                      <span style={{ color: gruen ? '#1D9E75' : '#0a0a0a', fontWeight: 500 }}>{wert}</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Status ändern</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['neu', 'kontaktiert', 'abgeschlossen'].map(s => (
                      <button
                        key={s}
                        onClick={() => statusAendern(ausgewaehlt.id, s)}
                        style={{
                          flex: 1, padding: '8px 4px', border: ausgewaehlt.status === s ? '1.5px solid #0a0a0a' : '1px solid #e2e1de',
                          borderRadius: '8px', fontSize: '11px', fontWeight: ausgewaehlt.status === s ? 500 : 400,
                          cursor: 'pointer', background: ausgewaehlt.status === s ? '#f8f8f7' : '#fff',
                          fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Firma zuweisen */}
                <div>
                  <div style={{ fontSize: '10px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>An Firma senden</div>
                  <select
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e1de', borderRadius: '8px', fontSize: '13px', color: '#0a0a0a', background: '#fff', fontFamily: "'DM Sans', sans-serif", marginBottom: '8px', outline: 'none' }}
                  >
                    <option value="">Firma auswählen...</option>
                    {firmen.map(f => (
                      <option key={f.id} value={f.id}>{f.name} (PLZ {f.plz})</option>
                    ))}
                  </select>
                  <button
                    style={{ width: '100%', padding: '11px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Lead weiterleiten →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}