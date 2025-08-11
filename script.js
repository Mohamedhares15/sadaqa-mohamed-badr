// Improved JS: counters, reader, khatmat tracking (localStorage)
document.addEventListener('DOMContentLoaded', () => {
  // Initialize counters for prayers
  const prayButtons = document.querySelectorAll('.pray');
  let totalTasbih = 0;
  prayButtons.forEach(btn => {
    const card = btn.closest('.card');
    const id = card.dataset.id;
    const countEl = card.querySelector('.count');
    const max = 33;
    // load saved
    let saved = parseInt(localStorage.getItem('masb_count_' + id) || '0', 10);
    countEl.textContent = saved;
    totalTasbih += saved;
    btn.addEventListener('click', () => {
      let cur = parseInt(countEl.textContent || '0', 10);
      if (cur < max) cur++; else cur = 0; // reset when exceed to allow cycles
      countEl.textContent = cur;
      localStorage.setItem('masb_count_' + id, cur);
      updateTotals();
    });
  });

  function updateTotals(){
    let tot = 0;
    document.querySelectorAll('.card').forEach(c => {
      tot += parseInt(c.querySelector('.count').textContent || '0', 10);
    });
    document.getElementById('total-tasbih').textContent = tot;
  }
  updateTotals();

  // Reader controls
  const surahSelect = document.getElementById('surah-select');
  const openBtn = document.getElementById('open-read');
  const reader = document.getElementById('reader');
  const readerText = document.getElementById('reader-text');
  const readerTitle = document.getElementById('reader-title');
  const markDone = document.getElementById('mark-done');
  const closeReader = document.getElementById('close-reader');
  const khatmatCountEl = document.getElementById('khatmat-count');
  const totalKhatmatEl = document.getElementById('total-khatmat');

  // load khatmat
  function loadKhatmat(){ return parseInt(localStorage.getItem('masb_khatmat')||'0',10) || 0; }
  function saveKhatmat(v){ localStorage.setItem('masb_khatmat', v); }
  khatmatCountEl.textContent = loadKhatmat();
  totalKhatmatEl.textContent = loadKhatmat();

  openBtn.addEventListener('click', () => {
    const key = surahSelect.value;
    const txt = SURAH_TEXTS[key] || 'نص السورة غير متوفر حالياً';
    readerText.textContent = txt;
    readerTitle.textContent = (surahSelect.options[surahSelect.selectedIndex].text);
    reader.hidden = false;
    readerText.focus();
  });

  closeReader.addEventListener('click', () => { reader.hidden = true; });

  markDone.addEventListener('click', () => {
    let k = loadKhatmat();
    k += 1;
    saveKhatmat(k);
    khatmatCountEl.textContent = k;
    totalKhatmatEl.textContent = k;
    // a subtle animation
    markDone.textContent = 'تم التسجيل ✓';
    setTimeout(()=> markDone.textContent = 'أكملت القراءة — سجل ختمة', 1400);
  });

  // Initialize total tasbih display element
  document.getElementById('total-tasbih').textContent = Array.from(document.querySelectorAll('.card')).reduce((s,c)=> s + parseInt(c.querySelector('.count').textContent||'0',10), 0);

  // Accessibility: allow space/enter to trigger pray buttons when focused
  document.querySelectorAll('.pray').forEach(b=>{
    b.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); b.click(); }
    });
  });
});
