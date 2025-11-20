function showTool(id) {
  document.querySelectorAll('.tool').forEach(el => {
    el.style.display = 'none';
    el.setAttribute('aria-hidden','true');
  });
  const el = document.getElementById(id);
  if (el) {
    el.style.display = 'block';
    el.setAttribute('aria-hidden','false');
    if (id === 'calendar') buildCalendar();
  }
}

function openHotel(){
  window.open("https://www.makemytrip.com/hotels/", "_blank");
}

/* Calculator */
let calc = '';
function press(v){
  calc += v;
  document.getElementById('calcScreen').innerText = calc || '0';
}
function calculate(){
  try {
    if (!/^[0-9+\-*/().\s]+$/.test(calc)) throw 'Invalid';
    calc = String(eval(calc));
    document.getElementById('calcScreen').innerText = calc;
  } catch(e){
    document.getElementById('calcScreen').innerText = 'Error';
    calc = '';
  }
}
function clearCalc(){
  calc='';
  document.getElementById('calcScreen').innerText='0';
}

/* Calendar */
function buildCalendar(){
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  document.getElementById('calHeader').innerText =
    today.toLocaleString('default', { month: 'long' }) + ' ' + year;

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d => grid.innerHTML += `<div><strong>${d}</strong></div>`);

  for (let i=0;i<firstDay;i++) grid.innerHTML += `<div></div>`;

  for (let d=1; d<=daysInMonth; d++){
    const cls = (d === today.getDate()) ? 'calendar-today' : '';
    grid.innerHTML += `<div class="${cls}">${d}</div>`;
  }
}

/* Converter */
function convert(){
  const a = Number(document.getElementById('amt').value) || 0;
  const f = document.getElementById('from').value;
  const t = document.getElementById('to').value;

  const rates = {
    "USD_INR": 83,
    "EUR_INR": 90,
    "INR_USD": 1/83,
    "INR_EUR": 1/90,
    "USD_EUR": 0.92,
    "EUR_USD": 1.09
  };

  let key = f + '_' + t;
  let rate = rates[key] ?? (f===t ? 1 : 1);
  const sym = {USD:'$', INR:'₹', EUR:'€'};

  document.getElementById('convResult').innerText =
    `Result: ${sym[t] || ''}${(a * rate).toFixed(2)}`;
}

/* Weather */
const WEATHER_API_KEY = '72aaa8790c614f2a87f142622251711';
function getWeather(){
  const city = document.getElementById('city').value.trim();
  const resultEl = document.getElementById('weatherResult');
  if (!city) return resultEl.innerText = 'Please enter a city.';

  resultEl.innerText = 'Loading...';

  fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`)
    .then(r => r.json())
    .then(data => {
      const c = data.current;
      resultEl.innerHTML = `
        <div style="display:flex;gap:10px;align-items:center">
          <img src="${c.condition.icon}" style="width:48px;height:48px;">
          <div>
            <strong>${data.location.name}, ${data.location.country}</strong><br>
            ${c.temp_c} °C — ${c.condition.text}<br>
            Humidity: ${c.humidity}% • Wind: ${c.wind_kph} kph
          </div>
        </div>
      `;
    })
    .catch(err => resultEl.innerText = 'Could not fetch weather.');
}

/* Notes */
const NOTE_KEY = 'mini_tools_note';
window.addEventListener('load', () => {
  document.getElementById('notearea').value = localStorage.getItem(NOTE_KEY) || '';
  buildCalendar();
});
function saveNote(){
  localStorage.setItem(NOTE_KEY, document.getElementById('notearea').value);
  document.getElementById('noteStatus').innerText = 'Saved ✔';
  setTimeout(()=> document.getElementById('noteStatus').innerText = '', 1600);
}
function clearNote(){
  localStorage.removeItem(NOTE_KEY);
  document.getElementById('notearea').value = '';
  document.getElementById('noteStatus').innerText = 'Cleared';
  setTimeout(()=> document.getElementById('noteStatus').innerText = '', 1400);
}

/* Map */
function loadMap(){
  const place = document.getElementById('mapSearch').value.trim();
  if (!place) return alert('Enter a location to search.');
  document.getElementById('mapFrame').src =
    `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
  showTool('map');
}
