export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { kontakt, firmen, ergebnis, antworten } = req.body

  if (!kontakt?.name || !kontakt?.plz || !kontakt?.tel) {
    return res.status(400).json({ error: 'Fehlende Pflichtfelder' })
  }

  const timestamp = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })

  const emailBody = `
Neuer Heizcheck Lead — ${timestamp}

KONTAKT
Name: ${kontakt.name}
PLZ: ${kontakt.plz}
Telefon: ${kontakt.tel}

EINSCHÄTZUNG
Aktuelle Heizkosten: ${ergebnis?.altKosten?.toLocaleString('de-DE')} €/Jahr
Mit Wärmepumpe: ${ergebnis?.wpKosten?.toLocaleString('de-DE')} €/Jahr
Ersparnis: ${ergebnis?.ersparnis?.toLocaleString('de-DE')} €/Jahr
Amortisation: ${ergebnis?.amortisation} Jahre
Netto-Investition: ${ergebnis?.nettoinvest?.toLocaleString('de-DE')} €

ANGABEN
Heizungsart: ${antworten?.heizungsart}
Heizungsalter: ${antworten?.alter}
Heizkörper: ${antworten?.heizkoerper}
Verbrauch: ${antworten?.verbrauch === 'default' ? 'Durchschnitt (20.000 kWh)' : antworten?.verbrauch + ' kWh'}
Kamin: ${antworten?.kamin}

AUSGEWÄHLTE FIRMEN IDs: ${firmen?.join(', ')}
  `.trim()

  try {
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'leads@heizcheck.pro',
          to: process.env.NOTIFICATION_EMAIL,
          subject: `Neuer Lead: ${kontakt.name} (PLZ ${kontakt.plz})`,
          text: emailBody
        })
      })
    }

    if (process.env.HUBSPOT_API_KEY) {
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
        },
        body: JSON.stringify({
          properties: {
            firstname: kontakt.name,
            zip: kontakt.plz,
            phone: kontakt.tel,
            hs_lead_status: 'NEW',
            lead_source: 'Heizcheck Konfigurator'
          }
        })
      })
    }

    if (process.env.CRM_WEBHOOK_URL) {
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kontakt, ergebnis, antworten, firmen, timestamp })
      })
    }

    return res.status(200).json({ ok: true })

  } catch (err) {
    console.error('Lead-Fehler:', err)
    return res.status(500).json({ error: 'Interner Fehler' })
  }
}
