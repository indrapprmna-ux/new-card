 /* =====================================================
   PENGATURAN — EDIT BAGIAN INI UNTUK MENGGANTI ISI
   ===================================================== */
const CONFIG = {
  pin: "61225",                               // ← PIN rahasia
  pinHint: "december",                                // ← petunjuk di layar PIN (kosongkan jika tak perlu)

  // ← GANTI dengan URL MP3 romantis kamu (atau file lokal, mis. "lagu.mp3" di folder yang sama)
  musicUrl: "lagu1.mp3", musicStartTime: 100,

  coverTitle: "For My Dear",               // ← teks di cover
  coverSub: "i have something to tell you",  // ← teks di cover

  // HALAMAN 1 — ucapan (efek mengetik)
  greetingTitle: "we're in 1st Anniversary",
  greetingLines: [
    "Tepat pada hari ini, di kursi unej dihari minggu, kita membuat janji untuk saling bersama",
    ".",
    "dan buka halaman demi halaman cerita kita."
  ],

  // HALAMAN KIRI (hiasan di samping tiap halaman, berurutan dari spread 1 s/d 4)
  leftPages: [
    "Setiap cinta punya awal, dan milikku dimulai denganmu.",
    "Terima kasih telah menjadi rumah buat aku.",
    "Di antara jutaan kemungkinan, aku memilihmu berulang kali.",
    "Semua kata ini hanya sebagian kecil dari rasaku."
  ],

  // HALAMAN 2 — 3 polaroid (ganti src dengan fotomu)
  photocards: [
    { src: "foto (5).jpeg", caption: "date pertama" },
    { src: "foto (6).jpeg", caption: "senyum lebar kita" },
    { src: "foto (13).jpeg", caption: "trend pertama yg kita buat" }
  ],

  // HALAMAN 3 — tepat 10 foto membentuk hati (ganti URL dengan fotomu)
  heartTitle: "my love",
  heartPhotos: [
    "foto (4).jpeg",  "foto (8).jpeg",
    "foto (2).jpeg",  "foto (15).jpeg",
    "foto (3).jpeg",  "foto (16).jpeg",
    "foto (17).jpeg",  "foto (9).jpeg",
    "foto (10).jpeg",  "foto (7).jpeg"
  ],

  // HALAMAN 4 — surat cinta (satu item = satu paragraf; boleh ditambah panjang)
  letter: [
    "Ma,",
    "Aku minta maaf dengan segala perbuatan dan kata-kata yang pernah nyakitin kamu ya, aku bener bener ngerasa bersalah, dan 1000x maafku gaakan cukup buat menebus semua itu.",
    "Aku bersyukur banget bisa punya kamu, kaya apa yang aku bilang tiap kamu bertanya \"kenapa kamu mau sama aku?\", aku cuma bisa bilang karena aku sayang sama kamu, dan aku mau kamu jadi bagian dari hidupku.",
    "Di hari ini, tepat 6 december pukul 09:00, aku mau bilang kalo aku sayang banget sama kamu, makasih udah mau nemenin aku.",
    "Semoga pasanganmu nanti jadi orang yang bisa bikin kamu bahagia dan gaakan pernah nyakitin kamu, aku bener-bener pingin jadi orang itu.",
    "I love you, and i will always love you.",
    "MAKASIHHH BANGET,"
  ],
  signature: "bib"       // ← tanda tangan pengirim
};
/* ===================================================== */

const $ = s => document.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));  document.addEventListener('pointerdown', event => {   if (event.pointerType === 'mouse' && event.button !== 0) return;    const heart = document.createElement('span');   heart.className = 'touch-heart';   heart.textContent = '♥';   heart.style.left = `${event.clientX}px`;   heart.style.top = `${event.clientY}px`;   heart.style.setProperty('--drift', `${Math.random() * 36 - 18}px`);   heart.style.setProperty('--rotation', `${Math.random() * 36 - 18}deg`);   document.body.appendChild(heart);   heart.addEventListener('animationend', () => heart.remove(), {once: true}); });

