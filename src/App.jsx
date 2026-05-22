import React, { useState, useEffect } from 'react'
import Konfigurator from './components/Konfigurator.jsx'
import Ergebnis from './components/Ergebnis.jsx'
import LeadForm from './components/LeadForm.jsx'
import Danke from './components/Danke.jsx'

const ANSICHTEN = { START: 'start', KONFIGURATOR: 'konfigurator', ERGEBNIS: 'ergebnis', LEAD: 'lead', DANKE: 'danke' }

function Nav({ onLogo }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 48px', borderBottom: '1px solid #f0efed'
    }}>
      <button onClick={onLogo} style={{
        background: 'none', border: 'none', fontSize: '18px',
        fontWeight: 500, cursor: 'pointer', color: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        heiz<span style={{ color: '#1D9E75' }}>check</span>
      </button>
      <div style={{ fontSize: '13px', color: '#a09e9a' }}>
        3 Schritte · 3 Minuten · Kostenlos
      </div>
    </nav>
  )
}

function BeispielRechnung() {
  return (
    <div style={{
      background: '#fff', borderRadius: '20px',
      border: '1px solid #e2e1de', padding: '28px',
      boxShadow: '0 4px 40px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        fontSize: '11px', fontWeight: 500, color: '#085041',
        background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px',
        display: 'inline-block', marginBottom: '16px'
      }}>
        ✓ Beispielrechnung — Einfamilienhaus, Gas
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Heizkosten heute', wert: '2.200 €', sub: 'pro Jahr', gruen: false },
          { label: 'Mit Wärmepumpe',   wert: '680 €',   sub: 'pro Jahr', gruen: true },
          { label: 'Ersparnis',         wert: '+1.520 €', sub: 'pro Jahr', gruen: true, gross: true },
          { label: 'Amortisation',      wert: '8 Jahre',  sub: 'nach Förderung' },
        ].map(({ label, wert, sub, gruen, gross }) => (
          <div key={label} style={{ background: '#f8f8f7', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '11px', color: '#a09e9a', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: gross ? '22px' : '18px', fontWeight: 500, color: gruen ? '#1D9E75' : '#0a0a0a' }}>{wert}</div>
            <div style={{ fontSize: '11px', color: '#6b6966' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e2e1de', paddingTop: '12px', marginBottom: '12px' }}>
        {[
          { label: 'Anlage',             wert: '20.000 €',  farbe: '#6b6966' },
          { label: 'Förderung BEG (35%)', wert: '–7.000 €',  farbe: '#1D9E75' },
          { label: 'Netto-Investition',   wert: '13.000 €',  bold: true },
        ].map(({ label, wert, farbe, bold }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '13px', padding: '3px 0',
            fontWeight: bold ? 500 : 400
          }}>
            <span style={{ color: '#6b6966' }}>{label}</span>
            <span style={{ color: farbe || '#0a0a0a' }}>{wert}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '11px', color: '#a09e9a', textAlign: 'center', paddingTop: '8px', borderTop: '1px solid #f0efed' }}>
        95% der finalen Angebote stimmen mit dieser Einschätzung überein
      </div>
    </div>
  )
}

function LandingPage({ onStart, isMobile }) {
  return (
    <div style={{
      maxWidth: "100%", margin: '0 auto',
      padding: isMobile ? "2rem 1.25rem 3rem" : "3.5rem 6% 4rem"
    }}>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '2rem' : '5rem',
        alignItems: 'center',
        marginBottom: isMobile ? '2rem' : '3rem'
      }}>

        {/* Links */}
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {['Kostenlos', 'Ohne Verkäufer', '3 Minuten'].map(t => (
              <span key={t} style={{
                fontSize: '11px', fontWeight: 500, color: '#085041',
                background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px'
              }}>{t}</span>
            ))}
          </div>

          <h1 style={{
            fontSize: isMobile ? 'clamp(26px, 5vw, 36px)' : '52px',
            fontWeight: 500, lineHeight: 1.12,
            letterSpacing: '-0.5px', marginBottom: '1rem', color: '#0a0a0a'
          }}>
            Erfahre was eine Wärmepumpe wirklich{' '}
            <span style={{ color: '#1D9E75' }}>für dein Haus kostet</span>{' '}
            — ohne lästige Verkäufer.
          </h1>

          <p style={{
            fontSize: '16px', color: '#6b6966', lineHeight: 1.65,
            marginBottom: '2rem', maxWidth: '440px'
          }}>
            Kein Anruf, kein Druck, kein Verkaufsgespräch. 15 kurze Fragen — du bekommst
            Kosten, Förderung und Ersparnis konkret für deine Situation.
          </p>

          <button onClick={onStart} style={{
            padding: '18px 48px', background: '#0a0a0a', color: '#fff',
            border: 'none', borderRadius: '12px', fontSize: '16px',
            fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            marginBottom: '2rem', display: 'block',
            width: isMobile ? '100%' : 'auto'
          }}>
            Jetzt kostenlos berechnen →
          </button>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[['1.200+', 'Berechnungen'], ['4.9 / 5', 'Bewertung'], ['95%', 'Angebotsgenauigkeit']].map(([zahl, label]) => (
              <div key={label}>
                <div style={{ fontSize: '20px', fontWeight: 500, color: '#0a0a0a' }}>{zahl}</div>
                <div style={{ fontSize: '12px', color: '#a09e9a' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rechts — nur Desktop */}
        {!isMobile && <BeispielRechnung />}
      </div>

      {/* Warum-Box — volle Breite */}
      <div style={{
        padding: '24px 28px', background: '#f8f8f7', borderRadius: '16px'
      }}>
        <div style={{ fontSize: '11px', color: '#a09e9a', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Warum die meisten zu viel bezahlen
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '4px'
        }}>
          {[
            { x: true,  text: '10 Firmen rufen an — niemand erklärt ehrlich was es kostet' },
            { x: true,  text: 'Angebote nicht vergleichbar — jeder rechnet anders' },
            { x: true,  text: 'Förderung wird falsch oder gar nicht berücksichtigt' },
            { x: false, text: 'Heizcheck gibt dir zuerst Klarheit — dann entscheidest du selbst' },
          ].map(({ x, text }, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', fontSize: '13px',
              color: '#6b6966', padding: '5px 0', alignItems: 'flex-start'
            }}>
              <span style={{ color: x ? '#E24B4A' : '#1D9E75', flexShrink: 0 }}>{x ? '✕' : '✓'}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [ansicht, setAnsicht] = useState(ANSICHTEN.START)
  const [daten, setDaten] = useState({ antworten: null, ergebnis: null, kontakt: null })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  function neustart() {
    setDaten({ antworten: null, ergebnis: null, kontakt: null })
    setAnsicht(ANSICHTEN.START)
  }

  function handlePdfDownload() {
    alert('Info-PDF kommt gleich — wird noch implementiert!')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Nav onLogo={neustart} />
      <main>
        {ansicht === ANSICHTEN.START && (
          <LandingPage onStart={() => setAnsicht(ANSICHTEN.KONFIGURATOR)} isMobile={isMobile} />
        )}
        {ansicht === ANSICHTEN.KONFIGURATOR && (
          <div style={{ padding: '1.5rem 0 3rem' }}>
            <Konfigurator
              onFertig={({ antworten, ergebnis }) => {
                setDaten(prev => ({ ...prev, antworten, ergebnis }))
                setAnsicht(ANSICHTEN.ERGEBNIS)
              }}
            />
          </div>
        )}
        {ansicht === ANSICHTEN.ERGEBNIS && (
          <div style={{ padding: '1.5rem 0 3rem' }}>
            <Ergebnis
              ergebnis={daten.ergebnis}
              onAngebot={() => setAnsicht(ANSICHTEN.LEAD)}
              onPdfDownload={handlePdfDownload}
              onNeustart={neustart}
            />
          </div>
        )}
        {ansicht === ANSICHTEN.LEAD && (
          <div style={{ padding: '1.5rem 0 3rem' }}>
            <LeadForm
              ergebnis={daten.ergebnis}
              antworten={daten.antworten}
              onErfolg={kontakt => {
                setDaten(prev => ({ ...prev, kontakt }))
                setAnsicht(ANSICHTEN.DANKE)
              }}
            />
          </div>
        )}
        {ansicht === ANSICHTEN.DANKE && (
          <div style={{ padding: '1.5rem 0 3rem' }}>
            <Danke kontakt={daten.kontakt} onNeustart={neustart} />
          </div>
        )}
      </main>
    </div>
  )
}
