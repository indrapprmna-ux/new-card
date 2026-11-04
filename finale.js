/* =====================================================
   FINALE — tutup buku → bouquet mawar → tanda tangan → ledakan → penguin
   Dipanggil dari script.js lewat startFinale()
   ===================================================== */
const FINALE = {
  signHint: 'tanda tangan di sini',        // ← teks petunjuk di area tanda tangan
  askText: 'Tanda tangani buketnya ya ♥',  // ← teks di bawah bouquet
  bye: 'Sampai jumpa, ya ♥',               // ← teks di atas penguin
  minInk: 260                              // ← panjang coretan minimal agar tombol "Selesai" muncul
};

/* ---------- Gambar mawar (dipakai ulang) ---------- */
const petals = [0, 72, 144, 216, 288].map(a => `<ellipse cy="-15" rx="15" ry="17" transform="rotate(${a})"/>`).join('');
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <radialGradient id="rg"><stop offset="0" stop-color="#f0405a"/><stop offset="1" stop-color="#9c0f25"/></radialGradient>
 <linearGradient id="wr" x1="0" x2="1"><stop offset="0" stop-color="#0b0507"/><stop offset=".5" stop-color="#2b1a1f"/><stop offset="1" stop-color="#0b0507"/></linearGradient>
 <g id="rose"><g fill="url(#rg)" stroke="#6e0a1a" stroke-width="1.6">${petals}<circle r="15"/></g>
  <path d="M0 -3C7 -3 9 5 2 8C-6 10 -10 -2 -3 -9C6 -14 14 -4 11 6" fill="none" stroke="#6e0a1a" stroke-width="2" stroke-linecap="round"/>
  <path d="M-12 -20Q0 -30 12 -20" fill="none" stroke="#ff8fa0" stroke-width="2.5" opacity=".5" stroke-linecap="round"/></g>
</defs></svg>`);

/* ---------- Bouquet: mawar merah, pembungkus hitam ---------- */
const leafSvg = [[78,168,-38],[322,168,38],[62,236,-62],[338,236,62],[150,92,-18],[250,92,18]]
  .map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="48" ry="16" transform="rotate(${a} ${x} ${y})"/>`).join('');
const roseSvg = [[200,120,1.15,0],[132,158,1.05,-20],[268,158,1.05,20],[90,222,.95,-35],[310,222,.95,35],[200,195,1.2,10],[145,232,.9,-10],[255,232,.9,12]]
  .map(([x, y, s, r]) => `<use href="#rose" transform="translate(${x} ${y}) rotate(${r}) scale(${s})"/>`).join('');
const bouquet = `<svg viewBox="0 0 400 560" aria-label="Buket mawar merah">
 <g fill="#2e6b3d" stroke="#1d4a29" stroke-width="2">${leafSvg}</g>${roseSvg}
 <path d="M64 246Q200 206 336 246L214 546Q200 556 186 546Z" fill="url(#wr)" stroke="#3a252b" stroke-width="2"/>
 <path d="M64 246L206 318L186 546Z" fill="#190d11" stroke="#3a252b"/><path d="M336 246L196 330L214 546Z" fill="#0c0608" stroke="#3a252b"/>
 <path d="M138 404Q200 428 262 404L256 430Q200 456 144 430Z" fill="#c98b86"/>
 <g fill="#d9a79f"><ellipse cx="170" cy="428" rx="24" ry="12" transform="rotate(-20 170 428)"/><ellipse cx="230" cy="428" rx="24" ry="12" transform="rotate(20 230 428)"/><circle cx="200" cy="432" r="9" fill="#b76e79"/></g></svg>`;

/* ---------- Boneka penguin (h = warna kepala, w = warna sayap) ---------- */
const penguin = (h, w) => `<svg viewBox="-20 0 240 230" aria-hidden="true">
 <ellipse cx="100" cy="214" rx="62" ry="8" fill="#000" opacity=".2"/>
 <ellipse cx="68" cy="205" rx="30" ry="13" fill="#f6dc7a" stroke="#e3bf4a" stroke-width="2"/><ellipse cx="132" cy="205" rx="30" ry="13" fill="#f6dc7a" stroke="#e3bf4a" stroke-width="2"/>
 <ellipse cx="100" cy="148" rx="60" ry="64" fill="#fff"/><ellipse cx="100" cy="174" rx="48" ry="34" fill="#e9ecf2" opacity=".7"/>
 <path d="M48 112C18 126 22 172 40 186C50 192 58 170 60 150Z" fill="${w}"/>
 <g transform="translate(150 112)"><g class="wv"><path d="M0 0C26 6 42 40 34 66C28 78 10 72 4 52C0 38 -6 16 0 0Z" fill="${w}"/></g></g>
 <ellipse cx="100" cy="72" rx="68" ry="54" fill="${h}"/><ellipse cx="100" cy="92" rx="56" ry="38" fill="#fff"/>
 <ellipse cx="68" cy="88" rx="30" ry="26" fill="#fff"/><ellipse cx="132" cy="88" rx="30" ry="26" fill="#fff"/>
 <circle cx="56" cy="100" r="8" fill="#f4a9b4" opacity=".45"/><circle cx="144" cy="100" r="8" fill="#f4a9b4" opacity=".45"/>
 <path d="M60 86Q70 74 80 86M120 86Q130 74 140 86" fill="none" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>
 <ellipse cx="100" cy="98" rx="19" ry="11" fill="#f7de7e" stroke="#e5c34f" stroke-width="2"/></svg>`;

