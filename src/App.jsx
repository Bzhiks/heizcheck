import React, { useState } from 'react'
import Konfigurator from './components/Konfigurator.jsx'
import Ergebnis from './components/Ergebnis.jsx'
import LeadForm from './components/LeadForm.jsx'
import Danke from './components/Danke.jsx'

const ANSICHTEN = { START: 'start', KONFIGURATOR: 'konfigurator', ERGEBNIS: 'ergebnis', LEAD: 'lead', DANKE: 'danke' }

function Nav({ onLogo }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 20px', borderBottom: '1px solid #f0efed'
    }}>
      <button onClick={onLogo} style={{
        background: 'none', border: 'none', fontSize: '16px',
        fontWeight: 500, cursor: 'pointer', color: '#0a0a0a',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        heiz<span style={{ color: '#1D9E75' }}>check</span>
      </button>
      <div style={{ fontSize: '12px', color: '#a09e9a' }}>
        Kostenlos · Kein Spam · 3 Minuten
      </div>
    </nav>
  )
}

function LandingPage({ onStart }) {
  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['Kostenlos', 'Ohne Verkäufer', '3 Minuten'].map(t => (
          <span key={t} style={{
            fontSize: '11px', fontWeight: 500, color: '#085041',
            background: '#E1F5EE', padding: '4px 12px', borderRadius: '20px'
          }}>{t}</span>
        ))}
      </div>

      <h1 style={{
        fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 500,
        lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: '1rem', color: '#0a0a0a'
      }}>
        Erfahre was eine Wärmepumpe wirklich{' '}
        <span style={{ color: '#1D9E75' }}>für dein Haus kostet</span>{' '}
        — ohne lästige Verkäufer.
      </h1>

      <p style={{
        fontSize: '15px', color: '#6b6966', lineHeight: 1.65,
        marginBottom: '1.75rem', maxWidth: '480px'
      }}>
        Kein Anruf, kein Druck, kein Verkaufsgespräch. 15 kurze Fragen — du bekommst
        Kosten, Förderung und Ersparnis konkret für deine Situation.
      </p>

      <button onClick={onStart} style={{
        padding: '15px 28px', background: '#0a0a0a', color: '#fff',
        border: 'none', borderRadius: '12px', fontSize: '15px',
        fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        marginBottom: '1.5rem', display: 'block', width: '100%'
      }}>
        Jetzt kostenlos berechnen →
      </button>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[['1.200+', 'Berechnungen'], ['4.9 / 5', 'Bewertung'], ['95%', 'Angebotsgenauigkeit']].map(([zahl, label]) => (
          <div key={label}>
            <div style={{ fontSize: '18px', fontWeight: 500, color: '#0a0a0a' }}>{zahl}</div>
            <div style={{ fontSize: '12px', color: '#a09e9a' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px', background: '#f8f8f7', borderRadius: '12px' }}>
        <div style={{ fontSize: '11px', color: '#a09e9a', marginBottom: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Warum die meisten zu viel bezahlen
        </div>
        {[
          { x: true,  text: '10 Firmen rufen an — niemand erklärt ehrlich was es kostet' },
          { x: true,  text: 'Angebote nicht vergleichbar — jeder rechnet anders' },
          { x: true,  text: 'Förderung wird falsch oder gar nicht berücksichtigt' },
          { x: false, text: 'Heizcheck gibt dir zuerst Klarheit — dann entscheidest du selbst' },
        ].map(({ x, text }, i) => (
          <div key={i} style={{
            display: 'flex', gap: '10px', fontSize: '13px',
            color: '#6b6966', padding: '3px 0', alignItems: 'flex-start'
          }}>
            <span style={{ color: x ? '#E24B4A' : '#1D9E75', flexShrink: 0 }}>{x ? '✕' : '✓'}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [ansicht, setAnsicht] = useState(ANSICHTEN.START)
  const [daten, setDaten] = useState({ antworten: null, ergebnis: null, kontakt: null })

  function neustart() {
    setDaten({ antworten: null, ergebnis: null, kontakt: null })
    setAnsicht(ANSICHTEN.START)
  }

  function handlePdfDownload() {
    alert('Info-PDF kommt gleich — wird noch implementiert!')
  }

  // Padding je nach Ansicht
  const mainPadding = ansicht === ANSICHTEN.START ? '0' : '1.25rem 0 3rem'

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Nav onLogo={neustart} />
      <main style={{ padding: mainPadding }}>
        {ansicht === ANSICHTEN.START && (
          <LandingPage onStart={() => setAnsicht(ANSICHTEN.KONFIGURATOR)} />
        )}
        {ansicht === ANSICHTEN.KONFIGURATOR && (
          <div style={{ padding: '1.25rem 0 3rem' }}>
            <Konfigurator
              onFertig={({ antworten, ergebnis }) => {
                setDaten(prev => ({ ...prev, antworten, ergebnis }))
                setAnsicht(ANSICHTEN.ERGEBNIS)
              }}
            />
          </div>
        )}
        {ansicht === ANSICHTEN.ERGEBNIS && (
          <div style={{ padding: '1.25rem 0 3rem' }}>
            <Ergebnis
              ergebnis={daten.ergebnis}
              onAngebot={() => setAnsicht(ANSICHTEN.LEAD)}
              onPdfDownload={handlePdfDownload}
              onNeustart={neustart}
            />
          </div>
        )}
        {ansicht === ANSICHTEN.LEAD && (
          <div style={{ padding: '1.25rem 0 3rem' }}>
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
          <div style={{ padding: '1.25rem 0 3rem' }}>
            <Danke kontakt={daten.kontakt} onNeustart={neustart} />
          </div>
        )}
      </main>
    </div>
  )
}
