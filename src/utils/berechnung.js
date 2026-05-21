export const MARKTPREISE = {
  gas: 0.11,
  oel: 1.42,
  pellets: 0.065,
  strom: 0.28,
  fernwaerme: 0.14
}

export const STANDARD_VERBRAUCH = 20000

export const COP_FAKTOREN = {
  fub: 4.2,
  mix: 3.6,
  hk: 3.0
}

const VERLUST = 0.12
const FOERDERUNG_BASIS = 0.35
const FOERDERUNG_EINKOMMEN = 0.70
const ANLAGEN_PREIS = 20000
const STROMPREIS_WP = 0.26
const PREISSTEIGERUNG = 0.03

export function berechneWirtschaftlichkeit(antworten) {
  const { heizungsart, verbrauch, heizflaeche, einkommen, eigentuemer, pv } = antworten

  const verbrauchKwh = verbrauch === 'default' || !verbrauch
    ? STANDARD_VERBRAUCH
    : parseFloat(verbrauch)

  let altKosten = 0
  if (heizungsart === 'oel') {
    altKosten = (verbrauchKwh / 10) * MARKTPREISE.oel
  } else {
    altKosten = verbrauchKwh * (MARKTPREISE[heizungsart] || 0.11)
  }

  const cop = COP_FAKTOREN[heizflaeche] || 3.5
  const wpVerbrauch = (verbrauchKwh / cop) * (1 + VERLUST)
  const wpKosten = wpVerbrauch * STROMPREIS_WP

  const hatEinkommensbonus = einkommen === 'ja'
  const istEigentuemer = eigentuemer === 'ja'
  const foerderProzent = hatEinkommensbonus ? FOERDERUNG_EINKOMMEN : FOERDERUNG_BASIS
  const foerderBetrag = istEigentuemer
    ? Math.round(ANLAGEN_PREIS * foerderProzent)
    : Math.round(ANLAGEN_PREIS * 0.15)
  const nettoinvest = ANLAGEN_PREIS - foerderBetrag

  const ersparnis = altKosten - wpKosten
  const pvBonus = pv === 'ja' ? Math.round(wpKosten * 0.25) : 0

  let jahre = 0
  let rest = nettoinvest
  while (rest > 0 && jahre < 30) {
    jahre++
    rest -= (ersparnis + pvBonus) * Math.pow(1 + PREISSTEIGERUNG, jahre)
  }

  return {
    altKosten: Math.round(altKosten),
    wpKosten: Math.round(wpKosten),
    ersparnis: Math.round(ersparnis + pvBonus),
    wpVerbrauch: Math.round(wpVerbrauch),
    foerderBetrag,
    foerderProzent: Math.round(foerderProzent * 100),
    nettoinvest,
    amortisation: jahre <= 0 ? null : jahre,
    anlagenPreis: ANLAGEN_PREIS,
    pvBonus,
    cop: cop.toFixed(1)
  }
}
