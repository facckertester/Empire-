// ===== КОНФИГУРАЦИЯ ИГРЫ =====
const CONFIG = {
    VERSION: '2.2',
    DAY_DURATION: 350, // 5 минут в секундах на игровой день
    MAX_DAYS: 7,
    FREQ_MIN: 0.0,
    FREQ_MAX: 500.0,
    FREQ_STEP: 0.1,
    
    // Система прогресса
    DISCOVERY_POINTS: 10,
    RESPONSE_POINTS: 5,
    GOAL_POINTS: 20,
    
    // Базовые значения
    INITIAL_POWER: 100,
    POWER_DRAIN: 0.01, // в секунду (меньше, т.к. день длиннее)
    RISK_DECAY: 0.005, // в секунду
    MAX_RISK: 10
};

// ===== СОСТОЯНИЕ ИГРЫ =====
const GameState = {
    // Основные параметры
    day: 1,
    gameTime: 0,
    power: CONFIG.INITIAL_POWER,
    risk: 0,
    currentFrequency: 88.8,
    
    // Прогресс
    discoveredFrequencies: new Set(['88.8']), // Начинаем с карусели
    goalsCompleted: new Set(),
    dayPoints: 0,
    totalPoints: 0,
    responses: new Map(), // частоты → количество ответов
    
    // Данные
    logEntries: [],
    playerNotes: '',
    bookmarks: [],
    transmissionsFound: new Map(),
    
    // События
    eventsTriggered: new Set(),
    currentEvent: null,
    
    // Интерфейс
    isDragging: false,
    dragStart: { x: 0, y: 0, freq: 0 },
    
    // Сохранение
    saveSlot: 'last_broadcast_v2',
    
    // Флаги
    gameActive: true,
    lastUpdate: Date.now()
};

// ===== БАЗА ДАННЫХ =====
const DATABASE = {
    // Все частоты с передачами
    frequencies: {
        '98.5': {
            id: 'carousel',
            name: 'Карусель Прошлого',
            text: '...зацикленная мелодия детской карусели... сквозь шум детский шёпот: "Они не любят весёлые звуки..."',
            tags: ['МУЗЫКА', 'ПРОШЛОЕ', 'ПРЕДУПРЕЖДЕНИЕ'],
            risk: 1,
            discoverDay: 1,
            responses: [
                '...мелодия ускоряется... детский смех... затем тишина...',
                '...голос: "спасибо за музыку... мы помним..."',
                '...статический шум усиливается... звук разбитого стекла...'
            ]
        },
        '112.3': {
            id: 'weather',
            name: 'Автоматическая метеостанция',
            text: '...автоматический голос: "Температура: -273°C. Давление: 0 гПа. Ветер: отсутствует. Условия: АБСОЛЮТНЫЙ НУЛЬ..."',
            tags: ['ДАННЫЕ', 'АНОМАЛИЯ', 'НАУКА'],
            risk: 2,
            discoverDay: 2,
            responses: [
                '...сигнал прерывается... "ОШИБКА: ДАТЧИКИ ОТКАЗАЛИ..."',
                '...новые данные: "Температура поднимается... что-то приближается..."',
                '...последнее сообщение: "БЕГИТЕ..."'
            ]
        },
        '66.6': {
            id: 'scientist',
            name: 'Доктор Ричардс',
            text: '...если кто-то слышит... проект "Резонанс" вышел из-под контроля... мы создали "Эхо-призраков"... они питаются вниманием...',
            tags: ['УЧЁНЫЙ', 'ВИНА', 'ИСТИНА'],
            risk: 4,
            discoverDay: 3,
            responses: [
                '...спасибо за ответ... найдите лабораторию... остановите генератор...',
                '...я виноват... простите...',
                '...они идут за мной... прощайте... *выстрел*...'
            ]
        },
        '101.1': {
            id: 'children',
            name: 'Лесной Лагерь',
            text: '...шепотом: "Тихие близко... держимся за руки... помни правила: не кричи, шепчи. Не беги, крадись. Свет привлекает Их..."',
            tags: ['ДЕТИ', 'ВЫЖИВШИЕ', 'ОПАСНОСТЬ'],
            risk: 3,
            discoverDay: 4,
            responses: [
                '...спасибо... мы слышали ваши передачи... вы даёте надежду...',
                '...один из нас пропал... мы идём на север...',
                '...мы нашли убежище... спасибо... *детский смех*...'
            ]
        },
        '189.0': {
            id: 'nomad',
            name: 'Кочевник',
            text: '...приём? Это "Скиталец"... нашёл лабораторию "Резонанса"... Тихие - не существа... они стоячие звуковые волны... звуковые призраки...',
            tags: ['ВЫЖИВШИЙ', 'ИССЛЕДОВАТЕЛЬ', 'ПРАВДА'],
            risk: 5,
            discoverDay: 5,
            responses: [
                '...лаборатория взорвана... данные сохранены... иду к вам...',
                '...вижу вашу станцию... готовлюсь к штурму...',
                '...они везде... прощай, оператор...'
            ]
        },
        '0.0': {
            id: 'zero',
            name: 'Нулевая Точка',
            text: '...Ричардс здесь... протокол Кодаускас готов... усилить все частоты до максимума... создаст звуковую сферу... либо отгоним их навсегда... либо привлечём всех сюда... выбор за вами...',
            tags: ['ФИНАЛ', 'РЕШЕНИЕ', 'ОТВЕТСТВЕННОСТЬ'],
            risk: 8,
            discoverDay: 6,
            responses: [
                '...спасибо... активирую протокол...',
                '...вы сделали правильный выбор... прощайте...',
                '...сигнал усиливается... мир меняется...'
            ]
        }
    },
    
    // Цели для каждого дня (теперь без указания частот)
    dailyGoals: {
        1: [
            { id: 'day1_goal1', text: 'Найти первую аномальную частоту', type: 'frequency', target: 'any' },
            { id: 'day1_goal2', text: 'Записать обнаруженную передачу', type: 'record', target: 'any' },
            { id: 'day1_goal3', text: 'Отправить первый ответ', type: 'response', target: 'any' }
        ],
        2: [
            { id: 'day2_goal1', text: 'Найти источник аномальных данных', type: 'frequency', target: 'any_new' },
            { id: 'day2_goal2', text: 'Проанализировать найденный сигнал', type: 'analyze', target: 'any' },
            { id: 'day2_goal3', text: 'Поддерживать низкий уровень риска (< 3)', type: 'risk', target: '3' }
        ],
        3: [
            { id: 'day3_goal1', text: 'Найти следы учёных', type: 'frequency', target: 'any_new' },
            { id: 'day3_goal2', text: 'Получить ответ на свои вопросы', type: 'response', target: 'any' },
            { id: 'day3_goal3', text: 'Создать 2 закладки для важных частот', type: 'bookmarks', target: '2' }
        ],
        4: [
            { id: 'day4_goal1', text: 'Найти выживших', type: 'frequency', target: 'any_new' },
            { id: 'day4_goal2', text: 'Помочь выжившим советом', type: 'response', target: 'any' },
            { id: 'day4_goal3', text: 'Исследовать половину доступного спектра', type: 'progress', target: '50' }
        ],
        5: [
            { id: 'day5_goal1', text: 'Найти исследователя', type: 'frequency', target: 'any_new' },
            { id: 'day5_goal2', text: 'Узнать правду о катастрофе', type: 'analyze', target: 'any' },
            { id: 'day5_goal3', text: 'Получить ответы от 3 разных источников', type: 'responses_total', target: '3' }
        ],
        6: [
            { id: 'day6_goal1', text: 'Найти нулевую точку', type: 'frequency', target: 'any_new' },
            { id: 'day6_goal2', text: 'Подготовить финальное решение', type: 'event', target: 'day6_final' },
            { id: 'day6_goal3', text: 'Найти все аномальные частоты (6 штук)', type: 'all_frequencies', target: '6' }
        ]
    },
    
    // События по дням
    dailyEvents: {
        1: {
            id: 'start',
            title: 'АКТИВАЦИЯ СТАНЦИИ',
            text: 'Станция "Голос Надежды" онлайн. Все системы работают.\n\nДЕНЬ 1 ИЗ 6\n\nВаша миссия: сканировать эфир, находить выживших и понять, что произошло. Каждый день ставит новые цели. У вас есть 5 минут реального времени на каждый игровой день.\n\nВнимание: частоты не указаны - вам нужно искать их самостоятельно.',
            type: 'info'
        },
        2: {
            id: 'day2_warning',
            title: 'РАСТУЩАЯ УГРОЗА',
            text: 'Уровень риска растёт. "Тихие" становятся активнее ночью.\n\nСОВЕТ: Попробуйте сканировать диапазон 100-130 МГц. Там часто встречаются автоматические станции.',
            type: 'warning'
        },
        3: {
            id: 'day3_discovery',
            title: 'РАСКРЫТИЕ ПРАВДЫ',
            text: 'Вы нашли запись учёного. Теперь вы знаете причину катастрофы. "Тихие" - это побочный эффект эксперимента "Резонанс".\n\nСОВЕТ: Попробуйте низкие частоты (30-70 МГц). Там могут быть следы учёных.',
            type: 'info'
        },
        4: {
            id: 'day4_choice',
            title: 'МОРАЛЬНЫЙ ВЫБОР',
            text: 'Вы нашли детей. Они просят помощи. Ваш выбор определит их судьбу.\n\n1. Дать им координаты безопасного места (риск: средний)\n2. Посоветовать оставаться на месте (риск: низкий)\n3. Игнорировать (риск: высокий)',
            type: 'choice',
            options: [
                { text: 'ДАЙТЕ КООРДИНАТЫ', action: 'help_children', risk: 3, points: 15 },
                { text: 'ОСТАВАЙТЕСЬ НА МЕСТЕ', action: 'advise_stay', risk: 1, points: 10 },
                { text: 'ИГНОРИРОВАТЬ', action: 'ignore', risk: 5, points: 5 }
            ]
        },
        5: {
            id: 'day5_nomad',
            title: 'КОЧЕВНИК В ОПАСНОСТИ',
            text: 'Кочевник попал в засаду "Тихих". Его сигнал прерывается.\n\nСОВЕТ: Ищите в диапазоне 180-200 МГц. Там может быть его аварийный маяк.',
            type: 'emergency',
            options: [
                { text: 'ИСКАТЬ МАЯК', action: 'search_beacon', risk: 4, points: 20 },
                { text: 'ПРОИГНОРИРОВАТЬ', action: 'ignore_nomad', risk: 2, points: 5 }
            ]
        },
        6: {
            id: 'day6_final',
            title: 'ВСЕ ДАННЫЕ СОБРАНЫ',
            text: 'Вы нашли все частоты. Вы услышали все голоса. Пришло время принять финальное решение о будущем мира.\n\nЧто вы выберете?',
            type: 'final',
            options: [
                { 
                    text: 'АКТИВИРОВАТЬ ПРОТОКОЛ (ЖЕРТВА)', 
                    action: 'activate_protocol', 
                    description: 'Усилить сигнал станции, привлечь всех "Тихых" и уничтожить их. Вы погибнете, но мир будет спасён.' 
                },
                { 
                    text: 'ЗАГЛУШИТЬ ЧАСТОТЫ (ИЗОЛЯЦИЯ)', 
                    action: 'silence_frequencies', 
                    description: 'Отключить все передатчики. Мир останется опасным, но выжившие смогут скрываться.' 
                },
                { 
                    text: 'ПЕРЕНАПРАВИТЬ ЭНЕРГИЮ (СИМБИОЗ)', 
                    action: 'redirect_energy', 
                    description: 'Использовать данные учёного, чтобы стабилизировать "Тихих". Новый мир, новая реальность.' 
                }
            ]
        }
    }
};

