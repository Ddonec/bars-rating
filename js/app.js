const app = document.getElementById('app');

const fields = ['Очередь', 'Атмосфера', 'Качество', 'Кухня', 'Вайб'];

function renderHome() {
    app.innerHTML = `
        <h1>Рейтинг баров России</h1>
        <button onclick="showBars()">Показать подходящий бар</button>
        <button onclick="showRatingForm()">Оценить бар</button>
        <button onclick="editPreferences()">Изменить предпочтения</button>
    `;
}

function showBars() {
    const preferences = JSON.parse(localStorage.getItem('preferences')) || {};

    const bars = [
        { name: 'Бар 1' },
        { name: 'Бар 2' },
        { name: 'Бар 3' }
    ];

    // Генерация случайных (или с учетом предпочтений) рейтингов
    bars.forEach(bar => {
        bar.ratings = {};
        fields.forEach(field => {
            let base = Math.floor(Math.random() * 10) + 1;
            if (preferences[field]) {
                // немного смещаем случайное число в сторону предпочтений
                const pref = parseInt(preferences[field]);
                base = Math.round((base + pref) / 2);
                if (base > 10) base = 10;
                if (base < 1) base = 1;
            }
            bar.ratings[field] = base;
        });
    });

    let barsHTML = `<h2>Подходящие бары</h2><div class="bars-container">`;

    bars.forEach(bar => {
        barsHTML += `
            <div class="bar-card">
                <h3>${bar.name}</h3>
                <ul>
                    ${fields.map(field => `<li>${field}: ${bar.ratings[field]}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    barsHTML += `<button class="back-btn" onclick="renderHome()">Назад</button>`;

    app.innerHTML = barsHTML;
}

function showRatingForm() {
    let formHTML = `<h2>Оцените бар</h2><form id="ratingForm">`;

    fields.forEach(field => {
        formHTML += `<p>${field}:</p><div class="radio-group">`;
        for (let i = 1; i <= 10; i++) {
            const id = `${field}_${i}`;
            formHTML += `
                <input type="radio" name="${field}" value="${i}" id="${id}">
                <label for="${id}">${i}</label>
            `;
        }
        formHTML += `</div>`;
    });

    formHTML += `
        <button type="submit">Отправить</button>
        <button type="button" class="back-btn" onclick="renderHome()">Назад</button>
    </form>`;

    app.innerHTML = formHTML;

    document.getElementById('ratingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {};
        fields.forEach(field => {
            const selected = document.querySelector(`input[name="${field}"]:checked`);
            data[field] = selected ? selected.value : null;
        });
        alert('Спасибо за оценку! ' + JSON.stringify(data));
        renderHome();
    });
}

function showPreferencesForm() {
    let formHTML = `<h2>Ваши предпочтения</h2><form id="prefsForm">`;

    fields.forEach(field => {
        formHTML += `<p>${field}:</p><div class="radio-group">`;
        for (let i = 1; i <= 10; i++) {
            const id = `pref_${field}_${i}`;
            formHTML += `
                <input type="radio" name="${field}" value="${i}" id="${id}">
                <label for="${id}">${i}</label>
            `;
        }
        formHTML += `</div>`;
    });

    formHTML += `
        <button type="submit">Сохранить</button>
    </form>`;

    app.innerHTML = formHTML;

    document.getElementById('prefsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const prefs = {};
        fields.forEach(field => {
            const selected = document.querySelector(`input[name="${field}"]:checked`);
            prefs[field] = selected ? selected.value : null;
        });
        localStorage.setItem('preferences', JSON.stringify(prefs));
        alert('Предпочтения сохранены!');
        renderHome();
    });
}

function editPreferences() {
    showPreferencesForm();
}

// при загрузке:
window.addEventListener('load', () => {
    const prefs = localStorage.getItem('preferences');
    if (!prefs) {
        showPreferencesForm();
    } else {
        renderHome();
    }
});
