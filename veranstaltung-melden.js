const submissionForm = document.querySelector('#meldeformular');
const submissionStatus = document.querySelector('#formular-status');

if (submissionForm && submissionStatus) {
  const labels = {
    verein: 'Verein',
    ansprechperson: 'Ansprechperson',
    email: 'E-Mail',
    telefon: 'Telefon',
    titel: 'Veranstaltung',
    art: 'Art',
    wiederholung: 'Wiederholung',
    'datum-von': 'Datum',
    'datum-bis': 'Enddatum',
    'zeit-von': 'Beginn',
    'zeit-bis': 'Ende',
    ort: 'Ort',
    buergerhaus: 'Bürgerhaus benötigt',
    besucher: 'Erwartete Personenzahl',
    aufbau: 'Aufbau ab',
    abbau: 'Abbau bis',
    sichtbarkeit: 'Veröffentlichung',
    beschreibung: 'Hinweise'
  };

  submissionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!submissionForm.reportValidity()) return;

    const data = new FormData(submissionForm);
    const lines = [
      'Guten Tag,',
      '',
      'hiermit melden wir folgenden Termin für die gemeinsame Veranstaltungsplanung:',
      ''
    ];

    Object.entries(labels).forEach(([name, label]) => {
      const value = String(data.get(name) || '').trim();
      if (value) lines.push(`${label}: ${value}`);
    });

    lines.push('', 'Viele Grüße');

    const title = String(data.get('titel') || 'Veranstaltung').trim();
    const club = String(data.get('verein') || 'Verein').trim();
    const subject = `Terminmeldung: ${title} – ${club}`;
    const mailto = `mailto:timokraemer96@gmx.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;

    submissionStatus.textContent = 'Die vorbereitete E-Mail wird jetzt geöffnet. Bitte dort noch auf „Senden“ klicken.';
    window.location.href = mailto;
  });
}
