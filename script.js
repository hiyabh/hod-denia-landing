// Hod Dania landing: WhatsApp links, mobile contact dock, scroll reveal.

// Sales office WhatsApp number (international format, digits only) - 055-29-29-224.
const WHATSAPP_NUMBER = '972552929224';
const WHATSAPP_TEXT = 'שלום, אשמח לשמוע פרטים על המעבר להוד דניה בלי הון עצמי.';
const REVEAL_THRESHOLD = 0.15;

function setupWhatsAppLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

function onceVisible(items, callback) {
  if (!('IntersectionObserver' in window)) {
    items.forEach(callback);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      callback(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: REVEAL_THRESHOLD });
  items.forEach((el) => observer.observe(el));
}

function setupDock() {
  const dock = document.querySelector('.dock');
  const hero = document.querySelector('.hero');
  if (!dock || !hero) return;
  document.body.classList.add('has-dock');
  if (!('IntersectionObserver' in window)) {
    dock.classList.add('is-visible');
    return;
  }
  new IntersectionObserver(([entry]) => {
    dock.classList.toggle('is-visible', !entry.isIntersecting);
  }).observe(hero);
}

setupWhatsAppLinks();
setupDock();
onceVisible(document.querySelectorAll('.reveal'), (el) => el.classList.add('is-visible'));
