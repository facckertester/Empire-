// Система локализации
let currentLanguage = 'en'; // Английский по умолчанию

const translations = {
    en: {
        // Меню
        'menu.title': 'Game Menu',
        'menu.reset': 'Start Over',
        'menu.close': 'Close',
        'menu.language': 'Language',
        'menu.confirmReset': 'Are you sure you want to start over? All progress will be lost!',
        
        // Эры
        'era.1': 'Era 1: Foundation',
        'era.2': 'Era 2: Crafts',
        'era.3': 'Era 3: Trade',
        'era.4': 'Era 4: Military',
        'era.5': 'Era 5: Elite',
        'era.citadel': 'Citadel',
        
        // Сообщения
        'msg.selectBuilding': 'Select a building to build',
        'msg.selectLocation': 'Select a location on the map to build: {name}',
        'msg.canBuild': 'Can build: {count} out of {total} possible',
        'msg.progressLoaded': 'Progress loaded',
        'msg.gameReset': 'Game reset. Start over!',
        'msg.built': 'Built: {name}',
        'msg.cannotBuild': 'Cannot build here! Check resources and availability.',
        'msg.movedBuildings': 'Moved buildings: {count}',
        'msg.cannotMove': 'Cannot move buildings here! At least one building is blocked by another.',
        'msg.rotatedBuildings': 'Rotated building group: {count}',
        'msg.cannotRotate': 'Cannot rotate group! At least one building is blocked by another.',
        'msg.group': 'Group: {count} buildings',
        'msg.total': 'Total: {count} buildings',
        'msg.noValidPositions': 'No suitable places for construction in the selected area.',
        'msg.massBuilt': 'Built buildings: {count} out of {total} possible',
        'ui.produces': 'Produces:',
        'ui.consumes': 'Consumes:',
        'ui.requires': 'Requirements:',
        'ui.cost': 'Cost:',
        'ui.bonus': 'Bonus:',
        'ui.preferred': 'Preferred tile:',
        'ui.efficiency': 'Efficiency:',
        'ui.nothing': 'nothing',
        'ui.tileBonuses': 'Tile bonuses',
        'ui.error': 'An error occurred while loading the game. Please reload the page.',
        'ui.position': 'Position:',
        'ui.size': 'Size:',
        'ui.tileType': 'Tile type:',
        'ui.groupSize': 'Group size:',
        'ui.selectedBuildings': 'Selected buildings:',
        'ui.totalBuildings': 'Total buildings of this type:',
        'ui.alreadyBuilt': 'Already built: {count} (price +{percent}%)',
        'ui.free': 'Free',
        'tile.grass': 'Grass',
        'tile.forest': 'Forest',
        'tile.stone': 'Stone',
        'tile.gold': 'Gold',
        'tile.iron': 'Iron',
        'tile.water': 'Water',
        // Ресурсы
        'resource.silver': 'Silver', 'resource.wood': 'Wood', 'resource.limestone': 'Limestone', 'resource.cement': 'Cement',
        'resource.blocks': 'Blocks', 'resource.coal': 'Coal', 'resource.gold-ore': 'Gold Ore', 'resource.gold': 'Gold',
        'resource.iron-ore': 'Iron Ore', 'resource.iron': 'Iron', 'resource.steel': 'Steel',
        'resource.gold-coins': 'Gold Coins', 'resource.stone': 'Stone', 'resource.brick': 'Brick',
        'resource.leather': 'Leather', 'resource.weapons': 'Weapons', 'resource.grain': 'Grain', 'resource.flour': 'Flour',
        'resource.bread': 'Bread', 'resource.horses': 'Horses', 'resource.armor': 'Armor',
        'resource.military-equipment': 'Military Equipment', 'resource.blessings': 'Blessings',
        'resource.manuscripts': 'Manuscripts', 'resource.craft-skills': 'Craft Skills',
        'resource.tools': 'Tools', 'resource.metal-products': 'Metal Products', 'resource.copper': 'Copper',
        'resource.copper-coins': 'Copper Coins', 'resource.marble': 'Marble', 'resource.cattle': 'Cattle', 'resource.meat': 'Meat',
        'resource.grapes': 'Grapes', 'resource.wine': 'Wine', 'resource.fruits': 'Fruits', 'resource.vegetables': 'Vegetables',
        'resource.divine-protection': 'Divine Protection', 'resource.knowledge': 'Knowledge',
        'resource.historical-records': 'Historical Records', 'resource.prestige': 'Prestige',
        'resource.protection': 'Protection', 'resource.influence': 'Influence', 'resource.fine-food': 'Fine Food',
        'resource.power': 'Power', 'resource.trade-goods': 'Trade Goods', 'resource.entertainment': 'Entertainment',
        'resource.hospitality': 'Hospitality', 'resource.military-intelligence': 'Military Intelligence',
        'ui.perSecond': '/s',
        'ui.needed': 'needed',
        'ui.available': 'available',
        'ui.produced': 'Produced:',
        'ui.consumed': 'Consumed:',
        'ui.balance': 'Balance:',
        'ui.status': 'Status:',
        'ui.working': 'Working',
        'ui.notWorking': 'Not working',
        'ui.reason': 'Reason:',
        'ui.insufficientResources': 'insufficient resources',
        'ui.cells': 'cells',
        'ui.pageTitle': 'Empire',
        
        // Здания
        'building.0': 'Silver Mine',
        'building.1': 'Sawmill',
        'building.2': 'Limestone Mine',
        'building.3': 'Cement Plant',
        'building.4': 'Block Factory',
        'building.5': 'Coal Mine',
        'building.6': 'Gold Drill',
        'building.7': 'Gold Smelter',
        'building.8': 'Iron Mine',
        'building.9': 'Iron Forge',
        'building.10': 'Steel Forge',
        'building.11': 'Treasury',
        'building.12': 'Quarry',
        'building.13': 'Brick Factory',
        'building.14': 'Leather Workshop',
        'building.15': 'Weapons Workshop',
        'building.16': 'Farm',
        'building.17': 'Mill',
        'building.18': 'Bakery',
        'building.19': 'Stable',
        'building.20': 'Armor Workshop',
        'building.21': 'Armory',
        'building.22': 'Watchtower',
        'building.23': 'Church',
        'building.24': 'Monastery',
        'building.25': 'Market',
        'building.26': 'Craftsmen Guild',
        'building.27': 'Tavern',
        'building.28': 'Inn',
        'building.29': 'Workshop',
        'building.30': 'Foundry',
        'building.31': 'Copper Mine',
        'building.32': 'Mint',
        'building.33': 'Marble Quarry',
        'building.34': 'Port',
        'building.35': 'Harbor',
        'building.36': 'Pasture',
        'building.37': 'Butcher Shop',
        'building.38': 'Vineyard',
        'building.39': 'Winery',
        'building.40': 'Gardens',
        'building.41': 'Vegetable Garden',
        'building.42': 'Sanctuary',
        'building.43': 'Library',
        'building.44': 'Archive',
        'building.45': 'Court',
        'building.46': 'Outpost',
        'building.47': 'Watch Tower',
        'building.48': 'Gate',
        'building.49': 'Throne Hall',
        'building.50': 'Kitchen',
        'building.51': 'Citadel',
    },
    ru: {
        // Меню
        'menu.title': 'Меню игры',
        'menu.reset': 'Начать Сначала',
        'menu.close': 'Закрыть',
        'menu.language': 'Язык',
        'menu.confirmReset': 'Вы уверены, что хотите начать игру сначала? Весь прогресс будет потерян!',
        
        // Эры
        'era.1': 'Эра 1: Основа',
        'era.2': 'Эра 2: Ремесла',
        'era.3': 'Эра 3: Торговля',
        'era.4': 'Эра 4: Военное',
        'era.5': 'Эра 5: Элита',
        'era.citadel': 'Цитадель',
        
        // Сообщения
        'msg.selectBuilding': 'Выберите здание для строительства',
        'msg.selectLocation': 'Выберите место на карте для постройки: {name}',
        'msg.canBuild': 'Можно построить: {count} из {total} возможных',
        'msg.progressLoaded': 'Прогресс загружен',
        'msg.gameReset': 'Игра сброшена. Начните заново!',
        'msg.built': 'Построено: {name}',
        'msg.cannotBuild': 'Нельзя построить здесь! Проверьте ресурсы и доступность места.',
        'msg.movedBuildings': 'Перемещено зданий: {count}',
        'msg.cannotMove': 'Нельзя переместить здания сюда! Хотя бы одному зданию мешает другое.',
        'msg.rotatedBuildings': 'Повернута группа зданий: {count}',
        'msg.cannotRotate': 'Нельзя повернуть группу! Хотя бы одному зданию мешает другое.',
        'msg.group': 'Группа: {count} зданий',
        'msg.total': 'Всего: {count} зданий',
        'msg.noValidPositions': 'В выделенной области нет подходящих мест для постройки.',
        'msg.massBuilt': 'Построено зданий: {count} из {total} возможных',
        'ui.produces': 'Производит:',
        'ui.consumes': 'Потребляет:',
        'ui.requires': 'Требования:',
        'ui.cost': 'Стоимость:',
        'ui.bonus': 'Бонус:',
        'ui.preferred': 'Предпочитаемый тайл:',
        'ui.efficiency': 'Эффективность:',
        'ui.nothing': 'ничего',
        'ui.tileBonuses': 'Бонусы местности',
        'ui.error': 'Произошла ошибка при загрузке игры. Пожалуйста, перезагрузите страницу.',
        'ui.position': 'Позиция:',
        'ui.size': 'Размер:',
        'ui.tileType': 'Тип местности:',
        'ui.groupSize': 'Размер группы:',
        'ui.selectedBuildings': 'Выбрано зданий:',
        'ui.totalBuildings': 'Всего зданий этого типа:',
        'ui.alreadyBuilt': 'Уже построено: {count} (цена +{percent}%)',
        'ui.free': 'Бесплатно',
        'tile.grass': 'Трава',
        'tile.forest': 'Лес',
        'tile.stone': 'Камень',
        'tile.gold': 'Золото',
        'tile.iron': 'Железо',
        'tile.water': 'Вода',
        // Ресурсы
        'resource.silver': 'Серебро', 'resource.wood': 'Дерево', 'resource.limestone': 'Известняк', 'resource.cement': 'Цемент',
        'resource.blocks': 'Блоки', 'resource.coal': 'Уголь', 'resource.gold-ore': 'Золотая руда', 'resource.gold': 'Золото',
        'resource.iron-ore': 'Железная руда', 'resource.iron': 'Железо', 'resource.steel': 'Сталь',
        'resource.gold-coins': 'Золотые монеты', 'resource.stone': 'Камень', 'resource.brick': 'Кирпич',
        'resource.leather': 'Кожа', 'resource.weapons': 'Оружие', 'resource.grain': 'Зерно', 'resource.flour': 'Мука',
        'resource.bread': 'Хлеб', 'resource.horses': 'Лошади', 'resource.armor': 'Доспехи',
        'resource.military-equipment': 'Военное снаряжение', 'resource.blessings': 'Благословения',
        'resource.manuscripts': 'Манускрипты', 'resource.craft-skills': 'Ремесленные навыки',
        'resource.tools': 'Инструменты', 'resource.metal-products': 'Металлические изделия', 'resource.copper': 'Медь',
        'resource.copper-coins': 'Медные монеты', 'resource.marble': 'Мрамор', 'resource.cattle': 'Скот', 'resource.meat': 'Мясо',
        'resource.grapes': 'Виноград', 'resource.wine': 'Вино', 'resource.fruits': 'Фрукты', 'resource.vegetables': 'Овощи',
        'resource.divine-protection': 'Божественная защита', 'resource.knowledge': 'Знания',
        'resource.historical-records': 'Исторические записи', 'resource.prestige': 'Престиж',
        'resource.protection': 'Защита', 'resource.influence': 'Влияние', 'resource.fine-food': 'Изысканная еда',
        'resource.power': 'Власть', 'resource.trade-goods': 'Торговые товары', 'resource.entertainment': 'Развлечения',
        'resource.hospitality': 'Гостеприимство', 'resource.military-intelligence': 'Военная разведка',
        'ui.perSecond': '/с',
        'ui.needed': 'нужно',
        'ui.available': 'доступно',
        'ui.produced': 'Производится:',
        'ui.consumed': 'Потребляется:',
        'ui.balance': 'Баланс:',
        'ui.status': 'Статус:',
        'ui.working': 'Работает',
        'ui.notWorking': 'Не работает',
        'ui.reason': 'Причина:',
        'ui.insufficientResources': 'недостаточно ресурсов',
        'ui.cells': 'клеток',
        'ui.pageTitle': 'Империя',
        
        // Здания
        'building.0': 'Серебряная шахта',
        'building.1': 'Лесопилка',
        'building.2': 'Известняковая шахта',
        'building.3': 'Цементный завод',
        'building.4': 'Завод блоков',
        'building.5': 'Угольная шахта',
        'building.6': 'Буровая установка (золото)',
        'building.7': 'Плавильня золота',
        'building.8': 'Железная шахта',
        'building.9': 'Кузница (железо)',
        'building.10': 'Сталелитейная кузница',
        'building.11': 'Казначейство',
        'building.12': 'Каменоломня',
        'building.13': 'Кирпичный завод',
        'building.14': 'Кожевенная мастерская',
        'building.15': 'Оружейная мастерская',
        'building.16': 'Ферма',
        'building.17': 'Мельница',
        'building.18': 'Пекарня',
        'building.19': 'Конюшня',
        'building.20': 'Доспешная мастерская',
        'building.21': 'Склад оружия',
        'building.22': 'Смотровая башня',
        'building.23': 'Церковь',
        'building.24': 'Монастырь',
        'building.25': 'Рынок',
        'building.26': 'Гильдия ремесленников',
        'building.27': 'Таверна',
        'building.28': 'Постоялый двор',
        'building.29': 'Мастерская',
        'building.30': 'Литейная',
        'building.31': 'Рудник (медь)',
        'building.32': 'Монетный двор',
        'building.33': 'Каменоломня (мрамор)',
        'building.34': 'Порт',
        'building.35': 'Гавань',
        'building.36': 'Пастбище',
        'building.37': 'Мясная лавка',
        'building.38': 'Виноградник',
        'building.39': 'Винодельня',
        'building.40': 'Сады',
        'building.41': 'Огород',
        'building.42': 'Святилище',
        'building.43': 'Библиотека',
        'building.44': 'Архив',
        'building.45': 'Двор',
        'building.46': 'Аванпост',
        'building.47': 'Дозорная башня',
        'building.48': 'Ворота',
        'building.49': 'Парадный зал',
        'building.50': 'Кухня',
        'building.51': 'Цитадель',
    }
};

// Функция для получения переведенной строки
function t(key, params = {}) {
    const translation = translations[currentLanguage]?.[key] || translations['en'][key] || key;
    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match);
}

// Функция для получения локализованного названия здания
function getBuildingName(buildingId) {
    return t(`building.${buildingId}`);
}

// Функция для установки языка
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('gameLanguage', lang);
        updateUI();
    }
}

// Загрузка сохраненного языка
function loadLanguage() {
    const savedLang = localStorage.getItem('gameLanguage');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    }
}

// Функция для обновления всего интерфейса при смене языка
function updateUI() {
    // Обновляем меню
    const menu = document.getElementById('game-menu');
    if (menu) {
        const title = menu.querySelector('h3');
        const resetBtn = document.getElementById('reset-game-btn');
        const closeBtn = document.getElementById('close-menu-btn');
        if (title) title.textContent = t('menu.title');
        if (resetBtn) resetBtn.textContent = t('menu.reset');
        if (closeBtn) closeBtn.textContent = t('menu.close');
        
        // Обновляем активную кнопку языка
        const langEnBtn = document.getElementById('lang-en-btn');
        const langRuBtn = document.getElementById('lang-ru-btn');
        if (langEnBtn && langRuBtn) {
            langEnBtn.classList.toggle('active', currentLanguage === 'en');
            langRuBtn.classList.toggle('active', currentLanguage === 'ru');
        }
    }
    
    // Обновляем вкладки эр
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const era = btn.dataset.era;
        if (era === 'citadel') {
            btn.textContent = t('era.citadel');
        } else {
            btn.textContent = t(`era.${era}`);
        }
    });
    
    // Обновляем панель информации
    if (!gameMap.buildingToPlace) {
        updateInfoPanel(t('msg.selectBuilding'));
    }
    
    // Обновляем названия зданий в списке
    document.querySelectorAll('.building-item').forEach(item => {
        const buildingId = parseInt(item.dataset.buildingId);
        const nameEl = item.querySelector('.building-item-name');
        if (nameEl && !isNaN(buildingId)) {
            nameEl.textContent = getBuildingName(buildingId);
        }
    });
    
    // Обновляем выбранное здание
    if (gameMap.selectedBuilding) {
        updateSelectedBuildingPanel(gameMap.selectedBuilding);
    }
    
    // Обновляем HTML элементы
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
        const infoPanelText = document.getElementById('info-panel-text');
        if (infoPanelText && !gameMap.buildingToPlace) {
            infoPanelText.textContent = t('msg.selectBuilding');
        }
    }
    
    // Update page title
    document.title = t('ui.pageTitle');
}

// Система ресурсов
const resources = {
    silver: 100,
    wood: 0,
    limestone: 0,
    cement: 0,
    blocks: 0,
    coal: 0,
    'gold-ore': 0,
    gold: 0,
    'iron-ore': 0,
    iron: 0,
    steel: 0,
    'gold-coins': 0,
    stone: 0,
    brick: 0,
    leather: 0,
    weapons: 0,
    grain: 0,
    flour: 0,
    bread: 0,
    horses: 0,
    armor: 0,
    'military-equipment': 0,
    blessings: 0,
    manuscripts: 0,
    'craft-skills': 0,
    tools: 0,
    'metal-products': 0,
    copper: 0,
    'copper-coins': 0,
    marble: 0,
    cattle: 0,
    meat: 0,
    grapes: 0,
    wine: 0,
    fruits: 0,
    vegetables: 0,
    'divine-protection': 0,
    knowledge: 0,
    'historical-records': 0,
    prestige: 0,
    protection: 0,
    influence: 0,
    'fine-food': 0,
    power: 0,
    'trade-goods': 0,
    'entertainment': 0,
    'hospitality': 0,
    'military-intelligence': 0
};

