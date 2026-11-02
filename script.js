// Hod Dania landing: lead form -> prefilled WhatsApp message, plus scroll reveal.

// PLACEHOLDER - replace with the sales office WhatsApp number (international format, digits only).
const WHATSAPP_NUMBER = '972500000000';
const OFFICE_PHONE_DISPLAY = '073-705-4213';
const ISRAELI_PHONE = /^(?:\+?972|0)(?:[23489]|5\d|7\d)\d{7}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REVEAL_THRESHOLD = 0.15;

const messages = {
  nameRequired: 'נא למלא שם, כדי שנדע איך לפנות אליכם.',
  phoneRequired: 'נא למלא מספר טלפון לחזרה.',
  phoneInvalid: 'מספר הטלפון לא נראה תקין. למשל: 050-1234567.',
  emailInvalid: 'כתובת האימייל לא נראית תקינה. אפשר גם להשאיר את השדה ריק.',
  consentRequired: 'כדי שנוכל לחזור אליכם, נא לאשר את קבלת המידע.',
  opening: 'פותחים את וואטסאפ עם הפרטים שלכם…',
  sent: `הפנייה מוכנה בוואטסאפ. אם החלון לא נפתח, אפשר לחייג ל-${OFFICE_PHONE_DISPLAY}.`,
};

function normalizePhone(value) {
  return value.replace(/[\s\-()]/g, '');
}

function setError(input, errorId, text) {
  document.getElementById(errorId).textContent = text;
  input.setAttribute('aria-invalid', text ? 'true' : 'false');
  return !text;
}

function validate(form) {
  const name = form.elements.name;
  const phone = form.elements.phone;
  const email = form.elements.email;
  const consent = form.elements.consent;
  const phoneValue = normalizePhone(phone.value);

  const results = [
    setError(name, 'e-name', name.value.trim() ? '' : messages.nameRequired),
    setError(phone, 'e-phone', !phoneValue ? messages.phoneRequired
      : ISRAELI_PHONE.test(phoneValue) ? '' : messages.phoneInvalid),
    setError(email, 'e-email', !email.value.trim() || EMAIL.test(email.value.trim()) ? '' : messages.emailInvalid),
    setError(consent, 'e-consent', consent.checked ? '' : messages.consentRequired),
  ];
  const firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) firstInvalid.focus();
  return results.every(Boolean);
}

function buildMessage(form) {
  const lines = [
    'שלום, אשמח לפרטים על המודל של הוד דניה: מעבר לדירה חדשה בלי הון עצמי.',
    `שם: ${form.elements.name.value.trim()}`,
    `טלפון: ${normalizePhone(form.elements.phone.value)}`,
  ];
  const email = form.elements.email.value.trim();
  if (email) lines.push(`אימייל: ${email}`);
  lines.push(`מתעניינים עבור: ${form.elements.for.value}`);
  return lines.join('\n');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('form-status');
  if (!validate(form)) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  status.textContent = messages.opening;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(form))}`;
  window.open(url, '_blank', 'noopener');
  status.textContent = messages.sent;
  button.disabled = false;
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: REVEAL_THRESHOLD });
  items.forEach((el) => observer.observe(el));
}

document.getElementById('lead-form').addEventListener('submit', handleSubmit);
setupReveal();
