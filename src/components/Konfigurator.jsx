import React, { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import { SCHRITTE, KAMIN_FOLGE } from '../utils/schritte.js'
import { berechneWirtschaftlichkeit } from '../utils/berechnung.js'

const btn = {
  base: {
    width: '100%',
    padding: '14px 18px',
    border: '1px solid #e2e1de',
    borderRadius: '12px',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#0a0a0a',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.15s ease',
    fontFamily: "'DM Sans', sans-serif"
  },
  selected: {
    borderColor: '#0a0a0a',
    background: '#f8f8f7'
  }
}

function OptionButton({ option, ausgewaehlt, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...btn.base,
        ...(ausgewaehlt ? btn.selected : {}),
        ...(hover && !ausgewaehlt ? { borderColor: '#a09e9a', background: '#f8f8f7' } : {})
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {option.icon && <span style={{ fontSize: '20px' }}>{option.icon}</span>}
        <div>
          <div style={{ fontWeight: ausgewaehlt ? 500 : 400 }}>{option.label}</div>
          {option.sub && (
            <div style={{ fontSize: '12px', color: ausgewaehlt ? '#6b6966' : '#a09e9a', marginTop: '2px' }}>
              {option.sub}
            </div>
          )}
        </div>
      </div>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: ausgewaehlt ? '6px solid #0a0a0a' : '1.5px solid #e2e1de',
        transition: 'all 0.15s ease',
        flexShrink: 0
      }} />
    </button>
  )
}

export default function Konfigurator({ onFertig }) {
  const [schritt, setSchritt] = useState(0)
  const [antworten, setAntworten] = useState({})
  const [eingabe, setEingabe] = useState('')
  const [animate, setAnimate] = useState(true)

  const alleSchritte = [...SCHRITTE]
  if (antworten.kamin === 'ja') {
    const kaminIdx = alleSchritte.findIndex(s => s.id === 'kamin')
    alleSchritte.splice(kaminIdx + 1, 0, KAMIN_FOLGE)
  }

  const aktuell = alleSchritte[schritt]
  const istLetzter = schritt === alleSchritte.length - 1
  const kannWeiter = aktuell?.typ === 'eingabe'
    ? (eingabe !== '' || antworten[aktuell.id] === 'default')
    : !!antworten[aktuell?.id]

  function naechster() {
    if (aktuell.typ === 'eingabe' && eingabe !== '') {
      setAntworten(prev => ({ ...prev, [aktuell.id]: eingabe }))
    }
    if (istLetzter) {
      const finalAntworten = { ...antworten }
      if (aktuell.typ === 'eingabe' && eingabe !== '') {
        finalAntworten[aktuell.id] = eingabe
      }
      const ergebnis = berechneWirtschaftlichkeit(finalAntworten)
      onFertig({ antworten: finalAntworten, ergebnis })
      return
    }
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s + 1)
      setEingabe(antworten[alleSchritte[schritt + 1]?.id] || '')
      setAnimate(true)
    }, 120)
  }

  function zurueck() {
    if (schritt === 0) return
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s - 1)
      setEingabe(antworten[alleSchritte[schritt - 1]?.id] || '')
      setAnimate(true)
    }, 120)
  }

  function waehleOption(id, wert) {
    setAntworten(prev => ({ ...prev, [id]: wert }))
  }

  function setzeDefault() {
    setAntworten(prev => ({ ...prev, [aktuell.id]: 'default' }))
    setEingabe('')
  }

  if (!aktuell) return null

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '0 1rem',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease'
    }}>
      <ProgressBar aktuell={schritt} gesamt={alleSchritte.length} />
      <h2 style={{
        fontSize: 'clamp(22px, 4vw, 28px)',
        fontWeight: 500,
        lineHeight: 1.2,
        marginBottom: '0.5rem',
        letterSpacing: '-0.3px'
      }}>
        {aktuell.frage}
      </h2>
      {aktuell.info && (
        <p style={{ fontSize: '13px', color: '#a09e9a', marginBottom: '1.5rem' }}>
          {aktuell.info}
        </p>
      )}
      <div style={{ height: aktuell.info ? 0 : '1.5rem' }} />
      {aktuell.typ === 'auswahl' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {aktuell.optionen.map(opt => (
            <OptionButton
              key={opt.wert}
              option={opt}
              ausgewaehlt={antworten[aktuell.id] === opt.wert}
              onClick={() => waehleOption(aktuell.id, opt.wert)}
            />
          ))}
        </div>
      )}
      {aktuell.typ === 'eingabe' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
            <input
              type="number"
              value={eingabe}
              onChange={e => {
                setEingabe(e.target.value)
                setAntworten(prev => ({ ...prev, [aktuell.id]: undefined }))
              }}
              placeholder={aktuell.placeholder}
              style={{
                flex: 1,
                padding: '14px 16px',
                border: '1px solid #e2e1de',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#0a0a0a',
                background: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#0a0a0a'}
              onBlur={e => e.target.style.borderColor = '#e2e1de'}
            />
            <div style={{
              padding: '14px 16px',
              border: '1px solid #e2e1de',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#a09e9a',
              background: '#f8f8f7',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center'
            }}>
              {aktuell.einheit}
            </div>
          </div>
          {antworten[aktuell.id] === 'default' && (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              background: '#E1F5EE',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#085041'
            }}>
              ✓ Wir verwenden den Durchschnittswert (20.000 kWh/Jahr)
            </div>
          )}
          <button
            onClick={setzeDefault}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '13px',
              color: '#a09e9a',
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationColor: '#e2e1de',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {aktuell.tippAktion}
          </button>
          {aktuell.tipp && (
            <p style={{ fontSize: '12px', color: '#a09e9a', marginTop: '8px', lineHeight: 1.5 }}>
              {aktuell.tipp}
            </p>
          )}
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2.5rem'
      }}>
        <button
          onClick={zurueck}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: '#a09e9a',
            padding: '8px 0',
            fontFamily: "'DM Sans', sans-serif",
            visibility: schritt === 0 ? 'hidden' : 'visible'
          }}
        >
          ← Zurück
        </button>
        <button
          onClick={naechster}
          disabled={!kannWeiter}
          style={{
            padding: '13px 32px',
            background: kannWeiter ? '#0a0a0a' : '#e2e1de',
            color: kannWeiter ? '#ffffff' : '#a09e9a',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: kannWeiter ? 'pointer' : 'default',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.15s ease'
          }}
        >
          {istLetzter ? 'Einschätzung anzeigen →' : 'Weiter'}
        </button>
      </div>
    </div>
  )
}