// ===== DOM ЭЛЕМЕНТЫ =====
const ELEMENTS = {
    // Частота
    digit1: document.getElementById('digit1'),
    digit2: document.getElementById('digit2'),
    digit3: document.getElementById('digit3'),
    digit4: document.getElementById('digit4'),
    
    // Статус
    day: document.getElementById('day'),
    time: document.getElementById('time'),
    risk: document.getElementById('risk'),
    power: document.getElementById('power'),
    
    // Сигнал
    signalBar: document.getElementById('signal-bar'),
    signalText: document.getElementById('signal-text'),
    
    // Передача
    sourceName: document.getElementById('source-name'),
    transmissionText: document.getElementById('transmission-text'),
    transmissionTags: document.getElementById('transmission-tags'),
    transmissionRisk: document.getElementById('transmission-risk'),
    
    // Цели
    dayGoals: document.getElementById('day-goals'),
    goalsList: document.getElementById('goals-list'),
    dayProgress: document.getElementById('day-progress'),
    
    // Прогресс
    discovered: document.getElementById('discovered'),
    progressFill: document.getElementById('progress-fill'),
    progressPercent: document.getElementById('progress-percent'),
    bookmarksCount: document.getElementById('bookmarks-count'),
    
    // Журнал
    logContent: document.getElementById('log-content'),
    logCount: document.getElementById('log-count'),
    playerNotes: document.getElementById('player-notes'),
    charCount: document.getElementById('char-count'),
    
    // Закладки
    bookmarksList: document.getElementById('bookmarks-list'),
    
    // Управление
    knob: document.getElementById('knob'),
    knobValue: document.getElementById('knob-value'),
    scanUp: document.getElementById('scan-up'),
    scanDown: document.getElementById('scan-down'),
    lock: document.getElementById('lock'),
    record: document.getElementById('record'),
    analyze: document.getElementById('analyze'),
    emergency: document.getElementById('emergency'),
    bookmark: document.getElementById('bookmark'),
    respond: document.getElementById('respond'),
    decode: document.getElementById('decode'),
    
    // Слайдеры
    volume: document.getElementById('volume'),
    volumeValue: document.getElementById('volume-value'),
    filter: document.getElementById('filter'),
    filterValue: document.getElementById('filter-value'),
    
    // Модальные окна
    modal: document.getElementById('modal'),
    modalTitle: document.getElementById('modal-title'),
    modalText: document.getElementById('modal-text'),
    modalOptions: document.getElementById('modal-options'),
    modalClose: document.getElementById('modal-close'),
    
    // Финальный экран
    endingScreen: document.getElementById('ending-screen'),
    endingTitle: document.getElementById('ending-title'),
    endingText: document.getElementById('ending-text'),
    endingStats: document.getElementById('ending-stats'),
    endingRestart: document.getElementById('ending-restart'),
    endingContinue: document.getElementById('ending-continue'),
    
    // Canvas
    spectrum: document.getElementById('spectrum'),
    spectrumMode: document.getElementById('spectrum-mode')
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    console.log('Initializing Last Broadcast v2.2...');
    
    // Загрузка сохранения
    loadGame();
    
    // Настройка обработчиков
    setupEventListeners();
    
    // Инициализация canvas
    initCanvas();
    
    // Обновление интерфейса
    updateFrequencyDisplay();
    updateGameInfo();
    updateGoals();
    updateProgress();
    updateLog();
    updateBookmarks();
    
    // Запуск игрового цикла
    GameState.lastUpdate = Date.now();
    requestAnimationFrame(gameLoop);
    
    // Автосохранение
    setInterval(saveGame, 30000);
    
    // Стартовое событие
    setTimeout(() => triggerEvent('start'), 1000);
    
    console.log('Game initialized');
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function setupEventListeners() {
    // Крутилка мыши
    ELEMENTS.knob.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // Крутилка для тач-устройств
    ELEMENTS.knob.addEventListener('touchstart', startDragTouch);
    document.addEventListener('touchmove', handleDragTouch);
    document.addEventListener('touchend', stopDrag);
    
    // Кнопки сканирования
    ELEMENTS.scanUp.addEventListener('click', () => {
        setFrequency(GameState.currentFrequency + CONFIG.FREQ_STEP);
        playSound('click');
    });
    
    ELEMENTS.scanDown.addEventListener('click', () => {
        setFrequency(GameState.currentFrequency - CONFIG.FREQ_STEP);
        playSound('click');
    });
    
    ELEMENTS.lock.addEventListener('click', () => {
        const freq = GameState.currentFrequency.toFixed(1);
        const transmission = DATABASE.frequencies[freq];
        if (transmission && !GameState.bookmarks.some(b => b.frequency === freq)) {
            addBookmark(freq, transmission.name);
            addLogEntry(`Закладка добавлена: ${freq} МГц - "${transmission.name}"`);
            playSound('beep');
        }
    });
    
    // Кнопки действий
    ELEMENTS.record.addEventListener('click', () => {
        const freq = GameState.currentFrequency.toFixed(1);
        const transmission = DATABASE.frequencies[freq];
        if (transmission) {
            addLogEntry(`Записана передача: "${transmission.name}" на ${freq} МГц`);
            addPoints(CONFIG.DISCOVERY_POINTS);
            
            // Проверка цели "записать передачу"
            checkGoalCompletion('record', 'any');
            
            playSound('beep');
        }
    });
    
    ELEMENTS.analyze.addEventListener('click', () => {
        const freq = GameState.currentFrequency.toFixed(1);
        const transmission = DATABASE.frequencies[freq];
        if (transmission) {
            showAnalysis(transmission);
            
            // Проверка цели "проанализировать"
            checkGoalCompletion('analyze', 'any');
            
            playSound('click');
        }
    });
    
    ELEMENTS.emergency.addEventListener('click', () => {
        showModal('АВАРИЙНОЕ ОТКЛЮЧЕНИЕ', 
            'Все системы будут отключены на 1 час.\nРиск снизится, но вы потеряете энергию и время.\n\nПродолжить?',
            [
                { text: 'ПОДТВЕРДИТЬ', action: () => {
                    GameState.power = Math.max(0, GameState.power - 30);
                    GameState.risk = Math.max(0, GameState.risk - 5);
                    addLogEntry('Аварийное отключение активировано. Риск снижен.');
                    playSound('beep');
                }},
                { text: 'ОТМЕНА', action: () => playSound('click') }
            ]
        );
    });
    
    ELEMENTS.bookmark.addEventListener('click', () => {
        const freq = GameState.currentFrequency.toFixed(1);
        const transmission = DATABASE.frequencies[freq];
        if (transmission) {
            addBookmark(freq, transmission.name);
            playSound('beep');
        }
    });
    
    ELEMENTS.respond.addEventListener('click', () => {
        const freq = GameState.currentFrequency.toFixed(1);
        const transmission = DATABASE.frequencies[freq];
        if (transmission) {
            sendResponse(freq, transmission);
            playSound('click');
        }
    });
    
    ELEMENTS.decode.addEventListener('click', () => {
        showDecodingGame();
        playSound('click');
    });
    
    // Ползунки
    ELEMENTS.volume.addEventListener('input', () => {
        ELEMENTS.volumeValue.textContent = `${ELEMENTS.volume.value}%`;
    });
    
    ELEMENTS.filter.addEventListener('input', () => {
        ELEMENTS.filterValue.textContent = `${ELEMENTS.filter.value}%`;
    });
    
    // Заметки
    ELEMENTS.playerNotes.addEventListener('input', () => {
        GameState.playerNotes = ELEMENTS.playerNotes.value;
        ELEMENTS.charCount.textContent = `${GameState.playerNotes.length}/500`;
    });
    
    // Очистка журнала
    document.getElementById('clear-log')?.addEventListener('click', () => {
        showModal('ОЧИСТКА ЖУРНАЛА', 
            'Удалить все записи журнала?\nЭто действие нельзя отменить.',
            [
                { text: 'ОЧИСТИТЬ', action: () => {
                    GameState.logEntries = [];
                    updateLog();
                    playSound('beep');
                }},
                { text: 'ОТМЕНА', action: () => playSound('click') }
            ]
        );
    });
    
    // Сохранение заметок
    document.getElementById('save-note')?.addEventListener('click', () => {
        saveGame();
        const btn = document.getElementById('save-note');
        btn.textContent = '💾 СОХРАНЕНО';
        setTimeout(() => btn.textContent = '💾', 1000);
        playSound('beep');
    });
    
    // Модальное окно
    ELEMENTS.modalClose.addEventListener('click', () => {
        ELEMENTS.modal.style.display = 'none';
        playSound('click');
    });
    
    // Финальный экран
    ELEMENTS.endingRestart.addEventListener('click', () => {
        if (confirm('Начать новую игру? Текущий прогресс будет потерян.')) {
            resetGame();
        }
    });
    
    ELEMENTS.endingContinue.addEventListener('click', () => {
        ELEMENTS.endingScreen.style.display = 'none';
    });
    
    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
        if (!e.ctrlKey && !e.metaKey) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    setFrequency(GameState.currentFrequency + CONFIG.FREQ_STEP);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setFrequency(GameState.currentFrequency - CONFIG.FREQ_STEP);
                    break;
                case ' ':
                    e.preventDefault();
                    ELEMENTS.record.click();
                    break;
                case 'r':
                    if (e.shiftKey) {
                        e.preventDefault();
                        ELEMENTS.emergency.click();
                    }
                    break;
                case 's':
                    if (e.shiftKey) {
                        e.preventDefault();
                        saveGame();
                    }
                    break;
            }
        }
    });
    
    // Автосохранение при закрытии
    window.addEventListener('beforeunload', saveGame);
}

