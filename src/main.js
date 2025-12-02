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
       4. CONTACT FORM (Валидация + Имитация отправки)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const captchaInput = document.getElementById('captchaInput');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Простая математическая капча (3 + 4)
            if (captchaInput.value.trim() !== '7') {
                formMessage.textContent = 'Ошибка: Неверный ответ на пример.';
                formMessage.className = 'form-message error-msg';
                // Анимация тряски для поля
                captchaInput.style.borderColor = 'red';
                setTimeout(() => captchaInput.style.borderColor = '', 2000);
                return;
            }

            // Кнопка в состояние загрузки
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            // Имитация AJAX запроса (1.5 сек)
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                
                // Успех
                formMessage.textContent = 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
                formMessage.className = 'form-message success-msg';
                
                // Очистка формы
                contactForm.reset();
                
                // Удаление сообщения через 5 секунд
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
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