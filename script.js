let carouselIndex = 1;
let isPlaying = false;
let currentQuoteIndex = 0;
let currentJarMessageIndex = 0;
let currentQuizQuestion = 0;
let currentSection = 'home';

// ===== SECTION NAVIGATION =====
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Add active class to clicked button
    const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    currentSection = sectionName;
}

// Initialize page when ready
function initializePage() {
    // Setup countdown timer
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);

    // Setup background hearts on login page
    generateBackgroundHearts();
}

let userScore = 0;
let anniversaryActive = true;

// Background music control
function playBackgroundMusic() {
    const audio = document.getElementById('bgMusic');
    if (audio) {
        audio.volume = 0.7;
        audio.play().catch(() => { }); // Ignore autoplay errors
    }
}
function pauseBackgroundMusic() {
    const audio = document.getElementById('bgMusic');
    if (audio) audio.pause();
}

// Love meter animation trigger
function triggerLoveMeter() {
    const meter = document.querySelector('.meter-fill');
    meter.style.animation = 'none';
    setTimeout(() => {
        meter.style.animation = 'expand 2s ease-in-out';
    }, 10);
}

// CAROUSEL FUNCTIONS
function showCarouselItem(n) {
    const items = document.querySelectorAll('.carousel-item');
    if (n > items.length) carouselIndex = 1;
    if (n < 1) carouselIndex = items.length;

    items.forEach(item => item.classList.remove('active'));
    items[carouselIndex - 1].classList.add('active');

    document.getElementById('carouselCurrent').textContent = carouselIndex;
}

function nextCarousel() {
    carouselIndex++;
    showCarouselItem(carouselIndex);
}

function prevCarousel() {
    carouselIndex--;
    showCarouselItem(carouselIndex);
}

// LOVE CALCULATOR
function calculateLove() {
    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;
    const resultDiv = document.getElementById('loveResult');

    if (!name1 || !name2) {
        resultDiv.innerHTML = '<div style="color: #e91e63; margin-top: 10px;">Please enter both names! 💕</div>';
        return;
    }

    // Calculate love percentage based on names
    const combined = (name1 + name2).toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        hash = combined.charCodeAt(i) + ((hash << 5) - hash);
    }
    let lovePercent = Math.abs(hash % 101);

    // Make it always high because love is infinite 😊
    lovePercent = Math.max(85, lovePercent);

    resultDiv.innerHTML = `
        <div class="love-result">💕 ${lovePercent}% Compatible 💕</div>
        <p style="color: #999; margin-top: 15px; font-size: 0.95rem;">
            ${getLoveMessage(lovePercent)}
        </p>
    `;
}

function getLoveMessage(percent) {
    if (percent === 100) return "Perfect match! You two are soulmates! 👼";
    if (percent >= 95) return "Exceptionally compatible! Meant to be together! 💑";
    if (percent >= 85) return "Highly compatible! Destined souls! 💕";
    return "Deep connection! Beautiful love! ❤️";
}

// LOVE LETTER WITH TYPING EFFECT
let loveLetterTimeout = null;
let loveLetterDone = false;
function typeOutLetter() {
    const letterText = `My Most Beautiful Love,

Today, I want to express what my heart feels every moment of every day...

You are the reason I wake up with a smile. Your laugh is my favorite melody, your smile is my greatest treasure, and your presence is my home.

Every day with you is a blessing I never take for granted. The way you look at me, the way you hold my hand, the little things you do – everything about you makes me fall in love with you all over again.

Thank you for being my partner, my best friend, my everything. Thank you for choosing to walk this beautiful journey with me. Thank you for loving me the way you do.

On this Valentine's Day and every day after, I promise to love you, cherish you, protect you, and make you happy. You are my forever, my always, my one true love.

Happy Valentine's Day to the most beautiful woman in my life – You!

Forever Yours,
Your Loving Husband 💕`;

    const letterDiv = document.getElementById('loveLetter');
    letterDiv.innerHTML = '';
    let index = 0;
    loveLetterDone = false;
    if (loveLetterTimeout) clearTimeout(loveLetterTimeout);

    function type() {
        if (index < letterText.length) {
            // Preserve line breaks
            if (letterText.charAt(index) === '\n') {
                letterDiv.innerHTML += '<br>';
            } else {
                letterDiv.innerHTML += letterText.charAt(index);
            }
            index++;
            loveLetterTimeout = setTimeout(type, 30);
        } else {
            loveLetterDone = true;
        }
    }

    type();
    // Allow click to instantly show full letter
    letterDiv.onclick = function () {
        if (!loveLetterDone) {
            if (loveLetterTimeout) clearTimeout(loveLetterTimeout);
            letterDiv.innerHTML = letterText.replace(/\n/g, '<br>');
            loveLetterDone = true;
        }
    };
}