// ===== УПРАВЛЕНИЕ КРУТИЛКОЙ =====
function startDrag(e) {
    e.preventDefault();
    GameState.isDragging = true;
    GameState.dragStart = {
        x: e.clientX,
        y: e.clientY,
        freq: GameState.currentFrequency
    };
    document.body.style.cursor = 'grabbing';
    playSound('click');
}

function startDragTouch(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        GameState.isDragging = true;
        GameState.dragStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            freq: GameState.currentFrequency
        };
        playSound('click');
    }
}

function handleDrag(e) {
    if (!GameState.isDragging) return;
    
    const deltaX = e.clientX - GameState.dragStart.x;
    const deltaY = GameState.dragStart.y - e.clientY; // Инвертируем для интуитивности
    const delta = (deltaX + deltaY) * 0.15;
    
    setFrequency(GameState.dragStart.freq + delta);
    e.preventDefault();
}

function handleDragTouch(e) {
    if (!GameState.isDragging || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - GameState.dragStart.x;
    const deltaY = GameState.dragStart.y - e.touches[0].clientY;
    const delta = (deltaX + deltaY) * 0.25;
    
    setFrequency(GameState.dragStart.freq + delta);
    e.preventDefault();
}

function stopDrag() {
    if (GameState.isDragging) {
        GameState.isDragging = false;
        document.body.style.cursor = '';
        playSound('click');
    }
}

// ===== ОСНОВНЫЕ ФУНКЦИИ ИГРЫ =====
function setFrequency(freq) {
    // Ограничение диапазона
    freq = Math.max(CONFIG.FREQ_MIN, Math.min(CONFIG.FREQ_MAX, freq));
    freq = Math.round(freq * 10) / 10; // Округление до 0.1
    
    GameState.currentFrequency = freq;
    
    // Обновление интерфейса
    updateFrequencyDisplay();
    
    // Увеличение риска при активном сканировании
    GameState.risk = Math.min(CONFIG.MAX_RISK, GameState.risk + 0.01);
    
    // Проверка обнаружения частоты
    checkFrequencyDiscovery();
    
    return freq;
}

function checkFrequencyDiscovery() {
    const freq = GameState.currentFrequency.toFixed(1);
    const transmission = DATABASE.frequencies[freq];
    
    if (transmission && !GameState.discoveredFrequencies.has(freq)) {
        // Обнаружена новая частота
        GameState.discoveredFrequencies.add(freq);
        GameState.transmissionsFound.set(freq, {
            time: Date.now(),
            day: GameState.day,
            responses: 0
        });
        
        // Добавление очков
        addPoints(CONFIG.DISCOVERY_POINTS);
        
        // Обновление интерфейса
        updateProgress();
        
        // Звук обнаружения
        playSound('discovery');
        
        // Запись в журнал (БЕЗ указания частоты!)
        addLogEntry(`Обнаружена новая передача: "${transmission.name}"`);
        
        // Проверка цели "найти частоту"
        checkGoalCompletion('frequency', 'any');
        
        // Проверка цели "найти новую частоту"
        if (GameState.day > 1) {
            checkGoalCompletion('frequency', 'any_new');
        }
        
        // Проверка если нашли все частоты
        if (GameState.discoveredFrequencies.size >= 6) {
            checkGoalCompletion('all_frequencies', '6');
        }
        
        updateTransmissionInfo();
        
        return true;
    }
    
    return false;
}
function sendResponse(freq, transmission) {
    if (!transmission || !transmission.responses) {
        return false;
    }
    
    // Получаем текущее количество ответов для этой частоты
    let responseCount = GameState.responses.get(freq) || 0;
    
    // Проверяем, есть ли еще доступные ответы
    if (responseCount < 3 && transmission.responses[responseCount]) {
        // Увеличение счетчика ответов
        responseCount++;
        GameState.responses.set(freq, responseCount);
        
        // Добавление очков
        addPoints(CONFIG.RESPONSE_POINTS);
        
        // Увеличение риска
        GameState.risk = Math.min(CONFIG.MAX_RISK, GameState.risk + transmission.risk * 0.5);
        
        // Запись в журнал
        addLogEntry(`Получен ответ от "${transmission.name}": ${transmission.responses[responseCount - 1]}`);
        
        // Показываем ответ в интерфейсе
        ELEMENTS.transmissionText.textContent = transmission.responses[responseCount - 1];
        
        // Обновление интерфейса
        updateProgress();
        updateTransmissionInfo(); // Важно: обновляем интерфейс частоты
        
        // Проверка целей
        checkGoalCompletion('response', 'any');
        
        // Проверка общего количества ответов
        const totalResponses = Array.from(GameState.responses.values()).reduce((a, b) => a + b, 0);
        if (totalResponses >= 3) {
            checkGoalCompletion('responses_total', '3');
        }
        
        // Звук
        playSound('response');
        
        return true;
    }
    
    return false;
}

function addPoints(points) {
    GameState.dayPoints += points;
    GameState.totalPoints += points;
    updateGoals();
}

function checkGoalCompletion(type, target) {
    const day = GameState.day;
    const goals = DATABASE.dailyGoals[day] || [];
    
    goals.forEach(goal => {
        if (!GameState.goalsCompleted.has(goal.id) && goal.type === type) {
            let completed = false;
            
            switch(type) {
                case 'frequency':
                    if (target === 'any') {
                        // Любая частота
                        completed = GameState.discoveredFrequencies.size > 0;
                    } else if (target === 'any_new') {
                        // Новая частота в текущем дне
                        const frequenciesForDay = Array.from(GameState.discoveredFrequencies).filter(freq => {
                            const transmission = DATABASE.frequencies[freq];
                            return transmission && transmission.discoverDay === day;
                        });
                        completed = frequenciesForDay.length > 0;
                    }
                    break;
                    
                case 'record':
                    completed = true; // Если игрок нажал кнопку записи
                    break;
                    
                case 'response':
                    if (target === 'any') {
                        completed = GameState.responses.size > 0;
                    }
                    break;
                    
                case 'analyze':
                    completed = true; // Если игрок нажал кнопку анализа
                    break;
                    
                case 'risk':
                    completed = GameState.risk <= parseFloat(target);
                    break;
                    
                case 'bookmarks':
                    completed = GameState.bookmarks.length >= parseInt(target);
                    break;
                    
                case 'progress':
                    const progress = (GameState.discoveredFrequencies.size / 6) * 100;
                    completed = progress >= parseFloat(target);
                    break;
                    
                case 'responses_total':
                    const total = Array.from(GameState.responses.values()).reduce((a, b) => a + b, 0);
                    completed = total >= parseInt(target);
                    break;
                    
                case 'all_frequencies':
                    completed = GameState.discoveredFrequencies.size >= parseInt(target);
                    break;
                    
                case 'event':
                    completed = GameState.eventsTriggered.has(target);
                    break;
            }
            
            if (completed) {
                GameState.goalsCompleted.add(goal.id);
                addPoints(CONFIG.GOAL_POINTS);
                addLogEntry(`Цель выполнена: ${goal.text}`);
                playSound('goal');
                updateGoals();
            }
        }
    });
}

function triggerEvent(eventId) {
    if (GameState.eventsTriggered.has(eventId)) return;
    
    const event = DATABASE.dailyEvents[GameState.day];
    if (!event || event.id !== eventId) return;
    
    GameState.eventsTriggered.add(eventId);
    GameState.currentEvent = event;
    
    showEventModal(event);
    
    // Проверка цели на событие
    if (eventId === 'day6_final') {
        checkGoalCompletion('event', 'day6_final');
    }
    
    return event;
}

// ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
function updateFrequencyDisplay() {
    const freq = GameState.currentFrequency.toFixed(1);
    
    // Разделяем частоту на цифры
    const [whole, decimal] = freq.split('.');
    
    // Обрабатываем целую часть
    let wholeDigits;
    if (whole.length === 1) {
        wholeDigits = '00' + whole; // Например, 0 → 000
    } else if (whole.length === 2) {
        wholeDigits = '0' + whole; // Например, 98 → 098
    } else {
        wholeDigits = whole; // Например, 189 → 189
    }
    
    // Обновление цифр
    ELEMENTS.digit1.textContent = wholeDigits[0];
    ELEMENTS.digit2.textContent = wholeDigits[1];
    ELEMENTS.digit3.textContent = wholeDigits[2];
    ELEMENTS.digit4.textContent = decimal || '0';
    
    // Обновление крутилки
    const rotation = ((GameState.currentFrequency - CONFIG.FREQ_MIN) / 
                     (CONFIG.FREQ_MAX - CONFIG.FREQ_MIN)) * 360;
    ELEMENTS.knob.style.transform = `rotate(${rotation}deg)`;
    ELEMENTS.knobValue.textContent = `↻ ${Math.round(rotation)}°`;
    
    // Обновление информации о передаче
    updateTransmissionInfo();
}

function updateTransmissionInfo() {
    const freq = GameState.currentFrequency.toFixed(1);
    const transmission = DATABASE.frequencies[freq];
    
    if (transmission) {
        // Есть передача
        ELEMENTS.sourceName.textContent = transmission.name;
        
        // Определяем какой текст показывать (базовый или ответ)
        let textToShow = transmission.text;
        const responseCount = GameState.responses.get(freq) || 0;
        
        if (responseCount > 0 && transmission.responses) {
            // Показываем последний полученный ответ
            textToShow = transmission.responses[responseCount - 1];
        }
        
        ELEMENTS.transmissionText.textContent = textToShow;
        ELEMENTS.transmissionRisk.textContent = getRiskText(transmission.risk);
        ELEMENTS.transmissionRisk.style.color = getRiskColor(transmission.risk);
        
        // Обновление тегов
        ELEMENTS.transmissionTags.innerHTML = '';
        transmission.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag;
            ELEMENTS.transmissionTags.appendChild(tagEl);
        });
        
        // Сигнал сильный
        const strength = 70 + transmission.risk * 3;
        ELEMENTS.signalBar.style.width = `${strength}%`;
        ELEMENTS.signalText.textContent = getSignalText(strength);
        ELEMENTS.signalText.style.color = getSignalColor(strength);
        
        // Включение кнопок
        ELEMENTS.record.disabled = false;
        ELEMENTS.analyze.disabled = false;
        ELEMENTS.bookmark.disabled = GameState.bookmarks.some(b => b.frequency === freq);
        
        // Кнопка ответа - показываем правильный счетчик
        ELEMENTS.respond.disabled = responseCount >= 3;
        ELEMENTS.respond.innerHTML = `<span class="btn-icon">📤</span><span>ОТВЕТ (${responseCount}/3)</span>`;
        
        ELEMENTS.decode.disabled = false;
    } else {
        // Нет передачи
        ELEMENTS.sourceName.textContent = '—';
        ELEMENTS.transmissionText.textContent = getNoiseText();
        ELEMENTS.transmissionRisk.textContent = 'БЕЗОП.';
        ELEMENTS.transmissionRisk.style.color = '#4aff9a';
        
        // Теги помех
        ELEMENTS.transmissionTags.innerHTML = '<span class="tag">ПОМЕХИ</span><span class="tag">ФОН</span>';
        
        // Слабый сигнал
        const strength = Math.random() * 30;
        ELEMENTS.signalBar.style.width = `${strength}%`;
        ELEMENTS.signalText.textContent = 'ПОИСК...';
        ELEMENTS.signalText.style.color = '#ff9a4a';
        
        // Отключение кнопок
        ELEMENTS.record.disabled = true;
        ELEMENTS.analyze.disabled = true;
        ELEMENTS.bookmark.disabled = true;
        ELEMENTS.respond.disabled = true;
        ELEMENTS.decode.disabled = true;
    }
}

