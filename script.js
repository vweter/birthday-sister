// Плавная прокрутка к секциям
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Музыкальный плеер
let isPlaying = false;
const audio = document.getElementById('bgMusic');
const playBtn = document.querySelector('.play-btn');

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶️';
        isPlaying = false;
    } else {
        // Попытка воспроизвести музыку
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.textContent = '⏸️';
                isPlaying = true;
                console.log('Музыка начала играть');
            }).catch(error => {
                console.log('Ошибка воспроизведения:', error);
                // Показать сообщение пользователю
                alert('Музыка не может воспроизводиться. Попробуйте YouTube плеер ниже!');
                playBtn.textContent = '❌';
            });
        }
    }
}

// Проверка загрузки аудио
audio.addEventListener('loadeddata', function() {
    console.log('Аудио файл загружен успешно');
});

audio.addEventListener('error', function(e) {
    console.log('Ошибка загрузки аудио:', e);
    playBtn.textContent = '❌';
    playBtn.style.background = '#ff4444';
});

// Анимация появления элементов при прокрутке
function animateOnScroll() {
    const elements = document.querySelectorAll('.wish-card, .memory-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Создание конфетти
function createConfetti() {
    const colors = ['#e91e63', '#9c27b0', '#fce4ec', '#f3e5f5', '#e8eaf6'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Создание сердечек
function createHearts() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.fontSize = '20px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    heart.style.animation = 'float 4s ease-in-out';

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Запуск анимаций
    animateOnScroll();

    // Создание конфетти каждые 3 секунды
    setInterval(createConfetti, 3000);

    // Создание сердечек каждые 2 секунды
    setInterval(createHearts, 2000);

    // Добавление эффекта параллакса для фона
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = scrolled * 0.5;

        if (parallax) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Анимация при клике на кнопки
    const buttons = document.querySelectorAll('.cta-button, .restart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Создание эффекта пульсации
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Добавление стилей для эффекта пульсации
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .cta-button, .restart-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // Автоматическое воспроизведение музыки при первом клике
    let firstClick = true;
    document.addEventListener('click', function() {
        if (firstClick && !isPlaying) {
            firstClick = false;
            setTimeout(() => {
                toggleMusic();
            }, 1000);
        }
    });

    // Добавление эффекта печатающегося текста
    const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.innerHTML = '';

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    };

    // Применение эффекта печатания к заголовку
    const title = document.querySelector('.title');
    if (title) {
        const originalText = title.textContent;
        setTimeout(() => {
            typeWriter(title, originalText, 150);
        }, 1000);
    }
});

// Обработка ошибок аудио
audio.addEventListener('error', function() {
    console.log('Ошибка загрузки аудио файла');
    playBtn.style.display = 'none';
});

// Добавление эффекта hover для карточек
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.wish-card, .memory-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Функция для создания снежинок (альтернатива конфетти)
function createSnowflakes() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄️';
    snowflake.style.position = 'fixed';
    snowflake.style.fontSize = '15px';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = '-20px';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = '998';
    snowflake.style.animation = 'snowfall 6s linear';

    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 6000);
}

// Добавление стилей для снежинок
const snowStyle = document.createElement('style');
snowStyle.textContent = `
    @keyframes snowfall {
        0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(snowStyle);

// Запуск снежинок каждые 4 секунды
setInterval(createSnowflakes, 4000);

// Случайные комплименты
const compliments = [
    "Ты самая лучшая сестра в мире! 💖",
    "Твоя улыбка освещает весь мир! ✨",
    "Ты невероятно талантливая! 🌟",
    "С тобой никогда не скучно! 😄",
    "Ты самая красивая! 👑",
    "Твоя доброта покоряет сердца! 💝",
    "Ты моя гордость! 🏆",
    "С тобой все становится лучше! 🌈",
    "Ты настоящая принцесса! 👸",
    "Твоя энергия заразительна! ⚡",
    "Ты самая умная! 🧠",
    "Твоя сила вдохновляет! 💪",
    "Ты самая заботливая! 🤗",
    "Твоя душа прекрасна! 🌸",
    "Ты моя лучшая подруга! 👯‍♀️"
];

function showRandomCompliment() {
    const complimentText = document.getElementById('compliment-text');
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

    // Анимация появления
    complimentText.style.opacity = '0';
    complimentText.style.transform = 'scale(0.8)';

    setTimeout(() => {
        complimentText.textContent = randomCompliment;
        complimentText.style.opacity = '1';
        complimentText.style.transform = 'scale(1)';

        // Добавляем эффект конфетти при получении комплимента
        createConfetti();
    }, 300);
}

// Добавляем стили для анимации комплиментов
const complimentStyle = document.createElement('style');
complimentStyle.textContent = `
    #compliment-text {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(complimentStyle);

// Функции для галереи "Как мы растём"
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.photo-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Скрываем все слайды
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Убираем активный класс со всех точек
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Показываем нужный слайд и активируем точку
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    currentSlideIndex = index;
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;

    // Зацикливаем слайды
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }

    showSlide(newIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// Автоматическое переключение слайдов каждые 5 секунд
function autoSlide() {
    changeSlide(1);
}

// Запускаем автопереключение
setInterval(autoSlide, 5000);

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
});