// Определение всех зданий (с бонусами от местности)
const buildings = [
    // Эра 1: Основа (1-10)
    {
        id: 0,
        name: 'Серебряная шахта',
        era: 1,
        icon: '💎',
        requires: {},
        produces: { silver: 1 },
        consumes: {},
        cost: {}, // Бесплатное первое здание
        preferredTile: 'stone',
        tileBonus: { stone: 1.3, gold: 1.5 },
        width: 1,
        height: 1
    },
    {
        id: 1,
        name: 'Лесопилка',
        era: 1,
        icon: '🪵',
        requires: { silver: 50 },
        produces: { wood: 1 },
        consumes: {},
        cost: { silver: 50 },
        preferredTile: 'forest',
        tileBonus: { forest: 1.5 },
        width: 1,
        height: 1
    },
    {
        id: 2,
        name: 'Известняковая шахта',
        era: 1,
        icon: '⛰️',
        requires: { wood: 10, silver: 100 },
        produces: { limestone: 1 },
        consumes: { wood: 0.5 },
        cost: { wood: 10, silver: 100 },
        preferredTile: 'stone',
        tileBonus: { stone: 1.5 }
    },
    {
        id: 3,
        name: 'Цементный завод',
        era: 1,
        icon: '🏗️',
        requires: { wood: 15, silver: 150 },
        produces: { cement: 1 },
        consumes: { limestone: 1, wood: 0.5 },
        cost: { wood: 15, silver: 150 }
    },
    {
        id: 4,
        name: 'Завод блоков',
        era: 1,
        icon: '🧱',
        requires: { wood: 20, silver: 200 },
        produces: { blocks: 1 },
        consumes: { cement: 1, wood: 0.3 },
        cost: { wood: 20, silver: 200 }
    },
    {
        id: 5,
        name: 'Угольная шахта',
        era: 1,
        icon: '⛏️',
        requires: { wood: 25, blocks: 10, silver: 250 },
        produces: { coal: 1 },
        consumes: { wood: 0.5, blocks: 0.2 },
        cost: { wood: 25, blocks: 10, silver: 250 },
        preferredTile: 'stone',
        tileBonus: { stone: 1.3 }
    },
    {
        id: 6,
        name: 'Буровая установка (золото)',
        era: 1,
        icon: '⚒️',
        requires: { wood: 30, blocks: 15, silver: 300 },
        produces: { 'gold-ore': 1 },
        consumes: { coal: 0.8, blocks: 0.3 },
        cost: { wood: 30, blocks: 15, silver: 300 },
        canToggle: true,
        preferredTile: 'gold',
        tileBonus: { gold: 2.0 } // +100% на золоте
    },
    {
        id: 7,
        name: 'Плавильня золота',
        era: 1,
        icon: '🔥',
        requires: { wood: 35, blocks: 20, silver: 350 },
        produces: { gold: 1 },
        consumes: { 'gold-ore': 1, coal: 0.5 },
        cost: { wood: 35, blocks: 20, silver: 350 }
    },
    {
        id: 8,
        name: 'Железная шахта',
        era: 1,
        icon: '⛏️',
        requires: { wood: 40, blocks: 25, silver: 400 },
        produces: { 'iron-ore': 1 },
        consumes: { coal: 0.6, wood: 0.4 },
        cost: { wood: 40, blocks: 25, silver: 400 },
        preferredTile: 'iron',
        tileBonus: { iron: 2.0 } // +100% на железе
    },
    {
        id: 9,
        name: 'Кузница (железо)',
        era: 1,
        icon: '🔨',
        requires: { wood: 45, blocks: 30, silver: 450 },
        produces: { iron: 1 },
        consumes: { 'iron-ore': 1, coal: 0.7 },
        cost: { wood: 45, blocks: 30, silver: 450 }
    },
    {
        id: 10,
        name: 'Сталелитейная кузница',
        era: 1,
        icon: '⚙️',
        requires: { wood: 50, blocks: 35, silver: 500 },
        produces: { steel: 1 },
        consumes: { iron: 1, coal: 0.8 },
        cost: { wood: 50, blocks: 35, silver: 500 }
    },
    // Эра 2: Ремесла (11-20)
    {
        id: 11,
        name: 'Казначейство',
        era: 2,
        icon: '💰',
        requires: { steel: 20, blocks: 40, gold: 10, silver: 600 },
        produces: { 'gold-coins': 1 },
        consumes: { gold: 0.5, steel: 0.2 },
        cost: { steel: 20, blocks: 40, gold: 10, silver: 600 }
    },
    {
        id: 12,
        name: 'Каменоломня',
        era: 2,
        icon: '🪨',
        requires: { steel: 25, blocks: 45, silver: 700 },
        produces: { stone: 1 },
        consumes: { steel: 0.3, coal: 0.4 },
        cost: { steel: 25, blocks: 45, silver: 700 },
        preferredTile: 'stone',
        tileBonus: { stone: 1.5 }
    },
    {
        id: 13,
        name: 'Кирпичный завод',
        era: 2,
        icon: '🏗️',
        requires: { stone: 30, blocks: 50, silver: 800 },
        produces: { brick: 1 },
        consumes: { stone: 1, coal: 0.5, blocks: 0.2 },
        cost: { stone: 30, blocks: 50, silver: 800 }
    },
    {
        id: 14,
        name: 'Кожевенная мастерская',
        era: 2,
        icon: '🦌',
        requires: { wood: 60, steel: 30, silver: 900, stone: 30 },
        produces: { leather: 1 },
        consumes: { wood: 0.6 },
        cost: { wood: 60, steel: 30, silver: 900, stone: 30 }
    },
    {
        id: 15,
        name: 'Оружейная мастерская',
        era: 2,
        icon: '⚔️',
        requires: { steel: 35, wood: 65, silver: 1000, stone: 35 },
        produces: { weapons: 1 },
        consumes: { steel: 1 },
        cost: { steel: 35, wood: 65, silver: 1000, stone: 35 }
    },
    {
        id: 16,
        name: 'Ферма',
        era: 2,
        icon: '🌾',
        requires: { wood: 70, blocks: 55, silver: 1100, stone: 40 },
        produces: { grain: 1 },
        consumes: {},
        cost: { wood: 70, blocks: 55, silver: 1100, stone: 40 },
        preferredTile: 'grass',
        tileBonus: { grass: 1.3 }
    },
    {
        id: 17,
        name: 'Мельница',
        era: 2,
        icon: '🏛️',
        requires: { wood: 75, stone: 40, silver: 1200 },
        produces: { flour: 1 },
        consumes: { grain: 1, stone: 0.1 },
        cost: { wood: 75, stone: 40, silver: 1200 }
    },
    {
        id: 18,
        name: 'Пекарня',
        era: 2,
        icon: '🍞',
        requires: { wood: 80, blocks: 60, silver: 1300, stone: 45 },
        produces: { bread: 1 },
        consumes: { flour: 1 },
        cost: { wood: 80, blocks: 60, silver: 1300, stone: 45 }
    },
    {
        id: 19,
        name: 'Конюшня',
        era: 2,
        icon: '🐴',
        requires: { wood: 85, blocks: 65, silver: 1400, stone: 50 },
        produces: { horses: 1 },
        consumes: { grain: 0.8 },
        cost: { wood: 85, blocks: 65, silver: 1400, stone: 50 }
    },
    {
        id: 20,
        name: 'Доспешная мастерская',
        era: 2,
        icon: '🛡️',
        requires: { steel: 40, wood: 90, blocks: 70, silver: 1500, stone: 55 },
        produces: { armor: 1 },
        consumes: { steel: 0.8, leather: 0.5 },
        cost: { steel: 40, wood: 90, blocks: 70, silver: 1500, stone: 55 }
    },
    // Эра 3: Торговля и религия (21-30)
    {
        id: 21,
        name: 'Склад оружия',
        era: 3,
        icon: '🏰',
        requires: { steel: 50, blocks: 80, stone: 50, silver: 1600, 'gold-coins': 15 },
        produces: { 'military-equipment': 1 },
        consumes: { weapons: 0.5, armor: 0.5, steel: 0.3 },
        cost: { steel: 50, blocks: 80, stone: 50, silver: 1600, 'gold-coins': 15 }
    },
    {
        id: 22,
        name: 'Смотровая башня',
        era: 3,
        icon: '🗼',
        requires: { stone: 60, blocks: 90, silver: 1700, 'gold-coins': 18 },
        produces: { 'military-intelligence': 0.1 },
        consumes: { stone: 0.2, 'military-equipment': 0.2 },
        cost: { stone: 60, blocks: 90, silver: 1700, 'gold-coins': 18 },
        bonus: { pps: 5 }
    },
    {
        id: 23,
        name: 'Церковь',
        era: 3,
        icon: '⛪',
        requires: { stone: 70, wood: 100, gold: 20, silver: 1800 },
        produces: { blessings: 0.03 },
        consumes: { gold: 0.3, stone: 0.2, brick: 0.3 },
        cost: { stone: 70, wood: 100, gold: 20, silver: 1800 },
        bonus: { production: 3 }
    },
    {
        id: 24,
        name: 'Монастырь',
        era: 3,
        icon: '📜',
        requires: { stone: 80, wood: 110, gold: 25, silver: 1900 },
        produces: { manuscripts: 0.02 },
        consumes: { gold: 0.4, brick: 0.4, stone: 0.25 },
        cost: { stone: 80, wood: 110, gold: 25, silver: 1900 },
        bonus: { breakChance: -2 }
    },
    {
        id: 25,
        name: 'Рынок',
        era: 3,
        icon: '🏪',
        requires: { stone: 90, blocks: 100, silver: 2000, 'gold-coins': 22 },
        produces: { 'trade-goods': 0.3 },
        consumes: { bread: 0.5, weapons: 0.3, brick: 0.3 },
        cost: { stone: 90, blocks: 100, silver: 2000, 'gold-coins': 22 },
        bonus: { pps: 4 }
    },
    {
        id: 26,
        name: 'Гильдия ремесленников',
        era: 3,
        icon: '🏛️',
        requires: { stone: 100, wood: 120, gold: 30, silver: 2100 },
        produces: { 'craft-skills': 0.03 },
        consumes: { gold: 0.5, brick: 0.4, 'trade-goods': 0.2 },
        cost: { stone: 100, wood: 120, gold: 30, silver: 2100 },
        bonus: { production: 3 }
    },
    {
        id: 27,
        name: 'Таверна',
        era: 3,
        icon: '🍺',
        requires: { wood: 130, blocks: 110, silver: 2200, 'gold-coins': 25, stone: 60 },
        produces: { 'entertainment': 0.2 },
        consumes: { bread: 0.4 },
        cost: { wood: 130, blocks: 110, silver: 2200, 'gold-coins': 25, stone: 60 },
        bonus: { pps: 3 }
    },
    {
        id: 28,
        name: 'Постоялый двор',
        era: 3,
        icon: '🏨',
        requires: { wood: 140, blocks: 120, silver: 2300, 'gold-coins': 28, stone: 65 },
        produces: { 'hospitality': 0.25 },
        consumes: { bread: 0.5, horses: 0.2 },
        cost: { wood: 140, blocks: 120, silver: 2300, 'gold-coins': 28, stone: 65 },
        bonus: { pps: 4 }
    },
    {
        id: 29,
        name: 'Мастерская',
        era: 3,
        icon: '🔧',
        requires: { steel: 60, wood: 150, silver: 2400, 'gold-coins': 30, stone: 70 },
        produces: { tools: 1 },
        consumes: { steel: 0.6, 'craft-skills': 0.01 },
        cost: { steel: 60, wood: 150, silver: 2400, 'gold-coins': 30, stone: 70 }
    },
    {
        id: 30,
        name: 'Литейная',
        era: 3,
        icon: '⚙️',
        requires: { steel: 70, blocks: 130, silver: 2500, 'gold-coins': 32, stone: 75 },
        produces: { 'metal-products': 1 },
        consumes: { steel: 0.8, blocks: 0.3 },
        cost: { steel: 70, blocks: 130, silver: 2500, 'gold-coins': 32, stone: 75 }
    },
    // Эра 4: Военное дело и строительство (31-40)
    {
        id: 31,
        name: 'Рудник (медь)',
        era: 4,
        icon: '🔶',
        requires: { wood: 160, blocks: 140, silver: 2600, 'gold-coins': 35, brick: 80 },
        produces: { copper: 1 },
        consumes: { coal: 0.5, tools: 0.2 },
        cost: { wood: 160, blocks: 140, silver: 2600, 'gold-coins': 35, brick: 80 },
        preferredTile: 'stone',
        tileBonus: { stone: 1.3 }
    },
    {
        id: 32,
        name: 'Монетный двор',
        era: 4,
        icon: '🪙',
        requires: { wood: 170, blocks: 150, silver: 2700, 'gold-coins': 38, brick: 85 },
        produces: { 'copper-coins': 1 },
        consumes: { copper: 1 },
        cost: { wood: 170, blocks: 150, silver: 2700, 'gold-coins': 38, brick: 85 },
        bonus: { pps: 2 }
    },
    {
        id: 33,
        name: 'Каменоломня (мрамор)',
        era: 4,
        icon: '🗿',
        requires: { steel: 80, blocks: 160, silver: 2800, 'gold-coins': 40, brick: 90 },
        produces: { marble: 1 },
        consumes: { steel: 0.4 },
        cost: { steel: 80, blocks: 160, silver: 2800, 'gold-coins': 40, brick: 90 },
        preferredTile: 'stone',
        tileBonus: { stone: 1.5 }
    },
    {
        id: 34,
        name: 'Порт',
        era: 4,
        icon: '⚓',
        requires: { wood: 180, stone: 120, blocks: 170, silver: 2900, 'gold-coins': 42, brick: 95 },
        produces: { 'trade-goods': 0.5 },
        consumes: { stone: 0.3, brick: 0.4, 'military-equipment': 0.3 },
        cost: { wood: 180, stone: 120, blocks: 170, silver: 2900, 'gold-coins': 42, brick: 95 },
        bonus: { pps: 5 },
        preferredTile: 'water',
        tileBonus: { water: 1.5 }
    },
    {
        id: 35,
        name: 'Гавань',
        era: 4,
        icon: '🚢',
        requires: { wood: 190, stone: 130, blocks: 180, silver: 3000, 'gold-coins': 45, brick: 100 },
        produces: { 'trade-goods': 0.6 },
        consumes: { stone: 0.35, brick: 0.5, 'military-equipment': 0.35 },
        cost: { wood: 190, stone: 130, blocks: 180, silver: 3000, 'gold-coins': 45, brick: 100 },
        bonus: { pps: 6 },
        preferredTile: 'water',
        tileBonus: { water: 1.5 }
    },
    {
        id: 36,
        name: 'Пастбище',
        era: 4,
        icon: '🐄',
        requires: { wood: 200, blocks: 190, silver: 3100, 'gold-coins': 48, brick: 105 },
        produces: { cattle: 1 },
        consumes: { grain: 0.6 },
        cost: { wood: 200, blocks: 190, silver: 3100, 'gold-coins': 48, brick: 105 },
        preferredTile: 'grass',
        tileBonus: { grass: 1.3 }
    },
    {
        id: 37,
        name: 'Мясная лавка',
        era: 4,
        icon: '🥩',
        requires: { wood: 210, blocks: 200, silver: 3200, 'gold-coins': 50, brick: 110 },
        produces: { meat: 1 },
        consumes: { cattle: 1, tools: 0.2 },
        cost: { wood: 210, blocks: 200, silver: 3200, 'gold-coins': 50, brick: 110 }
    },
    {
        id: 38,
        name: 'Виноградник',
        era: 4,
        icon: '🍇',
        requires: { wood: 220, blocks: 210, silver: 3300, 'gold-coins': 52, brick: 115 },
        produces: { grapes: 1 },
        consumes: { tools: 0.15 },
        cost: { wood: 220, blocks: 210, silver: 3300, 'gold-coins': 52, brick: 115 },
        preferredTile: 'grass',
        tileBonus: { grass: 1.3 }
    },
    {
        id: 39,
        name: 'Винодельня',
        era: 4,
        icon: '🍷',
        requires: { wood: 230, blocks: 220, silver: 3400, 'gold-coins': 54, brick: 120 },
        produces: { wine: 1 },
        consumes: { grapes: 1, tools: 0.3 },
        cost: { wood: 230, blocks: 220, silver: 3400, 'gold-coins': 54, brick: 120 }
    },
    {
        id: 40,
        name: 'Сады',
        era: 4,
        icon: '🌳',
        requires: { wood: 240, blocks: 230, silver: 3500, 'gold-coins': 56, brick: 125 },
        produces: { fruits: 1 },
        consumes: { tools: 0.2 },
        cost: { wood: 240, blocks: 230, silver: 3500, 'gold-coins': 56, brick: 125 },
        preferredTile: 'grass',
        tileBonus: { grass: 1.3 }
    },
    // Эра 5: Элита и завершение (41-50)
    {
        id: 41,
        name: 'Огород',
        era: 5,
        icon: '🥕',
        requires: { wood: 250, blocks: 240, silver: 3600, 'gold-coins': 58, marble: 30 },
        produces: { vegetables: 1 },
        consumes: { tools: 0.25 },
        cost: { wood: 250, blocks: 240, silver: 3600, 'gold-coins': 58, marble: 30 },
        preferredTile: 'grass',
        tileBonus: { grass: 1.3 }
    },
    {
        id: 42,
        name: 'Святилище',
        era: 5,
        icon: '✨',
        requires: { stone: 150, gold: 40, brick: 80, silver: 3700, 'gold-coins': 60, marble: 35 },
        produces: { 'divine-protection': 0.03 },
        consumes: { gold: 0.6, stone: 0.3, brick: 0.5, blessings: 0.01 },
        cost: { stone: 150, gold: 40, brick: 80, silver: 3700, 'gold-coins': 60, marble: 35 },
        bonus: { breakChance: -3 }
    },
    {
        id: 43,
        name: 'Библиотека',
        era: 5,
        icon: '📚',
        requires: { stone: 160, wood: 260, gold: 45, silver: 3800, 'gold-coins': 62, marble: 40 },
        produces: { knowledge: 0.02 },
        consumes: { gold: 0.7, brick: 0.6, stone: 0.35, manuscripts: 0.005 },
        cost: { stone: 160, wood: 260, gold: 45, silver: 3800, 'gold-coins': 62, marble: 40 },
        bonus: { repairSpeed: 20 }
    },
    {
        id: 44,
        name: 'Архив',
        era: 5,
        icon: '🗄️',
        requires: { stone: 170, wood: 270, gold: 50, brick: 100, silver: 3900, 'gold-coins': 64, marble: 42 },
        produces: { 'historical-records': 0.04 },
        consumes: { gold: 0.8, brick: 0.7, knowledge: 0.01 },
        cost: { stone: 170, wood: 270, gold: 50, brick: 100, silver: 3900, 'gold-coins': 64, marble: 42 },
        bonus: { pps: 4 }
    },
    {
        id: 45,
        name: 'Двор',
        era: 5,
        icon: '🏛️',
        requires: { stone: 180, marble: 50, gold: 55, brick: 120, silver: 4000, 'gold-coins': 66 },
        produces: { prestige: 0.05 },
        consumes: { marble: 0.4, gold: 0.9, brick: 0.8, 'historical-records': 0.01 },
        cost: { stone: 180, marble: 50, gold: 55, brick: 120, silver: 4000, 'gold-coins': 66 },
        bonus: { pps: 5 }
    },
    {
        id: 46,
        name: 'Аванпост',
        era: 5,
        icon: '🏰',
        requires: { stone: 190, steel: 100, blocks: 250, silver: 4100, 'gold-coins': 65, marble: 48 },
        produces: { protection: 0.03 },
        consumes: { steel: 1, 'military-equipment': 0.5, 'military-intelligence': 0.05 },
        cost: { stone: 190, steel: 100, blocks: 250, silver: 4100, 'gold-coins': 65, marble: 48 },
        bonus: { breakChance: -3 }
    },
    {
        id: 47,
        name: 'Дозорная башня',
        era: 5,
        icon: '🗼',
        requires: { stone: 200, blocks: 260, steel: 110, silver: 4200, 'gold-coins': 70, marble: 50 },
        produces: { 'military-intelligence': 0.15 },
        consumes: { 'military-equipment': 0.4 },
        cost: { stone: 200, blocks: 260, steel: 110, silver: 4200, 'gold-coins': 70, marble: 50 },
        bonus: { pps: 6 }
    },
    {
        id: 48,
        name: 'Ворота',
        era: 5,
        icon: '🚪',
        requires: { stone: 210, steel: 120, blocks: 270, silver: 4300, 'gold-coins': 75, marble: 52 },
        produces: { protection: 0.04 },
        consumes: { steel: 1.2, 'military-equipment': 0.6, 'military-intelligence': 0.08 },
        cost: { stone: 210, steel: 120, blocks: 270, silver: 4300, 'gold-coins': 75, marble: 52 },
        bonus: { breakChance: -4 }
    },
    {
        id: 49,
        name: 'Парадный зал',
        era: 5,
        icon: '👑',
        requires: { marble: 60, gold: 60, brick: 150, 'metal-products': 40, silver: 4400, 'gold-coins': 68 },
        produces: { influence: 0.06 },
        consumes: { marble: 0.5, gold: 1, brick: 1, 'metal-products': 0.4, wine: 0.3, 'entertainment': 0.2, prestige: 0.02 },
        cost: { marble: 60, gold: 60, brick: 150, 'metal-products': 40, silver: 4400, 'gold-coins': 68 },
        bonus: { pps: 6 }
    },
    {
        id: 50,
        name: 'Кухня',
        era: 5,
        icon: '🍳',
        requires: { wood: 280, blocks: 280, steel: 130, stone: 220, silver: 4500, 'gold-coins': 80, marble: 58 },
        produces: { 'fine-food': 0.05 },
        consumes: { bread: 0.6, vegetables: 0.5, fruits: 0.5, meat: 0.4, tools: 0.3, 'hospitality': 0.15 },
        cost: { wood: 280, blocks: 280, steel: 130, stone: 220, silver: 4500, 'gold-coins': 80, marble: 58 },
        bonus: { pps: 5 }
    },
    {
        id: 51,
        name: 'Цитадель',
        era: 'citadel',
        icon: '🏰',
        requires: {
            wood: 500, blocks: 500, steel: 200, stone: 300, brick: 200,
            gold: 100, silver: 5000, 'gold-coins': 50, 'copper-coins': 100,
            marble: 100, 'metal-products': 100
        },
        produces: { power: 0.1 },
        consumes: {
            wood: 5, blocks: 5, steel: 5, stone: 5, brick: 5,
            gold: 5, coal: 5, cement: 5, limestone: 5,
            iron: 5, 'iron-ore': 5, 'gold-ore': 5, leather: 5,
            weapons: 5, armor: 5, tools: 5, 'military-equipment': 5,
            'fine-food': 0.5, influence: 0.25, protection: 0.25, 'divine-protection': 0.1,
            grain: 5, flour: 5, bread: 5, horses: 5, 'gold-coins': 5,
            copper: 5, 'copper-coins': 5, marble: 5, cattle: 5, meat: 5,
            grapes: 5, wine: 5, fruits: 5, vegetables: 5,
            blessings: 0.15, manuscripts: 0.1, 'craft-skills': 0.15,
            knowledge: 0.1, 'historical-records': 0.2, prestige: 0.25,
            'trade-goods': 1.5, entertainment: 1, hospitality: 0.75, 'military-intelligence': 0.75,
            'metal-products': 5
        },
        cost: {
            wood: 500, blocks: 500, steel: 200, stone: 300, brick: 200,
            gold: 100, silver: 5000, 'gold-coins': 50, 'copper-coins': 100,
            marble: 100, 'metal-products': 100
        },
        bonus: { globalMultiplier: 1.1 }
    }
];

// Игровое поле
const gameMap = {
    width: 50,
    height: 50,
    tiles: [],
    buildings: [], // { x, y, buildingId, instanceId, width, height }
    occupiedTiles: new Set(), // Множество занятых клеток в формате "x,y"
    zoom: 1,
    selectedBuilding: null,
    buildingToPlace: null,
    buildingRotation: 0, // 0 = нормально, 1 = повернуто на 90° (width и height меняются местами)
    previewTiles: [], // Клетки для preview
    selectedBuildings: [], // Массив выбранных зданий (для группы/всего типа)
    selectionMode: 'single', // 'single', 'group', 'all-type', 'area'
    draggingBuildings: null, // { buildings: [], startX: 0, startY: 0, offsetX: 0, offsetY: 0, rotation: 0 }
    selectionBox: {
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
    }
};

// Состояние клавиши Ctrl (для показа бейджей)
let isCtrlPressed = false;

// Типы тайлов
const tileTypes = ['grass', 'forest', 'stone', 'gold', 'iron', 'water'];

// Генерация карты
function generateMap() {
    gameMap.tiles = [];
    for (let y = 0; y < gameMap.height; y++) {
        gameMap.tiles[y] = [];
        for (let x = 0; x < gameMap.width; x++) {
            // Генерация типов тайлов (упрощенная)
            let type = 'grass';
            const rand = Math.random();
            if (rand < 0.15) type = 'forest';
            else if (rand < 0.25) type = 'stone';
            else if (rand < 0.28) type = 'gold';
            else if (rand < 0.31) type = 'iron';
            else if (rand < 0.35) type = 'water';
            
            gameMap.tiles[y][x] = {
                type: type,
                building: null
            };
        }
    }
}

// Состояние игры
const gameState = {
    buildings: {},
    enabled: {},
    bonuses: {
        pps: 0,
        production: 0,
        breakChance: 0,
        repairSpeed: 0,
        globalMultiplier: 1
    },
    lastUpdate: Date.now(),
    gameTime: 0
};

// Кэш для быстрого доступа к зданиям (инициализируется после определения зданий)
let buildingsCache = new Map();

// Кэш для предыдущих значений ресурсов (для оптимизации рендеринга)
const previousResourceValues = {};

// Кэш для групп зданий (оптимизация производительности)
const buildingGroupsCache = new Map(); // Map<instanceId, groupSize>
let buildingsHash = ''; // Хэш для отслеживания изменений в зданиях
const MAX_GROUPS_CACHE_SIZE = 1000; // Максимальный размер кэша групп

// Кэш для расчетов ресурсов в tooltip (дебаунсинг)
let resourceTooltipCache = {
    production: {},
    consumption: {},
    lastUpdate: 0,
    cacheTimeout: 300, // Кэш обновляется раз в 300мс
    maxCacheSize: 48 // Максимальный размер кэша (количество ресурсов)
};
let resourceTooltipTimeout = null;

// Кэш статуса работы зданий (для визуальных индикаторов)
const buildingWorkStatus = new Map(); // Map<instanceId, {working: boolean, reason?: string}>
const buildingStatusCache = new Map(); // Map<instanceId, {working: boolean, reason?: string}> - предыдущий статус для сравнения
const buildingElementsCache = new WeakMap(); // WeakMap<HTMLElement, instanceId> - кэш DOM элементов
let lastWorkStatusUpdate = 0;
const WORK_STATUS_UPDATE_INTERVAL = 1000; // Обновляем статус раз в секунду
let gridElementCache = null; // Кэш элемента grid для избежания повторных querySelector

// Установка размеров зданий по умолчанию
function setBuildingSizes() {
    buildings.forEach(building => {
        if (!building.width) building.width = 1;
        if (!building.height) building.height = 1;
    });
    
    // Устанавливаем большие размеры для крупных зданий
    const largeBuildings = {
        3: { width: 2, height: 1 },  // Цементный завод
        4: { width: 2, height: 1 },  // Завод блоков
        7: { width: 1, height: 2 },  // Плавильня золота
        9: { width: 2, height: 1 },  // Кузница (железо)
        10: { width: 2, height: 2 }, // Сталелитейная кузница
        11: { width: 2, height: 2 }, // Казначейство
        15: { width: 2, height: 1 }, // Оружейная мастерская
        17: { width: 2, height: 2 }, // Мельница
        20: { width: 2, height: 2 }, // Доспешная мастерская
        21: { width: 3, height: 2 }, // Склад оружия
        22: { width: 1, height: 2 }, // Смотровая башня
        23: { width: 2, height: 2 }, // Церковь
        34: { width: 3, height: 2 }, // Порт
        35: { width: 3, height: 2 }, // Гавань
        43: { width: 2, height: 3 }, // Библиотека
        44: { width: 3, height: 2 }, // Архив
        45: { width: 3, height: 3 }, // Двор
        49: { width: 3, height: 3 }, // Парадный зал
        51: { width: 4, height: 4 }  // Цитадель
    };
    
    Object.entries(largeBuildings).forEach(([id, size]) => {
        const buildingId = parseInt(id);
        const building = buildingsCache.get(buildingId) || buildings.find(b => b.id === buildingId);
        if (building) {
            building.width = size.width;
            building.height = size.height;
            // Обновляем кэш если он уже инициализирован
            if (buildingsCache.has(buildingId)) {
                buildingsCache.set(buildingId, building);
            }
        }
    });
}

// Создание элементов ресурсов в верхней панели
function initResourcesBar() {
    const resourcesBar = document.getElementById('resources-bar');
    if (!resourcesBar) return;
    
    // Получаем все ресурсы в хронологическом порядке появления
    // Порядок определяется по ID зданий, которые их производят
    const resourcesOrder = [
        'silver',      // id 0
        'wood',        // id 1
        'limestone',   // id 2
        'cement',      // id 3
        'blocks',      // id 4
        'coal',        // id 5
        'gold-ore',    // id 6
        'gold',        // id 7
        'iron-ore',    // id 8
        'iron',        // id 9
        'steel',       // id 10
        'gold-coins',  // id 11
        'stone',       // id 12
        'brick',       // id 13
        'leather',     // id 14
        'weapons',     // id 15
        'grain',       // id 16
        'flour',       // id 17
        'bread',       // id 18
        'horses',      // id 19
        'armor',       // id 20
        'military-equipment', // id 21
        'blessings',   // id 23
        'manuscripts', // id 24
        'craft-skills', // id 26
        'tools',       // id 29
        'metal-products', // id 30
        'copper',      // id 31
        'copper-coins', // id 32
        'marble',      // id 33
        'cattle',      // id 36
        'meat',        // id 37
        'grapes',      // id 38
        'wine',        // id 39
        'fruits',      // id 40
        'vegetables',  // id 41
        'divine-protection', // id 42
        'knowledge',   // id 43
        'historical-records', // id 44
        'prestige',    // id 45
        'protection',  // id 46, 48
        'influence',   // id 49
        'fine-food',   // id 50
        'power',       // id 51
        'trade-goods', // id 25, 34, 35
        'entertainment', // id 27
        'hospitality', // id 28
        'military-intelligence' // id 22, 47
    ];
    
    resourcesOrder.forEach(resourceKey => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.dataset.resource = resourceKey;
        const initialValue = resources[resourceKey] || 0;
        resourceItem.innerHTML = `
            <span class="resource-icon">${getResourceIconHTML(resourceKey)}</span>
            <span class="resource-value" id="resource-${resourceKey}">${formatNumber(initialValue)}</span>
        `;
        
        // Добавляем обработчики для показа tooltip с информацией о ресурсе
        resourceItem.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            showResourceTooltip(resourceKey, e.target);
        });
        
        resourceItem.addEventListener('mouseleave', () => {
            hideResourceTooltip();
        });
        
        resourceItem.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });
        
        resourcesBar.appendChild(resourceItem);
    });
    
    // Инициализируем предыдущие значения для всех ресурсов
    resourcesOrder.forEach(key => {
        previousResourceValues[key] = resources[key] || 0;
    });
}