function updateGameInfo() {
    // День и время
    ELEMENTS.day.textContent = GameState.day;
    
    const timeLeft = CONFIG.DAY_DURATION - GameState.gameTime;
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = Math.floor(timeLeft % 60);
    ELEMENTS.time.textContent = `${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    
    // Риск
    ELEMENTS.risk.textContent = GameState.risk.toFixed(1);
    ELEMENTS.risk.style.color = getRiskColor(GameState.risk);
    
    // Энергия
    ELEMENTS.power.textContent = `${Math.round(GameState.power)}%`;
    ELEMENTS.power.style.color = GameState.power > 30 ? '#4aff9a' : 
                                 GameState.power > 10 ? '#ff9a4a' : '#ff4a6a';
}

function updateGoals() {
    const day = GameState.day;
    const goals = DATABASE.dailyGoals[day] || [];
    
    ELEMENTS.goalsList.innerHTML = '';
    
    let completedCount = 0;
    
    goals.forEach(goal => {
        const isCompleted = GameState.goalsCompleted.has(goal.id);
        
        const goalEl = document.createElement('div');
        goalEl.className = `goal-item ${isCompleted ? 'completed' : ''}`;
        goalEl.textContent = goal.text;
        
        ELEMENTS.goalsList.appendChild(goalEl);
        
        if (isCompleted) completedCount++;
    });
    
    ELEMENTS.dayGoals.textContent = `${completedCount}/${goals.length}`;
    
    // Прогресс дня
    const dayProgress = (completedCount / Math.max(1, goals.length)) * 100;
    ELEMENTS.dayProgress.style.width = `${dayProgress}%`;
}

function updateProgress() {
    // Найдено частот
    const discoveredCount = GameState.discoveredFrequencies.size;
    ELEMENTS.discovered.textContent = discoveredCount;
    
    // Общий прогресс
    const totalProgress = (discoveredCount / 6) * 100;
    ELEMENTS.progressFill.style.width = `${totalProgress}%`;
    ELEMENTS.progressPercent.textContent = `${Math.round(totalProgress)}%`;
    
    // Закладки
    ELEMENTS.bookmarksCount.textContent = GameState.bookmarks.length;
}

function updateLog() {
    ELEMENTS.logContent.innerHTML = '';
    
    GameState.logEntries.forEach(entry => {
        const entryEl = document.createElement('div');
        entryEl.className = 'log-entry';
        entryEl.innerHTML = `
            <div class="log-meta">${entry.time}</div>
            <div class="log-text">${entry.text}</div>
        `;
        ELEMENTS.logContent.appendChild(entryEl);
    });
    
    ELEMENTS.logCount.textContent = `[${GameState.logEntries.length}]`;
    
    // Прокрутка вниз
    ELEMENTS.logContent.scrollTop = ELEMENTS.logContent.scrollHeight;
}

function updateBookmarks() {
    ELEMENTS.bookmarksList.innerHTML = '';
    
    if (GameState.bookmarks.length === 0) {
        ELEMENTS.bookmarksList.innerHTML = '<div class="empty-bookmarks">Нет закладок</div>';
        return;
    }
    
    GameState.bookmarks.forEach(bookmark => {
        const bookmarkEl = document.createElement('div');
        bookmarkEl.className = 'bookmark-item';
        bookmarkEl.innerHTML = `
            <span class="bookmark-frequency">${bookmark.frequency} МГц</span>
            <span class="bookmark-name">${bookmark.name}</span>
        `;
        
        bookmarkEl.addEventListener('click', () => {
            setFrequency(parseFloat(bookmark.frequency));
            playSound('click');
        });
        
        ELEMENTS.bookmarksList.appendChild(bookmarkEl);
    });
}

function addLogEntry(text) {
    const now = new Date();
    const time = `ДЕНЬ ${GameState.day} | ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    GameState.logEntries.push({
        time,
        text
    });
    
    // Ограничение количества записей
    if (GameState.logEntries.length > 50) {
        GameState.logEntries = GameState.logEntries.slice(-50);
    }
    
    updateLog();
}

