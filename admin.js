
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ДАННЫЕ
    // ==========================================
    let products = [
        { id: 1, name: "De'Longhi Nespresso Inissia", category: 'Капсульная', price: '9 990 ₽', stock: '23 шт.', description: 'Компактная капсульная кофемашина.' },
        { id: 2, name: 'Philips Series 2200', category: 'Для дома', price: '24 990 ₽', stock: '15 шт.', description: 'Автоматическая кофемашина для дома.' },
        { id: 3, name: 'Jura WE8 Professional', category: 'Профессиональная', price: '59 990 ₽', stock: '8 шт.', description: 'Для ресторанов и кофеен.' }
    ];

    let categories = [
        { id: 1, name: 'Для дома', productsCount: 12 },
        { id: 2, name: 'Капсульные', productsCount: 8 },
        { id: 3, name: 'Профессиональные', productsCount: 15 },
        { id: 4, name: 'Для офиса', productsCount: 5 }
    ];

    let orders = [
        { id: '#1045', customer: 'Арина Петрова', phone: '+7 (916) 123-45-67', product: "De'Longhi Inissia", amount: '9 990 ₽', date: '12.01.2024', status: '✅ Доставлен', address: 'г. Москва, ул. Тверская, д. 1' },
        { id: '#1044', customer: 'Дмитрий Смирнов', phone: '+7 (926) 234-56-78', product: 'Jura WE8', amount: '59 990 ₽', date: '11.01.2024', status: '🚚 В пути', address: 'г. Москва, ул. Арбат, д. 15' },
        { id: '#1043', customer: 'Кристина Тимофеева', phone: '+7 (903) 345-67-89', product: 'Philips 2200', amount: '24 990 ₽', date: '10.01.2024', status: '⏳ Обработка', address: 'г. Москва, ул. Ленина, д. 5' }
    ];

    let reviews = [
        { id: 1, author: 'Арина Петрова', rating: '⭐⭐⭐⭐⭐', text: 'Приобрела кофемашину и я в восторге! Кофе насыщенный и ароматный, дизайн отличный.', status: '✅ Опубликован' },
        { id: 2, author: 'Дмитрий Смирнов', rating: '⭐⭐⭐⭐⭐', text: 'Купил кофемашину для офиса. Очень доволен качеством и работой менеджеров.', status: '✅ Опубликован' },
        { id: 3, author: 'Кристина Тимофеева', rating: '⭐⭐⭐⭐⭐', text: 'Искала кофемашину для дома и нашла идеальную! Гости в восторге от вкусного кофе.', status: '✅ Опубликован' },
        { id: 4, author: 'Андрей Кузнецов', rating: '⭐⭐⭐⭐☆', text: 'Заказал кофемашину, пришла с небольшим дефектом, но магазин быстро обменял.', status: '⏳ На модерации' }
    ];

    let editingProductId = null;
    let editingCategoryId = null;
    let editingOrderId = null;
    let editingReviewId = null;

    // ==========================================
    // НАВИГАЦИЯ ПО РАЗДЕЛАМ
    // ==========================================
    const sidebarLinks = document.querySelectorAll('.admin-sidebar nav a[data-page]');
    const adminPages = document.querySelectorAll('.admin-page');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.dataset.page;

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            adminPages.forEach(page => page.style.display = 'none');

            const targetPage = document.getElementById(`page-${pageName}`);
            if (targetPage) targetPage.style.display = 'block';

            if (pageName === 'products') renderProductsTable();
            if (pageName === 'categories') renderCategoriesTable();
            if (pageName === 'orders') renderOrdersTable();
            if (pageName === 'reviews-admin') renderReviewsTable();
            if (pageName === 'dashboard') updateDashboard();
        });
    });

    // ==========================================
    // ДАШБОРД
    // ==========================================
    function updateDashboard() {
        const dashboardCards = document.querySelectorAll('#page-dashboard .fact-card');
        if (dashboardCards.length >= 4) {
            const totalRevenue = orders.reduce((sum, o) => {
                const amount = parseInt(o.amount.replace(/[^0-9]/g, ''));
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
            dashboardCards[0].querySelector('.fact-number').textContent = orders.length;
            dashboardCards[1].querySelector('.fact-number').innerHTML = (totalRevenue / 1000).toFixed(1) + 'K<span class="fact-suffix">₽</span>';
            dashboardCards[2].querySelector('.fact-number').textContent = products.length;
            dashboardCards[3].querySelector('.fact-number').textContent = reviews.length;
        }

        const dashboardTable = document.querySelector('#page-dashboard .admin-table tbody');
        if (dashboardTable) {
            dashboardTable.innerHTML = orders.slice(-5).reverse().map(o => `
                <tr>
                    <td>${o.id}</td>
                    <td>${o.customer}</td>
                    <td>${o.product || '—'}</td>
                    <td>${o.amount}</td>
                    <td>${o.status}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="window.viewOrder('${o.id}')">📋</button>
                        <button class="btn btn-sm btn-outline" onclick="window.changeOrderStatus('${o.id}')">🔄</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // ==========================================
    // ТОВАРЫ 
    // ==========================================
    function renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>${p.price}</td>
                <td>✅ ${p.stock}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="window.editProduct(${p.id})">✏️</button>
                    <button class="btn btn-sm btn-outline" onclick="window.deleteProduct(${p.id})" style="color:#c62828;border-color:#c62828;">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    window.editProduct = function(id) {
        editingProductId = id;
        const product = products.find(p => p.id === id);
        if (!product) return;
        const modal = document.getElementById('productModal');
        const inputs = modal.querySelectorAll('input, textarea');
        const select = modal.querySelector('select');
        inputs[0].value = product.name;
        if (select) select.value = product.category;
        inputs[1].value = parseInt(product.price.replace(/[^0-9]/g, '')) || 0;
        inputs[2].value = parseInt(product.stock.replace(/[^0-9]/g, '')) || 0;
        inputs[3].value = product.description || '';
        modal.querySelector('h3').textContent = 'Редактировать товар';
        openModal('productModal');
    };

    window.deleteProduct = function(id) {
        if (confirm('Удалить этот товар?')) {
            products = products.filter(p => p.id !== id);
            renderProductsTable();
            updateDashboard();
            showToast('Товар удалён', 'success');
        }
    };

    window.saveProduct = function() {
        const modal = document.getElementById('productModal');
        const inputs = modal.querySelectorAll('input, textarea');
        const select = modal.querySelector('select');
        const name = inputs[0].value.trim();
        const category = select ? select.value : '';
        const priceRaw = parseInt(inputs[1].value) || 0;
        const stockRaw = parseInt(inputs[2].value) || 0;
        const description = inputs[3] ? inputs[3].value : '';

        if (!name) { showToast('Введите название!', 'error'); return; }
        if (priceRaw <= 0) { showToast('Введите цену!', 'error'); return; }

        if (editingProductId) {
            const p = products.find(p => p.id === editingProductId);
            if (p) {
                p.name = name;
                p.category = category;
                p.price = priceRaw.toLocaleString('ru-RU') + ' ₽';
                p.stock = stockRaw + ' шт.';
                p.description = description;
            }
            editingProductId = null;
            showToast('Товар обновлён', 'success');
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({
                id: newId,
                name: name,
                category: category,
                price: priceRaw.toLocaleString('ru-RU') + ' ₽',
                stock: stockRaw + ' шт.',
                description: description
            });
            showToast('Товар добавлен', 'success');
        }

        renderProductsTable();
        updateDashboard();
        closeModal('productModal');
        modal.querySelector('h3').textContent = 'Добавить товар';
        inputs.forEach(i => { if (i.tagName === 'INPUT' || i.tagName === 'TEXTAREA') i.value = ''; });
        if (select) select.value = 'Для дома';
    };

    // ==========================================
    // КАТЕГОРИИ
    // ==========================================
    function renderCategoriesTable() {
        const tbody = document.getElementById('categoriesTableBody');
        if (!tbody) return;
        tbody.innerHTML = categories.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.productsCount}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="window.editCategory(${c.id})">✏️</button>
                    <button class="btn btn-sm btn-outline" onclick="window.deleteCategory(${c.id})" style="color:#c62828;border-color:#c62828;">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    window.editCategory = function(id) {
        editingCategoryId = id;
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        const modal = document.getElementById('categoryModal');
        const input = modal.querySelector('input');
        input.value = cat.name;
        modal.querySelector('h3').textContent = 'Редактировать категорию';
        openModal('categoryModal');
    };

    window.deleteCategory = function(id) {
        if (confirm('Удалить эту категорию? Товары этой категории не будут удалены.')) {
            categories = categories.filter(c => c.id !== id);
            renderCategoriesTable();
            showToast('Категория удалена', 'success');
        }
    };

    window.saveCategory = function() {
        const modal = document.getElementById('categoryModal');
        const input = modal.querySelector('input');
        const name = input.value.trim();
        if (!name) { showToast('Введите название!', 'error'); return; }

        if (editingCategoryId) {
            const cat = categories.find(c => c.id === editingCategoryId);
            if (cat) cat.name = name;
            editingCategoryId = null;
            showToast('Категория обновлена', 'success');
        } else {
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
            categories.push({ id: newId, name: name, productsCount: 0 });
            showToast('Категория добавлена', 'success');
        }

        renderCategoriesTable();
        closeModal('categoryModal');
        modal.querySelector('h3').textContent = 'Добавить категорию';
        input.value = '';
    };

    // ==========================================
    // ЗАКАЗЫ (просмотр, редактирование, смена статуса)
    // ==========================================
    function renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>${o.id}</td>
                <td>${o.customer}</td>
                <td>${o.phone}</td>
                <td>${o.amount}</td>
                <td>${o.date}</td>
                <td>${o.status}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="window.viewOrder('${o.id}')">📋</button>
                    <button class="btn btn-sm btn-outline" onclick="window.editOrder('${o.id}')">✏️</button>
                    <button class="btn btn-sm btn-outline" onclick="window.changeOrderStatus('${o.id}')">🔄</button>
                    <button class="btn btn-sm btn-outline" onclick="window.deleteOrder('${o.id}')" style="color:#c62828;border-color:#c62828;">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    window.viewOrder = function(orderId) {
        const o = orders.find(o => o.id === orderId);
        if (!o) return;
        alert(`📦 Заказ ${o.id}\n\n👤 Клиент: ${o.customer}\n📞 Телефон: ${o.phone}\n📍 Адрес: ${o.address || 'не указан'}\n☕ Товар: ${o.product || '—'}\n💰 Сумма: ${o.amount}\n📅 Дата: ${o.date}\n📌 Статус: ${o.status}`);
    };

    window.editOrder = function(orderId) {
        editingOrderId = orderId;
        const o = orders.find(o => o.id === orderId);
        if (!o) return;
        const modal = document.getElementById('orderModal');
        const inputs = modal.querySelectorAll('input, select');
        inputs[0].value = o.customer;
        inputs[1].value = o.phone;
        inputs[2].value = o.product || '';
        inputs[3].value = parseInt(o.amount.replace(/[^0-9]/g, '')) || 0;
        inputs[4].value = o.date;
        inputs[5].value = o.address || '';
        const statusSelect = modal.querySelector('select');
        if (statusSelect) statusSelect.value = o.status;
        modal.querySelector('h3').textContent = `Редактировать заказ ${orderId}`;
        openModal('orderModal');
    };

    window.changeOrderStatus = function(orderId) {
        const o = orders.find(o => o.id === orderId);
        if (!o) return;
        const statuses = ['⏳ Обработка', '📦 Собран', '🚚 В пути', '✅ Доставлен', '❌ Отменён'];
        const idx = statuses.indexOf(o.status);
        o.status = statuses[(idx + 1) % statuses.length];
        renderOrdersTable();
        updateDashboard();
        showToast(`Статус заказа ${orderId}: "${o.status}"`, 'success');
    };

    window.deleteOrder = function(orderId) {
        if (confirm(`Удалить заказ ${orderId}?`)) {
            orders = orders.filter(o => o.id !== orderId);
            renderOrdersTable();
            updateDashboard();
            showToast('Заказ удалён', 'success');
        }
    };

    window.saveOrder = function() {
        const modal = document.getElementById('orderModal');
        const inputs = modal.querySelectorAll('input');
        const statusSelect = modal.querySelector('select');

        const customer = inputs[0].value.trim();
        const phone = inputs[1].value.trim();
        const product = inputs[2].value.trim();
        const amountRaw = parseInt(inputs[3].value) || 0;
        const date = inputs[4].value.trim();
        const address = inputs[5].value.trim();
        const status = statusSelect ? statusSelect.value : '⏳ Обработка';

        if (!customer) { showToast('Введите имя клиента!', 'error'); return; }
        if (!phone) { showToast('Введите телефон!', 'error'); return; }

        if (editingOrderId) {
            const o = orders.find(o => o.id === editingOrderId);
            if (o) {
                o.customer = customer;
                o.phone = phone;
                o.product = product;
                o.amount = amountRaw.toLocaleString('ru-RU') + ' ₽';
                o.date = date;
                o.address = address;
                o.status = status;
            }
            editingOrderId = null;
            showToast('Заказ обновлён', 'success');
        } else {
            const newId = '#0' + (orders.length + 1001);
            orders.push({
                id: newId,
                customer: customer,
                phone: phone,
                product: product,
                amount: amountRaw.toLocaleString('ru-RU') + ' ₽',
                date: date || new Date().toLocaleDateString('ru-RU'),
                status: status,
                address: address
            });
            showToast('Заказ добавлен', 'success');
        }

        renderOrdersTable();
        updateDashboard();
        closeModal('orderModal');
        modal.querySelector('h3').textContent = 'Добавить заказ';
        inputs.forEach(i => i.value = '');
        if (statusSelect) statusSelect.value = '⏳ Обработка';
    };

    // ==========================================
    // ОТЗЫВЫ (просмотр, редактирование, модерация, удаление)
    // ==========================================
    function renderReviewsTable() {
        const tbody = document.getElementById('reviewsTableBody');
        if (!tbody) return;
        tbody.innerHTML = reviews.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.author}</td>
                <td>${r.rating}</td>
                <td>${r.text.length > 40 ? r.text.substring(0, 40) + '...' : r.text}</td>
                <td>${r.status}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="window.viewReview(${r.id})">📋</button>
                    <button class="btn btn-sm btn-outline" onclick="window.editReview(${r.id})">✏️</button>
                    <button class="btn btn-sm btn-outline" onclick="window.toggleReview(${r.id})">✅</button>
                    <button class="btn btn-sm btn-outline" onclick="window.deleteReview(${r.id})" style="color:#c62828;border-color:#c62828;">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    window.viewReview = function(reviewId) {
        const r = reviews.find(r => r.id === reviewId);
        if (!r) return;
        alert(`⭐ Отзыв №${r.id}\n\n👤 Автор: ${r.author}\n⭐ Рейтинг: ${r.rating}\n📝 Текст: ${r.text}\n📌 Статус: ${r.status}`);
    };

    window.editReview = function(reviewId) {
        editingReviewId = reviewId;
        const r = reviews.find(r => r.id === reviewId);
        if (!r) return;
        const modal = document.getElementById('reviewModal');
        const inputs = modal.querySelectorAll('input, textarea');
        const ratingSelect = modal.querySelector('select');
        inputs[0].value = r.author;
        if (ratingSelect) ratingSelect.value = r.rating;
        inputs[1].value = r.text;
        modal.querySelector('h3').textContent = `Редактировать отзыв №${reviewId}`;
        openModal('reviewModal');
    };

    window.toggleReview = function(reviewId) {
        const r = reviews.find(r => r.id === reviewId);
        if (!r) return;
        r.status = r.status === '✅ Опубликован' ? '⏳ На модерации' : '✅ Опубликован';
        renderReviewsTable();
        showToast(`Статус отзыва: "${r.status}"`, 'success');
    };

    window.deleteReview = function(reviewId) {
        if (confirm('Удалить этот отзыв?')) {
            reviews = reviews.filter(r => r.id !== reviewId);
            renderReviewsTable();
            updateDashboard();
            showToast('Отзыв удалён', 'success');
        }
    };

    window.saveReview = function() {
        const modal = document.getElementById('reviewModal');
        const inputs = modal.querySelectorAll('input, textarea');
        const ratingSelect = modal.querySelector('select');
        const author = inputs[0].value.trim();
        const rating = ratingSelect ? ratingSelect.value : '⭐⭐⭐⭐⭐';
        const text = inputs[1].value.trim();

        if (!author) { showToast('Введите имя автора!', 'error'); return; }
        if (!text) { showToast('Введите текст отзыва!', 'error'); return; }

        if (editingReviewId) {
            const r = reviews.find(r => r.id === editingReviewId);
            if (r) {
                r.author = author;
                r.rating = rating;
                r.text = text;
            }
            editingReviewId = null;
            showToast('Отзыв обновлён', 'success');
        } else {
            const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
            reviews.push({ id: newId, author: author, rating: rating, text: text, status: '⏳ На модерации' });
            showToast('Отзыв добавлен', 'success');
        }

        renderReviewsTable();
        updateDashboard();
        closeModal('reviewModal');
        modal.querySelector('h3').textContent = 'Добавить отзыв';
        inputs.forEach(i => i.value = '');
        if (ratingSelect) ratingSelect.value = '⭐⭐⭐⭐⭐';
    };

    // ==========================================
    // НАСТРОЙКИ
    // ==========================================
    const saveSettingsBtn = document.querySelector('#page-settings .btn-primary');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            showToast('Настройки сохранены! 💾', 'success');
        });
    }


    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });


    // Товар
    const addProductBtn = document.querySelector('#page-products .btn-primary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            editingProductId = null;
            const modal = document.getElementById('productModal');
            modal.querySelector('h3').textContent = 'Добавить товар';
            modal.querySelectorAll('input, textarea').forEach(i => i.value = '');
            const select = modal.querySelector('select');
            if (select) select.value = 'Для дома';
            openModal('productModal');
        });
    }

    // Категория
    const addCategoryBtn = document.querySelector('#page-categories .btn-primary');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            editingCategoryId = null;
            const modal = document.getElementById('categoryModal');
            modal.querySelector('h3').textContent = 'Добавить категорию';
            modal.querySelector('input').value = '';
            openModal('categoryModal');
        });
    }

    // Заказ
    const addOrderBtn = document.querySelector('#page-orders .btn-primary');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', () => {
            editingOrderId = null;
            const modal = document.getElementById('orderModal');
            modal.querySelector('h3').textContent = 'Добавить заказ';
            modal.querySelectorAll('input').forEach(i => i.value = '');
            const select = modal.querySelector('select');
            if (select) select.value = '⏳ Обработка';
            openModal('orderModal');
        });
    }

    // Отзыв
    const addReviewBtn = document.querySelector('#page-reviews-admin .btn-primary');
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            editingReviewId = null;
            const modal = document.getElementById('reviewModal');
            modal.querySelector('h3').textContent = 'Добавить отзыв';
            modal.querySelectorAll('input, textarea').forEach(i => i.value = '');
            const select = modal.querySelector('select');
            if (select) select.value = '⭐⭐⭐⭐⭐';
            openModal('reviewModal');
        });
    }


    document.querySelector('#productModal .btn-primary')?.addEventListener('click', window.saveProduct);
    document.querySelector('#categoryModal .btn-primary')?.addEventListener('click', window.saveCategory);
    document.querySelector('#orderModal .btn-primary')?.addEventListener('click', window.saveOrder);
    document.querySelector('#reviewModal .btn-primary')?.addEventListener('click', window.saveReview);

    // ==========================================
    // TOAST-УВЕДОМЛЕНИЯ
    // ==========================================
    function showToast(message, type = 'success') {
        const old = document.querySelector('.toast');
        if (old) old.remove();

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


    const sidebar = document.getElementById('adminSidebar');
    const mobileToggle = document.createElement('button');
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.cssText = `
        display: none; position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px;
        border-radius: 50%; background: #2C1A0E; color: white; border: none; font-size: 1.5rem;
        cursor: pointer; z-index: 500; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(mobileToggle);

    mobileToggle.addEventListener('click', () => sidebar?.classList.toggle('open'));

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && e.target !== mobileToggle) {
            sidebar.classList.remove('open');
        }
    });

    function checkMobile() {
        mobileToggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        if (window.innerWidth > 768 && sidebar) sidebar.classList.remove('open');
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);


    renderProductsTable();
    updateDashboard();
    console.log('✅ Админ-панель готова. Все разделы работают.');
});