function showLoveLetter() {
    document.getElementById('loveLetterModal').style.display = 'block';
    typeOutLetter();
}

// Ensure typing stops if modal is closed
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'loveLetterModal') {
        if (loveLetterTimeout) clearTimeout(loveLetterTimeout);
    }
}

// MUSIC PLAYER
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    const status = document.getElementById('musicStatus');

    if (isPlaying) {
        isPlaying = false;
        btn.textContent = '🎵';
        btn.style.background = 'linear-gradient(135deg, #e91e63, #c2185b)';
        status.textContent = 'Click to play romantic music';
    } else {
        isPlaying = true;
        btn.textContent = '⏸️';
        btn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        status.textContent = 'Playing romantic music... 🎶';
        playRomanticMusic();
    }
}

function playRomanticMusic() {
    // Create audio context for music
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        gain.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(523.3, audioContext.currentTime); // C5

        oscillator.frequency.linearRampToValueAtTime(587.3, audioContext.currentTime + 0.5); // D5
        oscillator.frequency.linearRampToValueAtTime(659.3, audioContext.currentTime + 1); // E5

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// CONFETTI CELEBRATION
function createConfetti() {
    const colors = ['#e91e63', '#ff1493', '#ff69b4', '#ff6b9d', '#ff1744'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `fall 3s linear forwards`;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function celebrateYes() {
    createConfetti();
    let hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach(h => h.style.animation = 'heartbeat 0.5s infinite');

    setTimeout(() => {
        const text = document.querySelector('.modal-text:nth-of-type(3)');
        if (text) {
            text.innerHTML = '<span style="font-size: 2rem;"> 😭💕 You make me the happiest man alive! 💕😭 </span>';
        }
        document.querySelector('.modal-btn').disabled = true;
        document.querySelector('.modal-btn').style.opacity = '0.5';
    }, 500);
}

// Generate random hearts in background
function generateBackgroundHearts() {
    const container = document.getElementById('heartsBackground');
    const hearts = ['❤️', '💕', '💖', '💗', '💓'];

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(heart);
    }
}

// Generate falling hearts after login
function generateFallingHearts() {
    const container = document.getElementById('fallingHeartsContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💞'];

    const interval = setInterval(() => {
        if (document.getElementById('afterLoginContainer').style.display !== 'block') {
            clearInterval(interval);
            return;
        }

        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        container.appendChild(heart);

        setTimeout(() => heart.remove(), 13000);
    }, 300);
}

// Login form handler - attach when DOM is ready
function attachLoginHandler() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            console.log('Attempting login with:', email, password); // Debug log

            // Check credentials (case-insensitive email)
            if (email.toLowerCase() === 'valentine@gmail.com' && password === '14022026') {
                // Success!
                document.getElementById('loginContainer').style.display = 'none';
                document.getElementById('afterLoginContainer').style.display = 'block';
                document.body.style.overflow = 'hidden';
                generateFallingHearts();
                triggerLoveMeter();

                // Celebrate with confetti-like effect
                celebrateLogin();

                // Initialize the navigation
                setTimeout(() => {
                    showSection('home');
                }, 500);
            } else {
                // Show error
                const errorMsg = document.getElementById('errorMessage');
                errorMsg.style.display = 'block';

                // Clear fields
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';

                // Hide error after 3 seconds
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        });
    }
}

// Attach login handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachLoginHandler);
} else {
    attachLoginHandler();
}


