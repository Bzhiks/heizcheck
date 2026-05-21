import React, { useState } from 'react'
import { gefilterteSchritte } from '../utils/schritte.js'
import { berechneWirtschaftlichkeit } from '../utils/berechnung.js'

function BlockHeader({ nummer, titel, aktiv, fertig }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: fertig ? '#1D9E75' : aktiv ? '#0a0a0a' : '#e2e1de',
        color: fertig || aktiv ? '#fff' : '#a09e9a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 500,
        flexShrink: 0,
        transition: 'all 0.3s ease'
      }}>
        {fertig ? '✓' : nummer}
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: fertig ? '#1D9E75' : aktiv ? '#0a0a0a' : '#a09e9a',
        transition: 'color 0.3s ease',
        whiteSpace: 'nowrap'
      }}>
        {titel}
      </span>
    </div>
  )
}

function OptionButton({ option, ausgewaehlt, onClick }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '14px 18px',
        border: ausgewaehlt ? '1.5px solid #0a0a0a' : hover ? '1px solid #a09e9a' : '1px solid #e2e1de',
        borderRadius: '12px',
        background: ausgewaehlt ? '#f8f8f7' : hover ? '#f8f8f7' : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.15s ease',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {option.icon && <span style={{ fontSize: '20px' }}>{option.icon}</span>}
        {option.img && <span style={{ fontSize: '16px' }}>{option.img}</span>}
        <div>
          <div style={{ fontSize: '15px', fontWeight: ausgewaehlt ? 500 : 400, color: '#0a0a0a' }}>
            {option.label}
          </div>
          {option.sub && (
            <div style={{ fontSize: '12px', color: '#a09e9a', marginTop: '2px' }}>
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
  const [antworten, setAntworten] = useState({})
  const [eingabe, setEingabe] = useState('')
  const [schritt, setSchritt] = useState(0)
  const [animate, setAnimate] = useState(true)

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

  function naechster() {
    if (aktuell.typ === 'eingabe' && eingabe !== '') {
      setAntworten(prev => ({ ...prev, [aktuell.id]: eingabe }))
    }
    if (istLetzter) {
      const final = { ...antworten }
      if (aktuell.typ === 'eingabe' && eingabe !== '') final[aktuell.id] = eingabe
      const ergebnis = berechneWirtschaftlichkeit(final)
      onFertig({ antworten: final, ergebnis })
      return
    }
    setAnimate(false)
    setTimeout(() => {
      setSchritt(s => s + 1)
      setEingabe(antworten[schritte[schritt + 1]?.id] || '')
      setAnimate(true)
    }, 120)
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

  if (!aktuell) return null

  const fortschritt = ((schritt + 1) / schritte.length) * 100

  return (
    <div style={{
      maxWidth: '520px',
      margin: '0 auto',
      padding: '0 1rem',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease'
    }}>

      {/* Block-Indicator */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <BlockHeader nummer="1" titel="Dein Haus" aktiv={aktuellerBlock === 1} fertig={aktuellerBlock > 1} />
        <div style={{ color: '#e2e1de', alignSelf: 'center' }}>—</div>
        <BlockHeader nummer="2" titel="Deine Technik" aktiv={aktuellerBlock === 2} fertig={aktuellerBlock > 2} />
        <div style={{ color: '#e2e1de', alignSelf: 'center' }}>—</div>
        <BlockHeader nummer="3" titel="Deine Situation" aktiv={aktuellerBlock === 3} fertig={false} />
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '3px',
        background: '#e2e1de',
        borderRadius: '2px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${fortschritt}%`,
          background: '#1D9E75',
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Frage */}
      <h2 style={{
        fontSize: 'clamp(20px, 4vw, 26px)',
        fontWeight: 500,
        lineHeight: 1.2,
        marginBottom: '0.75rem',
        letterSpacing: '-0.3px',
        color: '#0a0a0a'
      }}>
        {aktuell.frage}
      </h2>

      {/* Info */}
      {aktuell.info && (
        <p style={{
          fontSize: '13px',
          color: '#6b6966',
          lineHeight: 1.6,
          marginBottom: '1.5rem',
          padding: '10px 14px',
          background: '#f8f8f7',
          borderRadius: '8px',
          borderLeft: '3px solid #1D9E75'
        }}>
          {aktuell.info}
        </p>
      )}

      <div style={{ height: aktuell.info ? 0 : '1.25rem' }} />

      {/* Optionen */}
      {aktuell.typ === 'auswahl' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {aktuell.optionen.map(opt => (
            <OptionButton
              key={opt.wert}
              option={opt}
              ausgewaehlt={antworten[aktuell.id] === opt.wert}
              onClick={() => setAntworten(prev => ({ ...prev, [aktuell.id]: opt.wert }))}
            />
          ))}
        </div>
      )}

      {/* Eingabe */}
      {aktuell.typ === 'eingabe' && (
        <div>
          <div style={{ display: 'flex', gap: '10px' }}>
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
                outline: 'none'
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
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
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
              ✓ Wir verwenden 20.000 kWh/Jahr als Durchschnitt
            </div>
          )}

          <button
            onClick={() => {
              setAntworten(prev => ({ ...prev, [aktuell.id]: 'default' }))
              setEingabe('')
            }}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              fontSize: '13px',
              color: '#a09e9a',
              cursor: 'pointer',
              textDecoration: 'underline',
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

      {/* Navigation */}
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
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            visibility: schritt === 0 ? 'hidden' : 'visible'
          }}
        >
          ← Zurück
        </button>

        <span style={{ fontSize: '12px', color: '#a09e9a' }}>
          {schritt + 1} / {schritte.length}
        </span>

        <button
          onClick={naechster}
          disabled={!kannWeiter}
          style={{
            padding: '13px 28px',
            background: kannWeiter ? '#0a0a0a' : '#e2e1de',
            color: kannWeiter ? '#fff' : '#a09e9a',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: kannWeiter ? 'pointer' : 'default',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'all 0.15s ease'
          }}
        >
          {istLetzter ? 'Mein Ergebnis →' : 'Weiter'}
        </button>
      </div>
    </div>
  )
}
