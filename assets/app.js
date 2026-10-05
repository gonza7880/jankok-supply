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