// Logout function
function logout() {
    document.getElementById('afterLoginContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    carouselIndex = 1;
    isPlaying = false;
    pauseBackgroundMusic();
}

// Modal functions
function showGallery() {
    document.getElementById('galleryModal').style.display = 'block';
}

function showSurprise() {
    document.getElementById('surpriseModal').style.display = 'block';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Celebrate login with extra animation
function celebrateLogin() {
    playBackgroundMusic();
    const container = document.getElementById('afterLoginContainer');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.fontSize = Math.random() * 2 + 1 + 'rem';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-20px';
            heart.style.zIndex = '15';
            heart.style.pointerEvents = 'none';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💓'][Math.floor(Math.random() * 5)];
            document.body.appendChild(heart);

            const animation = heart.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 }
            ], {
                duration: 3000,
                easing: 'ease-in'
            });

            animation.onfinish = () => heart.remove();
        }, i * 50);
    }
}

// Initialize
generateBackgroundHearts();

// Add CSS for falling confetti and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes heartFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes scaleOut {
        to {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== NEW ROMANTIC FEATURES =====

// Romantic Quotes
const romanticQuotes = [
    "Every day with you is a gift I never want to unwrap.",
    "You are my today and all of my tomorrows.",
    "My heart is yours, now and forever.",
    "In your smile, I find my home.",
    "You complete me in ways I never knew I needed.",
    "Loving you is the easiest thing I've ever done.",
    "You are my greatest adventure.",
    "With you, I found what I was searching for.",
    "You make ordinary moments extraordinary.",
    "Forever With You isn't long enough.",
    "Your love is my favorite feeling.",
    "I love you more than words could ever say.",
    "You are my greatest blessing.",
    "Every moment with you is magical.",
    "You are my sunshine on cloudy days.",
];

function nextQuote() {
    const quoteElement = document.getElementById('romanticQuote');
    currentQuoteIndex = (currentQuoteIndex + 1) % romanticQuotes.length;
    quoteElement.style.animation = 'none';
    setTimeout(() => {
        quoteElement.textContent = `"${romanticQuotes[currentQuoteIndex]}"`;
        quoteElement.style.animation = 'fadeInUp 0.6s ease';
    }, 10);
}

// Date Ideas Spinner
const dateIdeas = [
    "🍽️ Candlelit Dinner at Home",
    "🌅 Sunrise Breakfast on the Beach",
    "🎬 Movie Night Under the Stars",
    "🎭 Attend a Live Concert",
    "🧘 Couples Spa Day",
    "🚴 Bike Ride Through Nature",
    "🍷 Wine Tasting Tour",
    "📚 Bookstore & Coffee Date",
    "🎨 Paint and Sip Together",
    "🏖️ Beach Day with Picnic",
    "💃 Dance Lessons Class",
    "🌙 Midnight Stargazing",
    "🍰 Bake a Cake Together",
    "🎤 Karaoke Night",
    "🌳 Forest Walk & Nature Talk"
];

function spinDateIdea() {
    const spinner = document.getElementById('dateSpinner');
    const spinnerText = document.getElementById('spinnerText');

    // Rotate animation
    let rotation = 0;
    const interval = setInterval(() => {
        rotation += 30;
        spinner.style.transform = `rotate(${rotation}deg)`;
    }, 10);

    setTimeout(() => {
        clearInterval(interval);
        const randomIdea = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
        spinnerText.textContent = randomIdea;
        spinner.style.transform = `rotate(${rotation + 360}deg)`;
    }, 1000);
}

// Love Quiz
const quizQuestions = [
    {
        question: "What is my favorite thing about you?",
        answers: [
            "Your beautiful smile",
            "Your kind heart",
            "Everything about you",
            "Your laughter"
        ],
        correctAnswer: 2
    },
    {
        question: "When did I fall in love with you?",
        answers: [
            "On our first date",
            "The moment I saw you",
            "When I got to know you",
            "The day you said yes"
        ],
        correctAnswer: 1
    },
    {
        question: "What's my biggest weakness?",
        answers: [
            "You in a red dress",
            "Your cute smile",
            "Your love",
            "All of the above"
        ],
        correctAnswer: 3
    },
    {
        question: "How long will I love you?",
        answers: [
            "5 years",
            "10 years",
            "Forever and beyond",
            "Until the end of time"
        ],
        correctAnswer: 2
    },
    {
        question: "What do you mean to me?",
        answers: [
            "Everything",
            "My world",
            "My soulmate",
            "All of the above"
        ],
        correctAnswer: 3
    }
];

function startLoveQuiz() {
    document.getElementById('quizModal').style.display = 'block';
    currentQuizQuestion = 0;
    userScore = 0;
    displayQuizQuestion();
}

function displayQuizQuestion() {
    const question = quizQuestions[currentQuizQuestion];
    document.getElementById('quizQuestion').textContent = question.question;
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';

    const answersDiv = document.getElementById('quizAnswers');
    answersDiv.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index, btn);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const question = quizQuestions[currentQuizQuestion];
    const allButtons = document.querySelectorAll('.quiz-answer-btn');

    allButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === question.correctAnswer) {
        userScore++;
        btnElement.classList.add('correct');
    } else {
        btnElement.classList.add('incorrect');
        allButtons[question.correctAnswer].classList.add('correct');
    }

    setTimeout(() => {
        currentQuizQuestion++;
        if (currentQuizQuestion < quizQuestions.length) {
            displayQuizQuestion();
        } else {
            displayQuizResult();
        }
    }, 1500);
}

