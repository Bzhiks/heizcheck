import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qedfektpsyjsaeupffkl.supabase.co',
  'sb_publishable_VMIyo9XIj566yTt3PqspFA_fUqVhQ15'
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { kontakt, ergebnis, antworten } = req.body

  const { error } = await supabase.from('leads').insert({
    name:            kontakt?.name,
    plz:             kontakt?.plz,
    adresse:         kontakt?.adresse,
    stadt:           kontakt?.stadt,
    telefon:         kontakt?.tel,
    heizungsart:     antworten?.heizungsart,
    verbrauch:       antworten?.verbrauch,
    wp_groesse:      ergebnis?.wpGroesse,
    anlage_preis:    ergebnis?.anlagenPreis,
    foerder_prozent: ergebnis?.foerderProzent,
    foerder_betrag:  ergebnis?.foerderBetrag,
    netto_invest:    ergebnis?.nettoinvest,
    alt_kosten:      ergebnis?.altKosten,
    wp_kosten:       ergebnis?.wpKosten,
    ersparnis:       ergebnis?.ersparnis,
    antworten:       antworten,
    status:          'neu'
  })

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}