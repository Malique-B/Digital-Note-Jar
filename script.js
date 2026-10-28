// -------------------------------------------------------------
// EDIT YOUR REASONS HERE! Add as many personalized notes as you like.
// -------------------------------------------------------------
const defaultReasons = [
    "I appreciate how being around you can make an ordinary day feel special. There's something about your presence that makes me happy in a way that's difficult to explain.",
    "I appreciate that you want me around, even when we're doing absolutely nothing special. Sometimes just being next to you is enough to make my day.",
    "I appreciate the little ways you look after me. Whether it's making me food or making sure I'm comfortable, those little gestures mean more to me than you probably realise.",
    "I appreciate that I can have fun with you and be silly around you. I love that our time together doesn't always have to be serious to mean something.",
    "I appreciate the little things that make you you. Your habits, your expressions, your personality, and all those tiny details that make you different from anyone else.",
    "I appreciate that you take the time to make me food. It's such a simple thing, but there's something special about being cared for in a way that makes me feel at home.",
    "I appreciate that you make an effort to find ways for us to spend time together, even when life gets busy. It means a lot knowing that being around me is something you genuinely enjoy.",
    "I appreciate that we can talk about our lives, our values, and the future. I love getting to know more of who you are beyond the things everyone else gets to see.",
    "I appreciate that you tell me how you feel and what matters to you. Even when conversations aren't easy, honesty gives us a chance to understand each other better.",
    "I appreciate the way you think, the way you see things, and the perspective you bring into conversations. I'm not just attracted to you; I genuinely enjoy getting to know the person you are.",
    "I appreciate that smile of yours. You probably don't realise how much I enjoy seeing you happy, but it's one of those little things I could never get tired of.",
    "I appreciate the softness and unique energy you bring into my life. I love the little moments when you let me see your playful, affectionate side.",
    "I appreciate the way you make it clear that you enjoy having me around. It's a beautiful feeling knowing that the desire to spend time together comes from both sides.",
    "I appreciate you for being you, Pretty Girl. Not because of what you do for me, how you make me feel, or what the future might hold, but because there's a person behind all of that whom I'm genuinely grateful to know."
];

let availableReasons = [...defaultReasons];
let unlockedReasons = JSON.parse(localStorage.getItem('unlocked_reasons')) || [];

const colors = ['#ff758c', '#ff8e53', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];

// Sound effect generator using Web Audio API
function playPopSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
}

// Initialize Background & Jar UI
function init() {
    createBackgroundHearts();
    renderJarNotes();
}

function createBackgroundHearts() {
    const container = document.getElementById('heart-bg-container');
    const heartIcons = ['💖', '💕', '💗', '🌸', '✨'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-bg';
        heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${6 + Math.random() * 6}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(heart);
    }
}

function renderJarNotes() {
    const jarNotes = document.getElementById('jar-notes');
    jarNotes.innerHTML = '';
    const count = Math.min(availableReasons.length + 5, 18);
    for (let i = 0; i < count; i++) {
        const note = document.createElement('div');
        note.className = 'mini-note';
        const randomColor = colors[i % colors.length];
        const randomRot = (Math.random() * 40 - 20) + 'deg';
        note.style.backgroundColor = randomColor;
        note.style.setProperty('--rot', randomRot);
        jarNotes.appendChild(note);
    }
}

// Pull a random note
function pullNote() {
    if (availableReasons.length === 0) {
        // Reset pool if all drawn
        availableReasons = [...defaultReasons];
    }

    const randomIndex = Math.floor(Math.random() * availableReasons.length);
    const reason = availableReasons.splice(randomIndex, 1)[0];

    if (!unlockedReasons.includes(reason)) {
        unlockedReasons.push(reason);
        localStorage.setItem('unlocked_reasons', JSON.stringify(unlockedReasons));
    }

    playPopSound();

    // Fire confetti trigger
    confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
    });

    // Display in modal
    document.getElementById('modal-text').innerText = `"${reason}"`;
    document.getElementById('modal').classList.add('active');

    renderJarNotes();
    renderGallery();
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function toggleGallery() {
    const gallery = document.getElementById('gallery');
    gallery.classList.toggle('active');
    renderGallery();
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (unlockedReasons.length === 0) {
        gallery.innerHTML = '<p style="text-align:center; color:#777; font-size:0.9rem;">No unlocked reasons yet! Tap the jar to pull one.</p>';
        return;
    }
    gallery.innerHTML = unlockedReasons.map(r => `
        <div class="gallery-item">
            <span>💖 ${r}</span>
        </div>
    `).join('');
}

// Run setup on page load
init();