function displayQuizResult() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    const resultText = document.getElementById('quizResultText');
    const percentage = (userScore / quizQuestions.length) * 100;

    if (percentage === 100) {
        resultText.innerHTML = `🎉 Perfect Score! You know me SO well! 💕<br><small>That's MY perfect match!</small>`;
        createConfetti();
    } else if (percentage >= 80) {
        resultText.innerHTML = `🌟 Excellent! You know me well! 💕<br><small>Score: ${userScore}/${quizQuestions.length}</small>`;
    } else if (percentage >= 60) {
        resultText.innerHTML = `😊 Good job! You know me! 💕<br><small>Score: ${userScore}/${quizQuestions.length}</small>`;
    } else {
        resultText.innerHTML = `💕 That's okay, now you can learn more about me! 💕<br><small>Score: ${userScore}/${quizQuestions.length}</small>`;
    }
}

// Memory Jar
const jarMessages = [
    "You make my heart skip a beat every single day. 💕",
    "I fall in love with you all over again with each sunrise.",
    "Your love is the greatest gift I've ever received.",
    "Thank you for choosing to love me.",
    "You are my greatest adventure and my safest harbor.",
    "In your arms, I found my home.",
    "You make the world a better place just by being in it.",
    "I love the way you smile, the way you laugh.",
    "Every moment with you is a treasure I keep close to my heart.",
    "You are my soulmate, my partner, my love.",
    "I promise to love you forever and always.",
    "You complete me in ways I never imagined.",
    "Your kindness and beauty take my breath away.",
    "I love you more than yesterday, less than tomorrow.",
    "You are my today and all of my tomorrows.",
    "Thank you for being my greatest blessing.",
    "Nobody could love you more than I do.",
    "You are my favorite person to love.",
    "Forever with you is not long enough.",
    "You make my dreams come true every day."
];

function openMemoryJar() {
    document.getElementById('jarModal').style.display = 'block';
    currentJarMessageIndex = 0;
    nextJarMessage();
}

function nextJarMessage() {
    if (currentJarMessageIndex >= jarMessages.length) {
        currentJarMessageIndex = 0;
    }

    const jarMessage = document.getElementById('jarMessage');
    jarMessage.textContent = jarMessages[currentJarMessageIndex];
    jarMessage.style.animation = 'none';
    setTimeout(() => {
        jarMessage.style.animation = 'slideInUp 0.6s ease';
    }, 10);

    currentJarMessageIndex++;
}