/* ---------- Isi teks dari CONFIG ---------- */
$('#cvTitle').textContent = CONFIG.coverTitle;
$('#cvSub').textContent = CONFIG.coverSub;
$('#heartTitle').textContent = CONFIG.heartTitle;
$('#hint').textContent = CONFIG.pinHint || 'Masukkan PIN untuk membuka';
$('#gMsg').innerHTML = CONFIG.greetingLines.map(t => `<p>${t}</p>`).join('');
$('#letter').innerHTML = CONFIG.letter.map(t => `<p>${t}</p>`).join('') + `<p class="sign">${CONFIG.signature}</p>`;
document.querySelectorAll('.lp').forEach((el, i) => {
  el.innerHTML = `<span class="big script">♥</span><p>${CONFIG.leftPages[i] || ''}</p><span class="orn">❦</span>`;
});

/* ---------- Musik ---------- */
const audio = new Audio(CONFIG.musicUrl);
audio.loop = true; audio.volume = .4;
let soundContext;
function playFeedbackSound(type){
  if (!window.AudioContext) return;
  if (!soundContext) soundContext = new AudioContext();
  if (soundContext.state === 'suspended') {
    soundContext.resume().catch(error => console.error('Tidak dapat memulai efek suara.', error));
  }

  const now = soundContext.currentTime;
  const gain = soundContext.createGain();
  gain.connect(soundContext.destination);

  if (type === 'key') {
    const oscillator = soundContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(480, now + .06);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.07, now + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .07);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + .08);
    return;
  }

  if (type === 'wrong') {
    const oscillator = soundContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(360, now);
    oscillator.frequency.exponentialRampToValueAtTime(170, now + .2);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.13, now + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .22);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + .23);
    return;
  }

  const duration = .42;
  const buffer = soundContext.createBuffer(1, Math.floor(soundContext.sampleRate * duration), soundContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    const progress = i / samples.length;
    const attack = Math.min(progress / .16, 1);
    const release = Math.pow(1 - progress, 1.5);
    const flutter = .72 + .28 * Math.sin(progress * Math.PI * 22);
    samples[i] = (Math.random() * 2 - 1) * attack * release * flutter;
  }
  const noise = soundContext.createBufferSource();
  const filter = soundContext.createBiquadFilter();
  noise.buffer = buffer;
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(.55, now);
  filter.frequency.setValueAtTime(3200, now);
  filter.frequency.exponentialRampToValueAtTime(650, now + duration);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.2, now + .07);
  gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
}

