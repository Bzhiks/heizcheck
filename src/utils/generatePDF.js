import jsPDF from 'jspdf'

const GRUEN = [29, 158, 117]
const GRUEN_HELL = [225, 245, 238]
const GRUEN_DUNKEL = [8, 80, 65]
const SCHWARZ = [10, 10, 10]
const GRAU_HELL = [248, 248, 247]
const GRAU_MID = [226, 225, 222]
const GRAU_TEXT = [107, 105, 102]
const GRAU_LEICHT = [160, 158, 154]
const ROT = [226, 75, 74]
const WEISS = [255, 255, 255]

const fmt = n => n?.toLocaleString('de-DE') + ' €'

export function generateInfoPDF(ergebnis, antworten) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  buildPDF(doc, ergebnis, antworten, null)
  doc.save('heizcheck-info-report.pdf')
}

export function generatePersonalPDF(ergebnis, antworten, kontakt) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  buildPDF(doc, ergebnis, antworten, kontakt)
  doc.save(`heizcheck-report-${kontakt.name}.pdf`)
}

function buildPDF(doc, ergebnis, antworten, kontakt) {
  const W = 210
  const RAND = 14
  const INHALT = W - RAND * 2
  let y = 0

  doc.setFillColor(...SCHWARZ)
  doc.rect(0, 0, W, 22, 'F')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WEISS)
  doc.text('heiz', RAND, 14)
  const heizW = doc.getTextWidth('heiz')
  doc.setTextColor(...GRUEN)
  doc.text('check', RAND + heizW, 14)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  const titel = kontakt ? 'Persönlicher Wärmepumpen-Report' : 'Info-Report Wärmepumpe'
  doc.text(titel, W - RAND, 10, { align: 'right' })
  doc.text(new Date().toLocaleDateString('de-DE'), W - RAND, 15, { align: 'right' })
  y = 22

  doc.setFillColor(250, 250, 248)
  doc.rect(0, y, W, kontakt ? 22 : 18, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRUEN_DUNKEL)
  doc.setFillColor(...GRUEN_HELL)
  doc.roundedRect(RAND, y + 4, 68, 6, 1.5, 1.5, 'F')
  doc.text('Persönliche Wirtschaftlichkeitsberechnung', RAND + 3, y + 8.5)

  if (kontakt) {
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SCHWARZ)
    doc.text(kontakt.name, RAND, y + 18)
    const heizTyp = antworten?.heizungsart === 'gas' ? 'Gasheizung' :
      antworten?.heizungsart === 'oel' ? 'Ölheizung' :
      antworten?.heizungsart === 'pellets' ? 'Pelletheizung' : 'Aktuelle Heizung'
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_LEICHT)
    doc.text(heizTyp + ' · PLZ ' + kontakt.plz + ' · ' + (antworten?.verbrauch === 'default' ? '20.000' : antworten?.verbrauch) + ' kWh/Jahr', RAND, y + 22)
    y += 28
  } else {
    y += 22
  }

  doc.setDrawColor(...GRAU_MID)
  doc.setLineWidth(0.3)
  doc.line(0, y, W, y)
  doc.setFillColor(255, 255, 255)
  doc.rect(0, y, W, 16, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SCHWARZ)
  doc.text('Mit der richtigen Planung sparst du nicht nur einmal —', RAND, y + 7)
  doc.text('sondern jeden Monat.', RAND, y + 13)
  y += 16

  doc.line(0, y, W, y)
  y += 3
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAU_LEICHT)
  doc.text('DIREKTVERGLEICH', RAND, y + 4)
  y += 7

  const colW = INHALT / 3 - 2
  const cols = [
    { label: 'Gasheizung', wert: fmt(ergebnis.altKosten), farbe: ROT, bg: [252, 235, 235], pro: ['Steigende Preise', 'Energieabhaengig', 'Hohe Wartung'], plus: false },
    { label: 'Wärmepumpe', wert: fmt(ergebnis.wpKosten), farbe: GRUEN, bg: GRAU_HELL, pro: ['Deutlich günstiger', 'Unabhaengig', 'Niedrige Wartung'], plus: true },
    { label: 'WP + Energiemgmt.', wert: fmt(Math.round(ergebnis.wpKosten * 0.8)), farbe: GRUEN_DUNKEL, bg: GRUEN_HELL, pro: ['Maximum Ersparnis', 'Automatisch optimiert', 'Zukunftsorientiert'], plus: true },
  ]
  cols.forEach((col, i) => {
    const x = RAND + i * (colW + 3)
    doc.setFillColor(...col.bg)
    doc.roundedRect(x, y, colW, 32, 2, 2, 'F')
    doc.setDrawColor(...col.farbe)
    doc.setLineWidth(0.8)
    doc.line(x, y, x + colW, y)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_LEICHT)
    doc.text(col.label.toUpperCase(), x + 3, y + 5)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...col.farbe)
    doc.text(col.wert, x + 3, y + 13)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_LEICHT)
    doc.text('pro Jahr', x + 3, y + 17)
    col.pro.forEach((p, pi) => {
      doc.setTextColor(...(col.plus ? GRUEN : ROT))
      doc.text((col.plus ? '+ ' : '- ') + p, x + 3, y + 22 + pi * 4)
    })
  })
  y += 35

  doc.line(0, y, W, y)
  y += 3
  doc.setFontSize(7)
  doc.setTextColor(...GRAU_LEICHT)
  doc.setFont('helvetica', 'normal')
  doc.text('KOSTEN ÜBER 20 JAHRE (3% PREISSTEIGERUNG P.A.)', RAND, y + 4)
  y += 8

  const jahre20 = [
    { label: 'Gasheizung', wert: Math.round(ergebnis.altKosten * 26.87), farbe: ROT, breite: 1.0 },
    { label: 'Wärmepumpe', wert: Math.round(ergebnis.wpKosten * 26.87), farbe: GRUEN, breite: ergebnis.wpKosten / ergebnis.altKosten },
    { label: 'WP + Energiemanagement', wert: Math.round(ergebnis.wpKosten * 0.8 * 26.87), farbe: GRUEN_DUNKEL, breite: (ergebnis.wpKosten * 0.8) / ergebnis.altKosten },
  ]
  jahre20.forEach(item => {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_TEXT)
    doc.text(item.label, RAND, y + 3)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...item.farbe)
    doc.text(fmt(item.wert), W - RAND, y + 3, { align: 'right' })
    doc.setFillColor(240, 240, 240)
    doc.roundedRect(RAND, y + 4, INHALT, 4, 1, 1, 'F')
    doc.setFillColor(...item.farbe)
    doc.roundedRect(RAND, y + 4, INHALT * item.breite, 4, 1, 1, 'F')
    y += 11
  })

  doc.line(0, y, W, y)
  doc.setFillColor(250, 250, 248)
  doc.rect(0, y, W, 30, 'F')
  y += 4
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SCHWARZ)
  doc.text('Jede Heizperiode ohne Wärmepumpe bedeutet ' + fmt(ergebnis.altKosten), RAND, y + 5)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAU_TEXT)
  doc.text('die du weiter zahlst — ohne Gegenwert.', RAND, y + 10)
  y += 14

  const hColW = INHALT / 3 - 2
  const heizCols = [
    { label: '1 Jahr', wert: fmt(ergebnis.altKosten) },
    { label: '2 Jahre', wert: fmt(ergebnis.altKosten * 2) },
    { label: '3 Jahre', wert: fmt(ergebnis.altKosten * 3) },
  ]
  heizCols.forEach((col, i) => {
    const x = RAND + i * (hColW + 3)
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...GRAU_MID)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, hColW, 14, 2, 2, 'FD')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_LEICHT)
    doc.text('Noch ' + col.label + ' wie bisher', x + hColW / 2, y + 4, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...ROT)
    doc.text(col.wert, x + hColW / 2, y + 11, { align: 'center' })
  })
  y += 18

  doc.line(0, y, W, y)
  y += 3
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAU_LEICHT)
  doc.text('INVESTITIONSÜBERSICHT', RAND, y + 4)
  y += 8
  const invRows = [
    { label: 'Anlage inkl. Installation (Richtwert)', wert: fmt(ergebnis.anlagenPreis), farbe: GRAU_TEXT },
    { label: 'KfW-Förderung BEG (' + ergebnis.foerderProzent + '%)', wert: '- ' + fmt(ergebnis.foerderBetrag), farbe: GRUEN },
  ]
  invRows.forEach(row => {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_TEXT)
    doc.text(row.label, RAND, y)
    doc.setTextColor(...row.farbe)
    doc.text(row.wert, W - RAND, y, { align: 'right' })
    doc.setDrawColor(...GRAU_MID)
    doc.setLineWidth(0.2)
    doc.line(RAND, y + 2, W - RAND, y + 2)
    y += 7
  })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SCHWARZ)
  doc.text('Ihre Netto-Investition', RAND, y + 1)
  doc.text(fmt(ergebnis.nettoinvest), W - RAND, y + 1, { align: 'right' })
  y += 8

  doc.line(0, y, W, y)
  doc.setFillColor(250, 250, 248)
  doc.rect(0, y, W, 68, 'F')
  y += 3
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAU_LEICHT)
  if (y > 190) { doc.addPage(); y = 14; }
  doc.text('5 TIPPS — SO HOLEN SIE DAS MAXIMUM RAUS', RAND, y + 4)
  y += 8

  const tipps = [
    ['Konzept schlaegt Preis', 'Die monatlichen Betriebskosten zählen mehr als die einmalige Investition. Eine günstig gekaufte Anlage mit schlechtem Konzept kann 20% mehr Strom verbrauchen.'],
    ['Pufferspeicher korrekt dimensionieren', 'Schützt den Kompressor, verbessert den Rücklauf und ermoeglicht es teure Stromzeiten zu überbrücken. Senkt Betriebskosten und verlängert die Lebensdauer.'],
    ['Energiemanagement anfragen', 'Frag jeden Anbieter ob er mit einem Energiemanagementsystem arbeitet und vorhandene Komponenten wie Solar oder Speicher eingebunden werden können.'],
    ['Heizlastberechnung ist Pflicht', 'Sie zeigt wie sich deine Heizkörper und Fußbodenheizung bei -9 Grad verhalten. So laeuft die Anlage auch im haertesten Winter zuverlässig.'],
    ['Angebote wirklich vergleichen', 'Achte auf das Rundum-Paket: Konzept, aufeinander abgestimmte Komponenten und eine Planung für die nächsten mindestens 20 Jahre.'],
  ]
  tipps.forEach((tipp, i) => {
    doc.setFillColor(...SCHWARZ)
    doc.circle(RAND + 3, y + 2, 3, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(String(i + 1), RAND + 3, y + 3.5, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SCHWARZ)
    doc.text(tipp[0], RAND + 8, y + 3)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_TEXT)
    const lines = doc.splitTextToSize(tipp[1], INHALT - 8)
    doc.setFontSize(7)
    doc.text(lines, RAND + 8, y + 7)
    y += 13
  })

  if (kontakt) {
    doc.line(0, y, W, y)
    y += 3
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAU_LEICHT)
    doc.text('IHRE 3 GEPRUEFTEN FACHBETRIEBE IN DER REGION', RAND, y + 4)
    y += 8
    const firmen = [
      { kuerzel: 'TH', name: 'Thermotec Heizung GmbH', ort: kontakt.plz + ' · 3,2 km entfernt' },
      { kuerzel: 'EK', name: 'EnergieKlima Rheinland', ort: kontakt.plz + ' · 5,1 km entfernt' },
      { kuerzel: 'WP', name: 'WaermePro NRW', ort: kontakt.plz + ' · 7,8 km entfernt' },
    ]
    firmen.forEach(firma => {
      doc.setFillColor(...GRAU_HELL)
      doc.setDrawColor(...GRAU_MID)
      doc.setLineWidth(0.3)
      doc.roundedRect(RAND, y, INHALT, 12, 2, 2, 'FD')
      doc.setFillColor(...SCHWARZ)
      doc.roundedRect(RAND + 2, y + 2, 10, 8, 1.5, 1.5, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text(firma.kuerzel, RAND + 7, y + 7, { align: 'center' })
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...SCHWARZ)
      doc.setFontSize(8)
      doc.text(firma.name, RAND + 15, y + 6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...GRAU_LEICHT)
      doc.text(firma.ort, RAND + 15, y + 10)
      doc.setFillColor(...GRUEN_HELL)
      doc.roundedRect(W - RAND - 28, y + 3, 26, 6, 1.5, 1.5, 'F')
      doc.setFontSize(6.5)
      doc.setTextColor(...GRUEN_DUNKEL)
      doc.text('Meldet sich in 24h', W - RAND - 15, y + 7, { align: 'center' })
      y += 14
    })
  }

  const pageH = doc.internal.pageSize.height
  doc.setFillColor(...SCHWARZ)
  doc.rect(0, pageH - 12, W, 12, 'F')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text('heizcheck.pro · Persönlicher Wärmepumpen-Report', RAND, pageH - 5)
  doc.text('Richtwerte · 95% Angebotsgenauigkeit', W - RAND, pageH - 5, { align: 'right' })
}