// Rose Rain Effect
function startRoseRain() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const rose = document.createElement('div');
            rose.className = 'rose';
            rose.textContent = '🌹';
            rose.style.left = Math.random() * 100 + '%';
            rose.style.top = '-20px';
            rose.style.animationDuration = (Math.random() * 3 + 3) + 's';
            document.body.appendChild(rose);

            setTimeout(() => rose.remove(), 7000);
        }, i * 100);
    }
}

// ===== ANNIVERSARY FUNCTIONS =====

function showAnniversaryWishes() {
    document.getElementById('anniversaryWishesModal').style.display = 'block';
}

function show2YearsStory() {
    document.getElementById('twoYearsStoryModal').style.display = 'block';
}

function renewVows() {
    document.getElementById('vowRenewalModal').style.display = 'block';
}

function celebrateVowRenewal() {
    createConfetti();
    firehearts();
    startRoseRain();

    // Show celebration message
    const modal = document.getElementById('vowRenewalModal');
    const content = modal.querySelector('.modal-content');
    const newDiv = document.createElement('div');
    newDiv.style.marginTop = '20px';
    newDiv.style.textAlign = 'center';
    newDiv.style.color = '#e91e63';
    newDiv.style.fontSize = '1.5rem';
    newDiv.style.fontWeight = 'bold';
    newDiv.innerHTML = '💕 Forever starts right now! 💕';
    content.appendChild(newDiv);

    // Disable the button
    const btn = modal.querySelector('.modal-btn');
    btn.disabled = true;
    btn.style.opacity = '0.5';
}

function firehearts() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.fontSize = Math.random() * 3 + 2 + 'rem';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-20px';
            heart.style.zIndex = '999';
            heart.style.pointerEvents = 'none';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💓', '💘', '💞'][Math.floor(Math.random() * 7)];
            document.body.appendChild(heart);

            const animation = heart.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 }
            ], {
                duration: 3000,
                easing: 'ease-in'
            });

            animation.onfinish = () => heart.remove();
        }, i * 50);
    }
}

// ===== NEW FEATURES =====

// COUNTDOWN TIMER
function updateCountdownTimer() {
    // Next anniversary - February 14, 2027
    const nextAnniversary = new Date(2027, 1, 14).getTime();
    const now = new Date().getTime();
    const distance = nextAnniversary - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countDays = document.getElementById('countDays');
        const countHours = document.getElementById('countHours');
        const countMinutes = document.getElementById('countMinutes');
        const countSeconds = document.getElementById('countSeconds');

        if (countDays) countDays.textContent = days;
        if (countHours) countHours.textContent = hours;
        if (countMinutes) countMinutes.textContent = minutes;
        if (countSeconds) countSeconds.textContent = seconds;
    }
}

// Start countdown timer when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 1000);
    });
} else {
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);
}

// SWEET MESSAGES
const sweetMessages = [
    "You are my greatest blessing 💕",
    "Every day with you is a gift 🎁",
    "I love you more each day 💖",
    "You make my heart skip a beat 💗",
    "Forever starts with you 💞",
    "You are my soulmate 👼",
    "I'm so lucky to have you 🌟",
    "You complete me perfectly 💑",
    "My heart belongs to you 💝",
    "You are my forever love 💕",
    "I adore everything about you 😍",
    "You make me want to be a better person 🌹",
    "With you, I found home 🏠",
    "You are my everything 👑",
    "I cherish every moment with you ✨"
];

