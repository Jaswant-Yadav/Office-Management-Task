
(async function initLocation() {
  const $country = document.getElementById('country');
  const $state   = document.getElementById('state');
  const $city    = document.getElementById('city');
  if (!$country || !$state || !$city) return;

  const selectedCountry = $country.getAttribute('data-selected') || '';
  const selectedState   = $state.getAttribute('data-selected')   || '';
  const selectedCity    = $city.getAttribute('data-selected')    || '';

  function setOptions(el, values, selected='') {
    el.innerHTML = `<option value="">${el.id[0].toUpperCase()+el.id.slice(1)}</option>` +
      values.map(v => `<option value="${v}">${v}</option>`).join('');
    if (selected) el.value = selected;
  }

  async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Failed ' + res.status);
    return res.json();
  }

  try {
    const cRes = await fetchJSON('https://countriesnow.space/api/v0.1/countries/iso');
    const countries = (cRes?.data || []).map(c => c.name).sort();
    setOptions($country, countries, selectedCountry);
  } catch(e) {
    console.error('Countries load error', e);
  }

  async function loadStates(country, preselect='') {
    setOptions($state, [], '');
    setOptions($city, [], '');
    if (!country) return;
    try {
      const sRes = await fetchJSON('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ country })
      });
      const states = (sRes?.data?.states || []).map(s => s.name).sort();
      setOptions($state, states, preselect);
      if (preselect) $state.dispatchEvent(new Event('change'));
    } catch(e) {
      console.error('States load error', e);
    }
  }

  async function loadCities(country, state, preselect='') {
    setOptions($city, [], '');
    if (!country || !state) return;
    try {
      const ciRes = await fetchJSON('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ country, state })
      });
      const cities = (ciRes?.data || []).sort();
      setOptions($city, cities, preselect);
    } catch(e) {
      console.error('Cities load error', e);
    }
  }

  $country.addEventListener('change', () => loadStates($country.value, ''));
  $state.addEventListener('change', () => loadCities($country.value, $state.value, ''));

  if (selectedCountry) {
    await loadStates(selectedCountry, selectedState);
    if (selectedState) {
      await loadCities(selectedCountry, selectedState, selectedCity);
    }
  }
})();