// Сохранение прогресса в localStorage
function saveGame() {
    try {
        const saveData = {
            resources: { ...resources },
            buildings: { ...gameState.buildings },
            mapBuildings: gameMap.buildings.map(b => ({
                x: b.x,
                y: b.y,
                buildingId: b.buildingId,
                instanceId: b.instanceId,
                width: b.width,
                height: b.height
            })),
            mapTiles: gameMap.tiles.map(row => row.map(tile => ({ type: tile.type }))),
            gameTime: gameState.gameTime,
            enabled: { ...gameState.enabled },
            version: '1.0' // Версия сохранения для будущих миграций
        };
        
        localStorage.setItem('medievalEmpireSave', JSON.stringify(saveData));
        console.log('Game saved');
    } catch (error) {
        console.error('Ошибка сохранения игры:', error);
    }
}

// Загрузка прогресса из localStorage
function loadGame() {
    try {
        const saveDataStr = localStorage.getItem('medievalEmpireSave');
        if (!saveDataStr) {
            console.log('Save not found, starting new game');
            return false;
        }
        
        const saveData = JSON.parse(saveDataStr);
        
        // Восстанавливаем ресурсы
        if (saveData.resources) {
            Object.keys(resources).forEach(key => {
                if (saveData.resources.hasOwnProperty(key)) {
                    resources[key] = saveData.resources[key];
                }
            });
        }
        
        // Восстанавливаем счетчики зданий
        if (saveData.buildings) {
            Object.assign(gameState.buildings, saveData.buildings);
        }
        
        // Восстанавливаем карту
        if (saveData.mapTiles && Array.isArray(saveData.mapTiles)) {
            gameMap.tiles = saveData.mapTiles.map(row => 
                row.map(tile => ({ type: tile.type, building: null }))
            );
        }
        
        // Восстанавливаем здания на карте
        if (saveData.mapBuildings && Array.isArray(saveData.mapBuildings)) {
            gameMap.buildings = saveData.mapBuildings;
            
            // Сбрасываем кэши при загрузке
            gridElementCache = null;
            resourceStatsCache = null;
            buildingStatusCache.clear();
            buildingWorkStatus.clear();
            updateOccupiedTiles();
        }
        
        // Восстанавливаем игровое время
        if (saveData.gameTime !== undefined) {
            gameState.gameTime = saveData.gameTime;
        }
        
        // Восстанавливаем состояние enabled
        if (saveData.enabled) {
            Object.assign(gameState.enabled, saveData.enabled);
        }
        
        console.log('Game loaded');
        return true;
    } catch (error) {
        console.error('Ошибка загрузки игры:', error);
        return false;
    }
}

// Очистка сохранения
function clearSave() {
    localStorage.removeItem('medievalEmpireSave');
    console.log('Save cleared');
}

// Сброс игры на начало
function resetGame() {
    // Очищаем сохранение
    clearSave();
    
    // Сбрасываем ресурсы к начальным значениям
    Object.keys(resources).forEach(key => {
        resources[key] = key === 'silver' ? 100 : 0;
    });
    
    // Очищаем здания
    gameState.buildings = {};
    gameMap.buildings = [];
    
    // Сбрасываем кэши при сбросе игры
    gridElementCache = null;
    resourceStatsCache = null;
    buildingStatusCache.clear();
    buildingWorkStatus.clear();
    
    // Сбрасываем игровое время
    gameState.gameTime = 0;
    
    // Сбрасываем состояние enabled
    gameState.enabled = {};
    buildings.forEach(b => {
        gameState.enabled[b.id] = true;
    });
    
    // Генерируем новую карту
    generateMap();
    
    // Обновляем интерфейс
    updateOccupiedTiles();
    renderMap();
    renderMiniMap();
    renderBuildings(1);
    renderResources();
    updateInfoPanel(t('msg.gameReset'));
    
    // Закрываем меню
    const menu = document.getElementById('game-menu');
    if (menu) {
        menu.style.display = 'none';
    }
    
    console.log('Game reset');
}

