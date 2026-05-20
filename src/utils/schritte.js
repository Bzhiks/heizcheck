export const SCHRITTE = [
  {
    id: 'heizungsart',
    frage: 'Wie heizt du aktuell?',
    typ: 'auswahl',
    optionen: [
      { wert: 'gas',        label: 'Gasheizung',    icon: '🔥' },
      { wert: 'oel',        label: 'Ölheizung',      icon: '🛢️' },
      { wert: 'pellets',    label: 'Pelletheizung',  icon: '🪵' },
      { wert: 'strom',      label: 'Nachtspeicher',  icon: '⚡' },
      { wert: 'fernwaerme', label: 'Fernwärme',      icon: '🏭' },
    ]
  },
  {
    id: 'alter',
    frage: 'Wie alt ist deine Heizung?',
    typ: 'auswahl',
    optionen: [
      { wert: 'u10',   label: 'Unter 10 Jahre',  sub: 'Noch relativ neu' },
      { wert: '10-20', label: '10 – 20 Jahre',   sub: 'Bald Ersatz fällig' },
      { wert: 'ue20',  label: 'Über 20 Jahre',   sub: 'Sofort handeln lohnt sich' },
    ]
  },
  {
    id: 'heizkoerper',
    frage: 'Was hast du im Haus?',
    typ: 'auswahl',
    info: 'Das beeinflusst die Effizienz der Wärmepumpe.',
    optionen: [
      { wert: 'fub', label: 'Fußbodenheizung', sub: 'Ideal für WP' },
      { wert: 'mix', label: 'Beides gemischt',  sub: 'Gut geeignet' },
      { wert: 'hk',  label: 'Nur Heizkörper',   sub: 'Möglicherweise Anpassung nötig' },
    ]
  },
  {
    id: 'verbrauch',
    frage: 'Dein Jahresverbrauch?',
    typ: 'eingabe',
    placeholder: 'z.B. 20000',
    einheit: 'kWh / Jahr',
    tipp: 'Steht auf deiner Jahresabrechnung. Keine Ahnung? Kein Problem — wir nehmen den Durchschnitt.',
    tippAktion: 'Durchschnitt verwenden'
  },
  {
    id: 'kamin',
    frage: 'Hast du einen Kamin oder Ofen?',
    typ: 'auswahl',
    optionen: [
      { wert: 'nein', label: 'Nein' },
      { wert: 'ja',   label: 'Ja' },
    ]
  }
]

export const KAMIN_FOLGE = {
  id: 'kamingut',
  frage: 'Wie viel heizt du damit?',
  typ: 'auswahl',
  optionen: [
    { wert: 'wenig', label: 'Gelegentlich', sub: 'Paar Abende im Jahr' },
    { wert: 'viel',  label: 'Regelmäßig',   sub: 'Mehrmals pro Woche' },
  ]
}