/* ---------- PIN ---------- */
let entry = '', phase = 'lock';          // lock → closed → open
const dots = $('#dots'), pad = $('#pad'), msg = $('#msg');
dots.innerHTML = '<i></i>'.repeat(CONFIG.pin.length);
['1','2','3','4','5','6','7','8','9','','0','⌫'].forEach(k => {
  const b = document.createElement('button');
  b.textContent = k;
  if (!k) b.className = 'ghost';
  if (k === '⌫') { b.className = 'del'; b.setAttribute('aria-label', 'Hapus'); }
  b.onclick = () => press(k);
  pad.appendChild(b);
});
const paint = () => [...dots.children].forEach((d, i) => d.classList.toggle('on', i < entry.length));
function press(k){
  if (phase !== 'lock' || !k) return;
  playFeedbackSound('key');
  msg.textContent = ''; dots.classList.remove('bad');
  if (k === '⌫') entry = entry.slice(0, -1);
  else if (entry.length < CONFIG.pin.length) entry += k;
  paint();
  if (entry.length === CONFIG.pin.length) {
    if (entry === CONFIG.pin) unlock();
    else {                                                   // PIN salah → shake
      playFeedbackSound('wrong');
      dots.classList.add('bad'); msg.textContent = 'PIN salah, coba lagi';
      pad.classList.remove('shake'); void pad.offsetWidth; pad.classList.add('shake');
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => { entry = ''; paint(); dots.classList.remove('bad'); }, 500);
    }
  }
}
document.addEventListener('keydown', e => {
  if (phase === 'lock') { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫'); }
  if (e.key === 'Escape') closeLb();
});

function unlock(){
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) { audio.currentTime = CONFIG.musicStartTime; } else { audio.addEventListener('loadedmetadata', () => { audio.currentTime = CONFIG.musicStartTime; }, {once: true}); } audio.play().catch(error => console.error('Tidak dapat memulai musik.', error));                // dipanggil dari ketukan pengguna → musik boleh langsung main
  $('#lock').classList.add('gone');
  $('#stage').classList.add('on');
  $('#tap').textContent = matchMedia('(pointer: coarse)').matches
    ? 'Geser untuk membuka buku'
    : 'Ketuk untuk membuka buku';
  setTimeout(() => phase = 'closed', 900);     // setelah ini, buku dapat dibuka dengan swipe
}
async function openBook(){
  phase = 'open';
  playFeedbackSound('page');
  $('#tap').classList.add('hide');
  $('#book').classList.add('open');
  setCur(1);
  $('#stage').classList.add('reading');
  await sleep(1500);
  enter(1);
}
$('#stage').addEventListener('click', e => {
  if (!matchMedia('(pointer: fine)').matches) return;
  if (phase === 'closed') {
    openBook();
    return;
  }
  if (phase !== 'open' || !e.target.closest('#book') || e.target.closest('button, .letter')) return;
  const book = $('#book').getBoundingClientRect();
  go(e.clientX < book.left + book.width / 2 ? -1 : 1);
});

/* ---------- Buku & flip (halaman lama tetap menumpuk di kiri) ---------- */
const leaves = [...document.querySelectorAll('.leaf')], N = leaves.length;
let cur = 0;
function setCur(n){
  cur = n;
  leaves.forEach((l, i) => {
    const f = i < cur;
    l.classList.toggle('flipped', f);
    setTimeout(() => l.style.zIndex = f ? i + 1 : N - i, 500);
  });
  $('#pg').textContent = cur + ' / ' + (N - 1);
}
leaves.forEach((l, i) => l.style.zIndex = N - i);
function go(d){
  const n = cur + d;
  if (phase !== 'open' || n < 1 || n > N - 1) return;
  playFeedbackSound('page');
  setCur(n);
  setTimeout(() => enter(n), 700);
}
let touchStartX = null;
let letterTouchY = null;
const letter = $('#letter');
letter.addEventListener('touchstart', e => {
  letterTouchY = e.touches.length === 1 ? e.touches[0].clientY : null;
}, {passive: true});
letter.addEventListener('touchmove', e => {
  if (letterTouchY === null || e.touches.length !== 1) return;
  const touchY = e.touches[0].clientY;
  letter.scrollTop += letterTouchY - touchY;
  letterTouchY = touchY;
  e.preventDefault();
}, {passive: false});
const endLetterTouch = () => { letterTouchY = null; };
letter.addEventListener('touchend', endLetterTouch, {passive: true});
letter.addEventListener('touchcancel', endLetterTouch, {passive: true});
$('#stage').addEventListener('touchstart', e => {
  touchStartX = e.target.closest('#letter') ? null : e.changedTouches[0].clientX;
}, {passive: true});
$('#stage').addEventListener('touchend', e => {
  if (touchStartX === null) return;
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(deltaX) <= 60) return;
  if (phase === 'closed') openBook();
  else go(deltaX < 0 ? 1 : -1);
}, {passive: true});
setCur(0);

