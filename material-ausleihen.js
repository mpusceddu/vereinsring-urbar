const materialForm = document.querySelector('#materialformular');
const materialStatus = document.querySelector('#formular-status');

if (materialForm && materialStatus) {
  const quantityNames = ['biertischgarnituren', 'stehtische', 'hussen', 'glaeser'];

  const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  materialForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!materialForm.reportValidity()) return;

    const data = new FormData(materialForm);
    const pickup = String(data.get('abholung') || '');
    const returnDate = String(data.get('rueckgabe') || '');

    if (returnDate <= pickup) {
      materialStatus.textContent = 'Die Rückgabe muss nach der Abholung liegen.';
      document.querySelector('#rueckgabe').focus();
      return;
    }

    const quantities = quantityNames.map((name) => Number(data.get(name) || 0));
    const otherMaterial = String(data.get('sonstiges') || '').trim();
    if (!quantities.some((amount) => amount > 0) && !otherMaterial) {
      materialStatus.textContent = 'Bitte mindestens eine Materialart oder „Sonstiges“ angeben.';
      document.querySelector('#biertischgarnituren').focus();
      return;
    }

    const materialLines = [
      ['Biertischgarnituren', quantities[0]],
      ['Stehtische', quantities[1]],
      ['Hussen', quantities[2]],
      ['Gläser', quantities[3]]
    ].filter(([, amount]) => amount > 0).map(([label, amount]) => `${label}: ${amount}`);

    if (otherMaterial) {
      const otherAmount = String(data.get('sonstiges-anzahl') || '').trim();
      materialLines.push(`Sonstiges: ${otherMaterial}${otherAmount ? ` (${otherAmount})` : ''}`);
    }

    const lines = [
      'Guten Tag,',
      '',
      'hiermit fragen wir Material des Vereinsrings an:',
      '',
      `Verein: ${data.get('verein')}`,
      `Ansprechperson: ${data.get('ansprechperson')}`,
      `E-Mail: ${data.get('email')}`,
      `Telefon: ${data.get('telefon')}`,
      '',
      `Anlass: ${data.get('anlass')}`,
      `Einsatzort: ${data.get('einsatzort')}`,
      `Gewünschte Abholung: ${formatDateTime(pickup)}`,
      `Geplante Rückgabe: ${formatDateTime(returnDate)}`,
      '',
      'Gewünschtes Material:',
      ...materialLines,
      '',
      `Abholung und Transport: ${data.get('transport')}`
    ];

    const notes = String(data.get('hinweise') || '').trim();
    if (notes) lines.push(`Hinweise: ${notes}`);
    lines.push('', 'Viele Grüße');

    const subject = `Materialanfrage: ${data.get('anlass')} – ${data.get('verein')}`;
    const mailto = `mailto:material@vereinsring-urbar.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;

    materialStatus.textContent = 'Die vorbereitete E-Mail wird jetzt geöffnet. Bitte dort noch auf „Senden“ klicken.';
    window.location.href = mailto;
  });
}
