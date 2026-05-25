const WP_PREISE = {
  '5kw':  31500,
  '7kw':  32100,
  '10kw': 34670,
  '12kw': 37560,
}

const MARKTPREISE = {
  gas:        0.11,
  oel:        0.10,
  pellets:    0.065,
  strom:      0.28,
  fernwaerme: 0.14,
}

const STROMPREIS_WP   = 0.26
const PREISSTEIGERUNG = 0.03

const COP = {
  fub: 4.5,
  mix: 4.0,
  hk:  4.0,
}

function getWpGroesse(kwh) {
  if (kwh <= 20000) return '5kw'
  if (kwh <= 25000) return '7kw'
  if (kwh <= 32000) return '10kw'
  return '12kw'
}

function berechneForoerderung(antworten, anlagenPreis) {
  const { heizungsart, heizungsalter, eigentuemer, einkommen } = antworten
  const istEigentuemer  = eigentuemer === 'ja'
  const einkommensBonus = einkommen === 'ja'

  if (!istEigentuemer) {
    return { prozent: 15, betrag: Math.round(anlagenPreis * 0.15) }
  }

  let prozent = 35

  if (heizungsart === 'oel') {
    prozent = 55
  } else {
    const alter = heizungsalter === 'ue20' ? 20 : heizungsalter === '10-20' ? 15 : 5
    if (alter >= 20) prozent = 55
  }

  if (einkommensBonus) prozent = Math.min(prozent + 20, 70)

  const foerderBasis = Math.min(anlagenPreis, 30000)
  const betrag = Math.round(foerderBasis * (prozent / 100))

  return { prozent, betrag }
}

export function berechneWirtschaftlichkeit(antworten) {
  const { verbrauch, heizungsart, heizflaeche, pv } = antworten

  const verbrauchKwh = !verbrauch || verbrauch === 'default'
    ? 20000
    : parseFloat(verbrauch)

  const wpGroesse    = getWpGroesse(verbrauchKwh)
  const anlagenPreis = WP_PREISE[wpGroesse]

  const foerderung  = berechneForoerderung(antworten, anlagenPreis)
  const nettoinvest = anlagenPreis - foerderung.betrag

  const altKosten = Math.round(verbrauchKwh * (MARKTPREISE[heizungsart] || 0.11))

  const cop = COP[heizflaeche] || 4.0
  const wpVerbrauch = (verbrauchKwh / cop) * 1.12
  const pvBonus = pv === 'ja' ? Math.round(wpVerbrauch * STROMPREIS_WP * 0.25) : 0
  const wpKosten = Math.round(wpVerbrauch * STROMPREIS_WP - pvBonus)

  const ersparnis = Math.round(altKosten - wpKosten)

  let jahre = 0
  let rest  = nettoinvest
  while (rest > 0 && jahre < 30) {
    jahre++
    rest -= ersparnis * Math.pow(1 + PREISSTEIGERUNG, jahre)
  }

  return {
    wpGroesse,
    anlagenPreis,
    foerderProzent: foerderung.prozent,
    foerderBetrag:  foerderung.betrag,
    nettoinvest,
    altKosten,
    wpKosten,
    ersparnis,
    pvBonus,
    amortisation: jahre <= 0 ? null : jahre,
    verbrauchKwh,
    cop: cop.toFixed(1),
  }
}