function addBookmark(frequency, name) {
    if (GameState.bookmarks.some(b => b.frequency === frequency)) {
        return false;
    }
    
    GameState.bookmarks.push({
        frequency,
        name,
        time: Date.now()
    });
    
    updateBookmarks();
    
    // Проверка цели на закладки
    if (GameState.bookmarks.length >= 2) {
        checkGoalCompletion('bookmarks', '2');
    }
    
    return true;
}

// ===== МОДАЛЬНЫЕ ОКНА И СОБЫТИЯ =====
function showModal(title, text, options = []) {
    ELEMENTS.modalTitle.textContent = title;
    ELEMENTS.modalText.textContent = text;
    ELEMENTS.modalOptions.innerHTML = '';
    
    if (options.length > 0) {
        options.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.className = 'modal-option';
            optionEl.textContent = option.text;
            optionEl.addEventListener('click', () => {
                if (option.action) option.action();
                ELEMENTS.modal.style.display = 'none';
                playSound('click');
            });
            ELEMENTS.modalOptions.appendChild(optionEl);
        });
    }
    
    ELEMENTS.modal.style.display = 'flex';
}

function showEventModal(event) {
    if (event.type === 'choice' || event.type === 'emergency' || event.type === 'final') {
        showModal(event.title, event.text, event.options.map(option => ({
            text: option.text,
            action: () => handleEventChoice(option)
        })));
    } else {
        showModal(event.title, event.text);
    }
}