/* ---------- Efek suara ledakan ---------- */
function boom(){
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(35, t + .4);
    g.gain.setValueAtTime(.3, t); g.gain.exponentialRampToValueAtTime(.001, t + .45);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(t + .5);
  } catch (e) {}
}

/* ---------- Kanvas tanda tangan ---------- */
function signPad(c, onInk){
  const ctx = c.getContext('2d');
  let down = false, ink = 0, lx, ly;
  const r0 = c.getBoundingClientRect(), k = window.devicePixelRatio || 1;
  c.width = r0.width * k; c.height = r0.height * k;
  ctx.scale(k, k); ctx.lineWidth = 3.2; ctx.lineCap = ctx.lineJoin = 'round';
  ctx.strokeStyle = '#fff6dc'; ctx.shadowColor = '#ffd98a'; ctx.shadowBlur = 6;
  const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  c.onpointerdown = e => { down = true; c.setPointerCapture(e.pointerId); [lx, ly] = pos(e); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + .1, ly); ctx.stroke(); onInk(ink); };
  c.onpointermove = e => {
    if (!down) return;
    const [x, y] = pos(e);
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke();
    ink += Math.hypot(x - lx, y - ly); lx = x; ly = y; onInk(ink);
  };
  c.onpointerup = c.onpointercancel = () => down = false;
  return () => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ctx.restore(); ink = 0; onInk(0); };
}

/* ---------- Alur finale ---------- */
let finaleOn = false;
$('#closeBook').onclick = () => startFinale();

async function startFinale(){
  if (finaleOn || phase !== 'open' || cur !== N - 1) return;
  finaleOn = true; phase = 'finale';
  $('#tap').classList.add('hide');
  $('#stage').classList.remove('reading');

  /* 1. Buku menutup: halaman dibalik kembali satu per satu */
  const n = cur - 1;
  for (let k = n; k >= 0; k--) {
    setTimeout(() => {
      playFeedbackSound('page');
      leaves[k].style.zIndex = 20 + (n - k);
      leaves[k].classList.remove('flipped');
      setTimeout(() => leaves[k].style.zIndex = N - k, 1200);
    }, (n - k) * 230);
  }
  await sleep(n * 230 + 700);
  $('#book').classList.remove('open'); cur = 0;
  await sleep(2100);

  /* 2. Buku menghilang */
  const lr = leaves[0].getBoundingClientRect();
  burst(lr.left + lr.width / 2, lr.top + lr.height / 2);
  $('.wrap').classList.add('vanish');
  await sleep(1100);
  $('.wrap').style.display = 'none';

  /* 3. Bouquet muncul */
  const o = document.createElement('div');
  o.id = 'fin';
  o.innerHTML = `<div class="bq">${bouquet}<canvas id="sig" aria-label="Area tanda tangan"></canvas><span id="sh">${FINALE.signHint}</span></div>
    <div class="act"><button id="clr" type="button">hapus</button><button id="done" type="button">Selesai ♥</button></div><p class="ins">${FINALE.askText}</p>`;
  $('#stage').appendChild(o);
  await sleep(1500);

  /* 4. Tanda tangan di tengah bouquet */
  const done = $('#done'), bq = o.querySelector('.bq');
  const clear = signPad($('#sig'), ink => {
    done.classList.toggle('show', ink >= FINALE.minInk);
    $('#sh').style.opacity = ink > 0 ? 0 : 1;
  });
  $('#clr').onclick = clear;

  done.onclick = async () => {
    done.disabled = true; $('#sig').style.pointerEvents = 'none';

    /* 5. Bouquet meledak dan kelopak memenuhi layar */
    bq.classList.add('rumble'); boom();
    await sleep(800);
    bq.classList.remove('rumble'); bq.classList.add('gone');
    o.insertAdjacentHTML('beforeend', '<div class="flash"></div>');
    o.querySelectorAll('.act,.ins').forEach(x => x.remove());
    o.classList.add('veil');
    const W = innerWidth, H = innerHeight;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * W, y = Math.random() * H, rose = i % 6 === 0, p = document.createElement('i');
      p.className = 'pt';
      p.style.cssText = `left:${x}px;top:${y}px;--s:${14 + Math.random() * 28}px;--r:${Math.random() * 360}deg;--d:${(Math.random() * 3).toFixed(1)}s`;
      p.innerHTML = rose ? '<svg viewBox="-34 -34 68 68"><use href="#rose"/></svg>' : '<b></b>';
      o.appendChild(p);
      p.animate([{transform: `translate(${W / 2 - x}px,${H / 2 - y}px) scale(.1)`}, {transform: 'none'}],
        {duration: 900 + Math.random() * 800, easing: 'cubic-bezier(.15,.8,.25,1)', fill: 'backwards'});
    }
    await sleep(2000);
    bq.remove();

    /* 6. Penguin biru & abu-abu melambaikan tangan */
    o.insertAdjacentHTML('beforeend', `<div class="pg"><div class="pe a">${penguin('#a4a6ab', '#8e9096')}</div><div class="pe b">${penguin('#b4d4ee', '#9bc2e4')}</div></div>
      <p class="bye">${FINALE.bye}</p><button class="again" type="button" onclick="location.reload()">↻ ulangi dari awal</button>`);
  };
}
