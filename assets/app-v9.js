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
  const activeTexts=Array.from(document.querySelectorAll('[data-map-active]'));
  if(!rows.length||!markers.length) return;

  function activate(id){
    if(!id) return;
    rows.forEach(function(row){
      const active=row.dataset.portId===id;
      row.classList.toggle('is-active',active);
      row.setAttribute('aria-pressed',active?'true':'false');
    });
    markers.forEach(function(marker){
      const active=marker.dataset.portId===id;
      marker.classList.toggle('is-active',active);
      marker.setAttribute('aria-pressed',active?'true':'false');
    });

    const row=rows.find(function(item){return item.dataset.portId===id;});
    if(row){
      const title=(row.querySelector('strong')||{}).textContent||'';
      const desc=(row.querySelector('small')||{}).textContent||'';
      const region=(desc.split('·')[0]||'').trim();
      activeTexts.forEach(function(el){
        el.textContent=title+(region?' · '+region:'');
      });
    }
  }

  window.activatePatagoniaPort=activate;

  rows.forEach(function(row){
    row.setAttribute('aria-pressed',row.classList.contains('is-active')?'true':'false');
  });
  markers.forEach(function(marker){
    marker.setAttribute('aria-pressed',marker.classList.contains('is-active')?'true':'false');
  });

  function handleTarget(target){
    const selectable=target && target.closest ? target.closest('.port-row, .svg-port') : null;
    if(selectable && selectable.dataset.portId){
      activate(selectable.dataset.portId);
      return true;
    }
    return false;
  }

  document.addEventListener('pointerup',function(e){
    handleTarget(e.target);
  },true);

  document.addEventListener('touchend',function(e){
    handleTarget(e.target);
  },{capture:true,passive:true});

  document.addEventListener('click',function(e){
    handleTarget(e.target);
  },true);

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter' && e.key!==' ') return;
    const selectable=e.target && e.target.closest ? e.target.closest('.port-row, .svg-port') : null;
    if(selectable && selectable.dataset.portId){
      e.preventDefault();
      activate(selectable.dataset.portId);
    }
  },true);

  rows.forEach(function(row){
    row.addEventListener('mouseenter',function(){activate(row.dataset.portId);});
    row.addEventListener('focus',function(){activate(row.dataset.portId);});
  });
  markers.forEach(function(marker){
    marker.addEventListener('mouseenter',function(){activate(marker.dataset.portId);});
    marker.addEventListener('focus',function(){activate(marker.dataset.portId);});
  });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initPatagoniaInlineMap,{once:true});
}else{
  initPatagoniaInlineMap();
}
