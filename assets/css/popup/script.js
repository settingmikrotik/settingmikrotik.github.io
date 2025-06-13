const popup = document.getElementById('popup');
let popupTimeout;

function detectDeviceInfo() {
  const ua = navigator.userAgent;
  let device = /Android|iPhone|iPad|iPod/i.test(ua) ? 'Mobile' : 'PC/Desktop';
  let os = 'Tidak diketahui';
  let browser = 'Tidak diketahui';

  if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  if (/Chrome\/\d+/.test(ua)) browser = 'Chrome';
  else if (/Firefox\/\d+/.test(ua)) browser = 'Firefox';
  else if (/Safari\/\d+/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Edg\/\d+/.test(ua)) browser = 'Edge';

  return { device, os, browser };
}

async function showPopup() {
  clearTimeout(popupTimeout);

  let ip = 'Tidak diketahui';
  let city = '-', country = '-', isp = '-';
  const info = detectDeviceInfo();

  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    ip = data.ip;
    city = data.city;
    country = data.country_name;
    isp = data.org;
  } catch (err) {
    console.error('Gagal mengambil data lokasi', err);
  }

  popup.innerHTML = `
    🚫 Akses Dibatasi<br><br>
    📱 Perangkat: ${info.device}<br>
    💻 OS: ${info.os}<br>
    🌐 Browser: ${info.browser}<br><br>
    🌐 IP: ${ip}<br>
    🏙️ Kota: ${city}<br>
    🗺️ Negara: ${country}<br>
    🛰️ ISP: ${isp}
  `;

  popup.classList.add('show');
  popupTimeout = setTimeout(() => {
    popup.classList.remove('show');
  }, 7000);
}

// Blok klik kanan
window.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  showPopup();
});

// Blok Ctrl+U
window.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
    e.preventDefault();
    showPopup();
  }
});
