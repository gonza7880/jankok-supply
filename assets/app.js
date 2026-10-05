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
      ? {name:'Name',company:'Company',email:'Email',vessel:'Vessel',port:'Port / ETA',message:'Requirement'}
      : {name:'Nombre',company:'Empresa',email:'Email',vessel:'Buque',port:'Puerto / ETA',message:'Requerimiento'};
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


function initPatagoniaMap(){
  const mapEl=document.getElementById('patagonia-map');
  const rows=Array.from(document.querySelectorAll('.port-row'));
  if(!mapEl||!rows.length||typeof L==='undefined') return;

  const map=L.map(mapEl,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView([-50.3,-68.2],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:18,
    attribution:'&copy; OpenStreetMap'
  }).addTo(map);

  const route=[[-45.8641,-67.4790],[-47.7515,-65.8937],[-50.1174,-68.4163],[-51.6230,-69.0227],[-54.8159,-68.3175]];
  L.polyline(route,{color:'#0f7a83',weight:3,opacity:.72,dashArray:'10 8'}).addTo(map);

  const markers=new Map();
  function icon(label,active){
    return L.divIcon({
      className:'',
      html:'<div class="map-marker'+(active?' is-highlight':'')+'">'+label+'</div>',
      iconSize:[30,30],
      iconAnchor:[15,15],
      popupAnchor:[0,-14]
    });
  }

  rows.forEach(function(row,index){
    const lat=parseFloat(row.dataset.lat);
    const lng=parseFloat(row.dataset.lng);
    const title=(row.querySelector('strong')||{}).textContent||'';
    const desc=(row.querySelector('small')||{}).textContent||'';
    const marker=L.marker([lat,lng],{icon:icon(String(index+1),row.classList.contains('is-active'))}).addTo(map);
    marker.bindPopup('<div class="map-popup"><span>'+String(index+1).padStart(2,'0')+' / Puerto</span><strong>'+title+'</strong><p>'+desc+'</p></div>');
    marker.on('click',function(){activate(row.dataset.portId,true);});
    markers.set(row.dataset.portId,{marker:marker,index:index});
  });

  function activate(id,openPopup){
    rows.forEach(function(row,idx){
      const active=row.dataset.portId===id;
      row.classList.toggle('is-active',active);
      const item=markers.get(row.dataset.portId);
      if(item) item.marker.setIcon(icon(String(idx+1),active));
      if(active){
        const lat=parseFloat(row.dataset.lat);
        const lng=parseFloat(row.dataset.lng);
        const zoom=parseInt(row.dataset.zoom||'7',10);
        map.flyTo([lat,lng],zoom,{duration:.8});
        if(openPopup&&item) item.marker.openPopup();
      }
    });
  }

  rows.forEach(function(row){
    row.addEventListener('mouseenter',function(){activate(row.dataset.portId,false);});
    row.addEventListener('focus',function(){activate(row.dataset.portId,false);});
    row.addEventListener('click',function(){activate(row.dataset.portId,true);});
  });

  setTimeout(function(){map.invalidateSize();},250);
}
document.addEventListener('DOMContentLoaded',initPatagoniaMap);
