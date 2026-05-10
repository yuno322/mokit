
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ХЕДЕР: скролл-эффект и бургер-меню
    // ==========================================
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu .nav-link');

    // Затемнение хедера при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Бургер-меню
    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Подсветка активной страницы
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ==========================================
    // 2. СЛАЙДЕР ОТЗЫВОВ (анимация перелистывания)
    // ==========================================
    const track = document.querySelector('.reviews-track');
    const slides = document.querySelectorAll('.review-slide');
    const dotsContainer = document.querySelector('.reviews-dots');
    const prevBtn = document.querySelector('.reviews-arrow.prev');
    const nextBtn = document.querySelector('.reviews-arrow.next');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;
        let isTransitioning = false;

        // Создаём точки
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('reviews-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        const allDots = document.querySelectorAll('.reviews-dot');

        function goToSlide(index) {
            if (isTransitioning || index === currentIndex) return;
            isTransitioning = true;

            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalSlides - 1;
            if (currentIndex >= totalSlides) currentIndex = 0;

            // Анимированное перелистывание
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Обновляем точки
            allDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Добавляем эффект исчезновения/появления для текста
            const activeSlide = slides[currentIndex];
            const reviewText = activeSlide.querySelector('.review-text');
            const reviewAuthor = activeSlide.querySelector('.review-author');

            if (reviewText) {
                reviewText.style.opacity = '0';
                reviewText.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    reviewText.style.transition = 'all 0.4s ease';
                    reviewText.style.opacity = '1';
                    reviewText.style.transform = 'translateY(0)';
                }, 200);
            }

            if (reviewAuthor) {
                reviewAuthor.style.opacity = '0';
                setTimeout(() => {
                    reviewAuthor.style.transition = 'all 0.4s ease';
                    reviewAuthor.style.opacity = '1';
                }, 300);
            }

            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Кнопки навигации
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Автоперелистывание
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4500);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        startAutoPlay();

        // Останавливаем при наведении
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);

        // Свайп для мобильных
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        });
    }

    // ==========================================
    // 3. ГАЛЕРЕЯ КОФЕМАШИН (лайтбокс)
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    const galleryModalContent = document.querySelector('.gallery-modal-content');
    const galleryModalClose = document.querySelector('.gallery-modal-close');

    if (galleryModal) {
        const galleryImages = [
            '☕', '🏠', '🏢', '⭐', '🔥', '💎', '🌟', '🎯'
        ];

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                galleryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (galleryModalContent) {
                    galleryModalContent.textContent = galleryImages[index % galleryImages.length];
                    galleryModalContent.style.fontSize = '10rem';
                    galleryModalContent.style.display = 'flex';
                    galleryModalContent.style.alignItems = 'center';
                    galleryModalContent.style.justifyContent = 'center';
                    galleryModalContent.style.background = 'linear-gradient(135deg, #F5E6D3, #E8D5C0)';
                    galleryModalContent.style.width = '80vw';
                    galleryModalContent.style.maxWidth = '600px';
                    galleryModalContent.style.aspectRatio = '1';
                    galleryModalContent.style.borderRadius = '16px';
                }
            });
        });

        function closeGallery() {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (galleryModalClose) {
            galleryModalClose.addEventListener('click', closeGallery);
        }

        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) closeGallery();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
                closeGallery();
            }
        });
    }

    // ==========================================
    // 4. КАРТА
    // ==========================================
    const mapContainer = document.querySelector('.map-container');

    if (mapContainer) {
        const yandexMapScript = document.createElement('script');
        yandexMapScript.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        yandexMapScript.onload = () => {
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(() => {
                    const map = new ymaps.Map(mapContainer, {
                        center: [55.7558, 37.6173], // Москва
                        zoom: 14,
                        controls: ['zoomControl', 'fullscreenControl']
                    }, {
                        suppressMapOpenBlock: true
                    });

                    const placemark = new ymaps.Placemark(
                        [55.7558, 37.6173],
                        {
                            hintContent: 'Интернет-магазин кофемашин',
                            balloonContent: `
                                <strong>☕ КофеМашины.ру</strong><br>
                                г. Москва, ул. Елова, д. 10<br>
                                Тел: 8 800 333 20 30<br>
                                Время работы: 8:00-19:00
                            `
                        },
                        {
                            iconLayout: 'default#image',
                            iconImageHref: 'data:image/svg+xml;base64,' + btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
                                    <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#5D3A1A"/>
                                    <circle cx="20" cy="18" r="8" fill="white"/>
                                    <text x="20" y="22" text-anchor="middle" font-size="12" fill="#5D3A1A">☕</text>
                                </svg>
                            `),
                            iconImageSize: [40, 50],
                            iconImageOffset: [-20, -50]
                        }
                    );

                    map.geoObjects.add(placemark);

                    // Кнопка маршрута
                    const routeButton = document.createElement('button');
                    routeButton.textContent = '🗺️ Проложить маршрут';
                    routeButton.style.cssText = `
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        padding: 12px 24px;
                        background: #5D3A1A;
                        color: white;
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 600;
                        z-index: 100;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    `;
                    routeButton.addEventListener('click', () => {
                        window.open(
                            `https://yandex.ru/maps/-/CPWTq86Q`,
                            '_blank'
                        );
                    });


                    mapContainer.style.position = 'relative';
                    mapContainer.appendChild(routeButton);
                });
            }
        };

        yandexMapScript.onerror = () => {
            showMapFallback();
        };


        setTimeout(() => {
            if (!mapContainer.querySelector('ymaps')) {
                showMapFallback();
            }
        }, 5000);

        document.head.appendChild(yandexMapScript);
    }

    function showMapFallback() {
        if (!mapContainer) return;
        mapContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🗺️</div>
                <h3 style="color: #5D3A1A; margin-bottom: 10px;">Наш адрес</h3>
                <p style="color: #666;">г. Москва, ул. Елова, д. 10</p>
                <p style="color: #666;">м. Парк Культуры (5 мин пешком)</p>
                <a href="https://yandex.ru/maps/?rtext=~55.7558,37.6173&rtt=auto"
                   target="_blank"
                   style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #5D3A1A; color: white; text-decoration: none; border-radius: 30px; font-weight: 600;">
                    🗺️ Проложить маршрут
                </a>
            </div>
        `;
    }

    // ==========================================
    // 5. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
    // ==========================================
    const fadeElements = document.querySelectorAll(
        '.advantage-card, .product-card, .fact-card, .impact-card, .gallery-item, .review-card-full'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80); // Последовательное появление
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ==========================================
    // 6. ФОРМА АКЦИИ
    // ==========================================
    const promoForm = document.querySelector('.promo-form');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = promoForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast('Вы успешно подписались на акцию! 🎉', 'success');
                promoForm.reset();
            }
        });
    }

    // ==========================================
    // 7. КНОПКА "НАВЕРХ"
    // ==========================================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #5D3A1A;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 500;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 8. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРНЫХ ССЫЛОК
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 9. ФИЛЬТР КАТАЛОГА (на странице каталога)
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.product-card[data-category]');

    if (filterBtns.length > 0 && catalogItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                catalogItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================
    // 10. ТЕЛЕФОН: маска и копирование
    // ==========================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Просто разрешаем стандартное поведение (звонок)
        });
    });
});



function showToast(message, type = 'success') {

    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