function showSweetMessage() {
    const randomIndex = Math.floor(Math.random() * sweetMessages.length);
    const message = sweetMessages[randomIndex];

    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #e91e63, #ff1493);
        color: white;
        padding: 30px;
        border-radius: 15px;
        font-size: 1.3rem;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(233, 30, 99, 0.5);
        max-width: 400px;
        animation: popIn 0.5s ease;
    `;
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'scaleOut 0.5s ease';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// PHOTO SLIDER
let currentSlide = 0;

function nextSlide() {
    const slides = document.querySelectorAll('.photo-slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.photo-slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Auto-advance slider every 5 seconds
setInterval(nextSlide, 5000);

// HEARTS RAIN ANIMATION
function startHeartsRain() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.fontSize = Math.random() * 2 + 1 + 'rem';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-20px';
            heart.style.zIndex = '999';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heartFall 4s linear forwards';
            heart.textContent = ['❤️', '💕', '💖', '💗', '💓', '💘'][Math.floor(Math.random() * 6)];
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// Add heartFall animation to styles dynamically
const heartsStyle = document.createElement('style');
heartsStyle.textContent = `
    @keyframes heartFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes scaleOut {
        to {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartsStyle);

// ===== MEMORY MATCH GAME =====
const memoryEmojis = ['💘', '💍', '🌹', '💌', '💑', '🎁', '🧸', '🍫'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function startMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;

    // Create pairs and shuffle
    memoryCards = [...memoryEmojis, ...memoryEmojis];
    memoryCards.sort(() => Math.random() - 0.5);

    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.innerHTML = `<span style="display:none;">${emoji}</span>`; // Create hidden content
        card.onclick = () => flipCard(card, emoji);
        grid.appendChild(card);
    });
}

function flipCard(card, emoji) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.firstChild.style.display = 'block'; // Show emoji
    card.style.transform = 'rotateY(180deg)'; // Visual flip

    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.emoji === card2.emoji) {
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === memoryEmojis.length) {
            setTimeout(() => {
                createConfetti();
                showSweetMessage(); // Reusing sweet message
                alert("You won! You found all the love matches! 💕");
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card1.card.firstChild.style.display = 'none';
            card1.card.style.transform = '';

            card2.card.classList.remove('flipped');
            card2.card.firstChild.style.display = 'none';
            card2.card.style.transform = '';

            flippedCards = [];
        }, 1000);
    }
}

// Initialize Memory game on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMemoryGame);
} else {
    startMemoryGame();
}


// ===== TIC-TAC-TOE (LOVE EDITION) =====
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttActive = true;
const humanPlayer = '❤️';
const aiPlayer = '❌';

function makeMove(index) {
    if (!tttActive || tttBoard[index] !== '') return;

    // Human Move
    updateCell(index, humanPlayer);

    if (checkWin(humanPlayer)) {
        endGame(humanPlayer);
        return;
    }

    if (checkDraw()) {
        endGame('draw');
        return;
    }

    // AI Move
    document.getElementById('tttStatus').textContent = "Cupid is thinking... 🤔";
    tttActive = false;
    setTimeout(aiMove, 600);
}

function aiMove() {
    if (!tttActive && tttBoard.filter(c => c === '').length === 0) return; // Game over or full

    // Simple AI: pick random empty spot
    const emptyIndices = tttBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        updateCell(randomIndex, aiPlayer);

        if (checkWin(aiPlayer)) {
            endGame(aiPlayer);
        } else if (checkDraw()) {
            endGame('draw');
        } else {
            tttActive = true;
            document.getElementById('tttStatus').textContent = "Your Turn! (❤️)";
        }
    }
}

function updateCell(index, player) {
    tttBoard[index] = player;
    const cell = document.querySelectorAll('.ttt-cell')[index];
    cell.textContent = player;
    cell.classList.add('taken');
    cell.style.color = player === humanPlayer ? '#e91e63' : '#333';
}

function checkWin(player) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return wins.some(combination => {
        if (combination.every(index => tttBoard[index] === player)) {
            // Highlight winning cells
            combination.forEach(index => {
                document.querySelectorAll('.ttt-cell')[index].classList.add('winner');
            });
            return true;
        }
        return false;
    });
}

function checkDraw() {
    return tttBoard.every(cell => cell !== '');
}

function endGame(winner) {
    tttActive = false;
    const status = document.getElementById('tttStatus');
    if (winner === humanPlayer) {
        status.textContent = "You Won! Love Conquers All! 💕";
        createConfetti();
    } else if (winner === aiPlayer) {
        status.textContent = "Cupid Won! Try Again! 🏹";
    } else {
        status.textContent = "It's a Tie! Perfect Match! 💑";
    }
}

function resetTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttActive = true;
    document.querySelectorAll('.ttt-cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winner');
    });
    document.getElementById('tttStatus').textContent = "Your Turn! (❤️)";
}

// Initialize page on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
