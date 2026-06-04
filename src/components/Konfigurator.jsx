import React, { useState, useEffect } from 'react'
import { gefilterteSchritte } from '../utils/schritte.js'
import { berechneWirtschaftlichkeit } from '../utils/berechnung.js'

const fmt = n => n?.toLocaleString('de-DE') + ' €'

function BlockHeader({ nummer, titel, aktiv, fertig }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: fertig ? '#1D9E75' : aktiv ? '#0a0a0a' : '#e2e1de',
        color: fertig || aktiv ? '#fff' : '#a09e9a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 500, flexShrink: 0, transition: 'all 0.3s ease'
      }}>
        {fertig ? '✓' : nummer}
      </div>
      <span style={{
        fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
        color: fertig ? '#1D9E75' : aktiv ? '#0a0a0a' : '#a09e9a',
        transition: 'color 0.3s ease'
      }}>{titel}</span>
    </div>
  )
}

function OptionButton({ option, ausgewaehlt, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: '13px 16px',
        border: ausgewaehlt ? '1.5px solid #0a0a0a' : hover ? '1px solid #a09e9a' : '1px solid #e2e1de',
        borderRadius: '12px',
        background: ausgewaehlt ? '#f8f8f7' : hover ? '#f8f8f7' : '#fff',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.15s ease', fontFamily: "'DM Sans', sans-serif"
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {option.icon && <span style={{ fontSize: '18px' }}>{option.icon}</span>}
        {option.img && <span style={{ fontSize: '14px' }}>{option.img}</span>}
        <div>
          <div style={{ fontSize: '14px', fontWeight: ausgewaehlt ? 500 : 400, color: '#0a0a0a' }}>{option.label}</div>
          {option.sub && <div style={{ fontSize: '11px', color: '#a09e9a', marginTop: '1px' }}>{option.sub}</div>}
        </div>
      </div>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: ausgewaehlt ? '5px solid #0a0a0a' : '1.5px solid #e2e1de',
        transition: 'all 0.15s ease', flexShrink: 0
      }} />
    </button>
  )
}