function handleEventChoice(option) {
    if (option.action === 'help_children') {
        GameState.risk += 3;
        addPoints(15);
        addLogEntry('Вы отправили детям координаты безопасного места. Риск увеличен.');
    } else if (option.action === 'advise_stay') {
        GameState.risk += 1;
        addPoints(10);
        addLogEntry('Вы посоветовали детям оставаться на месте.');
    } else if (option.action === 'ignore') {
        GameState.risk += 5;
        addPoints(5);
        addLogEntry('Вы проигнорировали просьбу детей. Риск значительно увеличен.');
    } else if (option.action === 'search_beacon') {
        GameState.risk += 4;
        addPoints(20);
        addLogEntry('Вы нашли аварийный маяк Кочевника и спасли его.');
    } else if (option.action === 'ignore_nomad') {
        GameState.risk += 2;
        addPoints(5);
        addLogEntry('Вы проигнорировали сигнал бедствия Кочевника.');
    } else if (option.action.startsWith('activate_') || option.action.startsWith('silence_') || option.action.startsWith('redirect_')) {
        showEnding(option);
    }
    
    // Проверка целей после события
    checkGoalsAfterEvent();
}

function checkGoalsAfterEvent() {
    const day = GameState.day;
    const goals = DATABASE.dailyGoals[day] || [];
    
    goals.forEach(goal => {
        if (!GameState.goalsCompleted.has(goal.id)) {
            checkGoalCompletion(goal.type, goal.target);
        }
    });
}

function showAnalysis(transmission) {
    const analysis = `
Анализ передачи "${transmission.name}":
• Уровень риска: ${transmission.risk}/10
• Теги: ${transmission.tags.join(', ')}
• Рекомендации: ${getRecommendations(transmission.risk)}
`;
    
    showModal('АНАЛИЗ СИГНАЛА', analysis);
}

function showDecodingGame() {
    const codes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    
    showModal('ДЕКОДИРОВАНИЕ', 
        `Расшифруйте скрытый код:\n\n[ ${code.split('').join(' ')} ]\n\nВведите код:`,
        [
            { 
                text: 'ПРОВЕРИТЬ ALPHA', 
                action: () => checkDecoding('ALPHA', code) 
            },
            { 
                text: 'ПРОВЕРИТЬ BETA', 
                action: () => checkDecoding('BETA', code) 
            },
            { 
                text: 'ПРОВЕРИТЬ GAMMA', 
                action: () => checkDecoding('GAMMA', code) 
            }
        ]
    );
}

function checkDecoding(guess, actual) {
    if (guess === actual) {
        addPoints(25);
        addLogEntry('Код успешно расшифрован! Получены дополнительные данные.');
        showModal('УСПЕХ', 'Код расшифрован! Получены ценные данные.');
    } else {
        GameState.risk += 2;
        addLogEntry('Неверная расшифровка кода. Риск увеличен.');
        showModal('ОШИБКА', 'Неверный код. Сигнал потерян.');
    }
}

