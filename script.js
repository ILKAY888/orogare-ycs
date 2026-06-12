// Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const backTop = document.getElementById('backTop');
const toast = document.getElementById('toast');

hamburger.addEventListener('click', () => navMenu.classList.toggle('show'));

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('show'));
});

// Back to top
window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 300);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Bible verse rotation
const verses = [
    { text: '"For I know the plans I have for you," declares the LORD, "plans to give you hope and a future."', ref: 'Jeremiah 29:11' },
    { text: '"I can do all things through Christ who strengthens me."', ref: 'Philippians 4:13' },
    { text: '"The Lord is my shepherd, I lack nothing."', ref: 'Psalm 23:1' },
    { text: '"Be strong and courageous. Do not be afraid, for the LORD your God is with you."', ref: 'Joshua 1:9' },
    { text: '"Come to me, all who are weary, and I will give you rest."', ref: 'Matthew 11:28' }
];
let vIdx = 0;
setInterval(() => {
    vIdx = (vIdx + 1) % verses.length;
    const v = verses[vIdx];
    document.getElementById('bibleVerse').textContent = v.text;
    document.getElementById('bibleVerse').nextElementSibling.textContent = '— ' + v.ref;
}, 10000);

// Toast notification
function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// Join form
document.getElementById('joinForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    if (!name || !phone) return showToast('Please fill all required fields', 'error');
    if (!/^(?:\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))) return showToast('Enter valid Kenyan phone number', 'error');
    
    const data = JSON.parse(localStorage.getItem('ycs_members') || '[]');
    data.push({ name, course: document.getElementById('course').value, year: document.getElementById('year').value, phone, date: new Date().toISOString() });
    localStorage.setItem('ycs_members', JSON.stringify(data));
    
    showToast('✅ Registered! We will contact you soon. God bless!', 'success');
    this.reset();
});

console.log('✅ YCS Orogare - Ready!');