// ─── LIVE REPORT RECHTS ───────────────────────────────────────────────────────
function LiveReport({ person, antworten, schritt, schritte, phase }) {
  const block1Ende = schritte.filter(s => s.block === 1).length - 1
  const block2Ende = block1Ende + schritte.filter(s => s.block === 2).length
  const block1Fertig = schritt > block1Ende
  const block2Fertig = schritt > block2Ende
  const ergebnis = block2Fertig ? berechneWirtschaftlichkeit(antworten) : null

  const heizLabel = { gas: 'Gasheizung', oel: 'Ölheizung', pellets: 'Pelletheizung', strom: 'Stromheizung', fernwaerme: 'Fernwärme' }
  const heizflLabel = { fub: 'Fußbodenheizung', mix: 'Gemischt', hk: 'Heizkörper' }
  const bauLabel = { vor1970: 'Vor 1970', '1970-1990': '1970–1990', '1990-2010': '1990–2010', nach2010: 'Nach 2010' }

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid #e2e1de',
      overflow: 'hidden', position: 'sticky', top: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
    }}>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>
          heiz<span style={{ color: '#1D9E75' }}>check</span>
        </div>
        <div style={{ fontSize: '10px', color: '#085041', background: '#E1F5EE', padding: '3px 10px', borderRadius: '20px', fontWeight: 500 }}>
          Wird live erstellt...
        </div>
      </div>

      {/* Persönliche Daten — immer sichtbar */}
      <div style={{ background: '#FAFAF8', padding: '14px 20px', borderBottom: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '9px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
          Persönlicher Wärmepumpen-Report für
        </div>
        <div style={{
          fontSize: '18px', fontWeight: 500, color: person.name ? '#0a0a0a' : '#e2e1de',
          letterSpacing: '-0.3px', marginBottom: '3px', transition: 'color 0.2s ease'
        }}>
          {person.name || 'Dein Name'}
        </div>
        <div style={{ fontSize: '12px', color: person.plz ? '#6b6966' : '#e2e1de', transition: 'color 0.2s ease' }}>
          {[person.adresse, person.plz && person.stadt ? `${person.plz} ${person.stadt}` : person.plz].filter(Boolean).join(' · ') || 'Adresse · PLZ · Stadt'}
        </div>
      </div>

      <div style={{ padding: '14px 20px' }}>

        {/* Block 1 — Dein Haus */}
        <div style={{ marginBottom: '14px', opacity: phase === 'person' ? 0.3 : 1, transition: 'opacity 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: block1Fertig ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>
              {block1Fertig ? '✓' : '1'}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, color: block1Fertig ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dein Haus</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { label: 'Gebäude', wert: antworten.gebaeudetyp === 'efh' ? 'Einfamilienhaus' : antworten.gebaeudetyp === 'dhh' ? 'Doppelhaushälfte' : antworten.gebaeudetyp === 'rh' ? 'Reihenhaus' : antworten.gebaeudetyp === 'mfh' ? 'Mehrfamilienhaus' : '—' },
              { label: 'Baujahr', wert: antworten.baujahr || '—' },
              { label: 'Heizung', wert: heizLabel[antworten.heizungsart] || '—' },
              { label: 'Verbrauch', wert: antworten.verbrauch && antworten.verbrauch !== 'default' ? antworten.verbrauch + ' kWh' : antworten.verbrauch === 'default' ? '20.000 kWh' : '—' },
            ].map(({ label, wert }) => (
              <div key={label} style={{ background: '#f8f8f7', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e1de' }}>
                <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{wert}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 2 — Technik */}
        <div style={{ marginBottom: '14px', opacity: schritt > block1Ende ? 1 : 0.2, transition: 'opacity 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: block2Fertig ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>
              {block2Fertig ? '✓' : '2'}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, color: block2Fertig ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deine Technik</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { label: 'Personen', wert: antworten.personen ? antworten.personen + ' Pers.' : '—' },
              { label: 'Heizfläche', wert: heizflLabel[antworten.heizflaeche] || '—' },
              { label: 'Warmwasser', wert: antworten.warmwasser === 'sofort' ? 'Sofort' : antworten.warmwasser === 'kurz' ? 'Kurz' : antworten.warmwasser === 'lang' ? 'Lang' : '—' },
              { label: 'Solar', wert: antworten.pv === 'ja' ? 'Vorhanden' : antworten.pv === 'interesse' ? 'Interesse' : antworten.pv === 'nein' ? 'Nein' : '—' },
            ].map(({ label, wert }) => (
              <div key={label} style={{ background: '#f8f8f7', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e1de' }}>
                <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{wert}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 3 — Einschätzung */}
        <div style={{ opacity: ergebnis ? 1 : 0.2, transition: 'opacity 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: ergebnis ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>
              {ergebnis ? '✓' : '3'}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, color: ergebnis ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deine Einschätzung</span>
          </div>
          {ergebnis ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                <div style={{ background: '#f8f8f7', borderRadius: '8px', padding: '10px', border: '1px solid #e2e1de' }}>
                  <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '3px', textTransform: 'uppercase' }}>Heute</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#0a0a0a' }}>{fmt(ergebnis.altKosten)}</div>
                  <div style={{ fontSize: '10px', color: '#a09e9a' }}>pro Jahr</div>
                </div>
                <div style={{ background: '#f8f8f7', borderRadius: '8px', padding: '10px', border: '1px solid #e2e1de' }}>
                  <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '3px', textTransform: 'uppercase' }}>Mit WP</div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#1D9E75' }}>{fmt(ergebnis.wpKosten)}</div>
                  <div style={{ fontSize: '10px', color: '#a09e9a' }}>pro Jahr</div>
                </div>
              </div>
              <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '9px', color: '#085041', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ersparnis pro Jahr</div>
                <div style={{ fontSize: '22px', fontWeight: 500, color: '#1D9E75', letterSpacing: '-0.5px' }}>+{fmt(ergebnis.ersparnis)}</div>
              </div>
            </>
          ) : (
            <div style={{ background: '#f8f8f7', borderRadius: '10px', padding: '14px', border: '1px solid #e2e1de', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#a09e9a' }}>Wird nach allen Fragen berechnet...</div>
            </div>
          )}
        </div>

        {/* Fortschritt */}
        {phase === 'fragen' && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e1de' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a09e9a', marginBottom: '6px' }}>
              <span>Fortschritt</span><span>{schritt + 1} / {schritte.length}</span>
            </div>
            <div style={{ height: '3px', background: '#e2e1de', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#1D9E75', borderRadius: '2px', width: `${((schritt + 1) / schritte.length) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FINAL REPORT ─────────────────────────────────────────────────────────────
function FinalReport({ ergebnis, antworten, person, onAngebot }) {
  const [visible, setVisible] = useState(false)
  const [tel, setTel] = useState('')
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')
  const [freigeschaltet, setFreigeschaltet] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const heizLabel = { gas: 'Gasheizung', oel: 'Ölheizung', pellets: 'Pelletheizung', strom: 'Stromheizung', fernwaerme: 'Fernwärme' }
  const heizName = heizLabel[antworten.heizungsart] || 'Heizung'

  // Berechnete Werte
  const vorteil20 = Math.round((ergebnis.altKosten - ergebnis.wpKosten) * 26.87)
  const wpEM = Math.round(ergebnis.wpKosten * 0.8)
  const co2 = ((ergebnis.verbrauchKwh || 20000) * 0.0002).toFixed(1)
  const stadt = person?.plz && person?.stadt ? `${person.plz} ${person.stadt}` : person?.plz || ''
  const adresseLine = [person?.adresse, stadt].filter(Boolean).join(' · ')

  // Platzhalter-Firmen (später aus Supabase nach PLZ-Radius)
  const firmenListe = [
    { name: 'Wärme & Energie Fachbetrieb', region: stadt || 'Deine Region', entfernung: 8, spezial: 'Luft-Wasser WP' },
    { name: 'EnergieProfi Installateur', region: 'Nachbarregion', entfernung: 24, spezial: 'WP + PV' },
    { name: 'ThermoTech Heizungsbau', region: 'Umgebung', entfernung: 41, spezial: 'Altbau-Sanierung' },
  ]

  async function freischalten() {
    if (!tel || tel.trim().length < 6) { setFehler('Bitte gib eine gültige Telefonnummer ein.'); return }
    setFehler('')
    setLaden(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kontakt: { ...person, tel }, ergebnis, antworten, typ: 'firmen' })
      })
    } catch {}
    setLaden(false)
    setFreigeschaltet(true)
    if (onAngebot) onAngebot({ ...person, tel })
  }

  const C = {
    rot: '#E24B4A', rotBg: '#FCEBEB', rotDark: '#A32D2D',
    gruen: '#1D9E75', gruenDark: '#085041', gruenBg: '#E1F5EE',
    schwarz: '#0a0a0a', grau: '#6b6966', hellgrau: '#a09e9a',
    border: '#e2e1de', bgSoft: '#FAFAF8', bgCard: '#f8f8f7'
  }

  const lbl = { fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.hellgrau, marginBottom: '12px' }
  const sec = { padding: '26px 32px', borderBottom: `0.5px solid ${C.border}`, background: '#fff' }

  return (
    <div style={{
      maxWidth: '700px', margin: '0 auto',
      borderRadius: '16px', border: `0.5px solid ${C.border}`, overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 4px 40px rgba(0,0,0,0.08)'
    }}>

      {/* HEADER */}
      <div style={{ background: C.schwarz, padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff', letterSpacing: '-0.3px' }}>heiz<span style={{ color: C.gruen }}>check</span></div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Persönlicher Report · {new Date().toLocaleDateString('de-DE')}</div>
      </div>
      <div style={{ height: '3px', background: C.gruen }} />

      {/* HERO PERSON */}
      <div style={{ background: C.bgSoft, padding: '24px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ ...lbl, marginBottom: '8px' }}>Report erstellt für</div>
        <div style={{ fontSize: '30px', fontWeight: 500, color: C.schwarz, letterSpacing: '-1px', marginBottom: '4px' }}>{person?.name || 'Anonym'}</div>
        <div style={{ fontSize: '13px', color: C.grau }}>{[adresseLine, heizName, 'Einfamilienhaus'].filter(Boolean).join(' · ')}</div>
      </div>

      {/* VISION */}
      <div style={sec}>
        <div style={{ fontSize: '22px', fontWeight: 500, color: C.schwarz, letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.2 }}>
          Dein Haus kann eine Energiezentrale werden — <span style={{ color: C.gruen }}>die dir jeden Monat Geld zurückgibt.</span>
        </div>
        <div style={{ fontSize: '14px', color: C.grau, lineHeight: 1.7, marginBottom: '16px' }}>
          Der Wechsel zur Wärmepumpe ist keine Ausgabe — es ist eine Investition die sich rechnet. Mit bis zu 70% staatlicher Förderung und stetig steigenden Energiepreisen war der Zeitpunkt nie besser.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Nachhaltig', 'Kosten sparen', 'Zukunftssicher'].map(t => (
            <div key={t} style={{ background: C.gruenBg, padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, color: C.gruenDark }}>{t}</div>
          ))}
        </div>
      </div>

      {/* GROSSE ZAHL */}
      <div style={{ background: C.gruenBg, padding: '28px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ ...lbl, color: C.gruenDark, marginBottom: '8px' }}>Dein 20-Jahres-Vorteil</div>
        <div style={{ fontSize: '52px', fontWeight: 500, color: C.gruenDark, letterSpacing: '-3px', lineHeight: 1, marginBottom: '8px' }}>{fmt(vorteil20)}</div>
        <div style={{ fontSize: '14px', color: '#0F6E56', marginBottom: '20px' }}>die du gegenüber deiner {heizName} sparst — bei 3% jährlicher Preissteigerung.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { l: 'Jährlich', v: fmt(ergebnis.ersparnis), s: 'Ersparnis', gruen: true },
            { l: 'Amortisiert', v: ergebnis.amortisation ? `${ergebnis.amortisation} J.` : '8–9 J.', s: 'dann nur sparen', gruen: false },
            { l: 'CO₂ gespart', v: `~${co2} t`, s: 'pro Jahr', gruen: true },
          ].map(({ l, v, s, gruen }) => (
            <div key={l} style={{ background: '#fff', borderRadius: '10px', padding: '14px', border: `0.5px solid rgba(29,158,117,0.2)` }}>
              <div style={{ fontSize: '9px', color: C.hellgrau, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{l}</div>
              <div style={{ fontSize: '20px', fontWeight: 500, color: gruen ? C.gruen : C.schwarz }}>{v}</div>
              <div style={{ fontSize: '10px', color: C.hellgrau, marginTop: '2px' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 SPALTEN VERGLEICH */}
      <div style={sec}>
        <div style={lbl}>Direktvergleich — was zahlst du wirklich?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { label: heizName, wert: fmt(ergebnis.altKosten), farbe: C.rot, bg: C.rotBg, txt: C.rotDark, pros: ['Steigende Preise', 'CO₂-Steuer', 'Hohe Wartung'], plus: false },
            { label: 'Wärmepumpe', wert: fmt(ergebnis.wpKosten), farbe: C.gruen, bg: C.bgCard, txt: C.gruenDark, pros: ['Stabile Kosten', 'Unabhängig', 'Klimafreundlich'], plus: true },
            { label: 'WP + Energiemgmt.', wert: fmt(wpEM), farbe: C.gruenDark, bg: C.gruenBg, txt: C.gruenDark, pros: ['Maximum Ersparnis', 'Automatisch', 'Zukunft'], plus: true },
          ].map((col, i) => (
            <div key={i} style={{ background: col.bg, borderRadius: '10px', padding: '16px', borderTop: `3px solid ${col.farbe}` }}>
              <div style={{ fontSize: '10px', color: col.txt, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{col.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 500, color: col.farbe, letterSpacing: '-0.5px' }}>{col.wert}</div>
              <div style={{ fontSize: '11px', color: col.txt, marginBottom: '10px' }}>pro Jahr</div>
              <div style={{ fontSize: '11px', color: col.farbe, lineHeight: 1.6 }}>
                {col.pros.map((p, pi) => <div key={pi}>{col.plus ? '✓' : '✕'} {p}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div style={sec}>
        <div style={lbl}>Kostenentwicklung über 15 Jahre</div>
        <div style={{ fontSize: '13px', color: C.grau, marginBottom: '4px' }}>Ab Jahr {ergebnis.amortisation || 8} ist deine Anlage amortisiert — danach sparst du jeden Monat.</div>
        <div style={{ fontSize: '11px', color: C.hellgrau, marginBottom: '16px' }}>Kumulative Gesamtkosten inkl. CO₂-Steuer</div>
        <svg viewBox="0 0 620 210" style={{ width: '100%', height: 'auto' }}>
          {[20, 60, 100, 140, 170].map(y => <line key={y} x1="40" y1={y} x2="600" y2={y} stroke={C.border} strokeWidth="0.5" />)}
          {[['40k', 23], ['30k', 63], ['20k', 103], ['10k', 143], ['0', 173]].map(([t, y]) => (
            <text key={t} x="32" y={y} textAnchor="end" fontSize="9" fill={C.hellgrau}>{t}</text>
          ))}
          <polygon points="40,170 80,158 160,138 240,112 320,82 400,48 480,20 560,20 560,170" fill={C.rot} opacity="0.06" />
          <polyline points="40,170 80,158 160,138 240,112 320,82 400,48 480,20 560,20" fill="none" stroke={C.rot} strokeWidth="2" strokeLinejoin="round" />
          <polygon points="40,170 80,164 160,153 240,142 320,132 400,122 480,112 560,103 560,170" fill={C.gruen} opacity="0.08" />
          <polyline points="40,170 80,164 160,153 240,142 320,132 400,122 480,112 560,103" fill="none" stroke={C.gruen} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="380" cy="125" r="5" fill={C.gruen} />
          <line x1="380" y1="125" x2="380" y2="170" stroke={C.gruen} strokeWidth="0.8" strokeDasharray="3,3" />
          <rect x="330" y="107" width="100" height="15" rx="3" fill={C.gruen} />
          <text x="380" y="119" textAnchor="middle" fontSize="9" fill="white" fontWeight="500">✓ Amortisiert: Jahr {ergebnis.amortisation || 8}</text>
          {[['Heute', 40], ['Jahr 3', 160], ['Jahr 6', 280], ['Jahr 9', 400], ['Jahr 13', 520]].map(([t, x]) => (
            <text key={t} x={x} y="188" textAnchor="middle" fontSize="9" fill={C.hellgrau}>{t}</text>
          ))}
          <rect x="40" y="198" width="12" height="2.5" fill={C.rot} rx="1" />
          <text x="58" y="201" fontSize="9" fill={C.grau}>{heizName}</text>
          <rect x="150" y="198" width="12" height="2.5" fill={C.gruen} rx="1" />
          <text x="168" y="201" fontSize="9" fill={C.grau}>Wärmepumpe</text>
        </svg>
      </div>

      {/* ZITAT */}
      <div style={{ background: C.bgSoft, padding: '20px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ borderLeft: `3px solid ${C.gruen}`, paddingLeft: '14px' }}>
          <div style={{ fontSize: '14px', fontStyle: 'italic', color: C.grau, lineHeight: 1.6 }}>
            "Die beste Zeit eine Wärmepumpe zu installieren war vor 5 Jahren. Die zweitbeste Zeit ist heute."
          </div>
          <div style={{ fontSize: '11px', color: C.hellgrau, marginTop: '6px' }}>— Energieexperten</div>
        </div>
      </div>

      {/* SEKTION 2 — FÖRDERUNG */}
      <div style={{ background: C.bgSoft, padding: '20px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: C.gruenDark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Förderung</div>
        <div style={{ fontSize: '22px', fontWeight: 500, color: C.schwarz, letterSpacing: '-0.5px', marginTop: '4px' }}>Transparente Investition &amp; Förderung</div>
        <div style={{ fontSize: '14px', color: C.grau, marginTop: '8px', lineHeight: 1.6 }}>
          Der Staat unterstützt den Umstieg so stark wie nie. Mit der Bundesförderung (BEG) bekommst du bis zu <strong style={{ color: C.schwarz }}>70% der förderfähigen Kosten</strong> erstattet.
        </div>
      </div>

      {/* INVESTITION */}
      <div style={sec}>
        <div style={lbl}>Deine persönliche Investitionsübersicht</div>
        <div style={{ border: `0.5px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `0.5px solid ${C.border}`, fontSize: '13px' }}>
            <span style={{ color: C.grau }}>Durchschnittlicher Angebotspreis</span>
            <span style={{ fontWeight: 500 }}>{fmt(ergebnis.anlagenPreis)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `0.5px solid ${C.border}`, fontSize: '13px' }}>
            <span style={{ color: C.grau }}>KfW-Förderung BEG ({ergebnis.foerderProzent}%)</span>
            <span style={{ fontWeight: 500, color: C.gruen }}>– {fmt(ergebnis.foerderBetrag)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', fontSize: '15px', fontWeight: 500, background: C.bgSoft }}>
            <span>Deine Netto-Investition</span><span>{fmt(ergebnis.nettoinvest)}</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: C.hellgrau, marginTop: '8px' }}>
          Du zahlst {fmt(ergebnis.anlagenPreis)} an den Installateur. Die KfW-Förderung von {fmt(ergebnis.foerderBetrag)} erhältst du direkt vom Staat zurück.
        </div>
      </div>

      {/* AMORTISATIONS PHASEN */}
      <div style={{ ...sec, background: C.bgSoft }}>
        <div style={lbl}>Wann zahlt es sich aus?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
          {[
            { n: '1', t: 'Investition', d: 'Jahr 0 — Anlage installiert, Förderung beantragt', aktiv: false },
            { n: '2', t: 'Einsparungen', d: `Jahr 1–${(ergebnis.amortisation || 8) - 1} — ${fmt(ergebnis.ersparnis)} pro Jahr`, aktiv: false },
            { n: '✓', t: 'Amortisiert', d: `Jahr ${ergebnis.amortisation || 8} — Investition zurück`, aktiv: true },
            { n: '+', t: 'Reingewinn', d: 'Jahr 10+ — reine Ersparnis', aktiv: false },
          ].map((p, i) => (
            <div key={i} style={{ background: p.aktiv ? C.gruenBg : '#fff', borderRadius: '10px', padding: '12px', border: `0.5px solid ${p.aktiv ? 'rgba(29,158,117,0.2)' : C.border}`, textAlign: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: p.aktiv ? C.gruen : C.gruenBg, color: p.aktiv ? '#fff' : C.gruenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '12px', fontWeight: 500 }}>{p.n}</div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: p.aktiv ? C.gruenDark : C.schwarz, marginBottom: '4px' }}>{p.t}</div>
              <div style={{ fontSize: '10px', color: p.aktiv ? C.gruenDark : C.hellgrau, lineHeight: 1.4 }}>{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 TIPPS */}
      <div style={{ background: C.bgSoft, padding: '20px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: C.gruenDark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tipps</div>
        <div style={{ fontSize: '22px', fontWeight: 500, color: C.schwarz, letterSpacing: '-0.5px', marginTop: '4px' }}>5 Tipps für maximalen Erfolg</div>
      </div>
      <div style={sec}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { t: 'Konzept schlägt Preis', d: 'Achte nicht nur auf den günstigsten Anbieter. Eine falsch dimensionierte Anlage kostet langfristig mehr. Verlange immer eine schriftliche Heizlastberechnung.', hl: false },
            { t: 'Pufferspeicher richtig dimensionieren', d: 'Ein gut dimensionierter Pufferspeicher reduziert die Taktfrequenz und verlängert die Lebensdauer der Anlage deutlich.', hl: false },
            { t: 'Energiemanagement anfragen', d: 'Ein smarter Energiemanager lässt WP, PV und Speicher zusammenarbeiten. Bis zu 30% weniger Stromkosten — automatisch.', hl: true },
            { t: 'Heizlastberechnung ist Pflicht', d: 'Jeder seriöse Installateur erstellt vor dem Angebot eine Heizlastberechnung. Wer das nicht tut, sollte kein Angebot bekommen.', hl: false },
            { t: 'Angebote wirklich vergleichen', d: 'Vergleiche mindestens 3 Angebote — achte auf Jahresarbeitszahl (JAZ), Garantie und was im Paket enthalten ist.', hl: false },
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: tip.hl ? C.gruenBg : C.bgCard, borderRadius: '10px', border: `0.5px solid ${tip.hl ? 'rgba(29,158,117,0.2)' : C.border}` }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.gruen, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: tip.hl ? C.gruenDark : C.schwarz, marginBottom: '4px' }}>{tip.t}</div>
                <div style={{ fontSize: '13px', color: tip.hl ? '#0F6E56' : C.grau, lineHeight: 1.6 }}>{tip.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAHRPLAN */}
      <div style={{ background: C.bgSoft, padding: '20px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: C.gruenDark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fahrplan</div>
        <div style={{ fontSize: '22px', fontWeight: 500, color: C.schwarz, letterSpacing: '-0.5px', marginTop: '4px' }}>Dein Fahrplan zur neuen Heizung</div>
      </div>
      <div style={sec}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '19px', top: '32px', bottom: '32px', width: '1px', background: C.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { n: '1', t: 'Heizcheck Report angefordert', d: 'Du hast diesen Schritt bereits erledigt — dein Report liegt vor.', done: true },
              { n: '2', t: '3 Fachbetriebe anfragen', d: 'Heizcheck wählt 3 geprüfte Installateure in deiner Region. Kontakt innerhalb 24h.', current: true },
              { n: '3', t: 'Vor-Ort Termin & Angebote', d: 'Die Betriebe kommen zu dir — kostenlos, unverbindlich. Mindestens 3 Angebote zum Vergleich.' },
              { n: '4', t: 'Auftrag mit KfW-Klausel', d: 'Du unterschreibst mit KfW-Schutzklausel — falls Förderung abgelehnt wird, ist der Vertrag nichtig. Kein Risiko.', kfw: true },
              { n: '5', t: 'Installation & Förderung', d: 'Installation in 3–5 Werktagen. Ab jetzt sparst du jeden Monat.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500,
                  background: s.done || s.current ? (s.done ? C.gruen : C.gruenBg) : C.bgCard,
                  color: s.done ? '#fff' : s.current ? C.gruenDark : C.hellgrau,
                  border: s.current ? `1.5px solid ${C.gruen}` : s.done ? 'none' : `0.5px solid ${C.border}` }}>
                  {s.done ? '✓' : s.n}
                </div>
                <div style={{ flex: 1, paddingTop: '6px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: C.schwarz, marginBottom: '4px' }}>{s.t}</div>
                  <div style={{ fontSize: '13px', color: C.grau, lineHeight: 1.6 }}>{s.d} {s.done && <span style={{ color: C.gruen, fontWeight: 500 }}>✓ Erledigt</span>}</div>
                  {s.kfw && (
                    <div style={{ background: C.gruenBg, borderRadius: '10px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '8px' }}>
                      <span style={{ fontSize: '14px', color: C.gruen, flexShrink: 0 }}>🛡️</span>
                      <div style={{ fontSize: '12px', color: C.gruenDark, lineHeight: 1.5 }}><strong>KfW-Klausel schützt dich:</strong> Falls Förderung abgelehnt → Vertrag nichtig. Du zahlst nichts.</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEKTION 5 — FIRMEN (VERDECKT → FREISCHALTEN) */}
      <div style={{ background: C.bgSoft, padding: '20px 32px', borderBottom: `0.5px solid ${C.border}` }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: C.gruenDark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fachbetriebe</div>
        <div style={{ fontSize: '22px', fontWeight: 500, color: C.schwarz, letterSpacing: '-0.5px', marginTop: '4px' }}>
          {freigeschaltet ? 'Diese 3 Betriebe melden sich bei dir' : '3 geprüfte Betriebe in deiner Region'}
        </div>
        <div style={{ fontSize: '14px', color: C.grau, marginTop: '8px', lineHeight: 1.6 }}>
          {freigeschaltet
            ? `Wir haben deine Anfrage weitergeleitet${person?.name ? `, ${person.name}` : ''}. Die Betriebe melden sich innerhalb von 24h telefonisch bei dir.`
            : `Basierend auf ${stadt || 'deiner PLZ'} haben wir 3 geprüfte Installateure ausgewählt — alle zertifiziert und mit Erfahrung in deiner Anlagengröße.`}
        </div>
      </div>

      {/* 3 FIRMEN BOXEN */}
      <div style={{ padding: '24px 32px', background: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: freigeschaltet ? 0 : '20px' }}>
          {firmenListe.map((f, i) => (
            <div key={i} style={{
              border: `0.5px solid ${i === 0 ? C.gruen : C.border}`,
              borderRadius: '12px', overflow: 'hidden',
              background: i === 0 ? C.gruenBg : '#fff'
            }}>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: i === 0 ? C.gruen : C.bgCard, color: i === 0 ? '#fff' : C.hellgrau, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    {/* Name — verdeckt oder offen */}
                    <div style={{
                      fontSize: '15px', fontWeight: 500, color: C.schwarz, marginBottom: '2px',
                      filter: freigeschaltet ? 'none' : 'blur(5px)',
                      userSelect: freigeschaltet ? 'auto' : 'none',
                      transition: 'filter 0.4s ease'
                    }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: '12px', color: C.grau }}>
                      <span style={{ color: C.gruen }}>●</span> {f.region} · {f.entfernung} km entfernt
                    </div>
                  </div>
                </div>
                {i === 0 && !freigeschaltet && (
                  <div style={{ fontSize: '10px', color: C.gruenDark, background: '#fff', padding: '4px 10px', borderRadius: '20px', fontWeight: 500, flexShrink: 0 }}>Top-Empfehlung</div>
                )}
                {freigeschaltet && (
                  <div style={{ fontSize: '10px', color: C.gruenDark, background: C.gruenBg, padding: '4px 10px', borderRadius: '20px', fontWeight: 500, flexShrink: 0 }}>Meldet sich in 24h</div>
                )}
              </div>
              {/* Fakten */}
              <div style={{ padding: '0 16px 14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: C.gruenDark, background: i === 0 ? '#fff' : C.gruenBg, padding: '3px 10px', borderRadius: '20px' }}>✓ KfW zertifiziert</span>
                <span style={{ fontSize: '10px', color: C.gruenDark, background: i === 0 ? '#fff' : C.gruenBg, padding: '3px 10px', borderRadius: '20px' }}>✓ {f.spezial}</span>
                <span style={{ fontSize: '10px', color: C.gruenDark, background: i === 0 ? '#fff' : C.gruenBg, padding: '3px 10px', borderRadius: '20px' }}>✓ Heizlastberechnung</span>
              </div>
            </div>
          ))}
        </div>

        {/* FREISCHALTEN — inline Telefon */}
        {!freigeschaltet && (
          <div style={{ background: C.schwarz, borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Letzter Schritt</div>
            <div style={{ fontSize: '20px', fontWeight: 500, color: '#fff', letterSpacing: '-0.3px', marginBottom: '6px', lineHeight: 1.2 }}>
              Firmen freischalten &amp; Anfrage senden
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '18px' }}>
              Gib deine Telefonnummer ein — die 3 Betriebe melden sich innerhalb von 24h bei dir.
            </div>
            <input
              type="tel"
              value={tel}
              onChange={e => { setTel(e.target.value); setFehler('') }}
              placeholder="z.B. 0172 1234567"
              style={{ width: '100%', padding: '14px 16px', border: 'none', borderRadius: '10px', fontSize: '16px', color: C.schwarz, background: '#fff', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '10px', textAlign: 'center' }}
            />
            {fehler && <div style={{ fontSize: '12px', color: '#FF9B9B', marginBottom: '10px' }}>{fehler}</div>}
            <button
              onClick={freischalten}
              disabled={laden}
              style={{ background: laden ? 'rgba(29,158,117,0.5)' : C.gruen, border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 500, color: '#fff', cursor: laden ? 'default' : 'pointer', fontFamily: "'DM Sans', sans-serif", width: '100%' }}
            >
              {laden ? 'Wird gesendet...' : '🔓 3 Firmen freischalten →'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
              <span>🔒 Kein Spam</span><span>📞 Max. 3 Anrufe</span><span>✓ Kostenlos</span>
            </div>
          </div>
        )}

        {/* FREIGESCHALTET — Bestätigung */}
        {freigeschaltet && (
          <div style={{ background: C.gruenBg, borderRadius: '14px', padding: '20px 24px', textAlign: 'center', marginTop: '4px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
            <div style={{ fontSize: '17px', fontWeight: 500, color: C.gruenDark, marginBottom: '4px' }}>Anfrage erfolgreich gesendet!</div>
            <div style={{ fontSize: '13px', color: '#0F6E56', lineHeight: 1.6 }}>
              Die 3 Fachbetriebe wurden über deine Anfrage informiert und melden sich innerhalb von 24h telefonisch bei dir.
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: C.schwarz, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>heizcheck.pro · Persönlicher Wärmepumpen-Report</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>95% Angebotsgenauigkeit</div>
      </div>

    </div>
  )
}

// ─── PERSON EINGABE ───────────────────────────────────────────────────────────
function PersonEingabe({ person, setPerson, onWeiter, isMobile }) {
  const [fehler, setFehler] = useState('')

  function weiter() {
    if (!person.name?.trim()) { setFehler('Bitte gib deinen Vornamen ein.'); return }
    if (!person.plz?.trim() || person.plz.length < 5) { setFehler('Bitte gib deine Postleitzahl ein.'); return }
    setFehler('')
    onWeiter()
  }

  return (
    <div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 500, color: '#085041', background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px', marginBottom: '1.25rem' }}>
        ✓ Kostenlos & unverbindlich
      </div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.3px', color: '#0a0a0a' }}>
        Für wen erstellen wir den Report?
      </h2>
      <p style={{ fontSize: '14px', color: '#6b6966', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        {isMobile ? 'Dein Report wird persönlich auf dich zugeschnitten.' : 'Gib deinen Namen ein — dein Report wird sofort rechts personalisiert.'}
      </p>

      {[
        { key: 'name', label: 'Vorname', placeholder: 'z.B. Thomas', type: 'text', pflicht: true },
        { key: 'adresse', label: 'Straße & Hausnummer', placeholder: 'z.B. Musterstraße 12', type: 'text', pflicht: false },
        { key: 'plz', label: 'Postleitzahl', placeholder: 'z.B. 50667', type: 'text', maxLength: 5, pflicht: true },
        { key: 'stadt', label: 'Stadt', placeholder: 'z.B. Köln', type: 'text', pflicht: false },
      ].map(field => (
        <div key={field.key} style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#a09e9a', marginBottom: '5px' }}>
            {field.label} {field.pflicht ? <span style={{ color: '#E24B4A' }}>*</span> : <span style={{ color: '#e2e1de' }}>— optional</span>}
          </label>
          <input
            type={field.type}
            value={person[field.key] || ''}
            onChange={e => { setPerson(prev => ({ ...prev, [field.key]: e.target.value })); setFehler('') }}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            style={{ width: '100%', padding: '13px 14px', border: '1px solid #e2e1de', borderRadius: '10px', fontSize: '15px', color: '#0a0a0a', background: '#fff', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
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

      <button onClick={weiter} style={{ width: '100%', padding: '14px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: '10px', marginTop: '4px' }}>
        Berechnung starten →
      </button>
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#a09e9a' }}>
        🔒 Deine Daten werden nicht ohne deine Zustimmung weitergegeben
      </div>
    </div>
  )
}

// ─── HAUPT KONFIGURATOR ───────────────────────────────────────────────────────
export default function Konfigurator({ onFertig }) {
  const [phase, setPhase] = useState('person')
  const [person, setPerson] = useState({ name: '', adresse: '', plz: '', stadt: '' })
  const [antworten, setAntworten] = useState({})
  const [eingabe, setEingabe] = useState('')
  const [schritt, setSchritt] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [fertig, setFertig] = useState(false)
  const [ergebnis, setErgebnis] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const schritte = gefilterteSchritte(antworten)
  const aktuell = schritte[schritt]
  const istLetzter = schritt === schritte.length - 1

  const block1Schritte = schritte.filter(s => s.block === 1).length
  const block2Schritte = schritte.filter(s => s.block === 2).length
  const block1Ende = block1Schritte - 1
  const block2Ende = block1Schritte + block2Schritte - 1
  const aktuellerBlock = schritt <= block1Ende ? 1 : schritt <= block2Ende ? 2 : 3

  const kannWeiter = aktuell?.typ === 'eingabe'
    ? (eingabe !== '' || antworten[aktuell?.id] === 'default')
    : !!antworten[aktuell?.id]

  function weiter(neueAntworten) {
    if (istLetzter) {
      const result = berechneWirtschaftlichkeit(neueAntworten)
      setErgebnis(result)
      setFertig(true)
      return
    }
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s + 1)
      setEingabe(neueAntworten[schritte[schritt + 1]?.id] || '')
      setAnimate(true)
    }, 120)
  }

  function waehleOption(id, wert) {
    const neu = { ...antworten, [id]: wert }
    setAntworten(neu)
    setTimeout(() => weiter(neu), 200)
  }

  function naechsterEingabe() {
    const neu = { ...antworten }
    if (eingabe !== '') neu[aktuell.id] = eingabe
    setAntworten(neu)
    weiter(neu)
  }

  function zurueck() {
    if (schritt === 0) { setPhase('person'); return }
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s - 1)
      setEingabe(antworten[schritte[schritt - 1]?.id] || '')
      setAnimate(true)
    }, 120)
  }

  const layout = (links, rechts) => (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 6%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: '40px', alignItems: 'start' }}>
      <div>{links}</div>
      {!isMobile && rechts}
    </div>
  )

  // FINALE ANSICHT
  if (fertig && ergebnis) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 6%' }}>
        <FinalReport
          ergebnis={ergebnis}
          antworten={antworten}
          person={person}
          onAngebot={() => {}}
        />
      </div>
    )
  }

  // PHASE PERSON
  if (phase === 'person') {
    return layout(
      <PersonEingabe person={person} setPerson={setPerson} onWeiter={() => setPhase('fragen')} isMobile={isMobile} />,
      <LiveReport person={person} antworten={antworten} schritt={0} schritte={schritte} phase="person" />
    )
  }

  // PHASE FRAGEN
  if (!aktuell) return null

  return layout(
    <div style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.2s ease, transform 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'nowrap' }}>
        <BlockHeader nummer="1" titel="Dein Haus" aktiv={aktuellerBlock === 1} fertig={aktuellerBlock > 1} />
        <span style={{ color: '#e2e1de', fontSize: '10px', flexShrink: 0 }}>—</span>
        <BlockHeader nummer="2" titel="Technik" aktiv={aktuellerBlock === 2} fertig={aktuellerBlock > 2} />
        <span style={{ color: '#e2e1de', fontSize: '10px', flexShrink: 0 }}>—</span>
        <BlockHeader nummer="3" titel="Situation" aktiv={aktuellerBlock === 3} fertig={false} />
      </div>
      <div style={{ height: '3px', background: '#e2e1de', borderRadius: '2px', marginBottom: '1.75rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((schritt + 1) / schritte.length) * 100}%`, background: '#1D9E75', borderRadius: '2px', transition: 'width 0.3s ease' }} />
      </div>
      <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 500, lineHeight: 1.2, marginBottom: '0.75rem', letterSpacing: '-0.3px', color: '#0a0a0a' }}>{aktuell.frage}</h2>
      {aktuell.info && <p style={{ fontSize: '13px', color: '#6b6966', lineHeight: 1.6, marginBottom: '1rem', padding: '10px 14px', background: '#f8f8f7', borderRadius: '8px', borderLeft: '3px solid #1D9E75' }}>{aktuell.info}</p>}
      <div style={{ height: aktuell.info ? 0 : '1rem' }} />

      {aktuell.typ === 'auswahl' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {aktuell.optionen.map(opt => <OptionButton key={opt.wert} option={opt} ausgewaehlt={antworten[aktuell.id] === opt.wert} onClick={() => waehleOption(aktuell.id, opt.wert)} />)}
        </div>
      )}

      {aktuell.typ === 'eingabe' && (
        <div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" value={eingabe}
              onChange={e => { setEingabe(e.target.value); setAntworten(prev => ({ ...prev, [aktuell.id]: undefined })) }}
              placeholder={aktuell.placeholder}
              style={{ flex: 1, padding: '13px 16px', border: '1px solid #e2e1de', borderRadius: '12px', fontSize: '16px', color: '#0a0a0a', background: '#fff', fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0a0a0a'}
              onBlur={e => e.target.style.borderColor = '#e2e1de'}
              onKeyDown={e => { if (e.key === 'Enter' && kannWeiter) naechsterEingabe() }}
            />
            <div style={{ padding: '13px 14px', border: '1px solid #e2e1de', borderRadius: '12px', fontSize: '12px', color: '#a09e9a', background: '#f8f8f7', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{aktuell.einheit}</div>
          </div>
          {antworten[aktuell.id] === 'default' && <div style={{ marginTop: '8px', padding: '8px 12px', background: '#E1F5EE', borderRadius: '8px', fontSize: '12px', color: '#085041' }}>✓ Wir verwenden 20.000 kWh/Jahr als Durchschnitt</div>}
          <button onClick={() => { const neu = { ...antworten, [aktuell.id]: 'default' }; setAntworten(neu); setEingabe(''); setTimeout(() => weiter(neu), 150) }}
            style={{ marginTop: '10px', background: 'none', border: 'none', fontSize: '12px', color: '#a09e9a', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif" }}>{aktuell.tippAktion}</button>
          {aktuell.tipp && <p style={{ fontSize: '11px', color: '#a09e9a', marginTop: '6px', lineHeight: 1.5 }}>{aktuell.tipp}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button onClick={zurueck} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#a09e9a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>← Zurück</button>
            <span style={{ fontSize: '11px', color: '#a09e9a' }}>{schritt + 1} / {schritte.length}</span>
            <button onClick={naechsterEingabe} disabled={!kannWeiter} style={{ padding: '12px 24px', background: kannWeiter ? '#0a0a0a' : '#e2e1de', color: kannWeiter ? '#fff' : '#a09e9a', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: kannWeiter ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s ease' }}>
              {istLetzter ? 'Mein Ergebnis →' : 'Weiter'}
            </button>
          </div>
        </div>
      )}

      {aktuell.typ === 'auswahl' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
          <button onClick={zurueck} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#a09e9a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>← Zurück</button>
          <span style={{ fontSize: '11px', color: '#a09e9a' }}>{schritt + 1} / {schritte.length}</span>
          <div style={{ width: '70px' }} />
        </div>
      )}
    </div>,
    <LiveReport person={person} antworten={antworten} schritt={schritt} schritte={schritte} phase="fragen" />
  )
}