function showEnding(option) {
    const endings = {
        'activate_protocol': {
            title: 'КОНЦОВКА: ПОСЛЕДНЯЯ ПЕСНЯ',
            text: 'Вы активировали Протокол Кодаускас. Станция "Голос Надежды" взорвалась в оглушительном грохоте, привлекая всех "Тихих" к себе. Ваша жертва очистила эфир. Где-то далеко дети выходят из укрытий. Мир начинает новую жизнь.'
        },
        'silence_frequencies': {
            title: 'КОНЦОВКА: ТИХИЙ УЛЕЙ',
            text: 'Вы заглушили все частоты и ушли в глубокое подполье. "Тихие" успокоились. Мир замер в хрупком равновесии. Иногда в эфире проскальзывает слабый сигнал — кто-то ещё жив. Выжившие научились существовать в тишине.'
        },
        'redirect_energy': {
            title: 'КОНЦОВКА: НОВАЯ СИМФОНИЯ',
            text: 'Вы перенаправили энергию, используя данные учёного. "Тихие" обрели стабильную форму — прекрасные, молчаливые сияющие фигуры. Человечество учится сосуществовать с новыми формами жизни. Радио стало инструментом искусства, а не выживания. Новый мир рождается.'
        }
    };
    
    const ending = endings[option.action] || {
        title: 'КОНЦОВКА: НЕИЗВЕСТНОСТЬ',
        text: 'Ваш выбор сделан. Последствия будут.'
    };
    
    ELEMENTS.endingTitle.textContent = ending.title;
    ELEMENTS.endingText.textContent = ending.text;
    
    // Статистика
    const statsHTML = `
        <h3>СТАТИСТИКА ИГРЫ</h3>
        <div class="ending-stats-grid">
            <div class="stat-item">
                <span class="stat-label">Дней прожито:</span>
                <span class="stat-value">${GameState.day}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Частот найдено:</span>
                <span class="stat-value">${GameState.discoveredFrequencies.size}/6</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Ответов получено:</span>
                <span class="stat-value">${Array.from(GameState.responses.values()).reduce((a, b) => a + b, 0)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Очков заработано:</span>
                <span class="stat-value">${GameState.totalPoints}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Целей выполнено:</span>
                <span class="stat-value">${GameState.goalsCompleted.size}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Макс. риск:</span>
                <span class="stat-value">${GameState.risk.toFixed(1)}</span>
            </div>
        </div>
    `;
    
    ELEMENTS.endingStats.innerHTML = statsHTML;
    ELEMENTS.endingScreen.style.display = 'flex';
    
    // Остановка игры
    GameState.gameActive = false;
}

// ===== ИГРОВОЙ ЦИКЛ =====
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - GameState.lastUpdate) / 1000;
    GameState.lastUpdate = now;
    
    // Обновление времени
    GameState.gameTime += deltaTime;
    
    // Обновление ресурсов
    updateResources(deltaTime);
    
    // Проверка смены дня
    checkDayProgress();
    
    // Проверка событий
    checkEvents();
    
    // Обновление интерфейса
    updateGameInfo();
    updateSpectrum();
    
    // Проверка условий поражения
    if (GameState.power <= 0) {
        gameOver('power');
        return;
    }
    
    if (GameState.risk >= CONFIG.MAX_RISK) {
        gameOver('risk');
        return;
    }
    
    // Следующий кадр
    if (GameState.gameActive !== false) {
        requestAnimationFrame(gameLoop);
    }
}

function updateResources(deltaTime) {
    // Расход энергии
    GameState.power = Math.max(0, GameState.power - CONFIG.POWER_DRAIN * deltaTime);
    
    // Снижение риска со временем
    if (GameState.risk > 0) {
        GameState.risk = Math.max(0, GameState.risk - CONFIG.RISK_DECAY * deltaTime);
        
        // Проверка цели на риск
        if (GameState.risk <= 3) {
            checkGoalCompletion('risk', '3');
        }
    }
}

function checkDayProgress() {
    if (GameState.gameTime >= CONFIG.DAY_DURATION) {
        // Смена дня
        GameState.day++;
        GameState.gameTime = 0;
        GameState.dayPoints = 0;
        
        // Увеличение риска с каждым днём
        GameState.risk += 0.5;
        
        // Запись в журнал
        addLogEntry(`Начинается день ${GameState.day}. Риск увеличивается.`);
        
        // Обновление целей
        updateGoals();
        
        // Проверка финального дня
        if (GameState.day > CONFIG.MAX_DAYS) {
            gameOver('time');
            return;
        }
        
        // Событие нового дня
        const event = DATABASE.dailyEvents[GameState.day];
        if (event && !GameState.eventsTriggered.has(event.id)) {
            setTimeout(() => triggerEvent(event.id), 1000);
        }
    }
}

function checkEvents() {
    // Автоматические события по дням
    if (GameState.day > 0) {
        const event = DATABASE.dailyEvents[GameState.day];
        if (event && !GameState.eventsTriggered.has(event.id)) {
            triggerEvent(event.id);
        }
    }
    
    // События по прогрессу
    if (GameState.discoveredFrequencies.size >= 6 && !GameState.eventsTriggered.has('all_frequencies')) {
        GameState.eventsTriggered.add('all_frequencies');
        showModal('ВСЕ ЧАСТОТЫ НАЙДЕНЫ', 
            'Вы обнаружили все 6 аномальных частот!\n\nТеперь у вас есть полная картина происходящего. Приготовьтесь к финальному решению.'
        );
    }
}

function gameOver(reason) {
    const reasons = {
        power: {
            title: 'ЭНЕРГИЯ ИСЧЕРПАНА',
            text: 'Станция отключилась. В темноте вы слышите, как "Тихие" приближаются к двери...'
        },
        risk: {
            title: 'ПРЕДЕЛЬНЫЙ РИСК',
            text: 'Вы привлекли слишком много внимания. "Тихие" нашли вас. Последнее, что вы слышите — абсолютная тишина...'
        },
        time: {
            title: 'ВРЕМЯ ВЫШЛО',
            text: 'Семь дней прошло. Вы не успели принять решение. Мир остался в подвешенном состоянии...'
        }
    };
    
    const gameOverData = reasons[reason] || {
        title: 'КАТАСТРОФА',
        text: 'Игра окончена.'
    };
    
    showModal(gameOverData.title, gameOverData.text, [
        {
            text: 'НОВАЯ ИГРА',
            action: resetGame
        }
    ]);
    
    GameState.gameActive = false;
}

function resetGame() {
    if (confirm('Начать новую игру? Текущий прогресс будет потерян.')) {
        // Сброс состояния
        Object.keys(GameState).forEach(key => {
            if (typeof GameState[key] === 'object' && GameState[key] !== null) {
                if (GameState[key] instanceof Set) {
                    GameState[key] = new Set(['88.8']);
                } else if (GameState[key] instanceof Map) {
                    GameState[key] = new Map();
                } else if (Array.isArray(GameState[key])) {
                    GameState[key] = [];
                }
            }
        });
        
        // Сброс базовых значений
        GameState.day = 1;
        GameState.gameTime = 0;
        GameState.power = CONFIG.INITIAL_POWER;
        GameState.risk = 0;
        GameState.currentFrequency = 88.8;
        GameState.gameActive = true;
        GameState.discoveredFrequencies = new Set(['88.8']);
        
        // Сброс интерфейса
        ELEMENTS.playerNotes.value = '';
        ELEMENTS.volume.value = 50;
        ELEMENTS.volumeValue.textContent = '50%';
        ELEMENTS.filter.value = 0;
        ELEMENTS.filterValue.textContent = '0%';
        
        // Обновление интерфейса
        updateFrequencyDisplay();
        updateGameInfo();
        updateGoals();
        updateProgress();
        updateLog();
        updateBookmarks();
        
        // Начальная запись
        addLogEntry('Станция "Голос Надежды" активирована. Начинаю сканирование эфира.');
        
        // Начальное событие
        setTimeout(() => triggerEvent('start'), 500);
        
        // Скрытие модальных окон
        ELEMENTS.modal.style.display = 'none';
        ELEMENTS.endingScreen.style.display = 'none';
        
        // Запуск игрового цикла
        GameState.lastUpdate = Date.now();
        requestAnimationFrame(gameLoop);
    }
}