/* ---------- Animasi masuk tiap halaman (sekali saja) ---------- */
const seen = {};
function enter(p){
  if (seen[p]) return; seen[p] = 1;
  if (p === 1) greeting();
  if (p === 2) $('#cards').classList.add('show');
  if (p === 3) {
    $('#heart').classList.add('show');
    setTimeout(() => $('#heart').classList.add('beat'), 3800);
  }
}
async function greeting(){                       // efek mengetik
  const t = $('#gTitle'); t.classList.add('typing');
  for (const c of CONFIG.greetingTitle) { t.textContent += c; await sleep(80); }
  t.classList.remove('typing'); await sleep(500);
  for (const p of document.querySelectorAll('#gMsg p')) { p.classList.add('in'); await sleep(900); }
}

/* ---------- Sparkle / konfeti ---------- */
function burst(x, y){
  const cols = ['#d4af6a', '#f6d3da', '#b76e79', '#fffdfb', '#e8b4b8'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span'), z = 5 + Math.random() * 8, a = Math.random() * 6.28, d = 60 + Math.random() * 110;
    s.className = 'bit';
    s.textContent = i % 4 === 0 ? '♥' : '';
    s.style.cssText = `left:${x}px;top:${y}px;width:${z}px;height:${z}px;font-size:${z + 6}px;color:${cols[i % 5]};line-height:1;` +
      (i % 4 ? `background:${cols[i % 5]};border-radius:${i % 2 ? '50%' : '1px'}` : 'width:auto;height:auto');
    document.body.appendChild(s);
    s.animate([{transform: 'translate(0,0) rotate(0)', opacity: 1},
      {transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 50}px) rotate(${Math.random() * 540}deg)`, opacity: 0}],
      {duration: 900 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)'}).onfinish = () => s.remove();
  }
}

/* ---------- Lightbox ---------- */
const lb = $('#lb');
function openLb(src, cap){ lb.querySelector('img').src = src; lb.querySelector('p').textContent = cap || ''; lb.classList.add('on'); }
function closeLb(){ lb.classList.remove('on'); }
lb.onclick = closeLb;

/* ---------- Halaman 2: polaroid ---------- */
let opened = 0;
const tilt = [-3, 2.5, -1.5];
CONFIG.photocards.forEach((c, i) => {
  const el = document.createElement('button');
  el.className = 'pc';
  el.style.cssText = `--r:${tilt[i % 3]}deg;transition-delay:${i * .5}s`;     // muncul satu per satu
  el.innerHTML = `<div class="pol"><div class="ph"><img src="${c.src}" alt="${c.caption}"><div class="seal">♥</div></div><p class="cap"></p></div>`;
  el.onclick = () => {
    if (!el.classList.contains('open')) {
      el.classList.add('open'); el.style.transitionDelay = '0s';
      el.querySelector('.cap').textContent = c.caption; opened++;
      const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2);
      count();
    } else openLb(c.src, c.caption);             // sudah dibuka → klik lagi = pop-up zoom
  };
  $('#cards').appendChild(el);
});
function count(){
  const n = CONFIG.photocards.length;
  $('#count').textContent = opened === n ? 'Semua kenangan sudah terbuka ♥' : opened + ' dari ' + n + ' kenangan terbuka';
}
count();

/* ---------- Halaman 3: transisi foto lalu 10 foto membentuk hati ---------- */
/* [kolom, baris] — urutan muncul dari luar ke dalam */
const spots = [[2,1],[4,1],[1,2],[5,2],[1,3],[5,3],[2,4],[4,4],[3,5],[3,2]];
spots.forEach(([c, r], i) => {
  const src = CONFIG.heartPhotos[i];
  const b = document.createElement('button');
  b.className = 'hp';
  b.style.cssText = `grid-column:${c};grid-row:${r};--r:${(i % 2 ? 1 : -1) * (1 + i % 3)}deg;animation-delay:${i * .35}s`;
  b.innerHTML = `<img src="${src}" alt="Foto kenangan ${i + 1}" loading="lazy">`;
  b.onclick = () => openLb(src.replace('/300/300', '/900/900'), '');   // ukuran besar utk lightbox (hapus .replace jika fotomu tidak pakai pola ini)
  $('#heart').appendChild(b);
});
