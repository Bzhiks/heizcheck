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
    typ: 'auswahl',
    optionen: [
      { wert: 'vor1970',   label: 'Vor 1970',      sub: 'Altbau' },
      { wert: '1970-1990', label: '1970 – 1990',   sub: 'Älterer Bestand' },
      { wert: '1990-2010', label: '1990 – 2010',   sub: 'Neuerer Bestand' },
      { wert: 'nach2010',  label: 'Nach 2010',     sub: 'Modernes Haus' },
    ]
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
    typ: 'auswahl',
    optionen: [
      { wert: 'u10',   label: 'Unter 10 Jahre',  sub: 'Läuft noch gut' },
      { wert: '10-20', label: '10 – 20 Jahre',   sub: 'Bald fällig' },
      { wert: 'ue20',  label: 'Über 20 Jahre',   sub: 'Jetzt wechseln lohnt sich' },
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
    id: 'personen',
    block: 2,
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
    id: 'heizflaeche',
    block: 2,
    frage: 'Was hast du für Heizflächen im Haus?',
    info: 'Das ist wichtig — Fußbodenheizung braucht weniger Temperatur und ist ideal für Wärmepumpen.',
    typ: 'auswahl',
    optionen: [
      { wert: 'fub', label: 'Fußbodenheizung',    sub: '✅ Ideal für Wärmepumpe' },
      { wert: 'mix', label: 'Beides gemischt',     sub: '✅ Gut geeignet' },
      { wert: 'hk',  label: 'Nur Heizkörper',      sub: 'ℹ️ Funktioniert, kleine Anpassung möglich' },
    ]
  },
  {
    id: 'warmwasser',
    block: 2,
    frage: 'Wie lange dauert es bis warmes Wasser aus dem Hahn kommt?',
    info: 'Das verrät uns ob du eine Zirkulationsleitung hast — wichtig für die Planung.',
    typ: 'auswahl',
    optionen: [
      { wert: 'sofort', label: 'Sofort warm',   sub: 'Unter 5 Sekunden' },
      { wert: 'kurz',   label: 'Kurz warten',   sub: '5 – 30 Sekunden' },
      { wert: 'lang',   label: 'Lange warten',  sub: 'Über 30 Sekunden' },
    ]
  },
  {
    id: 'zaehlerkasten',
    block: 2,
    frage: 'Wie sieht dein Stromkasten aus?',
    info: 'Schau kurz in den Keller oder Flur. Welches Bild passt am besten?',
    typ: 'auswahl',
    optionen: [
      { wert: 'modern', label: 'Moderner Kasten',   sub: 'Kunststoff, neuwertig, Sicherungsautomaten', img: '🟢' },
      { wert: 'mittel', label: 'Älterer Kasten',    sub: 'Etwas älter, gemischte Sicherungen',        img: '🟡' },
      { wert: 'alt',    label: 'Sehr alter Kasten', sub: 'Schraubsicherungen, Keramiksicherungen',     img: '🔴' },
      { wert: 'weiss',  label: 'Weiß ich nicht',    sub: 'Kein Problem, wird vor Ort geprüft' },
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
    info: 'Wichtig für die staatliche Förderung. Eigentümer die selbst einziehen bekommen bis zu 70% Zuschuss.',
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
    return true
  })
}
