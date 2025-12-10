document.addEventListener('DOMContentLoaded', () => {

  // --- 0. INIT & CONFIG ---
  gsap.registerPlugin(ScrollTrigger);
  lucide.createIcons();

  // --- 1. SMOOTH SCROLL (LENIS) ---
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      touchMultiplier: 2,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- 2. MOBILE MENU ---
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (burger && mobileNav) {
      burger.addEventListener('click', () => {
          const isActive = burger.classList.toggle('is-active');
          mobileNav.classList.toggle('is-active');

          if (isActive) {
              lenis.stop();
              document.body.style.overflow = 'hidden';
          } else {
              lenis.start();
              document.body.style.overflow = '';
          }
      });

      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
              burger.classList.remove('is-active');
              mobileNav.classList.remove('is-active');
              lenis.start();
              document.body.style.overflow = '';
          });
      });
  }

  // --- 3. HERO ANIMATION ---
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
      const splitHero = new SplitType('.hero__title', { types: 'lines, words' });
      gsap.set('.hero__title', { visibility: 'visible' });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(splitHero.words, { y: 100, opacity: 0, duration: 1, stagger: 0.05, delay: 0.2 })
        .from('.hero__desc', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from('.hero__actions', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from('.hero__badge', { x: -20, opacity: 0, duration: 0.8 }, 0.5)
        .from('.hero__image-wrapper', { scale: 0.95, opacity: 0, duration: 1.5, ease: "power2.out" }, 0);

      // Parallax
      gsap.to('.hero__image-wrapper', {
          y: 50,
          scrollTrigger: {
              trigger: '.hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true
          }
      });
  }

  // --- 4. SCROLL ANIMATIONS FOR SECTIONS ---

  // Animate Section Titles (Split Type on Scroll)
  const sectionTitles = document.querySelectorAll('.section__title');
  sectionTitles.forEach(title => {
      new SplitType(title, { types: 'lines, words' });

      gsap.from(title.querySelectorAll('.word'), {
          scrollTrigger: {
              trigger: title,
              start: 'top 80%',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out"
      });
  });

  // Animate Cards (Stagger)
  const fadeCards = document.querySelectorAll('.feature-card, .blog-card, .methodology__card');
  gsap.utils.toArray(fadeCards).forEach(card => {
      gsap.from(card, {
          scrollTrigger: {
              trigger: card,
              start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
      });
  });

// --- 5. CONTACT FORM & VALIDATION (FIXED) ---
const form = document.getElementById('leadForm');

// Логика капчи
const captchaLabel = document.getElementById('captchaLabel');
const captchaInput = document.getElementById('captchaInput');
let correctSum = 5;

if (captchaLabel && captchaInput) {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    correctSum = num1 + num2;
    captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Выбираем все обязательные поля (включая чекбокс)
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            // 1. Определяем правильного родителя
            let group = input.closest('.form-group');
            if (!group) {
                group = input.closest('.form-checkbox');
            }

            // Если родитель не найден — пропускаем (защита от null)
            if (!group) return;

            // 2. Логика проверки зависит от типа поля
            let hasError = false;

            if (input.type === 'checkbox') {
                // Для чекбокса проверяем галочку
                if (!input.checked) hasError = true;
            } else {
                // Для текстовых полей проверяем пустоту
                if (!input.value.trim()) hasError = true;
            }

            // 3. Применяем классы ошибок
            if (hasError) {
                group.classList.add('error');
                isValid = false;
            } else {
                group.classList.remove('error');
            }
        });

        // 4. Проверка телефона (если заполнен)
        const phone = document.getElementById('phone');
        const phoneRegex = /^[0-9+\-() ]{5,}$/;
        if (phone && phone.value.trim() !== '') {
            if (!phoneRegex.test(phone.value)) {
                phone.closest('.form-group').classList.add('error');
                isValid = false;
            }
        }

        // 5. Проверка капчи
        if (captchaInput) {
            const userSum = parseInt(captchaInput.value, 10);
            if (userSum !== correctSum) {
                captchaInput.closest('.form-group').classList.add('error');
                isValid = false;
            }
        }

        // 6. Отправка
        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                const successMsg = document.getElementById('formSuccess');
                if (successMsg) successMsg.classList.add('is-visible');

                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;

                // Обновляем капчу
                const newNum1 = Math.floor(Math.random() * 5) + 1;
                const newNum2 = Math.floor(Math.random() * 5) + 1;
                correctSum = newNum1 + newNum2;
                captchaLabel.textContent = `Сколько будет ${newNum1} + ${newNum2}?`;
            }, 1500);
        }
    });

    // Убираем ошибки при вводе/клике
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            let group = input.closest('.form-group') || input.closest('.form-checkbox');
            if (group) group.classList.remove('error');
        });
        // Для чекбокса событие change надежнее
        if (input.type === 'checkbox') {
            input.addEventListener('change', () => {
                let group = input.closest('.form-checkbox');
                if (group) group.classList.remove('error');
            });
        }
    });
}

  // --- 6. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookie');

  if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('is-active');
      }, 2000);
  }

  if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('is-active');
      });
  }

});