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

function FinalReport({ ergebnis, antworten, onAngebot, onDownload }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])
  const heizLabel = { gas: 'Gasheizung', oel: 'Ölheizung', pellets: 'Pelletheizung', strom: 'Stromheizung', fernwaerme: 'Fernwärme' }
  return (
    <div style={{
      maxWidth: '680px', margin: '0 auto',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <div style={{ background: '#0a0a0a', borderRadius: '16px 16px 0 0', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff', letterSpacing: '-0.3px' }}>heiz<span style={{ color: '#1D9E75' }}>check</span></div>
        <div style={{ fontSize: '10px', fontWeight: 500, color: '#085041', background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px' }}>✓ Persönliche Wirtschaftlichkeitsberechnung</div>
      </div>
      <div style={{ background: '#FAFAF8', padding: '20px 28px', borderLeft: '1px solid #e2e1de', borderRight: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          Mit der richtigen Planung sparst du nicht nur einmal — <span style={{ color: '#1D9E75' }}>sondern jeden Monat.</span>
        </div>
        <div style={{ fontSize: '12px', color: '#a09e9a' }}>
          {heizLabel[antworten.heizungsart] || 'Aktuelle Heizung'} · {antworten.verbrauch === 'default' ? '20.000' : antworten.verbrauch} kWh/Jahr · {antworten.personen} Personen
        </div>
      </div>
      <div style={{ background: '#fff', padding: '20px 28px', borderLeft: '1px solid #e2e1de', borderRight: '1px solid #e2e1de', borderTop: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '10px', fontWeight: 500, color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Direktvergleich</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { label: heizLabel[antworten.heizungsart] || 'Heute', wert: fmt(ergebnis.altKosten), farbe: '#E24B4A', bg: '#FCEBEB', pros: ['Steigende Preise', 'Energieabhängig', 'Hohe Wartung'], plus: false },
            { label: 'Wärmepumpe', wert: fmt(ergebnis.wpKosten), farbe: '#1D9E75', bg: '#f8f8f7', pros: ['Deutlich günstiger', 'Unabhängig', 'Niedrige Wartung'], plus: true },
            { label: 'WP + Energiemgmt.', wert: fmt(Math.round(ergebnis.wpKosten * 0.8)), farbe: '#085041', bg: '#E1F5EE', pros: ['Maximum Ersparnis', 'Automatisch optimiert', 'Zukunftsorientiert'], plus: true },
          ].map((col, i) => (
            <div key={i} style={{ background: col.bg, borderRadius: '10px', padding: '12px', borderTop: `3px solid ${col.farbe}` }}>
              <div style={{ fontSize: '9px', color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{col.label}</div>
              <div style={{ fontSize: '20px', fontWeight: 500, color: col.farbe, marginBottom: '2px' }}>{col.wert}</div>
              <div style={{ fontSize: '10px', color: '#a09e9a', marginBottom: '8px' }}>pro Jahr</div>
              {col.pros.map((p, pi) => (
                <div key={pi} style={{ fontSize: '10px', color: col.plus ? col.farbe : '#E24B4A', marginBottom: '2px' }}>{col.plus ? '✓' : '✕'} {p}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', padding: '16px 28px', borderLeft: '1px solid #e2e1de', borderRight: '1px solid #e2e1de', borderTop: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '10px', fontWeight: 500, color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Kosten über 20 Jahre (3% Preissteigerung p.a.)</div>
        {[
          { label: heizLabel[antworten.heizungsart] || 'Heute', wert: Math.round(ergebnis.altKosten * 26.87), farbe: '#E24B4A', breite: '100%' },
          { label: 'Wärmepumpe', wert: Math.round(ergebnis.wpKosten * 26.87), farbe: '#1D9E75', breite: `${Math.round((ergebnis.wpKosten / ergebnis.altKosten) * 100)}%` },
          { label: 'WP + Energiemanagement', wert: Math.round(ergebnis.wpKosten * 0.8 * 26.87), farbe: '#085041', breite: `${Math.round((ergebnis.wpKosten * 0.8 / ergebnis.altKosten) * 100)}%` },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b6966', marginBottom: '4px' }}>
              <span>{item.label}</span><span style={{ fontWeight: 500, color: item.farbe }}>{fmt(item.wert)}</span>
            </div>
            <div style={{ height: '6px', background: '#f0efed', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: item.breite, background: item.farbe, borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#FAFAF8', padding: '16px 28px', borderLeft: '1px solid #e2e1de', borderRight: '1px solid #e2e1de', borderTop: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a', marginBottom: '4px' }}>
          Jede Heizperiode ohne Wärmepumpe bedeutet <span style={{ color: '#E24B4A' }}>{fmt(ergebnis.altKosten)}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#6b6966', marginBottom: '12px' }}>die du weiter zahlst — ohne Gegenwert.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[['1 Jahr', 1], ['2 Jahre', 2], ['3 Jahre', 3]].map(([label, mult]) => (
            <div key={label} style={{ background: '#fff', borderRadius: '8px', padding: '10px', border: '1px solid #e2e1de', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: '#a09e9a', marginBottom: '3px' }}>Noch {label}</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#E24B4A' }}>{fmt(ergebnis.altKosten * mult)}</div>
              <div style={{ fontSize: '9px', color: '#a09e9a' }}>noch gezahlt</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', padding: '16px 28px', borderLeft: '1px solid #e2e1de', borderRight: '1px solid #e2e1de', borderTop: '1px solid #e2e1de' }}>
        <div style={{ fontSize: '10px', fontWeight: 500, color: '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Investitionsübersicht</div>
        {[
          { label: 'Anlage inkl. Installation (Richtwert)', wert: fmt(ergebnis.anlagenPreis), farbe: '#6b6966' },
          { label: `KfW-Förderung BEG (${ergebnis.foerderProzent}%)`, wert: `– ${fmt(ergebnis.foerderBetrag)}`, farbe: '#1D9E75' },
        ].map(({ label, wert, farbe }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid #f0efed' }}>
            <span style={{ color: '#6b6966' }}>{label}</span>
            <span style={{ color: farbe, fontWeight: 500 }}>{wert}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 500, padding: '8px 0 0' }}>
          <span>Ihre Netto-Investition</span><span>{fmt(ergebnis.nettoinvest)}</span>
        </div>
      </div>
      <div style={{ background: '#f8f8f7', padding: '20px 28px', borderRadius: '0 0 16px 16px', border: '1px solid #e2e1de', borderTop: 'none' }}>
        <button onClick={onAngebot} style={{ width: '100%', padding: '14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginBottom: '10px' }}>
          3 Firmen anfragen + persönlichen Report erhalten →
        </button>
        <button onClick={onDownload} style={{ width: '100%', padding: '13px', background: '#fff', color: '#0a0a0a', border: '1px solid #e2e1de', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          📄 Info-Report herunterladen — kostenlos, anonym
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '11px', color: '#a09e9a', marginTop: '10px' }}>
          <span>🔒 Kein Spam</span><span>📞 Max. 3 Anrufe</span><span>✓ Kostenlos</span>
        </div>
      </div>
    </div>
  )
}

function LiveReport({ antworten, schritt, schritte }) {
  const block1Ende = schritte.filter(s => s.block === 1).length - 1
  const block2Ende = block1Ende + schritte.filter(s => s.block === 2).length
  const block1Fertig = schritt > block1Ende
  const block2Fertig = schritt > block2Ende
  const ergebnis = block2Fertig ? berechneWirtschaftlichkeit(antworten) : null
  const heizLabel = { gas: 'Gasheizung', oel: 'Ölheizung', pellets: 'Pelletheizung', strom: 'Stromheizung', fernwaerme: 'Fernwärme' }
  const heizflLabel = { fub: 'Fußbodenheizung', mix: 'Gemischt', hk: 'Heizkörper' }
  const bauLabel = { vor1970: 'Vor 1970', '1970-1990': '1970–1990', '1990-2010': '1990–2010', nach2010: 'Nach 2010' }
  return (
    <div style={{ background: '#FAFAF8', borderRadius: '20px', border: '1px solid #e2e1de', padding: '24px', position: 'sticky', top: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>heiz<span style={{ color: '#1D9E75' }}>check</span></div>
        <div style={{ fontSize: '10px', color: '#085041', background: '#E1F5EE', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>Wird live erstellt...</div>
      </div>
      <div style={{ marginBottom: '16px', opacity: 1, transition: 'opacity 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: block1Fertig ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>{block1Fertig ? '✓' : '1'}</div>
          <span style={{ fontSize: '10px', fontWeight: 500, color: block1Fertig ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dein Haus</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            { label: 'Gebäude', wert: antworten.gebaeudetyp === 'efh' ? 'Einfamilienhaus' : antworten.gebaeudetyp === 'dhh' ? 'Doppelhaushälfte' : antworten.gebaeudetyp === 'rh' ? 'Reihenhaus' : antworten.gebaeudetyp === 'mfh' ? 'Mehrfamilienhaus' : '—' },
            { label: 'Baujahr', wert: bauLabel[antworten.baujahr] || '—' },
            { label: 'Heizung', wert: heizLabel[antworten.heizungsart] || '—' },
            { label: 'Verbrauch', wert: antworten.verbrauch ? (antworten.verbrauch === 'default' ? '20.000 kWh' : antworten.verbrauch + ' kWh') : '—' },
          ].map(({ label, wert }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e1de' }}>
              <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{wert}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '16px', opacity: schritt > block1Ende ? 1 : 0.2, transition: 'opacity 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: block2Fertig ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>{block2Fertig ? '✓' : '2'}</div>
          <span style={{ fontSize: '10px', fontWeight: 500, color: block2Fertig ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deine Technik</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            { label: 'Personen', wert: antworten.personen ? antworten.personen + ' Pers.' : '—' },
            { label: 'Heizfläche', wert: heizflLabel[antworten.heizflaeche] || '—' },
            { label: 'Warmwasser', wert: antworten.warmwasser === 'sofort' ? 'Sofort' : antworten.warmwasser === 'kurz' ? 'Kurz' : antworten.warmwasser === 'lang' ? 'Lang' : '—' },
            { label: 'Solar', wert: antworten.pv === 'ja' ? 'Vorhanden' : antworten.pv === 'interesse' ? 'Interesse' : antworten.pv === 'nein' ? 'Nein' : '—' },
          ].map(({ label, wert }) => (
            <div key={label} style={{ background: '#fff', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e1de' }}>
              <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>{wert}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ opacity: schritt > block2Ende ? 1 : 0.2, transition: 'opacity 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: ergebnis ? '#1D9E75' : '#e2e1de', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 500, flexShrink: 0 }}>{ergebnis ? '✓' : '3'}</div>
          <span style={{ fontSize: '10px', fontWeight: 500, color: ergebnis ? '#1D9E75' : '#a09e9a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Deine Einschätzung</span>
        </div>
        {ergebnis ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
              <div style={{ background: '#fff', borderRadius: '8px', padding: '10px', border: '1px solid #e2e1de' }}>
                <div style={{ fontSize: '9px', color: '#a09e9a', marginBottom: '3px', textTransform: 'uppercase' }}>Heute</div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#0a0a0a' }}>{fmt(ergebnis.altKosten)}</div>
                <div style={{ fontSize: '10px', color: '#a09e9a' }}>pro Jahr</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '8px', padding: '10px', border: '1px solid #e2e1de' }}>
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
          <div style={{ background: '#fff', borderRadius: '10px', padding: '14px', border: '1px solid #e2e1de', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#a09e9a' }}>Wird nach Block 2 berechnet...</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e1de' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#a09e9a', marginBottom: '6px' }}>
          <span>Fortschritt</span><span>{schritt + 1} / {schritte.length}</span>
        </div>
        <div style={{ height: '3px', background: '#e2e1de', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#1D9E75', borderRadius: '2px', width: `${((schritt + 1) / schritte.length) * 100}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  )
}

export default function Konfigurator({ onFertig }) {
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
    if (schritt === 0) return
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s - 1)
      setEingabe(antworten[schritte[schritt - 1]?.id] || '')
      setAnimate(true)
    }, 120)
  }

  if (fertig && ergebnis) {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 6%' }}>
        <FinalReport
          ergebnis={ergebnis}
          antworten={antworten}
          onAngebot={() => onFertig({ antworten, ergebnis, ziel: 'angebot' })}
          onDownload={() => onFertig({ antworten, ergebnis, ziel: 'download' })}
        />
      </div>
    )
  }

  if (!aktuell) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 6%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: '40px', alignItems: 'start' }}>
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
              <button onClick={zurueck} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#a09e9a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", visibility: schritt === 0 ? 'hidden' : 'visible' }}>← Zurück</button>
              <span style={{ fontSize: '11px', color: '#a09e9a' }}>{schritt + 1} / {schritte.length}</span>
              <button onClick={naechsterEingabe} disabled={!kannWeiter} style={{ padding: '12px 24px', background: kannWeiter ? '#0a0a0a' : '#e2e1de', color: kannWeiter ? '#fff' : '#a09e9a', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 500, cursor: kannWeiter ? 'pointer' : 'default', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s ease' }}>
                {istLetzter ? 'Mein Ergebnis →' : 'Weiter'}
              </button>
            </div>
          </div>
        )}
        {aktuell.typ === 'auswahl' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
            <button onClick={zurueck} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#a09e9a', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", visibility: schritt === 0 ? 'hidden' : 'visible' }}>← Zurück</button>
            <span style={{ fontSize: '11px', color: '#a09e9a' }}>{schritt + 1} / {schritte.length}</span>
            <div style={{ width: '70px' }} />
          </div>
        )}
      </div>
      {!isMobile && <LiveReport antworten={antworten} schritt={schritt} schritte={schritte} />}
    </div>
  )
}
