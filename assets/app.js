const menuButton = document.querySelector('[data-menu]');
const menu = document.querySelector('[data-nav]');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.querySelector('[data-contact-form]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    const subject = lang === 'en' ? 'RFQ / Vessel supply request' : 'Solicitud de cotización / Abastecimiento marítimo';
    const labels = lang === 'en'
      ? {name:'Name',company:'Company / Agency',email:'Email',phone:'Phone / WhatsApp',vessel:'Vessel',service:'Requirement type',port:'Port',eta:'ETA',message:'Requirement'}
      : {name:'Nombre',company:'Empresa / Agencia',email:'Email',phone:'Tel. / WhatsApp',vessel:'Buque',service:'Tipo de requerimiento',port:'Puerto',eta:'ETA',message:'Requerimiento'};
    const body = [...fd.entries()].map(([k,v]) => `${labels[k] || k}: ${v}`).join('\n');
    window.location.href = `mailto:info@jankok.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());


const heroVideo = document.querySelector('[data-hero-video]');
const heroSection = document.querySelector('.hero');

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;

  const tryPlayHero = async () => {
    try {
      await heroVideo.play();
      heroSection?.classList.remove('video-blocked');
    } catch (err) {
      heroSection?.classList.add('video-blocked');
    }
  };

  heroVideo.addEventListener('loadedmetadata', tryPlayHero, { once: true });
  heroVideo.addEventListener('canplay', tryPlayHero);
  window.addEventListener('load', tryPlayHero, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlayHero();
  });

  ['pointerdown','touchstart','keydown'].forEach(evt => {
    document.addEventListener(evt, tryPlayHero, { once: true, passive: true });
  });

  document.querySelector('[data-play-hero]')?.addEventListener('click', tryPlayHero);
  tryPlayHero();
}



function initPatagoniaInlineMap(){
  const rows=Array.from(document.querySelectorAll('.port-row'));
  const markers=Array.from(document.querySelectorAll('.svg-port'));
  const activeText=document.querySelector('[data-map-active]');
  if(!rows.length||!markers.length) return;

  function activate(id){
    rows.forEach(function(row){ row.classList.toggle('is-active',row.dataset.portId===id); });
    markers.forEach(function(marker){ marker.classList.toggle('is-active',marker.dataset.portId===id); });
    const row=rows.find(function(item){return item.dataset.portId===id;});
    if(row&&activeText){
      const title=row.querySelector('strong')?.textContent||'';
      const desc=row.querySelector('small')?.textContent||'';
      const region=desc.split('·')[0].trim();
      activeText.textContent=title+(region?' · '+region:'');
    }
  }

  rows.forEach(function(row){
    ['mouseenter','focus','click'].forEach(function(evt){
      row.addEventListener(evt,function(){activate(row.dataset.portId);});
    });
  });
  markers.forEach(function(marker){
    ['mouseenter','focus','click'].forEach(function(evt){
      marker.addEventListener(evt,function(){activate(marker.dataset.portId);});
    });
  });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initPatagoniaInlineMap);
}else{
  initPatagoniaInlineMap();
}
