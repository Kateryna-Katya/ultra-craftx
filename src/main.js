document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. MOBILE MENU & HEADER LOGIC
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

    // Закрытие меню (кнопка крестик)
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Эффект тени у хедера при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(11, 11, 13, 0.95)'; // Чуть темнее при скролле
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(11, 11, 13, 0.9)';
        }
    });


    /* ==========================================================================
       2. HERO SECTION ANIMATION (GSAP + SplitType)
       ========================================================================== */
    
    // Проверяем, существуют ли библиотеки, чтобы избежать ошибок
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
        
        gsap.registerPlugin(ScrollTrigger);

        // 1. Разбиваем заголовок на слова и буквы
        const heroTitle = new SplitType('#hero-title', { 
            types: 'words, chars',
            tagName: 'span' 
        });

        // 2. Создаем Timeline для последовательности
        const tl = gsap.timeline({ 
            defaults: { ease: 'power4.out' } 
        });

        // 3. Запуск анимации
        tl
        // Анимация букв заголовка
        .from(heroTitle.chars, {
            y: 100,             // Вылет снизу
            opacity: 0,
            rotationX: -90,     // 3D вращение
            stagger: 0.02,      // Задержка между появлением букв
            duration: 1.2,
            transformOrigin: "0% 50% -50"
        })
        // Появление подзаголовка (с небольшим смещением по времени назад "-=0.8")
        .to('.hero__subtitle', {
            y: 0,
            opacity: 1,
            duration: 1,
            startAt: { y: 20, opacity: 0 }
        }, "-=0.8")
        // Появление кнопок
        .to('.hero__actions', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            startAt: { y: 20, opacity: 0 }
        }, "-=0.6")
        // Появление визуального блока справа
        .to('.hero__visual', {
            x: 0,
            opacity: 1,
            duration: 1.5,
            scale: 1,
            startAt: { x: 50, opacity: 0, scale: 0.95 },
            ease: 'expo.out'
        }, "-=1");

        // Обработка ресайза окна (SplitType может ломаться при изменении ширины)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Возвращаем текст в исходное состояние и разбиваем заново
                heroTitle.revert();
                heroTitle.split();
                // Перезапускаем анимацию букв, чтобы они встали на место (опционально)
                gsap.set(heroTitle.chars, { y: 0, opacity: 1, rotationX: 0 });
            }, 200);
        });
    }

/* ==========================================================================
       3. FAQ ACCORDION
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем другие (аккордеон)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий
            item.classList.toggle('active');
        });
    });

    /* ==========================================================================
       4. CONTACT FORM LOGIC (Basic)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const captchaInput = document.getElementById('captchaInput');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Простая проверка капчи (3+4=7)
            if (captchaInput.value.trim() !== '7') {
                formMessage.textContent = 'Ошибка: Неверный ответ на пример.';
                formMessage.className = 'form-message error-msg';
                return;
            }

            // Имитация отправки
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                formMessage.textContent = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
                formMessage.className = 'form-message success-msg';
                contactForm.reset();
            }, 1500);
        });
    }
/* ==========================================================================
       5. COOKIE POPUP LOGIC
       ========================================================================== */
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    // Проверяем, было ли уже согласие
    if (!localStorage.getItem('cookiesAccepted')) {
        // Показываем с задержкой в 2 секунды для плавности
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    // Обработка клика
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            // Скрываем попап
            cookiePopup.classList.remove('show');
            
            // Сохраняем выбор в браузере пользователя
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
});
