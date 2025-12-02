document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. UI & NAVIGATION (Меню и Хедер)
       ========================================================================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.header__link');
    const header = document.querySelector('.header');

    // Открытие меню
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
    }

    // Закрытие меню
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // Закрытие при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Эффект хедера при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(11, 11, 13, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(11, 11, 13, 0.9)';
        }
    });

    /* ==========================================================================
       2. HERO ANIMATION (GSAP + SplitType)
       ========================================================================== */
    // Проверка наличия библиотек для предотвращения ошибок
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined' && document.querySelector('#hero-title')) {

        gsap.registerPlugin(ScrollTrigger);

        // Разбиваем текст
        const heroTitle = new SplitType('#hero-title', {
            types: 'words, chars',
            tagName: 'span'
        });

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from(heroTitle.chars, {
            y: 100,
            opacity: 0,
            rotationX: -90,
            stagger: 0.02,
            duration: 1.2,
            transformOrigin: "0% 50% -50"
        })
        .to('.hero__subtitle', {
            y: 0,
            opacity: 1,
            duration: 1,
            startAt: { y: 20, opacity: 0 }
        }, "-=0.8")
        .to('.hero__actions', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            startAt: { y: 20, opacity: 0 }
        }, "-=0.6")
        .to('.hero__visual', {
            x: 0,
            opacity: 1,
            duration: 1.5,
            scale: 1,
            startAt: { x: 50, opacity: 0, scale: 0.95 },
            ease: 'expo.out'
        }, "-=1");

        // Ресайз фикс для SplitType
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                heroTitle.revert();
                heroTitle.split();
                gsap.set(heroTitle.chars, { y: 0, opacity: 1, rotationX: 0 });
            }, 200);
        });
    }

    /* ==========================================================================
       3. FAQ ACCORDION (Аккордеон)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Закрываем все остальные
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Переключаем текущий
                item.classList.toggle('active');
            });
        }
    });

   /* ==========================================================================
   CONTACT FORM — Полная валидация + имитация отправки
   ========================================================================== */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const captchaInput = document.getElementById('captchaInput');
const captchaLabel = document.getElementById('captchaLabel');

function showFieldError(input, message) {
    input.classList.add('input-error');
    input.style.borderColor = "#ff4d4d";

    let error = input.parentNode.querySelector('.field-error');
    if (!error) {
        error = document.createElement('div');
        error.className = 'field-error';
        input.parentNode.appendChild(error);
    }
    error.textContent = message;

    // Анимация "shake"
    input.style.animation = "shake 0.3s";
    setTimeout(() => (input.style.animation = ""), 300);
}

function clearFieldError(input) {
    input.classList.remove('input-error');
    input.style.borderColor = "";
    let error = input.parentNode.querySelector('.field-error');
    if (error) error.remove();
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const name = contactForm.name;
        const email = contactForm.email;
        const phone = contactForm.phone;

        // Очистка прошлых ошибок
        [name, email, phone, captchaInput].forEach(clearFieldError);

        // ---- Проверка имени ----
        if (name.value.trim().length < 2) {
            showFieldError(name, "Введите корректное имя");
            isValid = false;
        }

        // ---- Проверка Email ----
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showFieldError(email, "Введите корректный Email");
            isValid = false;
        }

        // ---- Проверка телефона ----
        const phoneRegex = /^[0-9+()\-\s]{6,}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showFieldError(phone, "Введите корректный номер телефона");
            isValid = false;
        }

        // ---- Математическая капча ----
        if (captchaInput.value.trim() !== "7") {
            showFieldError(captchaInput, "Неверный ответ");
            isValid = false;
        }

        if (!isValid) return;

        // ---- Кнопка в состояние загрузки ----
        const button = contactForm.querySelector("button");
        const btnText = button.textContent;
        button.textContent = "Отправка...";
        button.disabled = true;
        button.style.opacity = "0.7";

        // Имитация отправки
        setTimeout(() => {
            button.textContent = btnText;
            button.disabled = false;
            button.style.opacity = "1";

            formMessage.textContent = "Спасибо! Ваша заявка отправлена.";
            formMessage.className = "form-message success-msg";

            contactForm.reset();

            setTimeout(() => {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }, 5000);
        }, 1500);
    });
}

    /* ==========================================================================
       5. COOKIE POPUP (Попап с памятью)
       ========================================================================== */
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    if (cookiePopup && acceptBtn) {
        // Проверяем LocalStorage
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookiePopup.classList.add('show');
            }, 2000); // Показать через 2 сек после загрузки
        }

        acceptBtn.addEventListener('click', () => {
            cookiePopup.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
});