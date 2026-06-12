// YCS Orogare - Main JavaScript
(function() {
    'use strict';

    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const backTop = document.getElementById('backTop');
    const toast = document.getElementById('toast');
    const joinForm = document.getElementById('joinForm');
    const prayerForm = document.getElementById('prayerForm');
    const formStatus = document.getElementById('formStatus');

    // Navigation
    hamburger?.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        hamburger.textContent = navMenu.classList.contains('show') ? '✕' : '☰';
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            hamburger.textContent = '☰';
        });
    });

    // Scroll handlers
    window.addEventListener('scroll', () => {
        backTop?.classList.toggle('show', window.scrollY > 300);
    });

    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Bible verse rotation
    const verses = [
        { text: '"For I know the plans I have for you," declares the LORD, "plans to give you hope and a future."', ref: 'Jeremiah 29:11' },
        { text: '"I can do all things through Christ who strengthens me."', ref: 'Philippians 4:13' },
        { text: '"The Lord is my shepherd, I lack nothing."', ref: 'Psalm 23:1' },
        { text: '"Be strong and courageous. Do not be afraid."', ref: 'Joshua 1:9' },
        { text: '"Come to me, all who are weary, and I will give you rest."', ref: 'Matthew 11:28' }
    ];
    let vIdx = 0;
    setInterval(() => {
        vIdx = (vIdx + 1) % verses.length;
        document.getElementById('bibleVerse').textContent = verses[vIdx].text;
        document.getElementById('verseRef').textContent = '— ' + verses[vIdx].ref;
    }, 10000);

    // Toast notifications
    function showToast(msg, type = 'success') {
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    // Time ago helper
    function getTimeAgo(date) {
        const mins = Math.floor((new Date() - date) / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        const days = Math.floor(hrs / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // Join Form
    joinForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!fullName || !course || !year || !phone) {
            return showToast('⚠️ Fill all required fields', 'error');
        }
        if (!/^(?:\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))) {
            return showToast('⚠️ Invalid Kenyan phone number', 'error');
        }

        formStatus.textContent = '⏳ Submitting...';
        
        const result = await api.registerMember({ fullName, course, yearOfStudy: year, phone, email, message });
        
        if (result.success) {
            showToast('✅ Registered successfully! Welcome!', 'success');
            joinForm.reset();
            formStatus.textContent = '✅ Registration complete!';
        } else {
            // Fallback to localStorage
            const members = JSON.parse(localStorage.getItem('ycs_members') || '[]');
            members.push({ fullName, course, year, phone, email, message, date: new Date().toISOString() });
            localStorage.setItem('ycs_members', JSON.stringify(members));
            showToast('✅ Saved offline. Will sync later.', 'info');
            joinForm.reset();
            formStatus.textContent = '📱 Saved locally';
        }
    });

    // Prayer Form
    async function loadPrayers() {
        const container = document.getElementById('prayerIntentions');
        if (!container) return;

        const result = await api.getPublicPrayers();
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.slice(0, 10).map(p => `
                <div class="prayer-card">
                    <p>"${p.intention.replace(/</g, '&lt;')}"</p>
                    <span class="prayer-time">🕐 ${getTimeAgo(new Date(p.submittedAt))}</span>
                </div>
            `).join('');
            document.getElementById('prayerCount').textContent = `${result.data.length} prayer intentions`;
        }
    }

    prayerForm?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const intention = document.getElementById('prayerIntention').value.trim();
        const isPublic = document.getElementById('prayerPublic').checked;

        if (intention.length < 5) return showToast('⚠️ Write at least 5 characters', 'error');

        const result = await api.submitPrayer({ intention, isPublic });
        if (result.success) {
            showToast('🙏 Prayer submitted!', 'success');
            prayerForm.reset();
            loadPrayers();
        } else {
            showToast('📱 Saved offline', 'info');
            prayerForm.reset();
        }
    });

    // Gallery click effect
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.15)' ? 'scale(1)' : 'scale(1.15)';
            this.style.zIndex = this.style.zIndex === '10' ? '1' : '10';
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' }); }
        });
    });

    // Initialize
    loadPrayers();
    console.log('✅ YCS Orogare Frontend Ready');
})();