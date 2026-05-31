cat > ~/heizcheck/src/utils/schritte.js << 'EOF'
export const BLOCK1 = [
  {
    id: 'gebaeudetyp',
    block: 1,
    frage: 'Was für ein Haus hast du?',
    typ: 'auswahl',
    optionen: [
      { wert: 'efh',   label: 'Einfamilienhaus',     icon: '🏡', sub: 'Freistehendes Haus' },
      { wert: 'dhh',   label: 'Doppelhaushälfte',    icon: '🏘️', sub: 'Eine Hälfte eines Hauses' },
      { wert: 'rh',    label: 'Reihenhaus',           icon: '🏚️', sub: 'Haus in einer Reihe' },
      { wert: 'mfh',   label: 'Mehrfamilienhaus',     icon: '🏢', sub: 'Mehrere Wohnungen' },
    ]
  },
  {
    id: 'baujahr',
    block: 1,
    frage: 'Wann wurde dein Haus gebaut?',
    typ: 'eingabe',
    placeholder: 'z.B. 1985',
    einheit: 'Jahr',
    tipp: 'Steht im Grundbuch oder auf dem Energieausweis. Ungefähres Jahr ist ok.',
    tippAktion: 'Ungefähr 1990 (Durchschnitt verwenden)'
  },
  {
    id: 'heizungsart',
    block: 1,
    frage: 'Womit heizt du gerade?',
    typ: 'auswahl',
    optionen: [
      { wert: 'gas',        label: 'Gas',         icon: '🔥' },
      { wert: 'oel',        label: 'Öl',          icon: '🛢️' },
      { wert: 'pellets',    label: 'Pellets',     icon: '🪵' },
      { wert: 'strom',      label: 'Strom',       icon: '⚡' },
      { wert: 'fernwaerme', label: 'Fernwärme',   icon: '🏭' },
    ]
  },
  {
    id: 'heizungsalter',
    block: 1,
    frage: 'Wie alt ist deine aktuelle Heizung?',
    typ: 'eingabe',
    placeholder: 'z.B. 2005',
    einheit: 'Baujahr',
    tipp: 'Steht auf dem Typenschild der Heizung — meist vorne oder seitlich angebracht.',
    tippAktion: 'Ungefähr 2000 (Durchschnitt verwenden)'
  },
  {
    id: 'personen',
    block: 1,
    frage: 'Wie viele Personen wohnen bei euch?',
    typ: 'auswahl',
    optionen: [
      { wert: '1', label: '1 Person',   icon: '🧑' },
      { wert: '2', label: '2 Personen', icon: '👫' },
      { wert: '3', label: '3 Personen', icon: '👨‍👩‍👦' },
      { wert: '4', label: '4 Personen', icon: '👨‍👩‍👧‍👦' },
      { wert: '5', label: '5+',         icon: '👨‍👩‍👧‍👦' },
    ]
  },
  {
    id: 'verbrauch',
    block: 1,
    frage: 'Wie viel Energie verbrauchst du pro Jahr?',
    typ: 'eingabe',
    placeholder: 'z.B. 20000',
    einheit: 'kWh / Jahr',
    tipp: 'Steht auf deiner Jahresrechnung. Keine Ahnung? Einfach Durchschnitt nehmen.',
    tippAktion: 'Durchschnitt verwenden (20.000 kWh)'
  },
]