// Показать меню игры
function showGameMenu() {
    let menu = document.getElementById('game-menu');
    
    if (!menu) {
        // Создаем меню
        menu = document.createElement('div');
        menu.id = 'game-menu';
        menu.className = 'modal';
        menu.innerHTML = `
            <div class="modal-content" style="max-width: 350px;">
                <h3>${t('menu.title')}</h3>
                <div class="modal-section">
                    <h4>${t('menu.language')}</h4>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button id="lang-en-btn" class="btn-secondary" style="flex: 1;">English</button>
                        <button id="lang-ru-btn" class="btn-secondary" style="flex: 1;">Русский</button>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button id="reset-game-btn" class="btn-primary">${t('menu.reset')}</button>
                    <button id="close-menu-btn" class="btn-secondary">${t('menu.close')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
        
        // Обработчики кнопок
        document.getElementById('reset-game-btn').addEventListener('click', () => {
            if (confirm(t('menu.confirmReset'))) {
                resetGame();
            }
        });
        
        // Обработчики переключения языка
        document.getElementById('lang-en-btn').addEventListener('click', () => {
            setLanguage('en');
        });
        
        document.getElementById('lang-ru-btn').addEventListener('click', () => {
            setLanguage('ru');
        });
        
        document.getElementById('close-menu-btn').addEventListener('click', () => {
            menu.style.display = 'none';
        });
        
        // Закрытие по клику вне модального окна
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                menu.style.display = 'none';
            }
        });
    }
    
    menu.style.display = 'flex';
}

// Настройка меню игры
function setupGameMenu() {
    const timeElement = document.getElementById('game-time');
    if (timeElement) {
        timeElement.style.cursor = 'pointer';
        timeElement.addEventListener('click', () => {
            showGameMenu();
        });
    }
}

// Инициализация
function init() {
    // Загружаем язык
    loadLanguage();
    
    // Инициализация кэша зданий
    buildingsCache = new Map();
    buildings.forEach(b => buildingsCache.set(b.id, b));
    
    // Инициализация панели ресурсов
    initResourcesBar();
    
    setBuildingSizes();
    
    // Загружаем сохранение перед генерацией карты и рендерингом
    const loaded = loadGame();
    
    // Генерируем карту только если загрузка не удалась
    if (!loaded) {
        generateMap();
    }
    
    renderMap();
    renderMiniMap();
    renderBuildings(1);
    renderResources();
    setupTabs();
    setupEventListeners();
    setupAreaSelection();
    setupGameMenu();
    startGameLoop();
    updateGameTime();
    
    // Автосохранение каждые 30 секунд (очищаем предыдущий интервал если есть)
    if (autoSaveIntervalId) {
        clearInterval(autoSaveIntervalId);
    }
    autoSaveIntervalId = setInterval(() => {
        saveGame();
    }, 30000);
    
    // Сохраняем при закрытии страницы
    window.addEventListener('beforeunload', () => {
        saveGame();
    });
    
    // Обновляем viewport на мини-карте при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateMiniMapViewport();
        }, 100);
    });
    
    if (loaded) {
        updateInfoPanel(t('msg.progressLoaded'));
    }
    
    // Обновляем интерфейс с учетом языка
    updateUI();
    
    // Обработчики для клавиши Ctrl (для показа бейджей) и Esc (для отмены строительства)
    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            isCtrlPressed = true;
        }
        // Отмена строительства по Esc
        if (e.key === 'Escape' && gameMap.buildingToPlace) {
            e.preventDefault();
            e.stopPropagation();
            cancelBuildingPlacement();
        }
        
        // Горячие клавиши для эр (1-6)
        if (!e.ctrlKey && !e.altKey && !e.shiftKey && e.key >= '1' && e.key <= '6') {
            const era = e.key === '6' ? 'citadel' : parseInt(e.key);
            const tabBtn = document.querySelector(`.tab-btn[data-era="${era}"]`);
            if (tabBtn) {
                e.preventDefault();
                tabBtn.click();
            }
        }
        
        // Сохранение: Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveGame();
            updateInfoPanel(t('msg.progressLoaded'));
        }
        
        // Меню: M или F10
        if ((e.key === 'm' || e.key === 'M' || e.key === 'F10') && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            const menuBtn = document.getElementById('game-menu-btn');
            if (menuBtn) {
                menuBtn.click();
            } else {
                setupGameMenu();
                const menu = document.getElementById('game-menu');
                if (menu) menu.style.display = 'flex';
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            isCtrlPressed = false;
            hideMapBadge();
        }
    });
    
    // Также отслеживаем когда Ctrl теряет фокус (например, при переключении окна)
    window.addEventListener('blur', () => {
        isCtrlPressed = false;
        hideMapBadge();
    });
}

// Рендеринг карты
function renderMap() {
    const mapContainer = document.getElementById('game-map');
    mapContainer.innerHTML = '';
    
    // Сбрасываем кэш grid элемента при перерисовке карты
    gridElementCache = null;
    
    // Обновляем занятые клетки
    updateOccupiedTiles();
    
    const grid = document.createElement('div');
    grid.className = 'map-grid';
    grid.style.gridTemplateColumns = `repeat(${gameMap.width}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${gameMap.height}, 40px)`;
    grid.style.transform = `scale(${gameMap.zoom})`;
    grid.style.transformOrigin = '0 0';
    grid.style.width = `${gameMap.width * 40 * gameMap.zoom}px`;
    grid.style.height = `${gameMap.height * 40 * gameMap.zoom}px`;
    
    for (let y = 0; y < gameMap.height; y++) {
        for (let x = 0; x < gameMap.width; x++) {
            const tile = gameMap.tiles[y][x];
            const tileElement = document.createElement('div');
            tileElement.className = `tile ${tile.type}`;
            tileElement.dataset.x = x;
            tileElement.dataset.y = y;
            // Обработчики событий теперь на grid (делегирование) - экономия памяти (2500 тайлов = 2500 обработчиков вместо 3)
            grid.appendChild(tileElement);
        }
    }
    
    mapContainer.appendChild(grid);
    
    // Делегирование событий на grid для всех тайлов (оптимизация памяти)
    // Это экономит ~7500 обработчиков событий (2500 тайлов × 3 события)
    let lastHoveredTileKey = null;
    
    grid.addEventListener('click', (e) => {
        const tile = e.target.closest('.tile');
        if (tile && !e.target.closest('.map-building')) {
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            if (!isNaN(x) && !isNaN(y)) {
                e.stopPropagation();
                handleTileClick(x, y, e);
            }
        }
    });
    
    grid.addEventListener('mouseover', (e) => {
        const tile = e.target.closest('.tile');
        if (tile && !e.target.closest('.map-building')) {
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            if (!isNaN(x) && !isNaN(y)) {
                const tileKey = `${x},${y}`;
                // Проверяем, не является ли это тем же тайлом
                if (lastHoveredTileKey !== tileKey) {
                    lastHoveredTileKey = tileKey;
                    handleTileHover(x, y);
                    // Показываем бейдж с типом тайла
                    const tileData = gameMap.tiles[y][x];
                    if (tileData) {
                        const tileName = getTileName(tileData.type);
                        showMapBadge(tileName, e.clientX, e.clientY, 'tile');
                    }
                }
            }
        }
    });
    
    grid.addEventListener('mousemove', (e) => {
        const tile = e.target.closest('.tile');
        if (tile && !e.target.closest('.map-building')) {
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            if (!isNaN(x) && !isNaN(y)) {
                const tileData = gameMap.tiles[y][x];
                if (tileData) {
                    const tileName = getTileName(tileData.type);
                    showMapBadge(tileName, e.clientX, e.clientY, 'tile');
                }
            }
        }
    });
    
    grid.addEventListener('mouseout', (e) => {
        const tile = e.target.closest('.tile');
        // Проверяем, покинули ли мы тайл (relatedTarget не находится внутри тайла)
        if (tile && (!e.relatedTarget || !tile.contains(e.relatedTarget))) {
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            if (!isNaN(x) && !isNaN(y)) {
                const tileKey = `${x},${y}`;
                if (lastHoveredTileKey === tileKey) {
                    lastHoveredTileKey = null;
                }
                handleTileLeave(x, y);
                // Скрываем бейдж, если не перешли на здание
                if (!e.relatedTarget || !e.relatedTarget.closest('.map-building')) {
                    hideMapBadge();
                }
            }
        }
    });
    
    // Рендеринг зданий
    renderMapBuildings();
}

// Обновление множества занятых клеток (оптимизировано с кэшем)
function updateOccupiedTiles() {
    gameMap.occupiedTiles.clear();
    const newHash = gameMap.buildings.map(b => `${b.instanceId}:${b.x},${b.y}`).join('|');
    
    gameMap.buildings.forEach(building => {
        const buildingData = buildingsCache.get(building.buildingId);
        if (!buildingData) return;
        const rotation = building.rotation || 0;
        const size = getBuildingSize(buildingData, rotation);
        const width = size.width;
        const height = size.height;
        
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                gameMap.occupiedTiles.add(`${building.x + dx},${building.y + dy}`);
            }
        }
    });
    
    // Если здания изменились, инвалидируем кэш групп
    if (newHash !== buildingsHash) {
        buildingGroupsCache.clear();
        buildingsHash = newHash;
    }
}

// Поиск соседних зданий того же типа (по осям X и Y, не по диагонали)
function getAdjacentSameTypeBuildings(buildingInstance) {
    const building = buildingsCache.get(buildingInstance.buildingId);
    if (!building) return [];
    
    const width = buildingInstance.width || building.width || 1;
    const height = buildingInstance.height || building.height || 1;
    
    // Получаем граничные клетки здания
    const boundaryCells = [];
    
    // Верхняя и нижняя границы
    for (let dx = 0; dx < width; dx++) {
        boundaryCells.push({ x: buildingInstance.x + dx, y: buildingInstance.y - 1 }); // Верх
        boundaryCells.push({ x: buildingInstance.x + dx, y: buildingInstance.y + height }); // Низ
    }
    
    // Левая и правая границы
    for (let dy = 0; dy < height; dy++) {
        boundaryCells.push({ x: buildingInstance.x - 1, y: buildingInstance.y + dy }); // Лево
        boundaryCells.push({ x: buildingInstance.x + width, y: buildingInstance.y + dy }); // Право
    }
    
    // Проверяем каждую граничную клетку на наличие соседнего здания того же типа
    const foundBuildings = new Set();
    
    boundaryCells.forEach(cell => {
        gameMap.buildings.forEach(otherBuilding => {
            if (otherBuilding.instanceId === buildingInstance.instanceId) return;
            
            const otherBuildingData = buildingsCache.get(otherBuilding.buildingId);
            if (!otherBuildingData || otherBuilding.buildingId !== buildingInstance.buildingId) return;
            
            const otherWidth = otherBuilding.width || otherBuildingData.width || 1;
            const otherHeight = otherBuilding.height || otherBuildingData.height || 1;
            
            // Проверяем, находится ли клетка внутри другого здания
            if (cell.x >= otherBuilding.x && cell.x < otherBuilding.x + otherWidth &&
                cell.y >= otherBuilding.y && cell.y < otherBuilding.y + otherHeight) {
                foundBuildings.add(otherBuilding.instanceId);
            }
        });
    });
    
    return Array.from(foundBuildings).map(id => 
        gameMap.buildings.find(b => b.instanceId === id)
    ).filter(Boolean);
}

// Получить группу зданий (связанные здания одного типа)
function getBuildingGroup(buildingInstance) {
    const visited = new Set();
    const group = [];
    const queue = [buildingInstance];
    
    while (queue.length > 0) {
        const current = queue.shift();
        if (visited.has(current.instanceId)) continue;
        
        visited.add(current.instanceId);
        group.push(current);
        
        const adjacent = getAdjacentSameTypeBuildings(current);
        adjacent.forEach(adj => {
            if (!visited.has(adj.instanceId)) {
                queue.push(adj);
            }
        });
    }
    
    return group;
}

// Получить размер группы зданий с кэшированием (оптимизация производительности)
function getBuildingGroupSize(buildingInstance) {
    // Проверяем кэш
    if (buildingGroupsCache.has(buildingInstance.instanceId)) {
        return buildingGroupsCache.get(buildingInstance.instanceId);
    }
    
    // Вычисляем размер группы
    const group = getBuildingGroup(buildingInstance);
    const groupSize = group.length;
    
    // Кэшируем размер для всех зданий в группе
    group.forEach(b => {
        buildingGroupsCache.set(b.instanceId, groupSize);
    });
    
    // Ограничиваем размер кэша (оптимизация памяти)
    if (buildingGroupsCache.size > MAX_GROUPS_CACHE_SIZE) {
        // Удаляем 25% старых записей (FIFO через итерацию)
        const keysToDelete = Array.from(buildingGroupsCache.keys()).slice(0, Math.floor(MAX_GROUPS_CACHE_SIZE * 0.25));
        keysToDelete.forEach(key => buildingGroupsCache.delete(key));
    }
    
    return groupSize;
}

// Получить граничные сегменты группы зданий для выделения контуром
function getGroupOutlineSegments(group) {
    if (group.length === 0) return [];
    
    // Создаем карту занятых клеток
    const occupiedCells = new Set();
    group.forEach(building => {
        const buildingData = buildingsCache.get(building.buildingId);
        const width = buildingData?.width || building.width || 1;
        const height = buildingData?.height || building.height || 1;
        
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                occupiedCells.add(`${building.x + dx},${building.y + dy}`);
            }
        }
    });
    
    // Находим граничные сегменты (только внешние границы)
    const segments = [];
    
    group.forEach(building => {
        const buildingData = buildingsCache.get(building.buildingId);
        const width = buildingData?.width || building.width || 1;
        const height = buildingData?.height || building.height || 1;
        
        // Верхняя сторона (проверяем каждую клетку и объединяем соседние)
        let topStart = null;
        for (let dx = 0; dx <= width; dx++) {
            const x = building.x + dx;
            const y = building.y - 1;
            const isFree = !occupiedCells.has(`${x},${y}`);
            
            if (isFree && topStart === null) {
                topStart = dx;
            } else if (!isFree && topStart !== null) {
                segments.push({ 
                    x: (building.x + topStart) * 40, 
                    y: building.y * 40, 
                    width: (dx - topStart) * 40, 
                    height: 3 
                });
                topStart = null;
            }
        }
        if (topStart !== null) {
            segments.push({ 
                x: (building.x + topStart) * 40, 
                y: building.y * 40, 
                width: (width - topStart) * 40, 
                height: 3 
            });
        }
        
        // Нижняя сторона
        let bottomStart = null;
        for (let dx = 0; dx <= width; dx++) {
            const x = building.x + dx;
            const y = building.y + height;
            const isFree = !occupiedCells.has(`${x},${y}`);
            
            if (isFree && bottomStart === null) {
                bottomStart = dx;
            } else if (!isFree && bottomStart !== null) {
                segments.push({ 
                    x: (building.x + bottomStart) * 40, 
                    y: (building.y + height) * 40 - 3, 
                    width: (dx - bottomStart) * 40, 
                    height: 3 
                });
                bottomStart = null;
            }
        }
        if (bottomStart !== null) {
            segments.push({ 
                x: (building.x + bottomStart) * 40, 
                y: (building.y + height) * 40 - 3, 
                width: (width - bottomStart) * 40, 
                height: 3 
            });
        }
        
        // Левая сторона
        let leftStart = null;
        for (let dy = 0; dy <= height; dy++) {
            const x = building.x - 1;
            const y = building.y + dy;
            const isFree = !occupiedCells.has(`${x},${y}`);
            
            if (isFree && leftStart === null) {
                leftStart = dy;
            } else if (!isFree && leftStart !== null) {
                segments.push({ 
                    x: building.x * 40 - 3, 
                    y: (building.y + leftStart) * 40, 
                    width: 3, 
                    height: (dy - leftStart) * 40 
                });
                leftStart = null;
            }
        }
        if (leftStart !== null) {
            segments.push({ 
                x: building.x * 40 - 3, 
                y: (building.y + leftStart) * 40, 
                width: 3, 
                height: (height - leftStart) * 40 
            });
        }
        
        // Правая сторона
        let rightStart = null;
        for (let dy = 0; dy <= height; dy++) {
            const x = building.x + width;
            const y = building.y + dy;
            const isFree = !occupiedCells.has(`${x},${y}`);
            
            if (isFree && rightStart === null) {
                rightStart = dy;
            } else if (!isFree && rightStart !== null) {
                segments.push({ 
                    x: (building.x + width) * 40 - 3, 
                    y: (building.y + rightStart) * 40, 
                    width: 3, 
                    height: (dy - rightStart) * 40 
                });
                rightStart = null;
            }
        }
        if (rightStart !== null) {
            segments.push({ 
                x: (building.x + width) * 40 - 3, 
                y: (building.y + rightStart) * 40, 
                width: 3, 
                height: (height - rightStart) * 40 
            });
        }
    });
    
    return segments;
}

// Рендеринг зданий на карте (оптимизировано с кэшем + выделение групп)
function renderMapBuildings() {
    // Используем кэшированный элемент grid
    if (!gridElementCache) {
        gridElementCache = document.querySelector('.map-grid');
    }
    const grid = gridElementCache;
    if (!grid) return;
    
    // Очищаем старые здания и выделения (кроме сетки)
    const oldBuildings = grid.querySelectorAll('.map-building, .building-group-outline-segment');
    oldBuildings.forEach(el => el.remove());
    
    // Находим группы зданий
    const buildingGroups = [];
    
    gameMap.buildings.forEach(building => {
        // Проверяем, не обработана ли уже группа этого здания
        let isProcessed = false;
        for (const group of buildingGroups) {
            if (group.buildings.some(b => b.instanceId === building.instanceId)) {
                isProcessed = true;
                break;
            }
        }
        
        if (!isProcessed) {
            const group = getBuildingGroup(building);
            if (group.length > 1) { // Группа из 2+ зданий
                buildingGroups.push({ buildings: group });
            }
        }
    });
    
    // Рендерим группы (выделение по границам зданий с разными цветами)
    // Создаем карту занятых сегментов для предотвращения наложения
    const occupiedSegments = new Map(); // Map<"x,y", {groupId, color}>
    
    buildingGroups.forEach((groupData, groupIndex) => {
        const segments = getGroupOutlineSegments(groupData.buildings);
        // Получаем цвет для типа зданий в группе
        const buildingType = groupData.buildings[0]?.buildingId;
        const color = getBuildingGroupColor(buildingType);
        
        segments.forEach(segment => {
            // Создаем ключ для проверки наложения
            const segmentKey = `${Math.floor(segment.x)},${Math.floor(segment.y)},${Math.floor(segment.width)},${Math.floor(segment.height)}`;
            
            // Проверяем, не занят ли этот сегмент другой группой
            // Если занят, пропускаем (чтобы избежать наложения)
            if (occupiedSegments.has(segmentKey)) {
                const existing = occupiedSegments.get(segmentKey);
                // Если это та же группа, пропускаем (дубликат)
                if (existing.groupId === groupIndex) {
                    return;
                }
                // Если другая группа, пропускаем этот сегмент (избегаем наложения)
                return;
            }
            
            // Помечаем сегмент как занятый
            occupiedSegments.set(segmentKey, { groupId: groupIndex, color: color });
            
            const outlineSegment = document.createElement('div');
            outlineSegment.className = 'building-group-outline-segment';
            outlineSegment.style.left = `${segment.x}px`;
            outlineSegment.style.top = `${segment.y}px`;
            outlineSegment.style.width = `${segment.width}px`;
            outlineSegment.style.height = `${segment.height}px`;
            outlineSegment.style.borderColor = color;
            outlineSegment.style.backgroundColor = `${color}40`; // Полупрозрачный фон
            outlineSegment.style.color = color; // Для box-shadow в анимации
            grid.appendChild(outlineSegment);
        });
    });
    
    // Рендерим здания
    gameMap.buildings.forEach(building => {
        const buildingData = buildingsCache.get(building.buildingId);
        if (!buildingData) return;
        
        // Используем rotation здания при расчете размеров
        const rotation = building.rotation || 0;
        const size = getBuildingSize(buildingData, rotation);
        const width = size.width;
        const height = size.height;
        
        // Проверяем, является ли здание выбранным
        const isSelected = gameMap.selectedBuildings && 
                          gameMap.selectedBuildings.some(b => b.instanceId === building.instanceId) ||
                          gameMap.selectedBuilding === building.instanceId;
        
        const buildingElement = document.createElement('div');
        buildingElement.className = 'map-building';
        if (isSelected) {
            buildingElement.classList.add('selected');
        }
        
        // Добавляем индикатор статуса работы
        const workStatus = buildingWorkStatus.get(building.instanceId);
        if (workStatus) {
            if (workStatus.working) {
                buildingElement.classList.add('building-working');
            } else {
                buildingElement.classList.add('building-not-working');
                buildingElement.title = t('ui.notWorking') + (workStatus.reason ? ': ' + workStatus.reason : '');
            }
        }
        
        buildingElement.style.left = `${building.x * 40}px`;
        buildingElement.style.top = `${building.y * 40}px`;
        buildingElement.style.width = `${width * 40}px`;
        buildingElement.style.height = `${height * 40}px`;
        buildingElement.innerHTML = getBuildingIconHTML(buildingData.icon, buildingData.id);
        buildingElement.dataset.instanceId = building.instanceId;
        buildingElement.setAttribute('data-instance-id', building.instanceId);
        
        // Проверяем, входит ли здание в группу
        const inGroup = buildingGroups.some(g => 
            g.buildings.some(b => b.instanceId === building.instanceId)
        );
        if (inGroup) {
            buildingElement.classList.add('in-group');
        }
        
        // Обработчик начала перетаскивания (для всех зданий, но проверяем выбор)
        buildingElement.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            // Проверяем, выбрано ли это здание (включая одиночный выбор)
            const isCurrentlySelected = (gameMap.selectedBuildings && 
                                      gameMap.selectedBuildings.some(b => b.instanceId === building.instanceId)) ||
                                      (gameMap.selectedBuilding === building.instanceId);
            
            // Если здание выбрано (одиночно или в группе) - начинаем перетаскивание
            if (isCurrentlySelected && !gameMap.draggingBuildings) {
                // Если здание выбрано одиночно, но не в массиве - добавляем его
                if (gameMap.selectedBuilding === building.instanceId && 
                    (!gameMap.selectedBuildings || gameMap.selectedBuildings.length === 0)) {
                    gameMap.selectedBuildings = [building];
                }
                
                buildingElement.style.cursor = 'move';
                startDragBuildings(e, building);
            }
        });
        
        // Обработчик клика на здание - используем ту же логику, что и для тайлов
        buildingElement.addEventListener('click', (e) => {
            // Если было перетаскивание, не обрабатываем клик
            if (gameMap.draggingBuildings) {
                e.stopPropagation();
                return;
            }
            
            // Если выбрано здание для постройки, не останавливаем распространение события
            // чтобы клик мог пройти к тайлу и обработаться там
            if (!gameMap.buildingToPlace) {
                e.stopPropagation();
            }
            
            // Передаем координаты здания, сам объект здания и событие
            handleBuildingClick(building, e);
        });
        
        // Обработчик наведения на здание - показываем бейдж с названием
        buildingElement.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            const buildingName = getBuildingName(building.buildingId);
            showMapBadge(buildingName, e.clientX, e.clientY);
        });
        
        buildingElement.addEventListener('mousemove', (e) => {
            e.stopPropagation();
            const buildingName = getBuildingName(building.buildingId);
            showMapBadge(buildingName, e.clientX, e.clientY);
        });
        
        buildingElement.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            // Скрываем бейдж только если не перешли на другой элемент здания
            if (!e.relatedTarget || !e.relatedTarget.closest('.map-building')) {
                hideMapBadge();
            }
        });
        
        // Устанавливаем курсор для выбранных зданий (одиночный выбор или в группе)
        if (isSelected || gameMap.selectedBuilding === building.instanceId) {
            buildingElement.style.cursor = 'move';
        }
        
        grid.appendChild(buildingElement);
    });
    
    // Обновляем визуальное выделение после рендеринга
    updateBuildingSelection();
    
    // Сбрасываем кэш статусов после перерисовки зданий
    // (так как DOM элементы были пересозданы)
    buildingStatusCache.clear();
}

// Обновление визуальных индикаторов статуса зданий (оптимизировано)
function updateBuildingStatusIndicators() {
    // Используем кэшированный элемент grid
    if (!gridElementCache) {
        gridElementCache = document.querySelector('.map-grid');
    }
    const grid = gridElementCache;
    if (!grid) return;
    
    // Используем DocumentFragment для батчинга операций (если нужно)
    let hasChanges = false;
    
    // Получаем все здания один раз
    const buildings = grid.querySelectorAll('.map-building');
    
    // Оптимизация: обновляем только те здания, статус которых изменился
    buildings.forEach(buildingEl => {
        const instanceId = parseInt(buildingEl.dataset.instanceId);
        if (isNaN(instanceId)) return;
        
        const workStatus = buildingWorkStatus.get(instanceId);
        const previousStatus = buildingStatusCache.get(instanceId);
        
        // Проверяем, изменился ли статус
        const statusChanged = !previousStatus || 
                             previousStatus.working !== workStatus?.working ||
                             previousStatus.reason !== workStatus?.reason;
        
        if (!statusChanged && workStatus) {
            // Статус не изменился, пропускаем обновление
            return;
        }
        
        hasChanges = true;
        
        // Обновляем кэш статуса
        if (workStatus) {
            buildingStatusCache.set(instanceId, {
                working: workStatus.working,
                reason: workStatus.reason || ''
            });
        }
        
        // Удаляем старые классы статуса только если они есть
        const hasWorking = buildingEl.classList.contains('building-working');
        const hasNotWorking = buildingEl.classList.contains('building-not-working');
        
        if (workStatus) {
            if (workStatus.working) {
                // Добавляем класс только если его нет
                if (!hasWorking) {
                    buildingEl.classList.add('building-working');
                }
                // Удаляем класс неработающего только если он есть
                if (hasNotWorking) {
                    buildingEl.classList.remove('building-not-working');
                }
                // Удаляем title если он был установлен для неработающего здания
                if (buildingEl.title && buildingEl.title.startsWith(t('ui.notWorking'))) {
                    buildingEl.removeAttribute('title');
                }
            } else {
                // Добавляем класс только если его нет
                if (!hasNotWorking) {
                    buildingEl.classList.add('building-not-working');
                }
                // Удаляем класс работающего только если он есть
                if (hasWorking) {
                    buildingEl.classList.remove('building-working');
                }
                // Обновляем title только если он изменился
                const newTitle = t('ui.notWorking') + (workStatus.reason ? ': ' + workStatus.reason : '');
                if (buildingEl.title !== newTitle) {
                    buildingEl.title = newTitle;
                }
            }
        } else {
            // Нет статуса - удаляем все классы статуса
            if (hasWorking) buildingEl.classList.remove('building-working');
            if (hasNotWorking) buildingEl.classList.remove('building-not-working');
        }
    });
    
    // Если зданий нет в DOM, но есть в кэше статуса - очищаем кэш
    if (buildings.length === 0 && buildingStatusCache.size > 0) {
        // Очищаем кэш статусов для несуществующих зданий
        const existingIds = new Set();
        buildings.forEach(el => {
            const id = parseInt(el.dataset.instanceId);
            if (!isNaN(id)) existingIds.add(id);
        });
        
        buildingStatusCache.forEach((_, id) => {
            if (!existingIds.has(id)) {
                buildingStatusCache.delete(id);
            }
        });
    }
}

// Отслеживание кликов для выбора зданий
let clickState = {
    lastClickTime: 0,
    lastClickTile: null,
    clickCount: 0,
    lastBuildingId: null,
    timeout: null
};

// Обработка клика по зданию (вызывается из обработчика здания)
function handleBuildingClick(building, event = null) {
    if (gameMap.buildingToPlace) {
        // Если выбрано здание для постройки - нельзя строить на уже занятом месте
        // Игнорируем клик по уже построенному зданию, чтобы не мешать строительству
        // Пользователь должен кликнуть на свободное место для постройки
        // НЕ вызываем stopPropagation, чтобы клик мог пройти дальше к тайлу
        return;
    }
    
    processBuildingSelection(building, event);
}

// Обработка клика по тайлу (оптимизировано - проверяет все клетки здания)
function handleTileClick(x, y, event = null) {
    if (gameMap.buildingToPlace) {
        // Если выбрано здание для постройки - размещаем его
        placeBuilding(x, y, gameMap.buildingToPlace);
        return;
    }
    
    // Находим здание на тайле
    const building = gameMap.buildings.find(b => {
        const buildingData = buildingsCache.get(b.buildingId);
        const width = buildingData?.width || b.width || 1;
        const height = buildingData?.height || b.height || 1;
        return x >= b.x && x < b.x + width && y >= b.y && y < b.y + height;
    });
    
    if (building) {
        processBuildingSelection(building, event);
    } else {
        // Если кликнули по пустому месту - снимаем выбор зданий, но не отменяем строительство
        // Строительство отменяется только по Esc
        if (clickState.timeout) {
            clearTimeout(clickState.timeout);
            clickState.timeout = null;
        }
        
        // Не очищаем buildingToPlace - здание остается выбранным для строительства
        gameMap.selectedBuilding = null;
        gameMap.selectedBuildings = [];
        gameMap.selectionMode = 'single';
        
        // Обновляем визуальное выделение (убираем выделение зданий)
        updateBuildingSelection();
        
        document.querySelectorAll('.building-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Если здание выбрано для строительства, показываем соответствующее сообщение
        if (gameMap.buildingToPlace) {
            updateInfoPanel(t('msg.selectLocation', { name: getBuildingName(gameMap.buildingToPlace.id) }));
        } else {
            updateInfoPanel(t('msg.selectBuilding'));
        }
        
        const panel = document.getElementById('selected-panel');
        if (panel) {
            panel.style.display = 'none';
            panel.classList.remove('visible');
        }
        
        // Сбрасываем состояние кликов
        clickState.lastClickTime = 0;
        clickState.lastClickTile = null;
        clickState.clickCount = 0;
        clickState.lastBuildingId = null;
    }
}

// Обработка выбора здания с учетом модификаторов клавиш
function processBuildingSelection(building, event = null) {
    // Проверяем, зажата ли клавиша Ctrl
    const isCtrlPressed = event && event.ctrlKey;
    // Проверяем, зажата ли клавиша Shift
    const isShiftPressed = event && event.shiftKey;
    
    // Проверяем, выбрано ли это здание
    const isCurrentlySelected = (gameMap.selectedBuildings && 
                                  gameMap.selectedBuildings.some(b => b.instanceId === building.instanceId)) ||
                                  (gameMap.selectedBuilding === building.instanceId);
    
    // Очищаем предыдущий таймаут
    if (clickState.timeout) {
        clearTimeout(clickState.timeout);
        clickState.timeout = null;
    }
    
    // Если Ctrl зажат - выбираем группу (даже если здание уже выбрано)
    if (isCtrlPressed) {
        selectBuildingGroup(building.instanceId);
        // Сбрасываем состояние
        clickState.lastClickTime = 0;
        clickState.lastClickTile = null;
        clickState.clickCount = 0;
        clickState.lastBuildingId = null;
        return;
    }
    
    // Если Shift зажат - выбираем все здания этого типа (даже если здание уже выбрано)
    if (isShiftPressed) {
        selectAllBuildingsOfType(building.buildingId);
        // Сбрасываем состояние
        clickState.lastClickTime = 0;
        clickState.lastClickTile = null;
        clickState.clickCount = 0;
        clickState.lastBuildingId = null;
        return;
    }
    
    // Обычный клик без модификаторов
    // Если здание уже выбрано - ничего не делаем
    if (isCurrentlySelected) {
        // Сбрасываем состояние, но не меняем выбор
        clickState.lastClickTime = 0;
        clickState.lastClickTile = null;
        clickState.clickCount = 0;
        clickState.lastBuildingId = null;
        return;
    }
    
    // Если здание не выбрано - выбираем его
    selectSingleBuilding(building.instanceId);
    
    // Сбрасываем состояние
    clickState.lastClickTime = 0;
    clickState.lastClickTile = null;
    clickState.clickCount = 0;
    clickState.lastBuildingId = null;
}

// Отмена строительства
function cancelBuildingPlacement() {
    gameMap.buildingToPlace = null;
    clearPreview();
    document.querySelectorAll('.building-item').forEach(item => {
        item.classList.remove('selected');
    });
    updateInfoPanel(t('msg.selectBuilding'));
}

// Кэш для hover (избегаем лишних обновлений)
let lastHoverTile = null;

// Получить размеры здания с учетом ротации
function getBuildingSize(building, rotation = 0) {
    const baseWidth = building.width || 1;
    const baseHeight = building.height || 1;
    if (rotation === 1) {
        return { width: baseHeight, height: baseWidth };
    }
    return { width: baseWidth, height: baseHeight };
}

// Единая функция для преобразования координат мыши в координаты тайла
function getTileCoordinatesFromMouse(e) {
    const grid = document.querySelector('.map-grid');
    if (!grid) return null;
    
    const mapContainer = grid.closest('.game-map-container');
    if (!mapContainer) return null;
    
    const tileSize = 40;
    
    // Получаем позицию grid относительно viewport
    const gridRect = grid.getBoundingClientRect();
    
    // Вычисляем позицию мыши относительно grid с учетом scroll контейнера
    // clientX/Y - позиция мыши относительно viewport
    // gridRect.left/top - позиция grid относительно viewport (уже учитывает scroll визуально)
    // scrollLeft/Top - насколько прокручен контейнер
    const mouseX = (e.clientX - gridRect.left) + mapContainer.scrollLeft;
    const mouseY = (e.clientY - gridRect.top) + mapContainer.scrollTop;
    
    // Преобразуем в координаты тайла с учетом zoom
    const tileX = Math.floor(mouseX / (tileSize * gameMap.zoom));
    const tileY = Math.floor(mouseY / (tileSize * gameMap.zoom));
    
    return { x: tileX, y: tileY };
}

// Обработка наведения на тайл (оптимизировано с кэшированием)
function handleTileHover(x, y) {
    if (!gameMap.buildingToPlace) return;
    
    // Пропускаем, если идет выделение области (preview массовой постройки уже показывается)
    if (gameMap.selectionBox.active) return;
    
    // Пропускаем если та же клетка
    if (lastHoverTile && lastHoverTile.x === x && lastHoverTile.y === y) return;
    lastHoverTile = { x, y };
    
    const building = gameMap.buildingToPlace;
    const size = getBuildingSize(building, gameMap.buildingRotation);
    const width = size.width;
    const height = size.height;
    
    // Очищаем предыдущие preview
    clearPreview();
    
    // Проверка возможности строительства
    const canBuild = canPlaceBuilding(x, y, building);
    
    // Подсветка всех клеток здания (используем requestAnimationFrame для плавности)
    requestAnimationFrame(() => {
        gameMap.previewTiles = [];
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const tx = x + dx;
                const ty = y + dy;
                if (tx >= 0 && tx < gameMap.width && ty >= 0 && ty < gameMap.height) {
                    const tileElement = document.querySelector(`.tile[data-x="${tx}"][data-y="${ty}"]`);
                    if (tileElement) {
                        gameMap.previewTiles.push(`${tx},${ty}`);
                        tileElement.classList.remove('can-build', 'cannot-build', 'preview');
                        if (canBuild) {
                            tileElement.classList.add('preview');
                        } else {
                            tileElement.classList.add('cannot-build');
                        }
                    }
                }
            }
        }
    });
}

// Обработка ухода мыши с тайла (оптимизировано)
function handleTileLeave(x, y) {
    if (!gameMap.buildingToPlace) return;
    lastHoverTile = null;
    clearPreview();
}

// Очистка preview
function clearPreview() {
    // Очищаем все тайлы с превью
    gameMap.previewTiles.forEach(tileKey => {
        const [tx, ty] = tileKey.split(',').map(Number);
        const tileElement = document.querySelector(`.tile[data-x="${tx}"][data-y="${ty}"]`);
        if (tileElement) {
            tileElement.classList.remove('can-build', 'cannot-build', 'preview');
        }
    });
    gameMap.previewTiles = [];
    
    // Дополнительно: очищаем все тайлы с классом preview на случай, если что-то осталось
    document.querySelectorAll('.tile.preview, .tile.cannot-build').forEach(tile => {
        tile.classList.remove('can-build', 'cannot-build', 'preview');
    });
}

// Показать preview для массовой постройки
function showMassBuildPreview(building, positionsToBuild) {
    // Очищаем предыдущий preview
    clearPreview();
    
    const width = building.width || 1;
    const height = building.height || 1;
    
    // Показываем preview для всех позиций, где будут построены здания
    requestAnimationFrame(() => {
        gameMap.previewTiles = [];
        
        positionsToBuild.forEach(pos => {
            for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                    const tx = pos.x + dx;
                    const ty = pos.y + dy;
                    if (tx >= 0 && tx < gameMap.width && ty >= 0 && ty < gameMap.height) {
                        const tileKey = `${tx},${ty}`;
                        const tileElement = document.querySelector(`.tile[data-x="${tx}"][data-y="${ty}"]`);
                        if (tileElement && !gameMap.previewTiles.includes(tileKey)) {
                            gameMap.previewTiles.push(tileKey);
                            tileElement.classList.remove('can-build', 'cannot-build', 'preview');
                            tileElement.classList.add('preview');
                        }
                    }
                }
            }
        });
    });
}

// Начать перетаскивание зданий
function startDragBuildings(e, building) {
    if (!gameMap.selectedBuildings || gameMap.selectedBuildings.length === 0) return;
    
    const buildingsToMove = gameMap.selectedBuildings;
    if (!buildingsToMove.some(b => b.instanceId === building.instanceId)) return;
    
    // Находим минимальные координаты группы
    let minX = Infinity;
    let minY = Infinity;
    buildingsToMove.forEach(b => {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
    });
    
    // Получаем координаты клика на карте
    const tileCoords = getTileCoordinatesFromMouse(e);
    if (!tileCoords) return;
    const clickTileX = tileCoords.x;
    const clickTileY = tileCoords.y;
    
    // Вычисляем смещения для всех зданий относительно минимальных координат
    const offsets = buildingsToMove.map(b => ({
        building: b,
        offsetX: b.x - minX,
        offsetY: b.y - minY
    }));
    
    // Вычисляем смещение клика относительно минимальных координат
    const clickOffsetX = clickTileX - minX;
    const clickOffsetY = clickTileY - minY;
    
    // Вычисляем размеры группы
    let maxX = -Infinity;
    let maxY = -Infinity;
    buildingsToMove.forEach(b => {
        const buildingData = buildingsCache.get(b.buildingId);
        if (buildingData) {
            const rotation = b.rotation || 0;
            const size = getBuildingSize(buildingData, rotation);
            maxX = Math.max(maxX, b.x + size.width - 1);
            maxY = Math.max(maxY, b.y + size.height - 1);
        }
    });
    const groupWidth = maxX - minX + 1;
    const groupHeight = maxY - minY + 1;
    
    gameMap.draggingBuildings = {
        buildings: buildingsToMove,
        offsets: offsets,
        clickOffsetX: clickOffsetX,
        clickOffsetY: clickOffsetY,
        groupWidth: groupWidth,
        groupHeight: groupHeight,
        rotationCount: 0 // количество поворотов (0, 1, 2, 3)
    };
    
    e.preventDefault();
    e.stopPropagation();
    
    // Добавляем обработчики для перетаскивания
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // Предотвращаем выделение текста во время перетаскивания
    document.body.style.userSelect = 'none';
}

// Обработка движения мыши при перетаскивании
function handleDragMove(e) {
    if (!gameMap.draggingBuildings) return;
    
    e.preventDefault();
    
    const tileCoords = getTileCoordinatesFromMouse(e);
    if (!tileCoords) return;
    
    const mouseTileX = tileCoords.x;
    const mouseTileY = tileCoords.y;
    
    // Сохраняем для использования при повороте
        const grid = document.querySelector('.map-grid');
        if (grid) {
            const mapContainer = grid.closest('.game-map-container');
            const gridRect = grid.getBoundingClientRect();
            if (mapContainer) {
                gameMap.draggingBuildings.lastMouseX = e.clientX - gridRect.left + mapContainer.scrollLeft;
                gameMap.draggingBuildings.lastMouseY = e.clientY - gridRect.top + mapContainer.scrollTop;
            } else {
                gameMap.draggingBuildings.lastMouseX = e.clientX - gridRect.left;
                gameMap.draggingBuildings.lastMouseY = e.clientY - gridRect.top;
            }
        }
    
    // Вычисляем целевую позицию для группы
    const targetX = mouseTileX - gameMap.draggingBuildings.clickOffsetX;
    const targetY = mouseTileY - gameMap.draggingBuildings.clickOffsetY;
    
    // Показываем preview перемещения
    showDragPreview(targetX, targetY);
}

// Показать preview перемещения зданий
function showDragPreview(targetX, targetY) {
    clearPreview();
    
    const dragData = gameMap.draggingBuildings;
    if (!dragData) return;
    
    // Временно удаляем все перемещаемые здания из occupiedTiles
    dragData.buildings.forEach(b => removeBuildingFromOccupiedTiles(b));
    
    // Проверяем, можно ли разместить все здания на новых позициях
    let canMoveAll = true;
    const previewPositions = [];
    
    for (const item of dragData.offsets) {
        const newX = targetX + item.offsetX;
        const newY = targetY + item.offsetY;
        const buildingData = buildingsCache.get(item.building.buildingId);
        if (!buildingData) {
            canMoveAll = false;
            break;
        }
        
        // Используем текущий rotation здания (который мог измениться при повороте группы)
        const rotation = item.building.rotation || 0;
        const size = getBuildingSize(buildingData, rotation);
        const width = size.width;
        const height = size.height;
        
        // Проверяем, можно ли разместить на новой позиции
        if (!canPlaceBuildingAtPositionForMove(newX, newY, width, height)) {
            canMoveAll = false;
            break;
        }
        
        previewPositions.push({
            x: newX,
            y: newY,
            width: width,
            height: height
        });
    }
    
    // Восстанавливаем occupiedTiles (для следующей проверки)
    updateOccupiedTiles();
    
    // Показываем preview
    requestAnimationFrame(() => {
        gameMap.previewTiles = [];
        previewPositions.forEach(pos => {
            for (let dy = 0; dy < pos.height; dy++) {
                for (let dx = 0; dx < pos.width; dx++) {
                    const tx = pos.x + dx;
                    const ty = pos.y + dy;
                    if (tx >= 0 && tx < gameMap.width && ty >= 0 && ty < gameMap.height) {
                        const tileKey = `${tx},${ty}`;
                        const tileElement = document.querySelector(`.tile[data-x="${tx}"][data-y="${ty}"]`);
                        if (tileElement && !gameMap.previewTiles.includes(tileKey)) {
                            gameMap.previewTiles.push(tileKey);
                            tileElement.classList.remove('can-build', 'cannot-build', 'preview');
                            tileElement.classList.add(canMoveAll ? 'preview' : 'cannot-build');
                        }
                    }
                }
            }
        });
    });
}

// Завершение перетаскивания
function handleDragEnd(e) {
    if (!gameMap.draggingBuildings) {
        document.body.style.userSelect = '';
        return;
    }
    
    // Удаляем обработчики
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    // Восстанавливаем выделение текста
    document.body.style.userSelect = '';
    
    const tileCoords = getTileCoordinatesFromMouse(e);
    if (!tileCoords) {
        clearPreview();
        gameMap.draggingBuildings = null;
        return;
    }
    
    const mouseTileX = tileCoords.x;
    const mouseTileY = tileCoords.y;
    
    // Вычисляем целевую позицию для группы
    const targetX = mouseTileX - gameMap.draggingBuildings.clickOffsetX;
    const targetY = mouseTileY - gameMap.draggingBuildings.clickOffsetY;
    
    // Пытаемся переместить здания
    moveSelectedBuildings(targetX, targetY);
    
    clearPreview();
    gameMap.draggingBuildings = null;
}

// Повернуть группу зданий при перетаскивании на 90° по часовой стрелке
function rotateGroupDuringDrag() {
    if (!gameMap.draggingBuildings) return;
    
    // Очищаем превью перед поворотом
    clearPreview();
    
    const dragData = gameMap.draggingBuildings;
    const groupWidth = dragData.groupWidth;
    const groupHeight = dragData.groupHeight;
    
    // Увеличиваем счетчик поворотов (0 -> 1 -> 2 -> 3 -> 0)
    dragData.rotationCount = (dragData.rotationCount + 1) % 4;
    
    // Вычисляем центр группы для поворота
    const groupCenterX = dragData.groupWidth / 2 - 0.5;
    const groupCenterY = dragData.groupHeight / 2 - 0.5;
    
    // Поворачиваем каждое здание и пересчитываем offsets
    // Сначала находим минимальные координаты группы с учетом текущих позиций
    let minX = Infinity;
    let minY = Infinity;
    dragData.buildings.forEach(b => {
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
    });
    
    // Поворачиваем offsets всех зданий на 90° по часовой стрелке вокруг центра
    // И поворачиваем каждое здание (rotation: 0 -> 1, 1 -> 0)
    dragData.offsets = dragData.offsets.map(item => {
        // Поворачиваем само здание
        const currentRotation = item.building.rotation || 0;
        const newRotation = currentRotation === 0 ? 1 : 0;
        item.building.rotation = newRotation;
        
        // Получаем старые и новые размеры здания
        const buildingData = buildingsCache.get(item.building.buildingId);
        if (!buildingData) return item;
        const oldSize = getBuildingSize(buildingData, currentRotation);
        const newSize = getBuildingSize(buildingData, newRotation);
        
        // Вычисляем центр здания относительно центра группы (используя старые размеры)
        const oldCenterX = item.offsetX + (oldSize.width - 1) / 2;
        const oldCenterY = item.offsetY + (oldSize.height - 1) / 2;
        
        // Относительные координаты от центра группы
        const relX = oldCenterX - groupCenterX;
        const relY = oldCenterY - groupCenterY;
        
        // Поворачиваем: (x, y) -> (y, -x)
        const newRelX = relY;
        const newRelY = -relX;
        
        // Новые offsets относительно нового левого верхнего угла
        const newGroupWidth = groupHeight;
        const newGroupHeight = groupWidth;
        const newGroupCenterX = newGroupWidth / 2 - 0.5;
        const newGroupCenterY = newGroupHeight / 2 - 0.5;
        
        // Новый центр здания
        const newCenterX = newGroupCenterX + newRelX;
        const newCenterY = newGroupCenterY + newRelY;
        
        // Новый offset (левый верхний угол)
        const newOffsetX = Math.round(newCenterX - (newSize.width - 1) / 2);
        const newOffsetY = Math.round(newCenterY - (newSize.height - 1) / 2);
        
        return {
            building: item.building,
            offsetX: newOffsetX,
            offsetY: newOffsetY
        };
    });
    
    // Поворачиваем clickOffset тоже
    const relClickX = dragData.clickOffsetX - groupCenterX;
    const relClickY = dragData.clickOffsetY - groupCenterY;
    const newRelClickX = relClickY;
    const newRelClickY = -relClickX;
    const newGroupWidth = groupHeight;
    const newGroupHeight = groupWidth;
    const newGroupCenterX = newGroupWidth / 2 - 0.5;
    const newGroupCenterY = newGroupHeight / 2 - 0.5;
    dragData.clickOffsetX = Math.round(newGroupCenterX + newRelClickX);
    dragData.clickOffsetY = Math.round(newGroupCenterY + newRelClickY);
    
    // Меняем местами размеры группы
    dragData.groupWidth = groupHeight;
    dragData.groupHeight = groupWidth;
    
    // Обновляем preview
    if (dragData.lastMouseX !== undefined && dragData.lastMouseY !== undefined) {
        const grid = document.querySelector('.map-grid');
        if (grid) {
            const mapContainer = grid.closest('.game-map-container');
            const gridRect = grid.getBoundingClientRect();
            // lastMouseX уже включает scroll, поэтому вычитаем его
            const scrollX = mapContainer ? mapContainer.scrollLeft : 0;
            const scrollY = mapContainer ? mapContainer.scrollTop : 0;
            const syntheticEvent = {
                clientX: gridRect.left + dragData.lastMouseX - scrollX,
                clientY: gridRect.top + dragData.lastMouseY - scrollY
            };
            const tileCoords = getTileCoordinatesFromMouse(syntheticEvent);
            if (tileCoords) {
                const targetX = tileCoords.x - dragData.clickOffsetX;
                const targetY = tileCoords.y - dragData.clickOffsetY;
                showDragPreview(targetX, targetY);
            }
        }
    }
}

// Переместить выбранные здания
function moveSelectedBuildings(targetX, targetY) {
    if (!gameMap.selectedBuildings || gameMap.selectedBuildings.length === 0) return;
    
    const buildingsToMove = gameMap.selectedBuildings;
    
    // Используем offsets из draggingBuildings, если они есть (с учетом поворота группы)
    let offsets;
    if (gameMap.draggingBuildings && gameMap.draggingBuildings.offsets) {
        offsets = gameMap.draggingBuildings.offsets;
    } else {
        // Находим минимальные координаты группы
        let minX = Infinity;
        let minY = Infinity;
        buildingsToMove.forEach(b => {
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
        });
        
        // Вычисляем смещения для всех зданий
        offsets = buildingsToMove.map(b => ({
            building: b,
            offsetX: b.x - minX,
            offsetY: b.y - minY
        }));
    }
    
    // СНАЧАЛА удаляем ВСЕ перемещаемые здания из occupiedTiles
    buildingsToMove.forEach(b => removeBuildingFromOccupiedTiles(b));
    
    // Затем проверяем, можно ли разместить все здания на новых позициях
    let canMoveAll = true;
    const newPositions = [];
    
    for (const item of offsets) {
        const newX = targetX + item.offsetX;
        const newY = targetY + item.offsetY;
        const buildingData = buildingsCache.get(item.building.buildingId);
        if (!buildingData) {
            canMoveAll = false;
            break;
        }
        
        // Используем текущий rotation здания (который мог измениться при повороте группы)
        const rotation = item.building.rotation || 0;
        const size = getBuildingSize(buildingData, rotation);
        const width = size.width;
        const height = size.height;
        
        // Проверяем, можно ли разместить на новой позиции
        if (!canPlaceBuildingAtPositionForMove(newX, newY, width, height)) {
            canMoveAll = false;
            break;
        }
        
        newPositions.push({
            building: item.building,
            newX: newX,
            newY: newY
        });
    }
    
    if (canMoveAll && newPositions.length === buildingsToMove.length) {
        // Перемещаем все здания (rotation остается прежним!)
        newPositions.forEach(item => {
            item.building.x = item.newX;
            item.building.y = item.newY;
        });
        
        // Обновляем занятые клетки
        updateOccupiedTiles();
        renderMapBuildings();
        
        // Обновляем визуальное выделение после перемещения
        updateBuildingSelection();
        
        saveGame();
        
        // Очищаем превью после успешного перемещения
        clearPreview();
        
        updateInfoPanel(t('msg.movedBuildings', { count: buildingsToMove.length }));
    } else {
        // Восстанавливаем occupiedTiles (здания остаются на старых местах)
        updateOccupiedTiles();
        
        // Очищаем превью при ошибке
        clearPreview();
        
        updateInfoPanel(t('msg.cannotMove'));
    }
}

// Повернуть выбранные здания по часовой стрелке (вся группа как единое целое)
function rotateSelectedBuildings() {
    if (!gameMap.selectedBuildings || gameMap.selectedBuildings.length === 0) return;
    
    // Очищаем превью перед поворотом
    clearPreview();
    
    const buildingsToRotate = [...gameMap.selectedBuildings];
    
    // Находим границы всей группы (bounding box)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const buildingInfo = new Map();
    
    for (const building of buildingsToRotate) {
        const buildingData = buildingsCache.get(building.buildingId);
        if (!buildingData) continue;
        
        // НЕ меняем rotation здания! Используем текущий rotation
        const rotation = building.rotation || 0;
        const size = getBuildingSize(buildingData, rotation);
        const width = size.width;
        const height = size.height;
        
        buildingInfo.set(building.instanceId, { 
            width, 
            height, 
            buildingData,
            rotation // сохраняем текущий rotation
        });
        
        // Находим реальные границы здания
        const bMinX = building.x;
        const bMinY = building.y;
        const bMaxX = building.x + width - 1;
        const bMaxY = building.y + height - 1;
        
        minX = Math.min(minX, bMinX);
        minY = Math.min(minY, bMinY);
        maxX = Math.max(maxX, bMaxX);
        maxY = Math.max(maxY, bMaxY);
    }
    
    // Размеры группы ДО поворота
    const groupWidth = maxX - minX + 1;
    const groupHeight = maxY - minY + 1;
    
    // Вычисляем центр группы
    const groupCenterX = minX + (groupWidth - 1) / 2;
    const groupCenterY = minY + (groupHeight - 1) / 2;
    
    // СНАЧАЛА удаляем ВСЕ здания из occupiedTiles
    buildingsToRotate.forEach(b => removeBuildingFromOccupiedTiles(b));
    
    // Вычисляем новые позиции для всех зданий после поворота группы на 90° по часовой стрелке
    // Поворот вокруг центра группы: (dx, dy) -> (dy, -dx)
    const newPositions = [];
    let canRotateAll = true;
    
    for (const building of buildingsToRotate) {
        const info = buildingInfo.get(building.instanceId);
        if (!info) {
            canRotateAll = false;
            break;
        }
        
        // Поворачиваем само здание (rotation: 0 -> 1, 1 -> 0)
        const currentRotation = building.rotation || 0;
        const newRotation = currentRotation === 0 ? 1 : 0;
        
        // Получаем новые размеры здания после поворота
        const newSize = getBuildingSize(info.buildingData, newRotation);
        const newWidth = newSize.width;
        const newHeight = newSize.height;
        
        // Поворачиваем центр здания относительно центра группы
        // Вычисляем центр здания (с учетом СТАРЫХ размеров)
        const buildingCenterX = building.x + (info.width - 1) / 2;
        const buildingCenterY = building.y + (info.height - 1) / 2;
        
        // Относительные координаты центра здания
        const relativeX = buildingCenterX - groupCenterX;
        const relativeY = buildingCenterY - groupCenterY;
        
        // Поворачиваем на 90° по часовой стрелке: (x, y) -> (y, -x)
        const newRelativeX = relativeY;
        const newRelativeY = -relativeX;
        
        // Вычисляем новую абсолютную позицию центра здания
        const newCenterX = groupCenterX + newRelativeX;
        const newCenterY = groupCenterY + newRelativeY;
        
        // Вычисляем новую позицию левого верхнего угла здания (с учетом НОВЫХ размеров)
        const newX = Math.round(newCenterX - (newWidth - 1) / 2);
        const newY = Math.round(newCenterY - (newHeight - 1) / 2);
        
        newPositions.push({
            building: building,
            newX: newX,
            newY: newY,
            width: newWidth,
            height: newHeight,
            rotation: newRotation
        });
    }
    
    // Проверяем, что все здания не пересекаются друг с другом
    if (newPositions.length === buildingsToRotate.length) {
        const occupiedCells = new Set();
        for (const pos of newPositions) {
            for (let dy = 0; dy < pos.height; dy++) {
                for (let dx = 0; dx < pos.width; dx++) {
                    const tx = pos.newX + dx;
                    const ty = pos.newY + dy;
                    const cellKey = `${tx},${ty}`;
                    if (occupiedCells.has(cellKey)) {
                        canRotateAll = false;
                        break;
                    }
                    occupiedCells.add(cellKey);
                }
                if (!canRotateAll) break;
            }
            if (!canRotateAll) break;
        }
        
        // Теперь проверяем, что все здания можно разместить на карте
        if (canRotateAll) {
            for (const pos of newPositions) {
                if (!canPlaceBuildingAtPositionForMove(pos.newX, pos.newY, pos.width, pos.height)) {
                    canRotateAll = false;
                    break;
                }
            }
        }
    }
    
    if (canRotateAll && newPositions.length === buildingsToRotate.length) {
        // Применяем новые позиции и rotation ко всем зданиям
        newPositions.forEach(item => {
            item.building.x = item.newX;
            item.building.y = item.newY;
            item.building.rotation = item.rotation;
            item.building.width = item.width;
            item.building.height = item.height;
        });
        
        // Обновляем занятые клетки
        updateOccupiedTiles();
        renderMapBuildings();
        saveGame();
        
        // Очищаем превью после успешного поворота
        clearPreview();
        
        updateInfoPanel(t('msg.rotatedBuildings', { count: buildingsToRotate.length }));
    } else {
        // Восстанавливаем occupiedTiles (здания остаются без изменений)
        updateOccupiedTiles();
        
        // Очищаем превью при ошибке
        clearPreview();
        
        updateInfoPanel(t('msg.cannotRotate'));
    }
}

// Удалить здание из occupiedTiles (временно для проверки перемещения)
function removeBuildingFromOccupiedTiles(building) {
    const buildingData = buildingsCache.get(building.buildingId);
    if (!buildingData) return;
    const rotation = building.rotation || 0;
    const size = getBuildingSize(buildingData, rotation);
    const width = size.width;
    const height = size.height;
    
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = building.x + dx;
            const ty = building.y + dy;
            gameMap.occupiedTiles.delete(`${tx},${ty}`);
        }
    }
}

// Проверка возможности размещения здания (для перемещения - без учета ресурсов)
function canPlaceBuildingAtPositionForMove(x, y, width, height) {
    // Проверка границ карты
    if (x < 0 || x + width > gameMap.width || y < 0 || y + height > gameMap.height) {
        return false;
    }
    
    // Проверка занятости всех клеток
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = x + dx;
            const ty = y + dy;
            if (gameMap.occupiedTiles.has(`${tx},${ty}`)) {
                return false;
            }
        }
    }
    
    return true;
}


// Удалить здание из occupiedTiles (временно для проверки перемещения)
function removeBuildingFromOccupiedTiles(building) {
    const buildingData = buildingsCache.get(building.buildingId);
    if (!buildingData) return;
    const rotation = building.rotation || 0;
    const size = getBuildingSize(buildingData, rotation);
    const width = size.width;
    const height = size.height;
    
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = building.x + dx;
            const ty = building.y + dy;
            gameMap.occupiedTiles.delete(`${tx},${ty}`);
        }
    }
}

// Проверка возможности размещения здания (для перемещения - без учета ресурсов)
function canPlaceBuildingAtPositionForMove(x, y, width, height) {
    // Проверка границ карты
    if (x < 0 || x + width > gameMap.width || y < 0 || y + height > gameMap.height) {
        return false;
    }
    
    // Проверка занятости всех клеток
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = x + dx;
            const ty = y + dy;
            if (gameMap.occupiedTiles.has(`${tx},${ty}`)) {
                return false;
            }
        }
    }
    
    return true;
}

// Проверка возможности размещения здания
function canPlaceBuilding(x, y, building) {
    const size = getBuildingSize(building, gameMap.buildingRotation || 0);
    const width = size.width;
    const height = size.height;
    
    // Проверка границ
    if (x < 0 || x + width > gameMap.width || y < 0 || y + height > gameMap.height) {
        return false;
    }
    
    // Проверка занятости всех клеток
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = x + dx;
            const ty = y + dy;
            if (gameMap.occupiedTiles.has(`${tx},${ty}`)) {
                return false;
            }
        }
    }
    
    // Проверка ресурсов (с учетом прогрессивных цен)
    if (!canAfford(building)) return false;
    
    return true;
}

// Размещение здания (оптимизировано - обновляет только нужные части)
function placeBuilding(x, y, building) {
    if (!canPlaceBuilding(x, y, building)) {
        updateInfoPanel(t('msg.cannotBuild'));
        return;
    }
    
    // Получаем актуальную стоимость с учетом прогрессивного роста
    const actualCost = getBuildingCost(building);
    
    // Списываем ресурсы
    if (Object.keys(actualCost).length > 0) {
        Object.entries(actualCost).forEach(([resource, amount]) => {
            resources[resource] = (resources[resource] || 0) - amount;
        });
    }
    
    // Создаем экземпляр здания
    const instanceId = Date.now() + Math.random();
    const size = getBuildingSize(building, gameMap.buildingRotation);
    const width = size.width;
    const height = size.height;
    const rotation = gameMap.buildingRotation || 0;
    
    gameMap.buildings.push({
        x: x,
        y: y,
        buildingId: building.id,
        instanceId: instanceId,
        width: width,
        height: height,
        rotation: rotation
    });
    
    // Обновляем счетчик зданий
    gameState.buildings[building.id] = (gameState.buildings[building.id] || 0) + 1;
    
    // Сохраняем ID выбранного здания для восстановления (сохраняем объект здания, а не ссылку)
    const buildingIdToRestore = gameMap.buildingToPlace ? gameMap.buildingToPlace.id : null;
    
    // Очищаем только preview, но не отменяем строительство
    // Строительство остается активным до отмены по Esc
    clearPreview();
    
    // Обновляем интерфейс (оптимизировано - не пересоздаем всю карту)
    updateOccupiedTiles();
    renderMapBuildings(); // Только здания, не всю сетку
    renderResources();
    renderBuildings(getCurrentEra()); // Обновляем список для обновления цен и подсветки
    
    // Восстанавливаем выделение здания для строительства после перерисовки
    // ВАЖНО: восстанавливаем объект здания из массива buildings по ID
    if (buildingIdToRestore) {
        const buildingToRestore = buildings.find(b => b.id === buildingIdToRestore);
        if (buildingToRestore) {
            gameMap.buildingToPlace = buildingToRestore;
            
            // Восстанавливаем выделение в списке зданий
            requestAnimationFrame(() => {
                const selectedItem = document.querySelector(`.building-item[data-building-id="${buildingIdToRestore}"]`);
                if (selectedItem) {
                    selectedItem.classList.add('selected');
                    // Убираем класс locked, если здание было выбрано для строительства
                    selectedItem.classList.remove('locked');
                }
                
                // Восстанавливаем preview, если есть lastHoverTile
                if (lastHoverTile) {
                    handleTileHover(lastHoverTile.x, lastHoverTile.y);
                }
            });
        }
    }
    
    // Показываем сообщение о постройке и напоминаем, что можно строить еще
    // Строительство остается активным до отмены по Esc
    updateInfoPanel(t('msg.built', { name: getBuildingName(building.id) }) + '. ' + t('msg.selectLocation', { name: getBuildingName(building.id) }));
    
    // Обновляем мини-карту реже (только при размещении зданий)
    if (gameMap.buildings.length % 5 === 0) {
        renderMiniMap();
    }
    
    // Сохраняем прогресс после постройки
    saveGame();
    
    // Сбрасываем кэш статистики ресурсов при добавлении нового здания
    resourceStatsCache = null;
}

// Выбор здания (оптимизировано с кэшем)
// Обновление класса selected для зданий на карте
function updateBuildingSelection() {
    // Используем кэшированный элемент grid
    if (!gridElementCache) {
        gridElementCache = document.querySelector('.map-grid');
    }
    const grid = gridElementCache;
    if (!grid) return;
    
    // Убираем класс selected со всех зданий
    grid.querySelectorAll('.map-building').forEach(buildingEl => {
        buildingEl.classList.remove('selected');
    });
    
    // Добавляем класс selected для выбранных зданий
    if (gameMap.selectedBuildings && gameMap.selectedBuildings.length > 0) {
        gameMap.selectedBuildings.forEach(building => {
            // dataset.instanceId создает атрибут data-instance-id
            // Преобразуем instanceId в строку для селектора
            const buildingEl = grid.querySelector(`[data-instance-id="${String(building.instanceId)}"]`);
            if (buildingEl) {
                buildingEl.classList.add('selected');
            }
        });
    } else if (gameMap.selectedBuilding) {
        const buildingEl = grid.querySelector(`[data-instance-id="${String(gameMap.selectedBuilding)}"]`);
        if (buildingEl) {
            buildingEl.classList.add('selected');
        }
    }
}

// Выбор одного здания (1 клик)
function selectSingleBuilding(instanceId) {
    gameMap.selectedBuilding = instanceId;
    
    const building = gameMap.buildings.find(b => b.instanceId === instanceId);
    if (!building) return;
    
    // Добавляем здание в selectedBuildings для возможности перемещения
    gameMap.selectedBuildings = [building];
    gameMap.selectionMode = 'single';
    
    // Обновляем визуальное выделение
    updateBuildingSelection();
    
    const buildingData = buildingsCache.get(building.buildingId);
    if (!buildingData) return;
    
    showBuildingInfo(buildingData, building, 'single');
}

// Выбор группы зданий (2 клика)
function selectBuildingGroup(instanceId) {
    const building = gameMap.buildings.find(b => b.instanceId === instanceId);
    if (!building) return;
    
    const group = getBuildingGroup(building);
    gameMap.selectedBuilding = instanceId;
    gameMap.selectedBuildings = group;
    gameMap.selectionMode = 'group';
    
    // Обновляем визуальное выделение
    updateBuildingSelection();
    
    const buildingData = buildingsCache.get(building.buildingId);
    if (!buildingData) return;
    
    showBuildingInfo(buildingData, building, 'group', group);
}

// Выбор всех зданий одного типа (3 клика)
function selectAllBuildingsOfType(buildingId) {
    const allBuildings = gameMap.buildings.filter(b => b.buildingId === buildingId);
    if (allBuildings.length === 0) return;
    
    gameMap.selectedBuilding = allBuildings[0].instanceId;
    gameMap.selectedBuildings = allBuildings;
    gameMap.selectionMode = 'all-type';
    
    // Обновляем визуальное выделение
    updateBuildingSelection();
    
    const buildingData = buildingsCache.get(buildingId);
    if (!buildingData) return;
    
    showBuildingInfo(buildingData, allBuildings[0], 'all-type', allBuildings);
}

// Старая функция для совместимости
function selectBuilding(instanceId) {
    selectSingleBuilding(instanceId);
}

// Показать информацию о здании/группе/всех зданиях типа
function showBuildingInfo(buildingData, buildingInstance, mode = 'single', buildingsList = null) {
    const panel = document.getElementById('selected-panel');
    if (!panel) return;
    
    panel.style.display = 'block';
    // Добавляем класс для CSS селектора (для совместимости)
    panel.classList.add('visible');
    
    const iconEl = document.getElementById('selected-icon');
    const nameEl = document.getElementById('selected-name');
    if (iconEl) iconEl.innerHTML = getBuildingIconHTML(buildingData.icon, buildingData.id);
    
    // Определяем название в зависимости от режима
    let title = getBuildingName(buildingData.id);
    if (mode === 'group' && buildingsList) {
        title = `${getBuildingName(buildingData.id)} (${t('msg.group', { count: buildingsList.length })})`;
    } else if (mode === 'all-type' && buildingsList) {
        title = `${getBuildingName(buildingData.id)} (${t('msg.total', { count: buildingsList.length })})`;
    }
    if (nameEl) nameEl.textContent = title;
    
    const stats = document.getElementById('selected-stats');
    if (!stats) return;
    
    // Получаем список зданий для подсчета
    let buildingsToCalculate = [];
    if (mode === 'single') {
        buildingsToCalculate = [buildingInstance];
    } else if (mode === 'group' && buildingsList) {
        buildingsToCalculate = buildingsList;
    } else if (mode === 'all-type' && buildingsList) {
        buildingsToCalculate = buildingsList;
    }
    
    // Подсчитываем производство и потребление
    const production = calculateBuildingsProduction(buildingsToCalculate);
    const consumption = calculateBuildingsConsumption(buildingsToCalculate);
    
    // Формируем HTML
    let html = '';
    
    // Информация о выборе
    if (mode === 'single') {
        if (buildingInstance.y >= 0 && buildingInstance.y < gameMap.height &&
            buildingInstance.x >= 0 && buildingInstance.x < gameMap.width) {
            const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
            if (tile) {
                const tileBonus = buildingData.tileBonus && buildingData.tileBonus[tile.type] ? 
                    ` (${t('ui.bonus')}: +${Math.round((buildingData.tileBonus[tile.type] - 1) * 100)}%)` : '';
                
                const groupSize = getBuildingGroupSize(buildingInstance);
                const neighborhoodBonus = groupSize > 1 ? 
                    ` (${t('msg.group', { count: groupSize })}, +${(groupSize - 1) * 5}%)` : '';
                
                const width = buildingData.width || buildingInstance.width || 1;
                const height = buildingData.height || buildingInstance.height || 1;
                
                html += `<p>${t('ui.position')} (${buildingInstance.x}, ${buildingInstance.y})</p>`;
                html += `<p>${t('ui.size')} ${width}×${height}</p>`;
                html += `<p>${t('ui.tileType')} ${getTileName(tile.type)}${tileBonus}</p>`;
                html += `<p>${t('ui.groupSize')} ${groupSize}${neighborhoodBonus}</p>`;
            }
        }
    } else if (mode === 'group' && buildingsList) {
        html += `<p>${t('ui.selectedBuildings')} ${buildingsList.length}</p>`;
    } else if (mode === 'all-type' && buildingsList) {
        html += `<p>${t('ui.totalBuildings')} ${buildingsList.length}</p>`;
    }
    
    // Производство
    if (Object.keys(production).length > 0) {
        html += `<p><strong>${t('ui.produces')}</strong></p>`;
        html += `<div class="tooltip-badges">`;
        Object.entries(production).forEach(([resource, amount]) => {
            // Округляем значение перед отображением для консистентности (до 2 знаков)
            const roundedAmount = Math.round(amount * 100) / 100;
            html += `<span class="tooltip-badge" style="color: #4a9eff; background: rgba(74, 158, 255, 0.1);">${getResourceIconHTML(resource)} ${getResourceName(resource)} ${formatNumber(roundedAmount)}${t('ui.perSecond')}</span>`;
        });
        html += `</div>`;
    } else {
        html += `<p><strong>${t('ui.produces')}</strong> ${t('ui.nothing')}</p>`;
    }
    
    // Потребление
    if (Object.keys(consumption).length > 0) {
        html += `<p><strong>${t('ui.consumes')}</strong></p>`;
        html += `<div class="tooltip-badges">`;
        Object.entries(consumption).forEach(([resource, amount]) => {
            html += `<span class="tooltip-badge" style="color: #ff6b6b; background: rgba(255, 107, 107, 0.1);">${getResourceIconHTML(resource)} ${getResourceName(resource)} ${formatNumber(amount)}${t('ui.perSecond')}</span>`;
        });
        html += `</div>`;
    } else {
        html += `<p><strong>${t('ui.consumes')}</strong> ${t('ui.nothing')}</p>`;
    }
    
    // Статус работы и доход
    if (buildingsToCalculate.length > 0) {
        const firstBuilding = buildingsToCalculate[0];
        const building = buildingsCache.get(firstBuilding.buildingId);
        
        if (building && building.consumes && Object.keys(building.consumes).length > 0) {
            // Проверяем, может ли здание работать
            const allBuildings = [];
            gameMap.buildings.forEach(buildingInstance => {
                const b = buildingsCache.get(buildingInstance.buildingId);
                if (!b || !gameState.enabled[b.id]) return;
                if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
                    buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
                    return;
                }
                const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
                if (!tile) return;
                if (b.consumes && Object.keys(b.consumes).length > 0) {
                    allBuildings.push(buildingInstance);
                }
            });
            
            const globalWorkRatios = calculateBuildingWorkRatios(allBuildings);
            const workRatio = globalWorkRatios.get(firstBuilding.instanceId) || 0;
            
            if (workRatio >= 1.0) {
                html += `<p><strong>${t('ui.status')}:</strong> <span style="color: #4caf50;">${t('ui.working')}</span></p>`;
            } else if (workRatio === 0) {
                // Determine why it's not working
                const missingResources = [];
                Object.entries(building.consumes).forEach(([resource, rate]) => {
                    const currentAmount = resources[resource] || 0;
                    
                    // Calculate production of this resource
                    let productionRate = 0;
                    gameMap.buildings.forEach(prodBuildingInstance => {
                        const prodBuilding = buildingsCache.get(prodBuildingInstance.buildingId);
                        if (!prodBuilding || !gameState.enabled[prodBuilding.id]) return;
                        if (prodBuildingInstance.y < 0 || prodBuildingInstance.y >= gameMap.height ||
                            prodBuildingInstance.x < 0 || prodBuildingInstance.x >= gameMap.width) {
                            return;
                        }
                        const tile = gameMap.tiles[prodBuildingInstance.y]?.[prodBuildingInstance.x];
                        if (!tile) return;
                        if (!prodBuilding.consumes || Object.keys(prodBuilding.consumes).length === 0) {
                            if (prodBuilding.produces && prodBuilding.produces[resource]) {
                                const tileBonus = prodBuilding.tileBonus && prodBuilding.tileBonus[tile.type] ? 
                                    prodBuilding.tileBonus[tile.type] : 1;
                                const groupSize = getBuildingGroupSize(prodBuildingInstance);
                                const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
                                const totalBonus = tileBonus * neighborhoodBonus;
                                productionRate += (prodBuilding.produces[resource] || 0) * totalBonus;
                            }
                        }
                    });
                    
                    const available = currentAmount + productionRate;
                    if (available < rate) {
                        missingResources.push(`${getResourceName(resource)} (${t('ui.needed')} ${formatNumber(rate)}${t('ui.perSecond')}, ${t('ui.available')} ${formatNumber(available)}${t('ui.perSecond')})`);
                    }
                });
                
                if (missingResources.length > 0) {
                    html += `<p><strong>${t('ui.status')}:</strong> <span style="color: #f44336;">${t('ui.notWorking')}</span></p>`;
                    html += `<p><strong>${t('ui.reason')}:</strong> ${t('ui.insufficientResources')}: ${missingResources.join(', ')}</p>`;
                } else {
                    html += `<p><strong>${t('ui.status')}:</strong> <span style="color: #f44336;">${t('ui.notWorking')}</span></p>`;
                }
            }
        } else if (building && building.produces && Object.keys(building.produces).length > 0) {
            // Building does not consume resources, always working
            html += `<p><strong>${t('ui.status')}:</strong> <span style="color: #4caf50;">${t('ui.working')}</span></p>`;
        }
    }
    
    stats.innerHTML = html;
}

// Вычисление реальных коэффициентов работы зданий на основе доступности ресурсов
function calculateBuildingWorkRatios(buildingsToCheck) {
    const buildingWorkRatios = new Map();
    
    // Собираем все здания, которые потребляют ресурсы
    const buildingsToProcess = [];
    const resourceDemands = {};
    
    buildingsToCheck.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Если здание потребляет ресурсы, добавляем в обработку
        if (building.consumes && Object.keys(building.consumes).length > 0) {
            buildingsToProcess.push({ buildingInstance, building });
            
            // Собираем потребности этого здания (delta = 1 для расчета в секунду)
            Object.entries(building.consumes).forEach(([resource, rate]) => {
                if (!resourceDemands[resource]) {
                    resourceDemands[resource] = [];
                }
                resourceDemands[resource].push({
                    buildingInstance,
                    rate: rate // уже в единицах в секунду
                });
            });
        }
    });
    
    // Инициализируем все здания коэффициентом 1.0
    buildingsToProcess.forEach(({ buildingInstance }) => {
        buildingWorkRatios.set(buildingInstance.instanceId, 1.0);
    });
    
    // Вычисляем доступность каждого ресурса (текущее количество + производство от базовых зданий)
    const resourceAvailability = {};
    Object.keys(resourceDemands).forEach(resource => {
        const currentAmount = resources[resource] || 0;
        
        // Вычисляем производство этого ресурса зданиями, которые не потребляют ресурсы
        let productionRate = 0;
        gameMap.buildings.forEach(prodBuildingInstance => {
            const prodBuilding = buildingsCache.get(prodBuildingInstance.buildingId);
            if (!prodBuilding || !gameState.enabled[prodBuilding.id]) return;
            
            if (prodBuildingInstance.y < 0 || prodBuildingInstance.y >= gameMap.height ||
                prodBuildingInstance.x < 0 || prodBuildingInstance.x >= gameMap.width) {
                return;
            }
            
            const tile = gameMap.tiles[prodBuildingInstance.y]?.[prodBuildingInstance.x];
            if (!tile) return;
            
            // Учитываем только здания, которые не потребляют ресурсы (базовое производство)
            if (!prodBuilding.consumes || Object.keys(prodBuilding.consumes).length === 0) {
                if (prodBuilding.produces && prodBuilding.produces[resource]) {
                    const tileBonus = prodBuilding.tileBonus && prodBuilding.tileBonus[tile.type] ? 
                        prodBuilding.tileBonus[tile.type] : 1;
                    const groupSize = getBuildingGroupSize(prodBuildingInstance);
                    const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
                    const totalBonus = tileBonus * neighborhoodBonus;
                    productionRate += (prodBuilding.produces[resource] || 0) * totalBonus;
                }
            }
        });
        
        resourceAvailability[resource] = currentAmount + productionRate;
    });
    
    // Целочисленное распределение: здание либо работает (1.0), либо не работает (0.0)
    // Сортируем здания для детерминированного порядка распределения
    buildingsToProcess.sort((a, b) => a.buildingInstance.instanceId - b.buildingInstance.instanceId);
    
    // Для каждого здания проверяем, достаточно ли всех ресурсов
    buildingsToProcess.forEach(({ buildingInstance, building }) => {
        let canWork = true;
        const buildingDemands = {};
        
        // Собираем все потребности этого здания
        Object.entries(building.consumes).forEach(([resource, rate]) => {
            buildingDemands[resource] = rate;
        });
        
        // Проверяем, достаточно ли каждого ресурса (с учетом уже выделенных)
        // Создаем копию доступности для этого расчета
        const availableCopy = { ...resourceAvailability };
        
        // Проверяем все ресурсы для этого здания
        Object.entries(buildingDemands).forEach(([resource, rate]) => {
            if (availableCopy[resource] < rate) {
                canWork = false;
            }
        });
        
        // Если здание может работать, отмечаем его как работающее
        if (canWork) {
            buildingWorkRatios.set(buildingInstance.instanceId, 1.0);
            // Вычитаем потребности этого здания из доступности (чтобы другие здания не могли их использовать)
            Object.entries(buildingDemands).forEach(([resource, rate]) => {
                resourceAvailability[resource] -= rate;
            });
        } else {
            buildingWorkRatios.set(buildingInstance.instanceId, 0);
        }
    });
    
    return buildingWorkRatios;
}

// Подсчет производства для списка зданий (с учетом бонусов и реальной доступности ресурсов)
function calculateBuildingsProduction(buildings) {
    const totalProduction = {};
    
    // Вычисляем реальные коэффициенты работы для всех зданий на карте
    // (нужно проверить все здания, так как они конкурируют за ресурсы)
    const allBuildings = [];
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        if (building.consumes && Object.keys(building.consumes).length > 0) {
            allBuildings.push(buildingInstance);
        }
    });
    
    const globalWorkRatios = calculateBuildingWorkRatios(allBuildings);
    
    buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Проверяем наличие свойства produces
        if (!building.produces || Object.keys(building.produces).length === 0) {
            return;
        }
        
        // Бонус от типа местности
        const tileBonus = building.tileBonus && building.tileBonus[tile.type] ? 
            building.tileBonus[tile.type] : 1;
        
        // Бонус от группы (используем кэшированный размер)
        const groupSize = getBuildingGroupSize(buildingInstance);
        const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
        
        const totalBonus = tileBonus * neighborhoodBonus;
        
        // Получаем коэффициент работы (1.0 если здание не потребляет ресурсы, иначе из глобального расчета)
        const workRatio = (building.consumes && Object.keys(building.consumes).length > 0) 
            ? (globalWorkRatios.get(buildingInstance.instanceId) || 0)
            : 1.0;
        
        // Добавляем производство с учетом реального коэффициента работы (в единицах в секунду)
        Object.entries(building.produces).forEach(([resource, rate]) => {
            const production = rate * totalBonus * workRatio;
            // Не округляем здесь - суммируем точные значения, округление будет при отображении
            totalProduction[resource] = (totalProduction[resource] || 0) + production;
        });
    });
    
    return totalProduction;
}

// Подсчет потребления для списка зданий
function calculateBuildingsConsumption(buildings) {
    const totalConsumption = {};
    
    buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        if (!building.consumes) return;
        
        // Добавляем потребление (в единицах в секунду, delta = 1)
        Object.entries(building.consumes).forEach(([resource, rate]) => {
            totalConsumption[resource] = (totalConsumption[resource] || 0) + rate;
        });
    });
    
    return totalConsumption;
}

// Получить имя тайла
function getTileName(type) {
    return t(`tile.${type}`) || type;
}

// Рендеринг ресурсов (оптимизировано - обновляет только измененные, без мерцания)
function renderResources() {
    let resourcesChanged = false;
    
    // Вычисляем производство и потребление для предупреждений (с кэшированием)
    const currentTime = performance.now();
    let resourceStats = resourceStatsCache;
    
    // Обновляем статистику только если прошло достаточно времени
    if (!resourceStats || (currentTime - lastResourceStatsUpdate) > RESOURCE_STATS_CACHE_INTERVAL) {
        resourceStats = calculateResourceStats();
        resourceStatsCache = resourceStats;
        lastResourceStatsUpdate = currentTime;
    }
    
    // Обновляем все ресурсы
    Object.keys(resources).forEach(key => {
        const element = document.getElementById(`resource-${key}`);
        if (element) {
            // Округляем до 2 знаков после запятой для стабильного сравнения
            const value = Math.round(resources[key] * 100) / 100;
            const prevValue = previousResourceValues[key];
            
            // Обновляем только если значение изменилось значительно
            // Для больших чисел (>1) порог 0.1, для малых (<1) порог 0.01
            // Это предотвращает мерцание от микро-изменений
            const threshold = (value >= 1) ? 0.1 : 0.01;
            if (prevValue === undefined || Math.abs(value - prevValue) >= threshold) {
                const formattedValue = formatNumber(value);
                // Обновляем только если текст действительно изменился
                // Убрали класс updating и анимацию для предотвращения мерцания
                if (element.textContent !== formattedValue) {
                    element.textContent = formattedValue;
                    previousResourceValues[key] = value;
                    resourcesChanged = true;
                }
            }
            
            // Добавляем визуальное предупреждение о нехватке ресурсов
            const stats = resourceStats[key];
            if (stats && stats.balance < 0 && value < 1) {
                element.parentElement.classList.add('resource-low');
            } else {
                element.parentElement.classList.remove('resource-low');
            }
        }
    });
    
    // Если ресурсы изменились, обновляем подсветку зданий
    if (resourcesChanged) {
        updateBuildingsAvailability();
    }
}

// Вычисление статистики по ресурсам (производство, потребление, баланс)
function calculateResourceStats() {
    const stats = {};
    
    // Инициализируем все ресурсы
    Object.keys(resources).forEach(key => {
        stats[key] = { production: 0, consumption: 0, balance: 0 };
    });
    
    // Подсчитываем производство и потребление
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ массива
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Бонусы
        const tileBonus = building.tileBonus && building.tileBonus[tile.type] ? 
            building.tileBonus[tile.type] : 1;
        const groupSize = getBuildingGroupSize(buildingInstance);
        const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
        const totalBonus = tileBonus * neighborhoodBonus;
        
        // Проверяем, работает ли здание
        const workStatus = buildingWorkStatus.get(buildingInstance.instanceId);
        const isWorking = !workStatus || workStatus.working;
        
        if (isWorking) {
            // Производство
            if (building.produces) {
                Object.entries(building.produces).forEach(([resource, rate]) => {
                    if (stats[resource]) {
                        stats[resource].production += rate * totalBonus;
                    }
                });
            }
            
            // Потребление
            if (building.consumes) {
                Object.entries(building.consumes).forEach(([resource, rate]) => {
                    if (stats[resource]) {
                        stats[resource].consumption += rate;
                    }
                });
            }
        }
    });
    
    // Вычисляем баланс
    Object.keys(stats).forEach(key => {
        stats[key].balance = stats[key].production - stats[key].consumption;
    });
    
    return stats;
}

// Обновление доступности зданий (подсветка)
function updateBuildingsAvailability() {
    document.querySelectorAll('.building-item').forEach(item => {
        const buildingId = parseInt(item.dataset.buildingId);
        const building = buildingsCache.get(buildingId);
        if (!building) return;
        
        const canBuild = canAfford(building);
        
        // Обновляем класс locked
        if (canBuild) {
            item.classList.remove('locked');
        } else {
            item.classList.add('locked');
        }
    });
}

// Форматирование чисел (компактное для панели ресурсов, стабильное для предотвращения мерцания)
function formatNumber(num) {
    // Округляем для стабильности форматирования
    // Используем стандартное округление до 1 знака для значений >= 1
    // и до 2 знаков для значений < 1, чтобы избежать проблем с плавающей точкой
    if (num >= 1000000) {
        return (Math.round(num / 100000) / 10).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (Math.round(num / 100) / 10).toFixed(1) + 'K';
    }
    if (num >= 1) {
        // Для значений >= 1 округляем до 1 знака после запятой
        return (Math.round(num * 10) / 10).toFixed(1);
    }
    // Для значений < 1 округляем до 2 знаков после запятой
    return (Math.round(num * 100) / 100).toFixed(2);
}

// Рендеринг списка зданий (оптимизировано)
function renderBuildings(era) {
    const list = document.getElementById('buildings-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    const eraBuildings = buildings.filter(b => 
        era === 'citadel' ? b.era === 'citadel' : b.era === era
    );
    
    eraBuildings.forEach(building => {
        const item = createBuildingItem(building);
        if (item) list.appendChild(item);
    });
}

// Создание элемента здания в списке
function createBuildingItem(building) {
    const item = document.createElement('div');
    item.className = 'building-item';
    item.dataset.buildingId = building.id;
    
    const count = gameState.buildings[building.id] || 0;
    const canBuild = canAfford(building);
    
    // Добавляем класс locked только если нельзя построить
    if (!canBuild) {
        item.classList.add('locked');
    }
    
    item.innerHTML = `
        <div class="building-item-icon">${getBuildingIconHTML(building.icon, building.id)}</div>
        <div class="building-item-name">${getBuildingName(building.id)}</div>
        ${count > 0 ? `<div class="building-item-count">${count}</div>` : ''}
    `;
    
    // При наведении - показываем подсказку
    item.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        showBuildingTooltip(building, e.target);
    });
    
    item.addEventListener('mouseleave', () => {
        hideBuildingTooltip();
    });
    
    item.addEventListener('mousemove', (e) => {
        updateTooltipPosition(e);
    });
    
    // При клике - выбираем для постройки
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        // Позволяем выбирать здание даже если недостаточно ресурсов
        // (чтобы можно было строить после получения ресурсов)
        // Убираем выделение с других
        document.querySelectorAll('.building-item').forEach(i => {
            i.classList.remove('selected');
        });
        // Убираем класс locked при выборе здания
        item.classList.remove('locked');
        item.classList.add('selected');
        gameMap.buildingToPlace = building;
        hideBuildingTooltip();
        updateInfoPanel(t('msg.selectLocation', { name: getBuildingName(building.id) }));
    });
    
    return item;
}

// Показать tooltip с информацией о здании
function showBuildingTooltip(building, element) {
    const tooltip = document.getElementById('building-tooltip');
    const tooltipContent = document.getElementById('tooltip-content');
    if (!tooltip || !tooltipContent) return;
    
    // Скрываем tooltip для ресурсов, если он показан
    hideResourceTooltip();
    
    // Создаем содержимое tooltip
    let html = `<div class="tooltip-header">${getBuildingIconHTML(building.icon, building.id)} ${getBuildingName(building.id)}</div>`;
    
    // Требования (показываем актуальную стоимость с учетом прогрессивного роста)
    const baseCost = building.requires || building.cost || {};
    const actualCost = getBuildingCost(building);
    const count = gameState.buildings[building.id] || 0;
    
    if (Object.keys(actualCost).length > 0) {
        html += `<div class="tooltip-section"><strong>${t('ui.requires')}</strong>`;
        if (count > 0) {
            html += `<div style="font-size: 10px; color: #aaa; margin-bottom: 4px;">${t('ui.alreadyBuilt', { count: count, percent: count * 10 })}</div>`;
        }
        html += '<div class="tooltip-badges">';
        Object.entries(actualCost).forEach(([res, amount]) => {
            const baseAmount = baseCost[res] || amount;
            const increased = amount > baseAmount;
            html += `<span class="tooltip-badge" style="${increased ? 'color: #ff9800;' : ''}">${getResourceIconHTML(res)} ${getResourceName(res)} ${formatNumber(amount)}</span>`;
        });
        html += '</div></div>';
    } else {
        html += `<div class="tooltip-section"><span style="color: #4a9eff;">${t('ui.free')}</span></div>`;
    }
    
    // Производит (только бейджи)
    html += `<div class="tooltip-section"><strong>${t('ui.produces')}</strong>`;
    html += `<div class="tooltip-badges">`;
    Object.entries(building.produces).forEach(([res, amount]) => {
        html += `<span class="tooltip-badge" style="color: #4a9eff;">${getResourceIconHTML(res)} ${getResourceName(res)} ${formatNumber(amount)}${t('ui.perSecond')}</span>`;
    });
    html += '</div></div>';
    
    // Потребляет (только бейджи)
    if (building.consumes && Object.keys(building.consumes).length > 0) {
        html += `<div class="tooltip-section"><strong>${t('ui.consumes')}</strong>`;
        html += '<div class="tooltip-badges">';
        Object.entries(building.consumes).forEach(([res, amount]) => {
            html += `<span class="tooltip-badge" style="color: #ff6b6b;">${getResourceIconHTML(res)} ${getResourceName(res)} ${formatNumber(amount)}${t('ui.perSecond')}</span>`;
        });
        html += '</div></div>';
    } else {
        html += `<div class="tooltip-section"><strong>${t('ui.consumes')}</strong> <span style="color: #4a9eff;">${t('ui.nothing')}</span></div>`;
    }
    
    // Size
    const width = building.width || 1;
    const height = building.height || 1;
    html += `<div class="tooltip-section"><strong>${t('ui.size')}:</strong> ${width}×${height} ${t('ui.cells')}</div>`;
    
    // Tile bonuses
    if (building.tileBonus) {
        html += `<div class="tooltip-section"><strong>${t('ui.tileBonuses')}:</strong><div class="tooltip-badges">`;
        Object.entries(building.tileBonus).forEach(([tile, multiplier]) => {
            html += `<span class="tooltip-badge">${getTileName(tile)}: +${Math.round((multiplier - 1) * 100)}%</span>`;
        });
        html += '</div></div>';
    }
    
    tooltipContent.innerHTML = html;
    tooltip.style.display = 'block';
    
    // Позиционируем tooltip
    updateTooltipPosition({ target: element });
}

// Обновить позицию tooltip (с проверкой границ экрана)
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('building-tooltip');
    const resourceTooltip = document.getElementById('resource-tooltip');
    const activeTooltip = (tooltip && tooltip.style.display !== 'none') ? tooltip : 
                         (resourceTooltip && resourceTooltip.style.display !== 'none' ? resourceTooltip : null);
    if (!activeTooltip) return;
    
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = activeTooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let left = rect.right + 10;
    let top = rect.top;
    
    // Если tooltip выходит за правую границу - показываем слева
    if (left + tooltipRect.width > windowWidth) {
        left = rect.left - tooltipRect.width - 10;
    }
    
    // Если tooltip выходит за нижнюю границу - поднимаем вверх
    if (top + tooltipRect.height > windowHeight) {
        top = windowHeight - tooltipRect.height - 10;
    }
    
    // Если tooltip выходит за верхнюю границу - опускаем вниз
    if (top < 0) {
        top = 10;
    }

    activeTooltip.style.left = `${left}px`;
    activeTooltip.style.top = `${top}px`;
}

// Скрыть tooltip
function hideBuildingTooltip() {
    const tooltip = document.getElementById('building-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Скрыть tooltip ресурса
function hideResourceTooltip() {
    const tooltip = document.getElementById('resource-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Показать бейдж на карте
function showMapBadge(text, x, y, type = 'building') {
    // Показываем бейдж только если зажата клавиша Ctrl
    if (!isCtrlPressed) {
        return;
    }
    
    const badge = document.getElementById('map-badge');
    if (!badge) return;
    
    badge.textContent = text;
    
    // Применяем стиль в зависимости от типа
    if (type === 'tile') {
        badge.classList.add('tile-badge');
    } else {
        badge.classList.remove('tile-badge');
    }
    
    badge.style.display = 'block';
    
    // Позиционируем бейдж рядом с курсором
    const offsetX = 15;
    const offsetY = 15;
    let left = x + offsetX;
    let top = y + offsetY;
    
    // Проверяем границы экрана
    const badgeRect = badge.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Если бейдж выходит за правую границу - показываем слева от курсора
    if (left + badgeRect.width > windowWidth) {
        left = x - badgeRect.width - offsetX;
    }
    
    // Если бейдж выходит за нижнюю границу - показываем выше курсора
    if (top + badgeRect.height > windowHeight) {
        top = y - badgeRect.height - offsetY;
    }
    
    // Если бейдж выходит за верхнюю границу - показываем ниже
    if (top < 0) {
        top = offsetY;
    }
    
    // Если бейдж выходит за левую границу - показываем справа
    if (left < 0) {
        left = offsetX;
    }
    
    badge.style.left = `${left}px`;
    badge.style.top = `${top}px`;
}

// Скрыть бейдж на карте
function hideMapBadge() {
    const badge = document.getElementById('map-badge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// Расчет общего производства конкретного ресурса по всем зданиям (с учетом реальных коэффициентов работы)
function calculateResourceProduction(resourceKey) {
    let totalProduction = 0;
    
    // Вычисляем реальные коэффициенты работы для всех зданий на карте
    const allBuildings = [];
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        if (building.consumes && Object.keys(building.consumes).length > 0) {
            allBuildings.push(buildingInstance);
        }
    });
    
    const globalWorkRatios = calculateBuildingWorkRatios(allBuildings);
    
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Проверяем, производит ли это здание нужный ресурс
        if (!building.produces || !building.produces[resourceKey]) return;
        
        // Бонус от типа местности
        const tileBonus = building.tileBonus && building.tileBonus[tile.type] ? 
            building.tileBonus[tile.type] : 1;
        
        // Бонус от группы (используем кэшированный размер)
        const groupSize = getBuildingGroupSize(buildingInstance);
        const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
        
        const totalBonus = tileBonus * neighborhoodBonus;
        
        // Получаем коэффициент работы (1.0 если здание не потребляет ресурсы, иначе из глобального расчета)
        const workRatio = (building.consumes && Object.keys(building.consumes).length > 0) 
            ? (globalWorkRatios.get(buildingInstance.instanceId) || 0)
            : 1.0;
        
        const baseRate = building.produces[resourceKey] || 0;
        totalProduction += baseRate * totalBonus * workRatio;
    });
    
    return totalProduction;
}

// Расчет общего потребления конкретного ресурса по всем зданиям
function calculateResourceConsumption(resourceKey) {
    let totalConsumption = 0;
    
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        if (!building.consumes || !building.consumes[resourceKey]) return;
        
        // Показываем потенциальное потребление всех зданий, независимо от наличия ресурсов
        // Это соответствует логике показа в описании зданий
        totalConsumption += building.consumes[resourceKey] || 0;
    });
    
    return totalConsumption;
}

// Показать tooltip с информацией о ресурсе (оптимизировано с кэшированием)
function showResourceTooltip(resourceKey, element) {
    const tooltip = document.getElementById('resource-tooltip');
    const tooltipContent = document.getElementById('resource-tooltip-content');
    if (!tooltip || !tooltipContent) return;
    
    // Скрываем tooltip для зданий, если он показан
    hideBuildingTooltip();
    
    const now = Date.now();
    let production, consumption;
    
    // Используем кэш, если он актуален
    if (resourceTooltipCache.lastUpdate + resourceTooltipCache.cacheTimeout > now &&
        resourceTooltipCache.production[resourceKey] !== undefined) {
        production = resourceTooltipCache.production[resourceKey];
        consumption = resourceTooltipCache.consumption[resourceKey];
    } else {
        // Рассчитываем производство и потребление (обновляем кэш)
        production = calculateResourceProduction(resourceKey);
        consumption = calculateResourceConsumption(resourceKey);
        resourceTooltipCache.production[resourceKey] = production;
        resourceTooltipCache.consumption[resourceKey] = consumption;
        resourceTooltipCache.lastUpdate = now;
        
        // Ограничиваем размер кэша (оптимизация памяти)
        const prodKeys = Object.keys(resourceTooltipCache.production);
        if (prodKeys.length > resourceTooltipCache.maxCacheSize) {
            // Удаляем старые записи (оставляем только последние maxCacheSize)
            const keysToRemove = prodKeys.slice(0, prodKeys.length - resourceTooltipCache.maxCacheSize);
            keysToRemove.forEach(key => {
                delete resourceTooltipCache.production[key];
                delete resourceTooltipCache.consumption[key];
            });
        }
        
        // Обновляем кэш через 300мс (дебаунсинг)
        if (resourceTooltipTimeout) {
            clearTimeout(resourceTooltipTimeout);
        }
        resourceTooltipTimeout = setTimeout(() => {
            // Очищаем кэш для следующего обновления
            resourceTooltipCache.lastUpdate = 0;
        }, resourceTooltipCache.cacheTimeout);
    }
    
    const difference = production - consumption;
    
    // Создаем содержимое tooltip
    let html = `<div class="tooltip-header">${getResourceIconHTML(resourceKey)} ${getResourceName(resourceKey)}</div>`;
    
    html += '<div class="tooltip-section">';
    html += `<strong>${t('ui.produced')}</strong> <span style="color: #4a9eff;">${formatNumber(production)}${t('ui.perSecond')}</span>`;
    html += '</div>';
    
    html += '<div class="tooltip-section">';
    html += `<strong>${t('ui.consumed')}</strong> <span style="color: #ff6b6b;">${formatNumber(consumption)}${t('ui.perSecond')}</span>`;
    html += '</div>';
    
    html += '<div class="tooltip-section">';
    if (difference > 0) {
        html += `<strong>${t('ui.balance')}</strong> <span style="color: #4caf50;">+${formatNumber(difference)}${t('ui.perSecond')}</span>`;
    } else if (difference < 0) {
        html += `<strong>${t('ui.balance')}</strong> <span style="color: #f44336;">${formatNumber(difference)}${t('ui.perSecond')}</span>`;
    } else {
        html += `<strong>${t('ui.balance')}</strong> <span style="color: #888;">0${t('ui.perSecond')}</span>`;
    }
    html += '</div>';
    
    tooltipContent.innerHTML = html;
    tooltip.style.display = 'block';
    updateTooltipPosition({ target: element });
}

// Создание бейджа ресурса
function createResourceBadge(resource, amount, isPositive = null) {
    const badge = document.createElement('div');
    badge.className = 'resource-badge';
    
    const icon = getResourceIconHTML(resource);
    const color = isPositive === true ? '#4a9eff' : isPositive === false ? '#ff6b6b' : '#ffd700';
    
    badge.innerHTML = `
        <span class="icon">${icon}</span>
        <span style="color: ${color}">${formatNumber(amount)}</span>
    `;
    
    return badge;
}

// Получить иконку ресурса
function getResourceIcon(resource) {
    const icons = {
        silver: '💰', wood: '🪵', limestone: '🪨', cement: '🏗️', blocks: '🧱', coal: '⚫',
        'gold-ore': '⛰️', gold: '🪙', 'iron-ore': '🗿', iron: '⚙️', steel: '⚔️',
        'gold-coins': '🪙', stone: '🪨', brick: '🧱', leather: '🦌', weapons: '⚔️',
        grain: '🌾', flour: '🌾', bread: '🍞', horses: '🐴', armor: '🛡️',
        'military-equipment': '🎖️', blessings: '✨', manuscripts: '📜',
        'craft-skills': '🔨', tools: '🔧', 'metal-products': '⚙️', copper: '🔶',
        'copper-coins': '🪙', marble: '🗿', cattle: '🐄', meat: '🥩', grapes: '🍇',
        wine: '🍷', fruits: '🍎', vegetables: '🥕', 'divine-protection': '🛐',
        knowledge: '📚', 'historical-records': '📜', prestige: '👑', protection: '🛡️',
        influence: '💼',         'fine-food': '🍽️', power: '⚡',
        'trade-goods': '📦', 'entertainment': '🎭', 'hospitality': '🛎️',
        'military-intelligence': '🔍'
    };
    return icons[resource] || '📦';
}

// Получить HTML для иконки ресурса с поддержкой изображений (fallback на эмодзи)
// Используется в местах, где используется innerHTML
function getResourceIconHTML(resource) {
    const emoji = getResourceIcon(resource);
    // Пробуем сначала SVG, потом PNG
    const imagePathSvg = `assets/icons/resources/${resource}.svg`;
    const imagePathPng = `assets/icons/resources/${resource}.png`;
    // Возвращаем HTML с изображением и эмодзи в качестве fallback
    // Если изображение не загрузится, показывается эмодзи
    return `<span class="resource-icon-wrapper"><img src="${imagePathSvg}" alt="${emoji}" class="resource-icon-img" onerror="this.src='${imagePathPng}'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='inline';};" style="width: 1em; height: 1em; vertical-align: middle; display: inline-block; object-fit: contain;"><span class="resource-icon-fallback" style="display: none;">${emoji}</span></span>`;
}

// Получить HTML для иконки здания с поддержкой изображений (fallback на эмодзи)
function getBuildingIconHTML(icon, buildingId) {
    const emoji = icon || '🏗️';
    // Пробуем сначала SVG, потом PNG
    const imagePathSvg = `assets/icons/buildings/${buildingId}.svg`;
    const imagePathPng = `assets/icons/buildings/${buildingId}.png`;
    // Возвращаем HTML с изображением и эмодзи в качестве fallback
    // Если изображение не загрузится, показывается эмодзи
    return `<span class="building-icon-wrapper"><img src="${imagePathSvg}" alt="${emoji}" class="building-icon-img" onerror="this.src='${imagePathPng}'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='inline';};" style="width: 1em; height: 1em; vertical-align: middle; display: inline-block; object-fit: contain;"><span class="building-icon-fallback" style="display: none;">${emoji}</span></span>`;
}

// Получить имя ресурса
function getResourceName(resource) {
    return t(`resource.${resource}`) || resource;
}

// Получить цвет выделения для типа здания
function getBuildingGroupColor(buildingId) {
    const colors = [
        '#4a9eff', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4',
        '#FFEB3B', '#795548', '#607D8B', '#E91E63', '#3F51B5', '#009688',
        '#CDDC39', '#FF5722', '#673AB7', '#00E676', '#FF1744', '#2962FF',
        '#C51162', '#AA00FF', '#00BFA5', '#AEEA00', '#FF6D00', '#6200EA',
        '#0091EA', '#304FFE', '#D50000', '#FFD600', '#64DD17', '#00B8D4',
        '#D500F9', '#FF4081', '#651FFF', '#00E676', '#FFC400', '#2962FF',
        '#C51162', '#AA00FF', '#00BFA5', '#AEEA00', '#FF6D00', '#6200EA',
        '#0091EA', '#304FFE', '#D50000', '#FFD600', '#64DD17', '#00B8D4',
        '#D500F9', '#FF4081', '#651FFF', '#00E676', '#FFC400', '#FFD700'
    ];
    return colors[buildingId % colors.length];
}

// Получить актуальную стоимость здания с учетом прогрессивного роста цен
function getBuildingCost(building) {
    const baseCost = building.cost || {};
    const count = gameState.buildings[building.id] || 0;
    
    // Прогрессивный рост цен: каждое следующее здание того же типа стоит на 10% дороже
    const multiplier = 1 + (count * 0.1);
    
    const actualCost = {};
    for (const [resource, amount] of Object.entries(baseCost)) {
        actualCost[resource] = Math.ceil(amount * multiplier);
    }
    
    return actualCost;
}

// Проверка возможности покупки (с учетом прогрессивных цен)
function canAfford(building) {
    if (building.era !== 'citadel' && building.era > 1) {
        const prevEraBuildings = buildings.filter(b => b.era === building.era - 1);
        if (!prevEraBuildings.some(b => (gameState.buildings[b.id] || 0) > 0)) {
            return false;
        }
    }
    
    // Используем актуальную стоимость с учетом прогрессивного роста
    const actualCost = getBuildingCost(building);
    
    for (const [resource, amount] of Object.entries(actualCost)) {
        if ((resources[resource] || 0) < amount) {
            return false;
        }
    }
    
    return true;
}

// Настройка вкладок
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const era = btn.dataset.era;
            renderBuildings(era === 'citadel' ? 'citadel' : parseInt(era));
        });
    });
}

// Получить текущую эру
function getCurrentEra() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return 1;
    const era = activeTab.dataset.era;
    return era === 'citadel' ? 'citadel' : parseInt(era);
}

// Настройка обработчиков событий
function setupEventListeners() {
    document.getElementById('close-selected')?.addEventListener('click', () => {
        const panel = document.getElementById('selected-panel');
        if (panel) {
            panel.style.display = 'none';
            panel.classList.remove('visible');
        }
        gameMap.selectedBuilding = null;
    });
    
    // Зум карты
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        gameMap.zoom = Math.min(gameMap.zoom + 0.1, 2);
        updateMapZoom();
        renderMapBuildings(); // Перерисовываем здания с новым масштабом
        updateMiniMapViewport(); // Обновляем viewport на мини-карте
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
        gameMap.zoom = Math.max(gameMap.zoom - 0.1, 0.5);
        updateMapZoom();
        renderMapBuildings(); // Перерисовываем здания с новым масштабом
        updateMiniMapViewport(); // Обновляем viewport на мини-карте
    });
    
    // Обработчик клика на мини-карте для прокрутки основной карты
    const miniMap = document.getElementById('mini-map');
    if (miniMap) {
        miniMap.addEventListener('click', (e) => {
            const canvas = miniMap.querySelector('canvas');
            if (!canvas) return;
            
            const mapContainer = document.querySelector('.game-map-container');
            const grid = document.querySelector('.map-grid');
            if (!mapContainer || !grid) return;
            
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const tileSize = parseFloat(canvas.dataset.tileSize);
            
            // Преобразуем координаты клика в координаты тайла на карте
            const tileX = Math.floor(clickX / tileSize);
            const tileY = Math.floor(clickY / tileSize);
            
            // Ограничиваем координаты границами карты
            const clampedX = Math.max(0, Math.min(gameMap.width - 1, tileX));
            const clampedY = Math.max(0, Math.min(gameMap.height - 1, tileY));
            
            // Вычисляем позицию для прокрутки (центрируем выбранную область)
            const tilePixelSize = 40 * gameMap.zoom;
            const containerWidth = mapContainer.clientWidth;
            const containerHeight = mapContainer.clientHeight;
            
            // Прокручиваем так, чтобы выбранная область была в центре видимой области
            const targetScrollLeft = (clampedX * tilePixelSize) - (containerWidth / 2) + (tilePixelSize / 2);
            const targetScrollTop = (clampedY * tilePixelSize) - (containerHeight / 2) + (tilePixelSize / 2);
            
            // Ограничиваем прокрутку границами карты
            const maxScrollLeft = Math.max(0, (gameMap.width * tilePixelSize) - containerWidth);
            const maxScrollTop = Math.max(0, (gameMap.height * tilePixelSize) - containerHeight);
            
            mapContainer.scrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
            mapContainer.scrollTop = Math.max(0, Math.min(maxScrollTop, targetScrollTop));
            
            // Обновляем viewport на мини-карте
            updateMiniMapViewport();
        });
    }
    
    // Обработчик прокрутки основной карты для обновления viewport на мини-карте
    const mapContainer = document.querySelector('.game-map-container');
    if (mapContainer) {
        let scrollTimeout;
        mapContainer.addEventListener('scroll', () => {
            // Используем debounce для оптимизации
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateMiniMapViewport();
            }, 10);
        });
    }
    
    // Ротация по R (отмена строительства обрабатывается в init)
    document.addEventListener('keydown', (e) => {
        // Esc обрабатывается в init, здесь только ротация
        // Ротация здания на R (или русская К)
        if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
            if (gameMap.buildingToPlace || (gameMap.draggingBuildings && gameMap.draggingBuildings.buildings.length > 0)) {
                // Переключаем ротацию (0 -> 1, 1 -> 0)
                gameMap.buildingRotation = gameMap.buildingRotation === 0 ? 1 : 0;
                
                // Если перетаскиваем здания, поворачиваем всю группу как единое целое
                if (gameMap.draggingBuildings) {
                    rotateGroupDuringDrag();
                }
                
                // Обновляем preview
                if (gameMap.buildingToPlace && lastHoverTile) {
                    handleTileHover(lastHoverTile.x, lastHoverTile.y);
                } else if (gameMap.draggingBuildings) {
                    if (gameMap.draggingBuildings.lastMouseX !== undefined) {
                        // Создаем синтетическое событие для вычисления координат
                        const grid = document.querySelector('.map-grid');
                        if (grid) {
                            const mapContainer = grid.closest('.game-map-container');
                            const gridRect = grid.getBoundingClientRect();
                            const scrollX = mapContainer ? mapContainer.scrollLeft : 0;
                            const scrollY = mapContainer ? mapContainer.scrollTop : 0;
                            const syntheticEvent = {
                                clientX: gridRect.left + gameMap.draggingBuildings.lastMouseX - scrollX,
                                clientY: gridRect.top + gameMap.draggingBuildings.lastMouseY - scrollY
                            };
                            const tileCoords = getTileCoordinatesFromMouse(syntheticEvent);
                            if (tileCoords) {
                                const targetX = tileCoords.x - gameMap.draggingBuildings.clickOffsetX;
                                const targetY = tileCoords.y - gameMap.draggingBuildings.clickOffsetY;
                                showDragPreview(targetX, targetY);
                            }
                        }
                    }
                }
            } else if (gameMap.selectedBuildings && gameMap.selectedBuildings.length > 0) {
                // Ротация выбранных зданий
                rotateSelectedBuildings();
            }
        }
    });
    
    // Запрет контекстного меню (ПКМ)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Скрываем tooltip при клике вне области
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.building-item') && !e.target.closest('.tooltip')) {
            hideBuildingTooltip();
        }
    });
}

// Настройка выделения областью
function setupAreaSelection() {
    const mapContainer = document.getElementById('game-map');
    const mapContainerParent = document.querySelector('.game-map-container');
    if (!mapContainer || !mapContainerParent) return;
    
    // Создаем элемент для прямоугольника выделения (в контейнере, а не в самой карте)
    let selectionBox = document.getElementById('selection-box');
    if (!selectionBox) {
        selectionBox = document.createElement('div');
        selectionBox.id = 'selection-box';
        selectionBox.style.display = 'none';
        mapContainerParent.appendChild(selectionBox);
    }
    
    let isSelecting = false;
    let startTile = null;
    
    // Обработка начала выделения (mousedown)
    mapContainer.addEventListener('mousedown', (e) => {
        // Игнорируем клики по зданиям (они обрабатываются отдельно)
        if (e.target.classList.contains('map-building')) return;
        
        // Игнорируем правую кнопку мыши
        if (e.button !== 0) return;
        
        const grid = document.querySelector('.map-grid');
        if (!grid) return;
        
        // ВСЕГДА используем elementFromPoint для определения тайла под курсором
        // Это работает правильно даже при scroll и zoom
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        const tile = elementUnderCursor ? elementUnderCursor.closest('.tile') : null;
        
        let tileX, tileY;
        if (tile && tile.dataset.x !== undefined && tile.dataset.y !== undefined) {
            // Используем data-атрибуты тайла - это самый надежный способ
            tileX = parseInt(tile.dataset.x);
            tileY = parseInt(tile.dataset.y);
        } else {
            // Если не нашли тайл, значит кликнули не на тайл - выходим
            return;
        }
        
        if (tileX < 0 || tileX >= gameMap.width || tileY < 0 || tileY >= gameMap.height) return;
        
        isSelecting = true;
        startTile = { x: tileX, y: tileY };
        gameMap.selectionBox.active = true;
        gameMap.selectionBox.startX = tileX;
        gameMap.selectionBox.startY = tileY;
        gameMap.selectionBox.currentX = tileX;
        gameMap.selectionBox.currentY = tileY;
        
        selectionBox.style.display = 'block';
        updateSelectionBox();
        
        // Если выбрано здание для постройки, сразу показываем preview
        if (gameMap.buildingToPlace && gameMap.buildingToPlace.id !== 0) {
            const minX = Math.min(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
            const maxX = Math.max(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
            const minY = Math.min(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
            const maxY = Math.max(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
            
            const validPositions = findValidBuildPositions(minX, minY, maxX, maxY, gameMap.buildingToPlace);
            const buildPlan = calculateBuildPlan(validPositions, gameMap.buildingToPlace);
            showMassBuildPreview(gameMap.buildingToPlace, buildPlan.positions);
        }
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Обработка перетаскивания (mousemove)
    mapContainer.addEventListener('mousemove', (e) => {
        if (!isSelecting || !gameMap.selectionBox.active) return;
        
        const grid = document.querySelector('.map-grid');
        if (!grid) return;
        
        // Вычисляем координаты тайла напрямую по координатам мыши
        // Это работает даже когда курсор над зданием
        const gridRect = grid.getBoundingClientRect();
        const mapContainer = grid.closest('.game-map-container');
        
        // Учитываем scroll и zoom
        const scrollLeft = mapContainer ? mapContainer.scrollLeft : 0;
        const scrollTop = mapContainer ? mapContainer.scrollTop : 0;
        
        // Вычисляем позицию мыши относительно grid с учетом scroll
        const mouseX = (e.clientX - gridRect.left) + scrollLeft;
        const mouseY = (e.clientY - gridRect.top) + scrollTop;
        
        // Вычисляем координаты тайла с учетом zoom
        const tilePixelSize = 40 * gameMap.zoom;
        let tileX = Math.floor(mouseX / tilePixelSize);
        let tileY = Math.floor(mouseY / tilePixelSize);
        
        // Ограничиваем координаты границами карты
        tileX = Math.max(0, Math.min(gameMap.width - 1, tileX));
        tileY = Math.max(0, Math.min(gameMap.height - 1, tileY));
        
        gameMap.selectionBox.currentX = tileX;
        gameMap.selectionBox.currentY = tileY;
        updateSelectionBox();
        
        // Обновляем информацию о количестве зданий в реальном времени (если выбрано здание для постройки)
        if (gameMap.buildingToPlace && gameMap.buildingToPlace.id !== 0) {
            const minX = Math.min(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
            const maxX = Math.max(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
            const minY = Math.min(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
            const maxY = Math.max(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
            
            const validPositions = findValidBuildPositions(minX, minY, maxX, maxY, gameMap.buildingToPlace);
            const buildPlan = calculateBuildPlan(validPositions, gameMap.buildingToPlace);
            
            updateInfoPanel(t('msg.canBuild', { count: buildPlan.count, total: validPositions.length }));
            
            // Показываем preview всех позиций, где будут построены здания
            showMassBuildPreview(gameMap.buildingToPlace, buildPlan.positions);
        }
        
        e.preventDefault();
    });
    
    // Обработка завершения выделения (mouseup)
    document.addEventListener('mouseup', (e) => {
        if (!isSelecting || !gameMap.selectionBox.active) return;
        
        isSelecting = false;
        gameMap.selectionBox.active = false;
        selectionBox.style.display = 'none';
        
        const minX = Math.min(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
        const maxX = Math.max(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
        const minY = Math.min(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
        const maxY = Math.max(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
        
        // Если выбрано здание для постройки - режим массовой постройки
        if (gameMap.buildingToPlace) {
            // Исключение: серебряная шахта (id: 0) можно строить только по одному
            if (gameMap.buildingToPlace.id === 0) {
                // Для серебряной шахты используем обычную постройку в центре области
                const centerX = Math.floor((minX + maxX) / 2);
                const centerY = Math.floor((minY + maxY) / 2);
                if (canPlaceBuilding(centerX, centerY, gameMap.buildingToPlace)) {
                    placeBuilding(centerX, centerY, gameMap.buildingToPlace);
                }
            } else {
                // Массовая постройка для остальных зданий
                handleMassBuildArea(minX, minY, maxX, maxY, gameMap.buildingToPlace);
            }
        } else {
            // Режим выделения зданий
            const selectedBuildings = getBuildingsInArea(minX, minY, maxX, maxY);
            
            if (selectedBuildings.length > 0) {
                selectBuildingsByArea(selectedBuildings);
            } else {
                // Если ничего не выбрано, снимаем выделение только если был реальный drag
                const dragDistance = Math.abs(maxX - minX) + Math.abs(maxY - minY);
                if (dragDistance > 0) {
                    gameMap.selectedBuildings = [];
                    gameMap.selectedBuilding = null;
                    gameMap.selectionMode = 'single';
                    const panel = document.getElementById('selected-panel');
        if (panel) {
            panel.style.display = 'none';
            panel.classList.remove('visible');
        }
                }
            }
        }
        
        e.preventDefault();
    });
    
    // Функция обновления визуального прямоугольника выделения
    function updateSelectionBox() {
        const grid = document.querySelector('.map-grid');
        if (!grid) return;
        
        const mapContainer = grid.closest('.game-map-container');
        if (!mapContainer) return;
        
        const startX = Math.min(gameMap.selectionBox.startX, gameMap.selectionBox.currentX);
        const startY = Math.min(gameMap.selectionBox.startY, gameMap.selectionBox.currentY);
        const endX = Math.max(gameMap.selectionBox.startX, gameMap.selectionBox.currentX) + 1;
        const endY = Math.max(gameMap.selectionBox.startY, gameMap.selectionBox.currentY) + 1;
        
        // Находим тайлы для вычисления их реальных позиций на экране
        // Это работает правильно даже при scroll и zoom
        const startTile = document.querySelector(`.tile[data-x="${startX}"][data-y="${startY}"]`);
        const endTile = document.querySelector(`.tile[data-x="${endX - 1}"][data-y="${endY - 1}"]`);
        
        if (startTile && endTile) {
            const startRect = startTile.getBoundingClientRect();
            const endRect = endTile.getBoundingClientRect();
            const containerRect = mapContainerParent.getBoundingClientRect();
            
            // Учитываем прокрутку контейнера при расчете позиции
            const left = startRect.left - containerRect.left + mapContainerParent.scrollLeft;
            const top = startRect.top - containerRect.top + mapContainerParent.scrollTop;
            const width = endRect.right - startRect.left;
            const height = endRect.bottom - startRect.top;
            
            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
        } else {
            // Fallback на старый метод, если тайлы не найдены
            const gridRect = grid.getBoundingClientRect();
            const containerRect = mapContainerParent.getBoundingClientRect();
            const tileSize = 40 * gameMap.zoom;
            const width = (endX - startX) * tileSize;
            const height = (endY - startY) * tileSize;
            const left = (gridRect.left - containerRect.left) + (startX * tileSize) - mapContainer.scrollLeft;
            const top = (gridRect.top - containerRect.top) + (startY * tileSize) - mapContainer.scrollTop;
            
            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;
            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
        }
    }
}

// Получить все здания в области выделения
function getBuildingsInArea(startX, startY, endX, endY) {
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    
    const buildingsInArea = [];
    
    gameMap.buildings.forEach(building => {
        const buildingData = buildingsCache.get(building.buildingId);
        const width = buildingData?.width || building.width || 1;
        const height = buildingData?.height || building.height || 1;
        
        // Проверяем, пересекается ли здание с областью выделения
        const buildingRight = building.x + width;
        const buildingBottom = building.y + height;
        
        // Здание попадает в область, если оно пересекается с прямоугольником выделения
        if (!(buildingRight <= minX || building.x >= maxX + 1 || 
              buildingBottom <= minY || building.y >= maxY + 1)) {
            buildingsInArea.push(building);
        }
    });
    
    return buildingsInArea;
}

// Выбор зданий по области
function selectBuildingsByArea(buildings) {
    if (buildings.length === 0) return;
    
    gameMap.selectedBuildings = buildings;
    gameMap.selectedBuilding = buildings[0].instanceId;
    gameMap.selectionMode = 'area';
    
    // Обновляем визуальное выделение
    updateBuildingSelection();
    
    // Показываем агрегированную информацию
    showAreaSelectionInfo(buildings);
}

// Показать информацию о выделенных зданиях по области
function showAreaSelectionInfo(buildings) {
    const panel = document.getElementById('selected-panel');
    if (!panel) return;
    
    panel.style.display = 'block';
    // Добавляем класс для CSS селектора (для совместимости)
    panel.classList.add('visible');
    
    const iconEl = document.getElementById('selected-icon');
    const nameEl = document.getElementById('selected-name');
    if (iconEl) iconEl.textContent = '🏗️';
    if (nameEl) nameEl.textContent = `${t('ui.selectedBuildings')} ${buildings.length}`;
    
    const stats = document.getElementById('selected-stats');
    if (!stats) return;
    
    // Calculate production and consumption for all selected buildings
    const production = calculateBuildingsProduction(buildings);
    const consumption = calculateBuildingsConsumption(buildings);
    
    let html = `<p>${t('ui.selectedBuildings')} ${buildings.length}</p>`;
    
    // Production
    if (Object.keys(production).length > 0) {
        html += `<p><strong>${t('ui.produces')}</strong></p>`;
        html += `<div class="tooltip-badges">`;
        Object.entries(production).forEach(([resource, amount]) => {
            html += `<span class="tooltip-badge" style="color: #4a9eff; background: rgba(74, 158, 255, 0.1);">${getResourceIconHTML(resource)} ${getResourceName(resource)} ${formatNumber(amount)}${t('ui.perSecond')}</span>`;
        });
        html += `</div>`;
    } else {
        html += `<p><strong>${t('ui.produces')}</strong> ${t('ui.nothing')}</p>`;
    }
    
    // Потребление
    if (Object.keys(consumption).length > 0) {
        html += `<p><strong>${t('ui.consumes')}</strong></p>`;
        html += `<div class="tooltip-badges">`;
        Object.entries(consumption).forEach(([resource, amount]) => {
            html += `<span class="tooltip-badge" style="color: #ff6b6b; background: rgba(255, 107, 107, 0.1);">${getResourceIconHTML(resource)} ${getResourceName(resource)} ${formatNumber(amount)}${t('ui.perSecond')}</span>`;
        });
        html += `</div>`;
    } else {
        html += `<p><strong>${t('ui.consumes')}</strong> ${t('ui.nothing')}</p>`;
    }
    
    stats.innerHTML = html;
}

// Обработка массовой постройки в области
function handleMassBuildArea(minX, minY, maxX, maxY, building) {
    // Находим все валидные позиции в области (справа налево, сверху вниз)
    const validPositions = findValidBuildPositions(minX, minY, maxX, maxY, building);
    
    if (validPositions.length === 0) {
        updateInfoPanel(t('msg.noValidPositions'));
        return;
    }
    
    // Сразу строим все возможные здания
    executeMassBuild(building, validPositions);
}

// Найти все валидные позиции для постройки в области (справа налево, сверху вниз)
function findValidBuildPositions(minX, minY, maxX, maxY, building) {
    const width = building.width || 1;
    const height = building.height || 1;
    const validPositions = [];
    
    // Перебираем все возможные позиции в области (справа налево, сверху вниз)
    for (let y = minY; y <= maxY - height + 1; y++) {
        for (let x = maxX - width + 1; x >= minX; x--) {
            // Проверяем границы области
            if (x + width - 1 > maxX || y + height - 1 > maxY || x < minX) continue;
            
            // Проверяем возможность постройки (без проверки ресурсов, только место)
            if (canPlaceBuildingAtPosition(x, y, building)) {
                validPositions.push({ x, y });
            }
        }
    }
    
    return validPositions;
}

// Проверка возможности постройки только по позиции (без проверки ресурсов)
function canPlaceBuildingAtPosition(x, y, building) {
    const width = building.width || 1;
    const height = building.height || 1;
    
    // Проверка границ карты
    if (x < 0 || x + width > gameMap.width || y < 0 || y + height > gameMap.height) {
        return false;
    }
    
    // Проверка занятости всех клеток
    for (let dy = 0; dy < height; dy++) {
        for (let dx = 0; dx < width; dx++) {
            const tx = x + dx;
            const ty = y + dy;
            if (gameMap.occupiedTiles.has(`${tx},${ty}`)) {
                return false;
            }
        }
    }
    
    return true;
}

// Рассчитать план постройки с учетом ресурсов
function calculateBuildPlan(validPositions, building) {
    // Копируем текущие ресурсы для расчетов
    const availableResources = { ...resources };
    let builtCount = 0;
    const positionsToBuild = [];
    const baseCost = building.cost || {};
    const buildingsCount = gameState.buildings[building.id] || 0;
    
    for (const pos of validPositions) {
        // Рассчитываем стоимость с учетом уже построенных зданий и уже построенных в этой сессии
        const costMultiplier = 1 + ((buildingsCount + builtCount) * 0.1);
        
        // Проверяем, достаточно ли ресурсов
        let canAfford = true;
        for (const [resource, baseAmount] of Object.entries(baseCost)) {
            const requiredAmount = Math.ceil(baseAmount * costMultiplier);
            if ((availableResources[resource] || 0) < requiredAmount) {
                canAfford = false;
                break;
            }
        }
        
        if (canAfford) {
            // Списываем ресурсы
            for (const [resource, baseAmount] of Object.entries(baseCost)) {
                const requiredAmount = Math.ceil(baseAmount * costMultiplier);
                availableResources[resource] = (availableResources[resource] || 0) - requiredAmount;
            }
            
            positionsToBuild.push(pos);
            builtCount++;
        }
    }
    
    return {
        count: builtCount,
        positions: positionsToBuild,
        maxPossible: validPositions.length
    };
}


// Выполнить массовую постройку (строит все возможные с учетом ресурсов)
function executeMassBuild(building, positions) {
    // Рассчитываем план постройки с учетом ресурсов
    const buildPlan = calculateBuildPlan(positions, building);
    
    let builtCount = 0;
    
    // Строим здания из плана последовательно (они уже отсортированы справа налево, сверху вниз)
    for (const pos of buildPlan.positions) {
        // Проверяем еще раз перед постройкой (может измениться состояние после предыдущих построек)
        if (canPlaceBuildingAtPosition(pos.x, pos.y, building) && canAfford(building)) {
            placeBuildingWithoutClearing(pos.x, pos.y, building);
            builtCount++;
            
            // Обновляем занятые клетки сразу, чтобы следующие здания не накладывались
            updateOccupiedTiles();
        }
    }
    
    // Очищаем выбор после массовой постройки
    gameMap.buildingToPlace = null;
    clearPreview();
    document.querySelectorAll('.building-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Обновляем интерфейс
    updateOccupiedTiles();
    renderMapBuildings();
    renderResources();
    renderBuildings(getCurrentEra());
    updateInfoPanel(t('msg.massBuilt', { count: builtCount, total: positions.length }));
    
    // Сохраняем прогресс после массовой постройки
    if (builtCount > 0) {
        saveGame();
    }
}

// Разместить здание без очистки выбора (для массовой постройки)
function placeBuildingWithoutClearing(x, y, building) {
    if (!canPlaceBuilding(x, y, building)) {
        return false;
    }
    
    // Получаем актуальную стоимость с учетом прогрессивного роста
    const actualCost = getBuildingCost(building);
    
    // Списываем ресурсы
    if (Object.keys(actualCost).length > 0) {
        Object.entries(actualCost).forEach(([resource, amount]) => {
            resources[resource] = (resources[resource] || 0) - amount;
        });
    }
    
    // Создаем экземпляр здания
    const instanceId = Date.now() + Math.random() + Math.random();
    const width = building.width || 1;
    const height = building.height || 1;
    
    gameMap.buildings.push({
        x: x,
        y: y,
        buildingId: building.id,
        instanceId: instanceId,
        width: width,
        height: height
    });
    
    // Обновляем счетчик зданий
    gameState.buildings[building.id] = (gameState.buildings[building.id] || 0) + 1;
    
    // Обновляем занятые клетки сразу
    updateOccupiedTiles();
    
    return true;
}

// Обновление зума карты
function updateMapZoom() {
    const grid = document.querySelector('.map-grid');
    if (grid) {
        grid.style.transform = `scale(${gameMap.zoom})`;
        grid.style.transformOrigin = '0 0';
        // Обновляем размер сетки с учетом масштаба
        grid.style.width = `${gameMap.width * 40 * gameMap.zoom}px`;
        grid.style.height = `${gameMap.height * 40 * gameMap.zoom}px`;
    }
    // Обновляем viewport на мини-карте после изменения зума
    updateMiniMapViewport();
}

// Рендеринг мини-карты
function renderMiniMap() {
    const miniMap = document.getElementById('mini-map');
    miniMap.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.cursor = 'pointer';
    const ctx = canvas.getContext('2d');
    
    const tileSize = Math.min(200 / gameMap.width, 200 / gameMap.height);
    
    // Сохраняем tileSize для использования в других функциях
    canvas.dataset.tileSize = tileSize;
    
    for (let y = 0; y < gameMap.height; y++) {
        for (let x = 0; x < gameMap.width; x++) {
            const tile = gameMap.tiles[y][x];
            const colors = {
                grass: '#4a5a3a',
                forest: '#2d4a2d',
                stone: '#6a6a6a',
                gold: '#8b6914',
                iron: '#5a4a3a',
                water: '#2a4a6a'
            };
            
            ctx.fillStyle = colors[tile.type] || '#4a5a3a';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    
    // Отметки зданий
    gameMap.buildings.forEach(building => {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(building.x * tileSize, building.y * tileSize, tileSize, tileSize);
    });
    
    miniMap.appendChild(canvas);
    
    // Обновляем viewport после рендеринга
    updateMiniMapViewport();
}

// Обновление viewport на мини-карте
function updateMiniMapViewport() {
    const miniMap = document.getElementById('mini-map');
    const canvas = miniMap?.querySelector('canvas');
    if (!canvas) return;
    
    const mapContainer = document.querySelector('.game-map-container');
    if (!mapContainer) return;
    
    const ctx = canvas.getContext('2d');
    const tileSize = parseFloat(canvas.dataset.tileSize);
    
    // Получаем размеры видимой области
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;
    
    // Получаем позицию прокрутки
    const scrollLeft = mapContainer.scrollLeft;
    const scrollTop = mapContainer.scrollTop;
    
    // Вычисляем видимую область в координатах карты (с учетом zoom)
    const tilePixelSize = 40 * gameMap.zoom;
    const viewportStartX = scrollLeft / tilePixelSize;
    const viewportStartY = scrollTop / tilePixelSize;
    const viewportWidth = containerWidth / tilePixelSize;
    const viewportHeight = containerHeight / tilePixelSize;
    
    // Перерисовываем мини-карту с viewport
    renderMiniMapContent(ctx, tileSize);
    
    // Рисуем viewport (видимую область)
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(
        viewportStartX * tileSize,
        viewportStartY * tileSize,
        viewportWidth * tileSize,
        viewportHeight * tileSize
    );
    
    // Заливаем viewport полупрозрачным цветом
    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.fillRect(
        viewportStartX * tileSize,
        viewportStartY * tileSize,
        viewportWidth * tileSize,
        viewportHeight * tileSize
    );
}

// Рендеринг содержимого мини-карты (без viewport)
function renderMiniMapContent(ctx, tileSize) {
    // Очищаем canvas
    ctx.clearRect(0, 0, 200, 200);
    
    // Рисуем тайлы
    for (let y = 0; y < gameMap.height; y++) {
        for (let x = 0; x < gameMap.width; x++) {
            const tile = gameMap.tiles[y][x];
            const colors = {
                grass: '#4a5a3a',
                forest: '#2d4a2d',
                stone: '#6a6a6a',
                gold: '#8b6914',
                iron: '#5a4a3a',
                water: '#2a4a6a'
            };
            
            ctx.fillStyle = colors[tile.type] || '#4a5a3a';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    
    // Отметки зданий
    gameMap.buildings.forEach(building => {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(building.x * tileSize, building.y * tileSize, tileSize, tileSize);
    });
}

// Обновление панели информации (оптимизировано)
function updateInfoPanel(text) {
    const panel = document.getElementById('info-panel');
    if (!panel) return;
    
    const content = panel.querySelector('.info-content');
    if (content && text) {
        content.innerHTML = `<p>${text}</p>`;
    }
}

// Игровой цикл (оптимизировано с requestAnimationFrame для плавности)
let animationFrameId = null;
let autoSaveIntervalId = null; // ID интервала автосохранения

function startGameLoop() {
    let lastTime = performance.now();
    let lastBonusesTime = 0;
    
    function gameLoop(currentTime) {
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Ограничиваем delta для стабильности
        lastTime = currentTime;
        
        if (delta > 0) {
            // Сначала потребление, потом производство - так проверка наличия ресурсов работает корректно
            // Но это не правильно, потому что производство должно быть первым
            // Вместо этого, нужно проверять наличие ресурсов более строго в updateProduction
            updateProduction(delta);
            updateConsumption(delta);
            
            // Обновляем бонусы реже - раз в секунду
            if (currentTime - lastBonusesTime > 1000) {
                updateBonuses();
                lastBonusesTime = currentTime;
            }
        }
        
        // Рендерим ресурсы реже - раз в 500мс для производительности
        if (!gameState.lastRenderTime || currentTime - gameState.lastRenderTime > 500) {
            renderResources();
            gameState.lastRenderTime = currentTime;
        }
        
        // Обновляем визуальные индикаторы статуса зданий реже - раз в секунду
        if (currentTime - lastWorkStatusUpdate > WORK_STATUS_UPDATE_INTERVAL) {
            updateBuildingStatusIndicators();
            lastWorkStatusUpdate = currentTime;
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    gameState.lastRenderTime = 0;
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Остановка игрового цикла (на случай перезагрузки)
function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (autoSaveIntervalId) {
        clearInterval(autoSaveIntervalId);
        autoSaveIntervalId = null;
    }
}

// Обновление производства (оптимизировано с проверкой границ и кэшем + бонус соседства)
// ВАЖНО: Эта функция обрабатывает ВСЕ здания, включая те, которые только потребляют
// Логика: проверка наличия ресурсов -> потребление -> производство
function updateProduction(delta) {
    // Сначала обрабатываем все здания, которые не потребляют ресурсы (производят базовые ресурсы)
    // Они производят сразу, так как им ничего не нужно
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ массива
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Если здание ничего не потребляет, сразу производим
        if (!building.consumes || Object.keys(building.consumes).length === 0) {
            if (building.produces && Object.keys(building.produces).length > 0) {
                // Бонус от типа местности
                const tileBonus = building.tileBonus && building.tileBonus[tile.type] ? 
                    building.tileBonus[tile.type] : 1;
                
                // Бонус от группы
                const groupSize = getBuildingGroupSize(buildingInstance);
                const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
                
                const totalBonus = tileBonus * neighborhoodBonus;
                
                Object.entries(building.produces).forEach(([resource, rate]) => {
                    const production = rate * totalBonus * delta;
                    resources[resource] = (resources[resource] || 0) + production;
                });
            }
        }
    });
    
    // Теперь обрабатываем здания, которые потребляют ресурсы
    // Собираем все потребности по ресурсам для глобального распределения
    const resourceDemands = {};
    const buildingsToProcess = [];
    
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Проверка границ массива
        if (buildingInstance.y < 0 || buildingInstance.y >= gameMap.height ||
            buildingInstance.x < 0 || buildingInstance.x >= gameMap.width) {
            return;
        }
        
        const tile = gameMap.tiles[buildingInstance.y]?.[buildingInstance.x];
        if (!tile) return;
        
        // Если здание потребляет ресурсы, добавляем в обработку
        if (building.consumes && Object.keys(building.consumes).length > 0) {
            buildingsToProcess.push({ buildingInstance, building, tile });
            
            // Собираем потребности этого здания
            Object.entries(building.consumes).forEach(([resource, rate]) => {
                if (!resourceDemands[resource]) {
                    resourceDemands[resource] = [];
                }
                resourceDemands[resource].push({
                    buildingInstance,
                    rate: rate * delta
                });
            });
        }
    });
    
    // Целочисленное распределение ресурсов: здание либо работает на 100%, либо не работает
    const buildingWorkRatios = new Map();
    
    // Вычисляем доступность каждого ресурса (текущее количество + производство от базовых зданий)
    const resourceAvailability = {};
    Object.keys(resourceDemands).forEach(resource => {
        const currentAmount = resources[resource] || 0;
        
        // Вычисляем производство этого ресурса зданиями, которые не потребляют ресурсы
        let productionRate = 0;
        gameMap.buildings.forEach(prodBuildingInstance => {
            const prodBuilding = buildingsCache.get(prodBuildingInstance.buildingId);
            if (!prodBuilding || !gameState.enabled[prodBuilding.id]) return;
            
            if (prodBuildingInstance.y < 0 || prodBuildingInstance.y >= gameMap.height ||
                prodBuildingInstance.x < 0 || prodBuildingInstance.x >= gameMap.width) {
                return;
            }
            
            const tile = gameMap.tiles[prodBuildingInstance.y]?.[prodBuildingInstance.x];
            if (!tile) return;
            
            // Учитываем только здания, которые не потребляют ресурсы (базовое производство)
            if (!prodBuilding.consumes || Object.keys(prodBuilding.consumes).length === 0) {
                if (prodBuilding.produces && prodBuilding.produces[resource]) {
                    const tileBonus = prodBuilding.tileBonus && prodBuilding.tileBonus[tile.type] ? 
                        prodBuilding.tileBonus[tile.type] : 1;
                    const groupSize = getBuildingGroupSize(prodBuildingInstance);
                    const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
                    const totalBonus = tileBonus * neighborhoodBonus;
                    productionRate += (prodBuilding.produces[resource] || 0) * totalBonus;
                }
            }
        });
        
        resourceAvailability[resource] = (currentAmount + productionRate) * delta;
    });
    
    // Сортируем здания для детерминированного порядка распределения
    buildingsToProcess.sort((a, b) => a.buildingInstance.instanceId - b.buildingInstance.instanceId);
    
    // Для каждого здания проверяем, достаточно ли всех ресурсов
    buildingsToProcess.forEach(({ buildingInstance, building }) => {
        let canWork = true;
        
        // Проверяем все ресурсы для этого здания
        Object.entries(building.consumes).forEach(([resource, rate]) => {
            const required = rate * delta;
            if (resourceAvailability[resource] < required) {
                canWork = false;
            }
        });
        
        // Если здание может работать, отмечаем его как работающее и вычитаем ресурсы
        if (canWork) {
            buildingWorkRatios.set(buildingInstance.instanceId, 1.0);
            // Вычитаем потребности этого здания из доступности
            Object.entries(building.consumes).forEach(([resource, rate]) => {
                resourceAvailability[resource] -= rate * delta;
            });
        } else {
            buildingWorkRatios.set(buildingInstance.instanceId, 0);
        }
    });
    
    // Теперь обрабатываем здания с учетом коэффициентов работы
    buildingsToProcess.forEach(({ buildingInstance, building, tile }) => {
        const workRatio = buildingWorkRatios.get(buildingInstance.instanceId);
        
        // Обновляем статус работы здания
        if (workRatio === undefined || workRatio <= 0) {
            // Определяем причину остановки
            let reason = '';
            Object.entries(building.consumes).forEach(([resource, rate]) => {
                const required = rate * delta;
                const available = resourceAvailability[resource] || 0;
                if (available < required) {
                    if (reason) reason += ', ';
                    reason += t(`resource.${resource}`) || resource;
                }
            });
            buildingWorkStatus.set(buildingInstance.instanceId, {
                working: false,
                reason: reason || t('ui.insufficientResources')
            });
            return;
        }
        
        // Здание работает
        buildingWorkStatus.set(buildingInstance.instanceId, { working: true });
        
        // Потребляем ресурсы (с учетом коэффициента)
        Object.entries(building.consumes).forEach(([resource, rate]) => {
            const consumption = rate * delta * workRatio;
            const current = resources[resource] || 0;
            resources[resource] = Math.max(0, current - consumption);
        });
        
        // Производим (с учетом коэффициента)
        if (building.produces && Object.keys(building.produces).length > 0) {
            // Бонус от типа местности
            const tileBonus = building.tileBonus && building.tileBonus[tile.type] ? 
                building.tileBonus[tile.type] : 1;
            
            // Бонус от группы
            const groupSize = getBuildingGroupSize(buildingInstance);
            const neighborhoodBonus = 1 + ((groupSize - 1) * 0.05);
            
            const totalBonus = tileBonus * neighborhoodBonus;
            
            Object.entries(building.produces).forEach(([resource, rate]) => {
                const production = rate * totalBonus * delta * workRatio;
                resources[resource] = (resources[resource] || 0) + production;
            });
        }
    });
    
    // Обновляем статус для зданий, которые не потребляют ресурсы (они всегда работают)
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !gameState.enabled[building.id]) return;
        
        // Если здание не потребляет ресурсы и производит что-то, оно всегда работает
        if ((!building.consumes || Object.keys(building.consumes).length === 0) &&
            building.produces && Object.keys(building.produces).length > 0) {
            buildingWorkStatus.set(buildingInstance.instanceId, { working: true });
        }
    });
}

// Обновление потребления (оптимизировано с кэшем)
// ВАЖНО: Потребление теперь происходит внутри updateProduction перед производством,
// чтобы гарантировать корректную логику: проверка наличия -> потребление -> производство
// Эта функция оставлена пустой, чтобы избежать двойного потребления ресурсов
function updateConsumption(delta) {
    // Потребление ресурсов теперь происходит в updateProduction() 
    // для каждого здания перед его производством, что гарантирует корректную логику
}

// Обновление бонусов (оптимизировано с кэшем)
function updateBonuses() {
    gameState.bonuses = {
        pps: 0,
        production: 0,
        breakChance: 0,
        repairSpeed: 0,
        globalMultiplier: 1
    };
    
    gameMap.buildings.forEach(buildingInstance => {
        const building = buildingsCache.get(buildingInstance.buildingId);
        if (!building || !building.bonus) return;
        
        Object.entries(building.bonus).forEach(([key, value]) => {
            if (key === 'globalMultiplier') {
                gameState.bonuses[key] *= value;
            } else {
                gameState.bonuses[key] += value;
            }
        });
    });
}

// Обновление игрового времени (оптимизировано)
let gameTimeInterval = null;
function updateGameTime() {
    if (gameTimeInterval) clearInterval(gameTimeInterval);
    
    gameTimeInterval = setInterval(() => {
        gameState.gameTime += 1;
        const minutes = Math.floor(gameState.gameTime / 60);
        const seconds = gameState.gameTime % 60;
        const timeElement = document.getElementById('game-time');
        if (timeElement) {
            timeElement.textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

// Остановка обновления времени
function stopGameTime() {
    if (gameTimeInterval) {
        clearInterval(gameTimeInterval);
        gameTimeInterval = null;
    }
}

// Инициализация включенных зданий
buildings.forEach(b => {
    if (!gameState.enabled[b.id]) {
        gameState.enabled[b.id] = true;
    }
});

// Инициализация предыдущих значений ресурсов
Object.keys(resources).forEach(key => {
    previousResourceValues[key] = resources[key];
});

// Запуск игры
document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        alert(t('ui.error'));
    }
});

// Очистка при выгрузке страницы (основное сохранение происходит в init)
window.addEventListener('beforeunload', () => {
    stopGameLoop();
    stopGameTime();
});
