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
const FOERDERUNG_BASIS = 0.30
const FOERDERUNG_KLIMA = 0.05
const ANLAGEN_PREIS = 20000
const STROMPREIS_WP = 0.26
const PREISSTEIGERUNG = 0.03

export function berechneWirtschaftlichkeit({ heizungsart, verbrauch, heizkoerper, kamin, kamingut }) {
  const verbrauchKwh = verbrauch === 'default' ? STANDARD_VERBRAUCH : parseFloat(verbrauch)

  let altKosten = 0
  if (heizungsart === 'oel') {
    const liter = verbrauchKwh / 10
    altKosten = liter * MARKTPREISE.oel
  } else {
    altKosten = verbrauchKwh * (MARKTPREISE[heizungsart] || 0.11)
  }

  const kaminAbzug = kamin === 'ja' ? (kamingut === 'viel' ? 2000 : 1000) : 0
  const effVerbrauch = verbrauchKwh - kaminAbzug

  const cop = COP_FAKTOREN[heizkoerper] || 3.5
  const wpVerbrauch = (effVerbrauch / cop) * (1 + VERLUST)
  const wpKosten = wpVerbrauch * STROMPREIS_WP

  const foerderProzent = FOERDERUNG_BASIS + FOERDERUNG_KLIMA
  const foerderBetrag = Math.round(ANLAGEN_PREIS * foerderProzent)
  const nettoinvest = ANLAGEN_PREIS - foerderBetrag

  const ersparnis = altKosten - wpKosten

  let jahre = 0
  let rest = nettoinvest
  while (rest > 0 && jahre < 30) {
    jahre++
    rest -= ersparnis * Math.pow(1 + PREISSTEIGERUNG, jahre)
  }

  return {
    altKosten: Math.round(altKosten),
    wpKosten: Math.round(wpKosten),
    ersparnis: Math.round(ersparnis),
    wpVerbrauch: Math.round(wpVerbrauch),
    foerderBetrag,
    nettoinvest,
    amortisation: jahre <= 0 ? null : jahre,
    anlagenPreis: ANLAGEN_PREIS,
    cop: cop.toFixed(1)
  }
}