// ===== CANVAS И АУДИО =====
function initCanvas() {
    const ctx = ELEMENTS.spectrum.getContext('2d');
    ELEMENTS.spectrum.width = ELEMENTS.spectrum.clientWidth;
    ELEMENTS.spectrum.height = ELEMENTS.spectrum.clientHeight;
    
    GameState.spectrumCtx = ctx;
    GameState.spectrumData = new Array(100).fill(0);
}

function updateSpectrum() {
    if (!GameState.spectrumCtx) return;
    
    const ctx = GameState.spectrumCtx;
    const width = ELEMENTS.spectrum.width;
    const height = ELEMENTS.spectrum.height;
    
    // Очистка
    ctx.clearRect(0, 0, width, height);
    
    // Обновление данных
    const freq = GameState.currentFrequency.toFixed(1);
    const transmission = DATABASE.frequencies[freq];
    const hasSignal = transmission ? 0.7 : 0.3;
    
    GameState.spectrumData.shift();
    GameState.spectrumData.push(
        (Math.random() * 0.4 + 0.3) * hasSignal
    );
    
    // Рисование
    const barWidth = width / GameState.spectrumData.length;
    const color = transmission ? '#4aff9a' : '#4a9fff';
    
    ctx.fillStyle = color + '40';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    
    for (let i = 0; i < GameState.spectrumData.length; i++) {
        const x = i * barWidth;
        const value = GameState.spectrumData[i];
        const barHeight = value * height * 0.8;
        const y = height - barHeight;
        
        // Заполнение
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        
        // Линия
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

function playSound(type) {
    // Простая имитация звуков
    try {
        if (window.AudioContext) {
            const audioContext = new AudioContext();
            
            let frequency = 440;
            let duration = 0.1;
            
            switch(type) {
                case 'click':
                    frequency = 800;
                    duration = 0.05;
                    break;
                case 'beep':
                    frequency = 1200;
                    duration = 0.15;
                    break;
                case 'discovery':
                    frequency = 1500;
                    duration = 0.3;
                    break;
                case 'response':
                    frequency = 1000;
                    duration = 0.2;
                    break;
                case 'goal':
                    frequency = 2000;
                    duration = 0.25;
                    break;
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        }
    } catch (error) {
        // Игнорируем ошибки аудио
    }
}

// ===== СОХРАНЕНИЕ И ЗАГРУЗКА =====
function saveGame() {
    try {
        const saveData = {
            version: CONFIG.VERSION,
            day: GameState.day,
            gameTime: GameState.gameTime,
            power: GameState.power,
            risk: GameState.risk,
            currentFrequency: GameState.currentFrequency,
            discoveredFrequencies: Array.from(GameState.discoveredFrequencies),
            goalsCompleted: Array.from(GameState.goalsCompleted),
            dayPoints: GameState.dayPoints,
            totalPoints: GameState.totalPoints,
            responses: Array.from(GameState.responses.entries()),
            logEntries: GameState.logEntries,
            playerNotes: GameState.playerNotes,
            bookmarks: GameState.bookmarks,
            eventsTriggered: Array.from(GameState.eventsTriggered),
            lastSave: Date.now()
        };
        
        localStorage.setItem(GameState.saveSlot, JSON.stringify(saveData));
        console.log('Game saved');
        return true;
    } catch (error) {
        console.error('Save failed:', error);
        return false;
    }
}

function loadGame() {
    try {
        const saveData = JSON.parse(localStorage.getItem(GameState.saveSlot));
        
        if (!saveData || saveData.version !== CONFIG.VERSION) {
            console.log('No save found, starting new game');
            
            // Начальная запись
            addLogEntry('Станция "Голос Надежды" активирована. Начинаю сканирование эфира.');
            
            // Обнаружение начальной частоты
            GameState.discoveredFrequencies = new Set(['88.8']);
            
            return false;
        }
        
        // Загрузка состояния
        GameState.day = saveData.day || 1;
        GameState.gameTime = saveData.gameTime || 0;
        GameState.power = saveData.power || CONFIG.INITIAL_POWER;
        GameState.risk = saveData.risk || 0;
        GameState.currentFrequency = saveData.currentFrequency || 88.8;
        GameState.discoveredFrequencies = new Set(saveData.discoveredFrequencies || ['88.8']);
        GameState.goalsCompleted = new Set(saveData.goalsCompleted || []);
        GameState.dayPoints = saveData.dayPoints || 0;
        GameState.totalPoints = saveData.totalPoints || 0;
        GameState.responses = new Map(saveData.responses || []);
        GameState.logEntries = saveData.logEntries || [];
        GameState.playerNotes = saveData.playerNotes || '';
        GameState.bookmarks = saveData.bookmarks || [];
        GameState.eventsTriggered = new Set(saveData.eventsTriggered || []);
        GameState.gameActive = true;
        
        // Обновление интерфейса
        ELEMENTS.playerNotes.value = GameState.playerNotes;
        ELEMENTS.charCount.textContent = `${GameState.playerNotes.length}/500`;
        
        console.log('Game loaded');
        return true;
    } catch (error) {
        console.error('Load failed:', error);
        return false;
    }
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getRiskText(risk) {
    if (risk <= 2) return 'БЕЗОП.';
    if (risk <= 4) return 'НИЗКИЙ';
    if (risk <= 6) return 'СРЕДНИЙ';
    if (risk <= 8) return 'ВЫСОКИЙ';
    return 'КРИТИЧ.';
}

function getRiskColor(risk) {
    if (risk <= 2) return '#4aff9a';
    if (risk <= 4) return '#4a9fff';
    if (risk <= 6) return '#ff9a4a';
    if (risk <= 8) return '#ff4a6a';
    return '#ff0000';
}

function getSignalText(strength) {
    if (strength < 20) return 'НЕТ СИГНАЛА';
    if (strength < 40) return 'СЛАБЫЙ';
    if (strength < 60) return 'СРЕДНИЙ';
    if (strength < 80) return 'ХОРОШИЙ';
    return 'ОТЛИЧНЫЙ';
}

function getSignalColor(strength) {
    if (strength < 20) return '#ff4a6a';
    if (strength < 40) return '#ff9a4a';
    if (strength < 60) return '#ffd700';
    if (strength < 80) return '#4a9fff';
    return '#4aff9a';
}

function getNoiseText() {
    const texts = [
        '...статический шум... слабые помехи...',
        '...фоновый гул низких частот... мерцающие импульсы...',
        '...космический шум... атмосферные аномалии...',
        '...белый шум... случайные всплески...'
    ];
    return texts[Math.floor(Math.random() * texts.length)];
}

function getRecommendations(risk) {
    if (risk <= 3) return 'Безопасно для прослушивания';
    if (risk <= 6) return 'Рекомендуется снизить громкость';
    if (risk <= 8) return 'Опасно. Возможна активность "Тихих"';
    return 'Критически опасно. Немедленно прекратите прослушивание';
}

// ===== ЗАПУСК ИГРЫ =====
// Запуск при полной загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для гарантии загрузки всех элементов
    setTimeout(() => {
        init();
        console.log('Last Broadcast v2.2 запущена!');
    }, 100);
});