export const BLOCK2 = [
  {
    id: 'heizflaeche',
    block: 2,
    frage: 'Was hast du für Heizflächen im Haus?',
    info: 'Fußbodenheizung braucht weniger Vorlauftemperatur — ideal für Wärmepumpen und senkt die Betriebskosten deutlich.',
    typ: 'auswahl',
    optionen: [
      { wert: 'fub', label: 'Fußbodenheizung',                sub: '✅ Ideal für Wärmepumpe' },
      { wert: 'mix', label: 'Heizkörper + Fußbodenheizung',   sub: '✅ Gut geeignet' },
      { wert: 'hk',  label: 'Nur Heizkörper',                 sub: 'ℹ️ Funktioniert, kleine Anpassung möglich' },
    ]
  },
  {
    id: 'warmwasser',
    block: 2,
    frage: 'Hast du eine Zirkulationsleitung?',
    info: 'Einfacher Test: Dreh den Warmwasserhahn auf. Kommt das warme Wasser sofort (unter 5 Sekunden)? Dann hast du eine Zirkulationsleitung. Dauert es länger? Dann nicht.',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',   label: 'Ja — Wasser kommt sofort warm',     sub: 'Zirkulationsleitung vorhanden' },
      { wert: 'nein', label: 'Nein — Wasser braucht etwas',        sub: 'Keine Zirkulationsleitung' },
    ]
  },
  {
    id: 'zaehlerkasten_modernisiert',
    block: 2,
    frage: 'Wurde dein Zählerschrank jemals modernisiert?',
    info: 'Ein moderner Zählerschrank hat Sicherungsautomaten (kleine Schalter). Ein alter hat Schraubsicherungen (runde Keramikteile).',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',   label: 'Ja, wurde modernisiert',   sub: 'Hat Sicherungsautomaten' },
      { wert: 'nein', label: 'Nein, noch der alte',      sub: 'Hat Schraubsicherungen' },
    ]
  },
  {
    id: 'zaehlerkasten_wann',
    block: 2,
    frage: 'Wann wurde der Zählerschrank modernisiert?',
    typ: 'auswahl',
    nur: 'zaehlerkasten_ja',
    optionen: [
      { wert: '1-5',   label: 'Vor 1–5 Jahren',    sub: 'Sehr modern' },
      { wert: '5-10',  label: 'Vor 5–10 Jahren',   sub: 'Modern' },
      { wert: '10-15', label: 'Vor 10–15 Jahren',  sub: 'Noch akzeptabel' },
    ]
  },
  {
    id: 'pv',
    block: 2,
    frage: 'Hast du eine Solaranlage auf dem Dach?',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',        label: 'Ja, habe ich',        icon: '☀️' },
      { wert: 'nein',      label: 'Nein',                 icon: '❌' },
      { wert: 'interesse', label: 'Nein, aber Interesse', icon: '💡' },
    ]
  },
  {
    id: 'oeltank',
    block: 2,
    frage: 'Hast du einen Öltank im Keller oder Garten?',
    typ: 'auswahl',
    nur: 'oel',
    optionen: [
      { wert: 'ja',   label: 'Ja, muss weg', sub: 'Demontage wird mitgeplant' },
      { wert: 'nein', label: 'Nein',          sub: 'Bereits entfernt oder nicht vorhanden' },
    ]
  },
]

export const BLOCK3 = [
  {
    id: 'aufstellort',
    block: 3,
    frage: 'Wo soll das Außengerät stehen?',
    info: 'Das Außengerät der Wärmepumpe kommt in den Garten oder an die Hauswand.',
    typ: 'auswahl',
    optionen: [
      { wert: 'direkt', label: 'Direkt an der Hauswand', sub: 'Weniger als 1 Meter' },
      { wert: 'nah',    label: 'Nah an der Hauswand',    sub: '1 – 3 Meter entfernt' },
      { wert: 'weit',   label: 'Weiter weg',              sub: 'Über 3 Meter entfernt' },
    ]
  },
  {
    id: 'energiemanagement',
    block: 3,
    frage: 'Soll dein Haus automatisch Strom sparen?',
    info: '💡 Ein Energiemanagement-System lässt Wärmepumpe, Solaranlage und Speicher automatisch zusammenarbeiten. Ergebnis: bis zu 30% weniger Stromkosten — ohne dass du etwas tun musst.',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',   label: 'Ja, klingt gut', sub: 'Empfohlen — zahlt sich schnell aus' },
      { wert: 'nein', label: 'Nein danke',      sub: 'Ohne Energiemanagement' },
    ]
  },
  {
    id: 'eigentuemer',
    block: 3,
    frage: 'Bist du der Eigentümer und wohnst selbst dort?',
    info: 'Wichtig für die staatliche Förderung. Eigentümer die selbst einwohnen bekommen bis zu 70% Zuschuss.',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',     label: 'Ja, beides',              sub: '✅ Maximale Förderung möglich' },
      { wert: 'eigen',  label: 'Eigentümer, wohne nicht', sub: 'Geringere Förderung' },
      { wert: 'mieter', label: 'Ich bin Mieter',           sub: 'Förderung über Vermieter' },
    ]
  },
  {
    id: 'einkommen',
    block: 3,
    frage: 'War dein Haushaltseinkommen unter 40.000 € pro Jahr?',
    info: 'Haushalte unter 40.000 € bekommen 70% statt 35% Förderung — das sind tausende Euro mehr.',
    typ: 'auswahl',
    optionen: [
      { wert: 'ja',    label: 'Ja',             sub: '🎉 +Extra-Förderung' },
      { wert: 'nein',  label: 'Nein',            sub: 'Standard-Förderung' },
      { wert: 'weiss', label: 'Weiß ich nicht', sub: 'Wird neutral berechnet' },
    ]
  },
]

export const ALLE_SCHRITTE = [...BLOCK1, ...BLOCK2, ...BLOCK3]

export const gefilterteSchritte = (antworten) => {
  return ALLE_SCHRITTE.filter(schritt => {
    if (schritt.nur === 'oel') return antworten.heizungsart === 'oel'
    if (schritt.nur === 'zaehlerkasten_ja') return antworten.zaehlerkasten_modernisiert === 'ja'
    return true
  })
}
EOF