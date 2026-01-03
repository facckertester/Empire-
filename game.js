// Расчёт поглощения урона Вуалью звёзд
function calculateVeilDamageReduction() {
    const veilWeapon = activeWeapons.find(w => w.type === 'veilOfStars');
    if (!veilWeapon) return 0;
    
    // Начальный процент 8% на 1 уровне, до 99% на 40 уровне
    const reductionPercent = Math.min(8 + (veilWeapon.level - 1) * 2.3, 99);
    return reductionPercent / 100;
}

// Применение поглощения урона
function applyVeilDamageReduction(damage) {
    const reduction = calculateVeilDamageReduction();
    return damage * (1 - reduction);
}

// Функция активации красного эффекта при уроне
function activateDamageEffect() {
    startDamageBorderEffect();
}

// Функция для звука стратегического удара
function playStrategicStrikeSound() {
    if (soundEnabled) {
        // Используем существующий звук попадания как временный
        playHitSound();
    }
}

// Система красной рамки при уроне
let damageBorderEffect = {
    active: false,
    duration: 0,
    maxDuration: 500 // 0.5 секунды эффекта
};

// Запуск красной рамки при уроне
function startDamageBorderEffect() {
    damageBorderEffect.active = true;
    damageBorderEffect.duration = damageBorderEffect.maxDuration;
    
    // Применяем эффект к canvas
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.style.borderColor = '#ff0000';
        canvas.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
    }
}

// Обновление эффекта красной рамки
function updateDamageBorderEffect(deltaTime) {
    if (!damageBorderEffect.active) return;
    
    damageBorderEffect.duration -= deltaTime;
    
    if (damageBorderEffect.duration <= 0) {
        damageBorderEffect.active = false;
        
        // Возвращаем обычные стили
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.borderColor = '#1a237e';
            canvas.style.boxShadow = '0 0 20px rgba(0, 50, 255, 0.3)';
        }
    } else {
        // Пульсирующий эффект
        const intensity = damageBorderEffect.duration / damageBorderEffect.maxDuration;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            const glowSize = 20 + (intensity * 20);
            canvas.style.boxShadow = `0 0 ${glowSize}px rgba(255, 0, 0, ${intensity * 0.8})`;
        }
    }
}

// Система тряски экрана
let screenShake = {
    active: false,
    intensity: 0,
    duration: 0,
    offsetX: 0,
    offsetY: 0
};

// Запуск тряски экрана
function startScreenShake(intensity, duration) {
    screenShake.active = true;
    screenShake.intensity = intensity;
    screenShake.duration = duration;
    screenShake.offsetX = 0;
    screenShake.offsetY = 0;
}

// Обновление тряски экрана
function updateScreenShake() {
    if (!screenShake.active) return;
    
    if (screenShake.duration > 0) {
        screenShake.duration--;
        
        // Генерируем случайное смещение
        screenShake.offsetX = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.offsetY = (Math.random() - 0.5) * screenShake.intensity;
        
        // Применяем смещение к canvas
        ctx.save();
        ctx.translate(screenShake.offsetX, screenShake.offsetY);
    } else {
        screenShake.active = false;
        screenShake.offsetX = 0;
        screenShake.offsetY = 0;
    }
}

// Применение тряски к игровому контейнеру
function applyScreenShakeToContainer() {
    const gameContainer = document.querySelector('.game-container');
    if (screenShake.active && gameContainer) {
        gameContainer.style.transform = `translate(${screenShake.offsetX}px, ${screenShake.offsetY}px)`;
    } else if (gameContainer) {
        gameContainer.style.transform = 'translate(0, 0)';
    }
}
let gameActive = false;
let gamePaused = false;
let soundEnabled = true;
let money = 0; // Валюта для покупки улучшений
let score = 0; // Очки для рекорда (начисляются за врагов и боссов)
let highScore = localStorage.getItem('spaceSurvivorHighScore') || 0;
let lives = 5;
let wave = 1;
let level = 1;
let waveTimer = 10;
let waveMaxTimer = 10; // Добавлено объявление
let waveInterval;
let bossEnemySpawnInterval;
let gameTime = 0;
let stars = [];
let isFullscreen = false;
let autoShootInterval;
let shieldActive = false;
let shieldCooldown = false;
let bossActive = false;
let boss = null;
let manualShootMode = false; // Режим стрельбы: false = автоматический, true = ручной

// Система неуязвимости после потери жизни
let invulnerable = false;
let invulnerableEndTime = 0;
let invulnerableDuration = 2000; // 2 секунды неуязвимости

// Активация неуязвимости после потери жизни
function activateInvulnerability() {
    invulnerable = true;
    invulnerableEndTime = Date.now() + invulnerableDuration;
    
    // Показываем уведомление
    showNotification('shield', '🛡️ Неуязвимость на 2 секунды!');
    
    // Визуальный эффект неуязвимости
    createParticles(player.x, player.y, 20, '#ffff00', 'shield');
}

// Единый AudioContext для всех звуков (оптимизация памяти)
let audioContext = null;

// Максимальное количество объектов (оптимизация памяти)
const MAX_PARTICLES = 500;
const MAX_NOTIFICATIONS = 10;
const MAX_BULLETS = 300;
const MAX_ENEMY_BULLETS = 200;

// Фиксированный временной шаг для независимости от FPS (60 FPS)
const FIXED_TIMESTEP = 1000 / 60; // 16.67 мс на кадр при 60 FPS
let lastTime = 0;
let accumulator = 0;

// Объект игрока
const player = {
    x: 400,
    y: 250,
    radius: 15,
    speed: 4,
    color: '#4fc3f7',
    health: 100,
    maxHealth: 100,
    fireRate: 400,
    damage: 10,
    lastShot: 0,
    isMoving: { up: false, down: false, left: false, right: false },
    mouseX: 400,
    mouseY: 250,
    shield: 0,
    maxShield: 0,
    shieldRegen: 0.05,
    lastShieldRegen: 0,
    splitLevel: 0,
    ricochetLevel: 0,
    piercingLevel: 0,
    shieldActiveTime: 0,
    shieldCooldownTime: 0,
    lifeSteal: 0,
    criticalChance: 5,
    criticalMultiplier: 2,
    bulletSpeed: 7,
    experience: 0,
    experienceToNextLevel: 100,
    playerLevel: 1,
    // Эффекты боссов
    onFire: false,
    fireEndTime: 0,
    movementSlowed: false,
    movementSlowEndTime: 0,
    attackSlowed: false,
    attackSlowEndTime: 0,
    baseSpeed: 4,
    baseFireRate: 400
};

// Массивы объектов игры
let bullets = [];
let enemies = [];
let enemyBullets = [];
let particles = [];
let upgrades = [];
let notifications = [];
let bossProjectiles = [];
let healthCores = [];

// Система дополнительного оружия
let activeWeapons = []; // Массив активных оружий {type, level}
let weaponSelectionPaused = false; // Флаг паузы для выбора оружия
let refreshCost = 5; // Начальная цена обновления выбора оружия

// Данные для дополнительного оружия
let orbitalShields = []; // Орбитальные щиты
let companionDrones = []; // Дроны-помощники
let laserBeams = { lastShot: 0 }; // Лазерные лучи (состояние)
let chainLightning = { lastCast: 0, cooldown: 2000 }; // Молнии
let damageWaves = []; // Волны урона
let meteors = []; // Метеориты
let fireBalls = []; // Огненные шары
let iceSpikes = { lastSpike: 0, activeSpikes: [], secondarySpikes: [] }; // Ледяные шипы (основные и дополнительные)
let homingMissiles = []; // Снаряды с наведением
let bulletRings = { lastCast: 0, cooldown: 3000 }; // Кольцо из пуль
let activeLasers = []; // Активные лазерные лучи
let activeLightning = []; // Активные молнии

// НОВЫЕ ОРУЖИЯ
let magneticMines = [];          // Магнитные мины 🧲
let lightSabers = [];            // Световые клинки ⚔️
let toxicClouds = [];            // Токсичные облака ☁️
let sniperLasers = { lastShot: 0, cooldown: 3000, activeTarget: null }; // Снайперские лазеры 🎯
let veilOfStars = { lastInvulnerability: 0, cooldown: 10000, active: false, endTime: 0 }; // Вуаль звёзд ✨
let electricTraps = [];          // Электрические ловушки ⚡
let vortexTornadoes = [];        // Вихревые торнадо 🌪️
let crystalSpikes = [];          // Кристаллические шипы 💎
let plasmaBalls = [];            // Плазменные шары 🔵
let strategicStrikes = { lastStrike: 0, cooldown: 5000, targetX: 0, targetY: 0 }; // Стратегический удар 🚀

// Флаг для отображения цели стратегического удара
let showStrategicTarget = false;
let strategicTargetX = 0;
let strategicTargetY = 0;

// Система улучшений (добавлены новые улучшения)
const upgradeSystem = {
    damage: { level: 1, cost: 100, value: 10, maxLevel: 20, description: "Урон +3" },
    fireRate: { level: 1, cost: 150, value: 400, maxLevel: 20, description: "Скорострельность +8%" },
    health: { level: 1, cost: 200, value: 100, maxLevel: 20, description: "Здоровье +20" },
    movement: { level: 1, cost: 120, value: 4, maxLevel: 15, description: "Скорость +0.3" },
    shield: { level: 0, cost: 250, value: 0, maxLevel: 10, description: "Щит +15%" },
    split: { level: 0, cost: 400, value: 0, maxLevel: 3, description: "Разделение пуль" },
    ricochet: { level: 0, cost: 350, value: 0, maxLevel: 5, description: "Рикошет +1" },
    piercing: { level: 0, cost: 400, value: 0, maxLevel: 5, description: "Пробивание +1" },
    lifeSteal: { level: 0, cost: 300, value: 0, maxLevel: 10, description: "Кража жизни +1%" },
    criticalChance: { level: 0, cost: 400, value: 5, maxLevel: 10, description: "Шанс крита +5%" },
    criticalMultiplier: { level: 0, cost: 500, value: 2, maxLevel: 5, description: "Множитель крита +0.5" },
    bulletSpeed: { level: 0, cost: 200, value: 7, maxLevel: 10, description: "Скорость пуль +5%" },
    experienceGain: { level: 0, cost: 600, value: 1, maxLevel: 5, description: "Опыт +20%" }
};

// Функция для округления чисел
function roundNumber(num) {
    return Math.round(num);
}

// Функция для форматирования чисел (убираем дробную часть)
function formatNumber(num) {
    return Math.floor(num);
}

// Инициализация игры
function initGame() {
    console.log("Инициализация игры...");
    
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Запрещаем выделение текста на всей странице
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    // Запрещаем контекстное меню (ПКМ) на всей странице
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Обработчик ПКМ на canvas для переключения режима стрельбы
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (gameActive && !gamePaused) {
            toggleShootMode();
        }
    });
    
    // Устанавливаем стили для запрета выделения
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    
    // Устанавливаем размеры canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Обновление рекорда
    document.getElementById('highScoreValue').textContent = highScore;
    
    // Обработчики событий клавиатуры
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Обработчик событий мыши
    canvas.addEventListener('click', handleManualShoot);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Создаем начальные звезды для фона
    createStars();
    
    // Запуск игрового цикла с фиксированным временным шагом
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    
    console.log("Игра инициализирована");
}

// Изменение размера canvas
function resizeCanvas() {
    const gameArea = document.querySelector('.game-area');
    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight - 70; // Учитываем место для controls-info
    
    canvas.width = width;
    canvas.height = Math.max(height, 300);
    
    // Пересчитываем позицию игрока
    if (player.x > canvas.width - player.radius) player.x = canvas.width - player.radius;
    if (player.y > canvas.height - player.radius) player.y = canvas.height - player.radius;
    if (player.x < player.radius) player.x = player.radius;
    if (player.y < player.radius) player.y = player.radius;
}

// Улучшенное создание звезд
function createStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        const speed = Math.random() * 0.8 + 0.1;
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: speed,
            brightness: Math.random() * 0.8 + 0.2,
            type: speed > 0.5 ? 'fast' : 'normal'
        });
    }
    
    // Добавляем несколько ярких звезд
    for (let i = 0; i < 10; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 1.5,
            speed: Math.random() * 0.3 + 0.1,
            brightness: 1,
            type: 'bright'
        });
    }
}

// Запуск спавна врагов во время босса
function startBossEnemySpawn() {
    clearInterval(bossEnemySpawnInterval);
    bossEnemySpawnInterval = setInterval(() => {
        if (!bossActive || gamePaused || enemies.length >= 15) return;
        
        // Создаем небольшое количество врагов во время босса
        createEnemies(1 + Math.floor(wave / 10));
    }, 4000); // Спавн каждые 4 секунды
}

// Создание босса
function createBoss() {
    bossActive = true;
    
    // Характеристики босса
    const bossHealth = 500 + (wave * 100);
    const bossSpeed = 1.2;
    
    // Выбираем случайный тип босса
    const bossType = Math.floor(Math.random() * 3);
    let color, attackPattern, name;
    
    switch(bossType) {
        case 0: // Огненный босс
            color = '#ff3300';
            attackPattern = 'fireRing';
            name = 'Огненный титан';
            break;
        case 1: // Ледяной босс
            color = '#0099ff';
            attackPattern = 'iceSpray';
            name = 'Ледяной колосс';
            break;
        case 2: // Токсичный босс
            color = '#33ff33';
            attackPattern = 'poisonSpread';
            name = 'Токсичный монстр';
            break;
    }
    
    boss = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 40,
        speed: bossSpeed,
        health: roundNumber(bossHealth),
        maxHealth: roundNumber(bossHealth),
        color: color,
        damage: 20 + (wave * 3),
        type: bossType,
        attackPattern: attackPattern,
        name: name,
        lastAttack: 0,
        attackCooldown: 2000,
        moveDirectionX: 1,
        moveDirectionY: 1,
        moveTimerX: 0,
        moveTimerY: 0,
        shield: roundNumber(bossHealth * 0.3),
        maxShield: roundNumber(bossHealth * 0.3),
        shieldActive: true,
        lastShieldRegen: 0,
        shieldRegen: 0.01,
        moveTimer: 0,           // Таймер текущего движения
        moveDuration: 0,        // Продолжительность движения в текущем направлении
        moveDistance: 0,        // Дистанция движения
        targetAngle: 0,         // Угол движения
        startX: canvas.width / 2, // Начальная позиция X
        startY: canvas.height / 2, // Начальная позиция Y
        phase: 1,               // Фаза босса (1, 2, 3)
    };
    
    showNotification('boss', `БОСС: ${name}!`);
    createBossAppearanceEffect(boss.x, boss.y, boss.color);
    
    // Во время босса всегда ручной режим стрельбы
    updateShootModeDisplay();
    
    // Запускаем спавн врагов во время босса
    startBossEnemySpawn();
}

// Создание эффекта появления босса
function createBossAppearanceEffect(x, y, color) {
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        
        particles.push({
            x: px,
            y: py,
            radius: Math.random() * 5 + 2,
            color: color,
            speedX: (x - px) * 0.1,
            speedY: (y - py) * 0.1,
            life: 60
        });
    }
}

// Атаки босса
function bossAttack() {
    const now = Date.now();
    if (now - boss.lastAttack > boss.attackCooldown) {
        boss.lastAttack = now;
        
        // В фазе 2+ боссы могут использовать дополнительные атаки
        if (boss.phase >= 2) {
            const useAdditionalAttack = Math.random() < 0.5; // 50% шанс использовать дополнительную атаку
            
            if (useAdditionalAttack) {
                switch(boss.type) {
                    case 0: // Огненный босс
                        createFireWaveAttack();
                        showNotification('boss', 'Огненная волна!');
                        break;
                    case 1: // Ледяной босс
                        createIceRainAttack();
                        showNotification('boss', 'Ледяной дождь!');
                        break;
                    case 2: // Токсичный босс
                        createPoisonCloudAttack();
                        showNotification('boss', 'Токсичное облако!');
                        break;
                }
                if (soundEnabled) playBossAttackSound();
                return;
            }
        }
        
        // Основные атаки (всегда используются в фазе 1 и как запасные в фазах 2+)
        switch(boss.attackPattern) {
            case 'fireRing':
                createFireRingAttack();
                break;
            case 'iceSpray':
                createIceSprayAttack();
                break;
            case 'poisonSpread':
                createPoisonSpreadAttack();
                break;
        }
        
        if (soundEnabled) playBossAttackSound();
    }
}

// Кольцо огня
function createFireRingAttack() {
    const numProjectiles = 16;
    
    for (let i = 0; i < numProjectiles; i++) {
        const angle = (Math.PI * 2 / numProjectiles) * i;
        
        bossProjectiles.push({
            x: boss.x,
            y: boss.y,
            radius: 8,
            speed: 3,
            damage: 15,
            angle: angle,
            color: '#ff3300',
            type: 'fire',
            life: 300
        });
    }
}

// Ледяной спрей
function createIceSprayAttack() {
    const numProjectiles = 8;
    const spreadAngle = Math.PI / 3;
    
    for (let i = 0; i < numProjectiles; i++) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        const angle = baseAngle + (spreadAngle * (i / (numProjectiles - 1))) - (spreadAngle / 2);
        
        bossProjectiles.push({
            x: boss.x,
            y: boss.y,
            radius: 6,
            speed: 4,
            damage: 12,
            angle: angle,
            color: '#0099ff',
            type: 'ice',
            life: 180
        });
    }
}

// Токсичное распространение
function createPoisonSpreadAttack() {
    const numProjectiles = 5;
    
    for (let i = 0; i < numProjectiles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 2;
        
        bossProjectiles.push({
            x: boss.x,
            y: boss.y,
            radius: 10,
            speed: speed,
            damage: 10,
            angle: angle,
            color: '#33ff33',
            type: 'poison',
            life: 240
        });
    }
}

// Огненная волна (дополнительная атака для Огненного босса, фаза 2+)
function createFireWaveAttack() {
    const numWaves = 3;
    const projectilesPerWave = 12;
    
    for (let wave = 0; wave < numWaves; wave++) {
        setTimeout(() => {
            for (let i = 0; i < projectilesPerWave; i++) {
                const angle = (Math.PI * 2 / projectilesPerWave) * i;
                const speed = 2 + wave * 0.5; // Каждая следующая волна быстрее
                
                bossProjectiles.push({
                    x: boss.x,
                    y: boss.y,
                    radius: 6,
                    speed: speed,
                    damage: 8 + wave * 2,
                    angle: angle,
                    color: '#ff6600',
                    type: 'fireWave',
                    life: 300
                });
            }
        }, wave * 200); // Волны с задержкой 200мс
    }
}

// Ледяной дождь (дополнительная атака для Ледяного босса, фаза 2+)
function createIceRainAttack() {
    const numShards = 20;
    
    for (let i = 0; i < numShards; i++) {
        setTimeout(() => {
            const x = boss.x + (Math.random() - 0.5) * 200;
            const y = boss.y - 100 - Math.random() * 100;
            
            bossProjectiles.push({
                x: x,
                y: y,
                radius: 4,
                speed: 3 + Math.random() * 2,
                damage: 6,
                angle: Math.PI / 2 + (Math.random() - 0.5) * 0.3, // Падают вниз с небольшим разбросом
                color: '#66ccff',
                type: 'iceShard',
                life: 400
            });
        }, i * 50); // Снаряды появляются с задержкой 50мс
    }
}

// Токсичное облако (дополнительная атака для Токсичного босса, фаза 2+)
function createPoisonCloudAttack() {
    const numClouds = 5;
    
    for (let i = 0; i < numClouds; i++) {
        const angle = (Math.PI * 2 / numClouds) * i;
        const distance = 100;
        const targetX = boss.x + Math.cos(angle) * distance;
        const targetY = boss.y + Math.sin(angle) * distance;
        
        bossProjectiles.push({
            x: targetX,
            y: targetY,
            radius: 15,
            speed: 0.5, // Медленное движение
            damage: 3,
            angle: Math.random() * Math.PI * 2,
            color: '#66ff66',
            type: 'poisonCloud',
            life: 600, // Долго существует
            expanding: true,
            maxRadius: 25
        });
    }
}

// Обновление босса
function updateBoss(deltaTime) {
    if (!bossActive || !boss) return;
    
    const bossSpeed = boss.speed * (deltaTime / 16.67);
    const margin = boss.radius + 20;
    
    // === НОВЫЙ КОД ДВИЖЕНИЯ ===
    
    if (boss.phase === 3) {
        // Фаза 3 (последняя) - преследование игрока
        const angleToPlayer = Math.atan2(player.y - boss.y, player.x - boss.x);
        const newX = boss.x + Math.cos(angleToPlayer) * bossSpeed * 1.3;
        const newY = boss.y + Math.sin(angleToPlayer) * bossSpeed * 1.3;
        
        // Проверяем границы
        if (newX >= margin && newX <= canvas.width - margin) {
            boss.x = newX;
        }
        if (newY >= margin && newY <= canvas.height - margin) {
            boss.y = newY;
        }
    } else {
        // Фаза 1 и 2 - случайное движение
        
        // Проверяем, нужно ли выбрать новую цель
        boss.moveTimer += deltaTime;
        
        if (boss.moveTimer > boss.moveDuration || 
            boss.x <= margin || boss.x >= canvas.width - margin ||
            boss.y <= margin || boss.y >= canvas.height - margin) {
            
            // Выбираем новое случайное направление и дистанцию
            boss.targetAngle = Math.random() * Math.PI * 2;
            boss.moveDuration = 1500 + Math.random() * 1500; // 1.5-3 секунды
            boss.moveDistance = 50 + Math.random() * 150; // 50-200 пикселей
            boss.startX = boss.x;
            boss.startY = boss.y;
            boss.moveTimer = 0;
        }
        
        // Двигаемся к случайной точке
        const progress = Math.min(1, boss.moveTimer / boss.moveDuration);
        const currentDistance = boss.moveDistance * progress;
        
        boss.x = boss.startX + Math.cos(boss.targetAngle) * currentDistance;
        boss.y = boss.startY + Math.sin(boss.targetAngle) * currentDistance;
    }
    
    // Ограничиваем движение в пределах игрового поля
    if (boss.x < margin) {
        boss.x = margin;
        // При столкновении с границей меняем направление
        if (boss.phase < 3) {
            boss.moveTimer = boss.moveDuration; // Завершаем текущее движение
        }
    }
    if (boss.x > canvas.width - margin) {
        boss.x = canvas.width - margin;
        if (boss.phase < 3) {
            boss.moveTimer = boss.moveDuration;
        }
    }
    if (boss.y < margin) {
        boss.y = margin;
        if (boss.phase < 3) {
            boss.moveTimer = boss.moveDuration;
        }
    }
    if (boss.y > canvas.height - margin) {
        boss.y = canvas.height - margin;
        if (boss.phase < 3) {
            boss.moveTimer = boss.moveDuration;
        }
    }
    
    // === КОНЕЦ НОВОГО КОДА ДВИЖЕНИЯ ===
    
    const now = Date.now();
    if (now - boss.lastShieldRegen > 2000 && boss.shield < boss.maxShield) {
        boss.shield += boss.maxShield * boss.shieldRegen;
        if (boss.shield > boss.maxShield) boss.shield = boss.maxShield;
        boss.lastShieldRegen = now;
    }
    
    bossAttack();
    updateBossProjectiles(deltaTime);
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const dx = bullet.x - boss.x;
        const dy = bullet.y - boss.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = bullet.radius + boss.radius;
        
        if (distanceSquared < radiusSum * radiusSum) {
            if (boss.shieldActive && boss.shield > 0) {
                boss.shield -= bullet.damage;
                createParticles(bullet.x, bullet.y, 8, '#4fc3f7', 'shield');
                
                if (boss.shield <= 0) {
                    boss.shield = 0;
                    boss.shieldActive = false;
                    showNotification('boss', 'Щит босса разрушен!');
                    createParticles(boss.x, boss.y, 25, '#4fc3f7', 'shield');
                    
                    // Добавляем тряску при разрушении щита босса
                    startScreenShake(6, 12);
                }
            } else {
                boss.health -= bullet.damage;
                createParticles(bullet.x, bullet.y, 5, boss.color, 'hit');
                
                if (boss.health < boss.maxHealth * 0.5 && boss.phase === 1) {
                    boss.phase = 2;
                    boss.attackCooldown = 1500;
                    boss.speed *= 1.5;
                    showNotification('boss', 'Босс в ярости!');
                }
                
                if (boss.health < boss.maxHealth * 0.25 && boss.phase === 2) {
                    boss.phase = 3;
                    boss.attackCooldown = 1000;
                    // Начинаем преследовать игрока
                    showNotification('boss', 'БОСС В БЕШЕНСТВЕ! ПРЕСЛЕДУЕТ ИГРОКА!');
                }
                
                if (boss.health <= 0) {
                    defeatBoss();
                    return;
                }
            }
            
            bullets.splice(i, 1);
        }
    }
    
    const dxToPlayer = player.x - boss.x;
    const dyToPlayer = player.y - boss.y;
    const distanceToPlayerSquared = dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer;
    const playerRadiusSum = player.radius + boss.radius;
    
    if (distanceToPlayerSquared < playerRadiusSum * playerRadiusSum) {
        // Если игрок неуязвим, игнорируем столкновение
        if (invulnerable) {
            return;
        }
        
        if (shieldActive && player.shield > 0) {
            player.shield -= boss.damage * 2;
            if (player.shield < 0) player.shield = 0;
            
            const pushAngle = Math.atan2(dyToPlayer, dxToPlayer);
            player.x += Math.cos(pushAngle) * 25;
            player.y += Math.sin(pushAngle) * 25;
            
            createParticles(player.x, player.y, 10, '#4fc3f7', 'shield');
        } else {
            // Проверяем неуязвимость от Вуали звёзд
            if (!veilOfStars.active) {
                player.health -= applyVeilDamageReduction(boss.damage);
            }
            activateDamageEffect(); // Красный эффект по краям
            
            const pushAngle = Math.atan2(dyToPlayer, dxToPlayer);
            player.x += Math.cos(pushAngle) * 30;
            player.y += Math.sin(pushAngle) * 30;
            
            createParticles(player.x, player.y, 12, '#ff0000', 'hit');
            
            // Добавляем тряску экрана при уроне от босса
            startScreenShake(8, 15);
            
            // Добавляем красную рамку при уроне
            startDamageBorderEffect();
            
            // Применяем эффекты босса в зависимости от типа
            applyBossEffect(boss.type);
            
            if (player.health <= 0) {
                player.health = 0;
                lives--;
                updateLives();
                
                if (lives <= 0) {
                    gameOver();
                } else {
                    player.health = player.maxHealth;
                    player.x = canvas.width / 2;
                    player.y = canvas.height / 2;
                    
                    // Активируем неуязвимость после потери жизни
                    activateInvulnerability();
                }
            }
        }
    }
}

// Обновление снарядов босса
function updateBossProjectiles(deltaTime) {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const projectile = bossProjectiles[i];
        const projSpeed = projectile.speed * (deltaTime / 16.67);
        
        // Особое поведение для токсичных облаков
        if (projectile.type === 'poisonCloud' && projectile.expanding) {
            // Облака расширяются со временем
            if (projectile.radius < projectile.maxRadius) {
                projectile.radius += 0.1;
            }
            // Облака движутся медленнее и могут менять направление
            projectile.angle += (Math.random() - 0.5) * 0.1;
        }
        
        projectile.x += Math.cos(projectile.angle) * projSpeed;
        projectile.y += Math.sin(projectile.angle) * projSpeed;
        
        projectile.life--;
        
        const dx = player.x - projectile.x;
        const dy = player.y - projectile.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = player.radius + projectile.radius;
        
        if (distanceSquared < radiusSum * radiusSum) {
            // Если игрок неуязвим, игнорируем попадание
            if (invulnerable) {
                bossProjectiles.splice(i, 1);
                continue;
            }
            
            if (shieldActive && player.shield > 0) {
                player.shield -= projectile.damage;
                if (player.shield < 0) player.shield = 0;
                createParticles(projectile.x, projectile.y, 6, '#4fc3f7', 'shield');
            } else {
                // Проверяем неуязвимость от Вуали звёзд
                if (!veilOfStars.active) {
                    player.health -= applyVeilDamageReduction(projectile.damage);
                }
                startDamageBorderEffect(); // Красный эффект по краям
                createParticles(projectile.x, projectile.y, 8, projectile.color, 'hit');
                
                // Применяем эффекты босса при попадании снаряда
                if (bossActive && boss) {
                    applyBossEffect(boss.type);
                }
                
                if (player.health <= 0) {
                    player.health = 0;
                    lives--;
                    updateLives();
                    
                    if (lives <= 0) {
                        gameOver();
                    } else {
                        player.health = player.maxHealth;
                        player.x = canvas.width / 2;
                        player.y = canvas.height / 2;
                        
                        // Активируем неуязвимость после потери жизни
                        activateInvulnerability();
                    }
                }
            }
            
            // Токсичные облака не исчезают после попадания
            if (projectile.type !== 'poisonCloud') {
                bossProjectiles.splice(i, 1);
                continue;
            }
        }
        
        if (projectile.life <= 0 ||
            projectile.x < -100 || projectile.x > canvas.width + 100 ||
            projectile.y < -100 || projectile.y > canvas.height + 100) {
            bossProjectiles.splice(i, 1);
        }
    }
}

// Победа над боссом
function defeatBoss() {
    // Очки для рекорда
    const bossRecordPoints = 1000 + (wave * 200);
    score += bossRecordPoints;
    
    // Валюта для улучшений (уменьшена в 5 раз)
    const bossMoneyReward = 200 + (wave * 40);
    money += bossMoneyReward;
    
    updateMoney();
    updateScore();
    
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * boss.radius;
        const px = boss.x + Math.cos(angle) * distance;
        const py = boss.y + Math.sin(angle) * distance;
        
        particles.push({
            x: px,
            y: py,
            radius: Math.random() * 6 + 3,
            color: boss.color,
            speedX: Math.cos(angle) * (Math.random() * 8 + 4),
            speedY: Math.sin(angle) * (Math.random() * 8 + 4),
            life: 90
        });
    }
    
    const healAmount = Math.min(50, player.maxHealth - player.health);
    if (healAmount > 0) {
        player.health += healAmount;
        showNotification('health', `Босс повержен! +${healAmount} HP`);
    }
    
    if (wave % 20 === 0) {
        lives++;
        updateLives();
        showNotification('life', 'Бонусная жизнь!');
    }
    
    showNotification('boss', `БОСС ПОВЕРЖЕН! +${bossRecordPoints} очков`);
    
    // Останавливаем спавн врагов во время босса
    clearInterval(bossEnemySpawnInterval);
    
    bossActive = false;
    boss = null;
    bossProjectiles = [];
    
    // Восстанавливаем таймер волны
    waveMaxTimer = 12 + Math.floor(wave / 3);
    waveTimer = waveMaxTimer;
    updateWaveDisplay();
    
    // Обновляем отображение режима стрельбы после босса
    updateShootModeDisplay();
    
    if (soundEnabled) playBossDefeatSound();
}

// Обработка нажатия клавиш
function handleKeyDown(e) {
    if (!gameActive) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            player.isMoving.up = true;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            player.isMoving.down = true;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            player.isMoving.left = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            player.isMoving.right = true;
            break;
        case ' ':
            if (gameActive) togglePause();
            break;
        case 'q':
        case 'Q':
            skipWaveTimer();
            break;
        case 'Shift':
            activateShield();
            break;
        case 'Escape':
            if (isFullscreen) toggleFullscreen();
            break;
    }
}

// Обработка отпускания клавиш
function handleKeyUp(e) {
    if (!gameActive) return;
    
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            player.isMoving.up = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            player.isMoving.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            player.isMoving.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            player.isMoving.right = false;
            break;
        case 'Shift':
            deactivateShield();
            break;
    }
}

// Активация щита
function activateShield() {
    if (!gameActive || gamePaused || shieldCooldown || player.shield <= 0) return;
    
    shieldActive = true;
    player.shieldActiveTime = Date.now();
    
    createParticles(player.x, player.y, 15, '#4fc3f7', 'shield');
    
    if (soundEnabled) playShieldSound();
}

// Деактивация щита
function deactivateShield() {
    shieldActive = false;
}

// Обработка движения мыши
function handleMouseMove(e) {
    if (!gameActive || gamePaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    player.mouseX = mouseX;
    player.mouseY = mouseY;
    
    // Обновляем цель для стратегического удара только если не активен прицел
    if (!showStrategicTarget) {
        strategicTargetX = mouseX;
        strategicTargetY = mouseY;
    }
}

// Переключение режима стрельбы
function toggleShootMode() {
    manualShootMode = !manualShootMode;
    updateShootModeDisplay();
}

// Обновление отображения режима стрельбы
function updateShootModeDisplay() {
    const shootModeElement = document.getElementById('shootModeDisplay');
    if (shootModeElement) {
        if (bossActive) {
            shootModeElement.innerHTML = '<i class="fas fa-crosshairs"></i><span>Ручной (Босс)</span>';
        } else if (manualShootMode) {
            shootModeElement.innerHTML = '<i class="fas fa-crosshairs"></i><span>Ручной режим</span>';
        } else {
            shootModeElement.innerHTML = '<i class="fas fa-mouse-pointer"></i><span>Автострельба</span>';
        }
    }
}

// Ручной выстрел
function handleManualShoot(e) {
    if (!gameActive || gamePaused) return;
    
    // В ручном режиме или во время босса стреляем по клику
    const currentShootMode = bossActive ? true : manualShootMode;
    if (!currentShootMode) return; // В автоматическом режиме не стреляем по клику
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    shoot(angle);
}

// Автоматическая стрельба
function autoShoot() {
    if (!gameActive || gamePaused || enemies.length === 0) return;
    
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    for (const enemy of enemies) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = dx * dx + dy * dy;
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
        }
    }
    
    if (closestEnemy) {
        const angle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
        shoot(angle);
    }
}

// Функция стрельбы
function shoot(angle) {
    const now = Date.now();
    if (now - player.lastShot > player.fireRate) {
        // Проверка на критический удар
        let isCritical = Math.random() * 100 < player.criticalChance;
        let bulletDamage = player.damage;
        let bulletColor = '#ffcc00';
        
        if (isCritical) {
            bulletDamage = roundNumber(player.damage * player.criticalMultiplier);
            bulletColor = '#ff0000';
        }
        
        // Создаем специальные частицы для критического выстрела
        if (isCritical) {
            createParticles(player.x, player.y, 5, '#ff0000', 'critical');
        }
        
        bullets.push({
            x: player.x,
            y: player.y,
            radius: 4,
            speed: player.bulletSpeed,
            damage: bulletDamage,
            angle: angle,
            color: bulletColor,
            splitLevel: player.splitLevel,
            ricochetCount: player.ricochetLevel,
            piercingCount: player.piercingLevel,
            enemiesHit: [],
            isCritical: isCritical
        });
        
        if (player.splitLevel > 0) {
            const numExtraBullets = Math.min(2, player.splitLevel);
            
            for (let i = 1; i <= numExtraBullets; i++) {
                const splitAngle1 = angle + (i * 0.15);
                const splitAngle2 = angle - (i * 0.15);
                
                bullets.push({
                    x: player.x,
                    y: player.y,
                    radius: 3,
                    speed: player.bulletSpeed * 0.9,
                    damage: roundNumber(player.damage * 0.5),
                    angle: splitAngle1,
                    color: '#ff9900',
                    splitLevel: 0,
                    ricochetCount: Math.max(0, player.ricochetLevel - 1),
                    piercingCount: Math.max(0, player.piercingLevel - 1),
                    enemiesHit: []
                });
                
                bullets.push({
                    x: player.x,
                    y: player.y,
                    radius: 3,
                    speed: player.bulletSpeed * 0.9,
                    damage: roundNumber(player.damage * 0.5),
                    angle: splitAngle2,
                    color: '#ff9900',
                    splitLevel: 0,
                    ricochetCount: Math.max(0, player.ricochetLevel - 1),
                    piercingCount: Math.max(0, player.piercingLevel - 1),
                    enemiesHit: []
                });
            }
        }
        
        player.lastShot = now;
        createParticles(player.x, player.y, 2, '#ffcc00', 'hit');
        
        if (soundEnabled) playShootSound();
    }
}

// Создание врага-стрелка
function createShooterEnemy(x, y) {
    // Базовое HP обычного врага (100%)
    const baseEnemyHealth = 20 + (wave * 3) + (level * 2);
    // Стрелок - 75% HP от обычного
    const enemyHealth = roundNumber(baseEnemyHealth * 0.75);
    
    return {
        x: x,
        y: y,
        radius: 12,
        speed: 0.5,
        health: enemyHealth,
        maxHealth: enemyHealth,
        color: '#ff00ff',
        damage: 5,
        type: 'shooter',
        lastShot: 0,
        fireRate: 2000,
        bulletSpeed: 4,
        bulletDamage: 8 + (wave * 1)
    };
}

// Стрельба врагов
function enemyShoot(enemy) {
    const now = Date.now();
    if (now - enemy.lastShot > enemy.fireRate) {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        
        enemyBullets.push({
            x: enemy.x,
            y: enemy.y,
            radius: 5,
            speed: enemy.bulletSpeed,
            damage: enemy.bulletDamage,
            angle: angle,
            color: '#ff00ff'
        });
        
        enemy.lastShot = now;
        createParticles(enemy.x, enemy.y, 3, '#ff00ff', 'hit');
        
        if (soundEnabled) playEnemyShootSound();
    }
}

// Создание ядра здоровья
function createHealthCore(x, y) {
    healthCores.push({
        x: x,
        y: y,
        radius: 8,
        life: 300, // Время жизни ядра (5 секунд при 60 FPS)
        pulse: 0
    });
}

// Улучшенная система частиц для эффектов
function createParticles(x, y, count, color, type = 'explosion') {
    // Удаляем старые частицы, если их слишком много
    const maxParticlesDuringBoss = bossActive ? MAX_PARTICLES * 0.5 : MAX_PARTICLES;
    if (particles.length > maxParticlesDuringBoss * 0.8) {
        particles = particles.filter(p => p.life > 10);
    }
    
    const particlesToCreate = Math.min(count, maxParticlesDuringBoss - particles.length);
    
    for (let i = 0; i < particlesToCreate; i++) {
        let particle = {
            x: x,
            y: y,
            radius: Math.random() * 3 + 0.5,
            color: color,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            type: type
        };
        
        // Разные типы частиц с разными характеристиками
        switch(type) {
            case 'explosion':
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1; // Уменьшили максимальную скорость с 8 до 5
                particle.speedX = Math.cos(angle) * speed;
                particle.speedY = Math.sin(angle) * speed;
                particle.radius = Math.random() * 4 + 1;
                particle.life = 25 + Math.random() * 15;
                particle.gravity = 0.1;
                particle.fadeRate = 0.02;
                break;
                
            case 'hit':
                const hitAngle = Math.random() * Math.PI * 2;
                const hitSpeed = Math.random() * 3 + 1;
                particle.speedX = Math.cos(hitAngle) * hitSpeed;
                particle.speedY = Math.sin(hitAngle) * hitSpeed;
                particle.radius = Math.random() * 2 + 0.5;
                particle.life = 15 + Math.random() * 10;
                particle.fadeRate = 0.03;
                break;
                
            case 'critical':
                const critAngle = Math.random() * Math.PI * 2;
                const critSpeed = Math.random() * 8 + 3; // Уменьшили максимальную скорость с 11 до 11
                particle.speedX = Math.cos(critAngle) * critSpeed;
                particle.speedY = Math.sin(critAngle) * critSpeed;
                particle.radius = Math.random() * 5 + 2;
                particle.life = 35 + Math.random() * 15;
                particle.color = ['#ff0000', '#ff6600', '#ffff00'][Math.floor(Math.random() * 3)];
                particle.gravity = 0.05;
                particle.fadeRate = 0.015;
                particle.trail = [];
                break;
                
            case 'shield':
                const shieldAngle = Math.random() * Math.PI * 2;
                const shieldSpeed = Math.random() * 2 + 0.5;
                particle.speedX = Math.cos(shieldAngle) * shieldSpeed;
                particle.speedY = Math.sin(shieldAngle) * shieldSpeed;
                particle.radius = Math.random() * 2 + 1;
                particle.life = 20 + Math.random() * 10;
                particle.color = '#4fc3f7';
                particle.fadeRate = 0.025;
                break;
                
            case 'levelup':
                const levelAngle = (Math.PI * 2 / particlesToCreate) * i;
                const levelSpeed = 3;
                particle.speedX = Math.cos(levelAngle) * levelSpeed;
                particle.speedY = Math.sin(levelAngle) * levelSpeed;
                particle.radius = Math.random() * 3 + 1;
                particle.life = 40 + Math.random() * 20;
                particle.color = ['#ffcc00', '#ff9900', '#ffff00'][Math.floor(Math.random() * 3)];
                particle.gravity = -0.05;
                particle.fadeRate = 0.01;
                break;
                
            case 'heal':
                const healAngle = Math.random() * Math.PI * 2;
                const healSpeed = Math.random() * 1.5 + 0.5;
                particle.speedX = Math.cos(healAngle) * healSpeed;
                particle.speedY = Math.sin(healAngle) * healSpeed - 1;
                particle.radius = Math.random() * 2 + 1;
                particle.life = 30 + Math.random() * 15;
                particle.color = '#00ff00';
                particle.gravity = -0.02;
                particle.fadeRate = 0.02;
                break;
                
            default:
                particle.speedX = Math.random() * 4 - 2;
                particle.speedY = Math.random() * 4 - 2;
                particle.life = 20;
                particle.fadeRate = 0.02;
        }
        
        particles.push(particle);
    }
}

// Создание врагов
function createEnemies(count) {
    for (let i = 0; i < count; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0:
                x = Math.random() * canvas.width;
                y = -20;
                break;
            case 1:
                x = canvas.width + 20;
                y = Math.random() * canvas.height;
                break;
            case 2:
                x = Math.random() * canvas.width;
                y = canvas.height + 20;
                break;
            case 3:
                x = -20;
                y = Math.random() * canvas.height;
                break;
        }
        
        // Базовое HP обычного врага (100%)
        const baseEnemyHealth = 20 + (wave * 3) + (level * 2);
        const enemyType = Math.random();
        
        if (enemyType < 0.6) {
            // Обычный враг (60%) - 100% HP
            const speed = 0.8 + wave * 0.06 + level * 0.03;
            const radius = 10 + wave * 0.04;
            const damage = 4 + wave * 0.4;
            const enemyHealth = roundNumber(baseEnemyHealth);
            
            enemies.push({
                x: x,
                y: y,
                radius: roundNumber(radius),
                speed: speed,
                health: enemyHealth,
                maxHealth: enemyHealth,
                color: `hsl(${Math.random() * 60 + 300}, 70%, 50%)`,
                damage: roundNumber(damage),
                type: 'normal'
            });
        } else if (enemyType < 0.85) {
            // Быстрый враг (25%) - 50% HP от обычного
            const speed = 1.5 + wave * 0.1 + level * 0.06;
            const radius = 7 + wave * 0.025;
            const damage = 2 + wave * 0.25;
            const enemyHealth = roundNumber(baseEnemyHealth * 0.5);
            
            enemies.push({
                x: x,
                y: y,
                radius: roundNumber(radius),
                speed: speed,
                health: enemyHealth,
                maxHealth: enemyHealth,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 50%)`,
                damage: roundNumber(damage),
                type: 'fast'
            });
        } else if (enemyType < 0.95) {
            // Танк (10%) - 200% HP от обычного
            const speed = 0.4 + wave * 0.02 + level * 0.015;
            const radius = 18 + wave * 0.06;
            const damage = 8 + wave * 0.6;
            const enemyHealth = roundNumber(baseEnemyHealth * 3);
            
            enemies.push({
                x: x,
                y: y,
                radius: roundNumber(radius),
                speed: speed,
                health: enemyHealth,
                maxHealth: enemyHealth,
                color: `hsl(${Math.random() * 60 + 0}, 70%, 50%)`,
                damage: roundNumber(damage),
                type: 'tank'
            });
        } else {
            // Стрелок (5%)
            enemies.push(createShooterEnemy(x, y));
        }
    }
}

// Вспомогательная функция для обработки смерти врага
function handleEnemyDeath(enemy, index) {
    // Очки для рекорда
    let recordPoints = 10 + wave * 1.5;
    if (enemy.type === 'fast') recordPoints *= 1.3;
    if (enemy.type === 'tank') recordPoints *= 1.8;
    if (enemy.type === 'shooter') recordPoints *= 2;
    score += roundNumber(recordPoints);
    
    // Валюта для улучшений
    let moneyReward = 2 + wave * 0.3;
    if (enemy.type === 'fast') moneyReward *= 1.2;
    if (enemy.type === 'tank') moneyReward *= 1.5;
    if (enemy.type === 'shooter') moneyReward *= 1.8;
    money += roundNumber(moneyReward);
    
    updateMoney();
    updateScore();
    
    // Получение опыта
    const expGain = 10 * (1 + upgradeSystem.experienceGain.level * 0.2);
    player.experience += expGain;
    updateExperienceBar();
    checkLevelUp();
    
    createParticles(enemy.x, enemy.y, 10, '#ff9900');
    
    // Шанс выпадения ядра здоровья (30%)
    if (Math.random() < 0.3) {
        createHealthCore(enemy.x, enemy.y);
    }
    
    enemies.splice(index, 1);
    
    if (soundEnabled) playEnemyDestroySound();
}

// Обновление состояния игры
function updateGame(deltaTime) {
    if (!gameActive || gamePaused || weaponSelectionPaused) return;
    
    gameTime++;
    
    // Проверяем окончание неуязвимости
    if (invulnerable && Date.now() > invulnerableEndTime) {
        invulnerable = false;
    }
    
    // Проверяем, нужно ли обновить отображение
    if (!bossActive && enemies.length === 0) {
        updateWaveDisplay();
    }
    
    // Обновление эффектов боссов
    updateBossEffects();
    
    // Обновление дополнительного оружия
    updateWeapons(deltaTime);
    
    // Движение игрока
    const moveSpeed = player.speed * (deltaTime / 16.67);
    if (player.isMoving.up && player.y > player.radius) player.y -= moveSpeed;
    if (player.isMoving.down && player.y < canvas.height - player.radius) player.y += moveSpeed;
    if (player.isMoving.left && player.x > player.radius) player.x -= moveSpeed;
    if (player.isMoving.right && player.x < canvas.width - player.radius) player.x += moveSpeed;
    
    // Стрельба (автоматическая или ручная)
    // Во время босса всегда ручной режим
    const currentShootMode = bossActive ? true : manualShootMode;
    if (!currentShootMode) {
        autoShoot();
    }
    
    // Обновление щита
    updateShield(deltaTime);
    
    // Обновление босса
    if (bossActive) {
        updateBoss(deltaTime);
    }
    
    // Очистка старых пуль, если их слишком много (оптимизация памяти)
    if (bullets.length > MAX_BULLETS) {
        bullets = bullets.slice(-MAX_BULLETS);
    }
    
    // Обновление пуль игрока
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const bulletSpeed = bullet.speed * (deltaTime / 16.67);
        bullet.x += Math.cos(bullet.angle) * bulletSpeed;
        bullet.y += Math.sin(bullet.angle) * bulletSpeed;
        
        if (bullet.x < -bullet.radius || bullet.x > canvas.width + bullet.radius ||
            bullet.y < -bullet.radius || bullet.y > canvas.height + bullet.radius) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Проверка столкновения с врагами (работает всегда, даже во время босса)
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            
            if (bullet.enemiesHit.includes(j)) continue;
            
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = bullet.radius + enemy.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                enemy.health -= bullet.damage;
                bullet.enemiesHit.push(j);
                
                createParticles(bullet.x, bullet.y, 3, '#ff3300', 'hit');
                
                // Кража жизни
                if (player.lifeSteal > 0 && enemy.health <= 0) {
                    const healAmount = roundNumber(bullet.damage * (player.lifeSteal / 100));
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                }
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                } else {
                    if (soundEnabled) playHitSound();
                    
                    if (bullet.ricochetCount > 0) {
                        bullet.ricochetCount--;
                        
                        const normalAngle = Math.atan2(bullet.y - enemy.y, bullet.x - enemy.x);
                        const incidenceAngle = bullet.angle;
                        bullet.angle = 2 * normalAngle - incidenceAngle + Math.PI;
                        
                        bullet.x += Math.cos(bullet.angle) * 4;
                        bullet.y += Math.sin(bullet.angle) * 4;
                        
                        continue;
                    }
                }
                
                if (bullet.piercingCount <= 0 || bullet.enemiesHit.length >= bullet.piercingCount + 1) {
                    bullets.splice(i, 1);
                }
                
                break;
            }
        }
    }
    
    // Обновление врагов
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        // Движение врага
        const enemySpeed = enemy.speed * (deltaTime / 16.67);
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemySpeed;
        enemy.y += Math.sin(angle) * enemySpeed;
        
        // Стрельба врага-стрелка
        if (enemy.type === 'shooter') {
            enemyShoot(enemy);
        }
        
        // Проверка столкновения
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = player.radius + enemy.radius;
        
        if (distanceSquared < radiusSum * radiusSum) {
            // Если игрок неуязвим, игнорируем столкновение
            if (invulnerable) {
                continue;
            }
            
            if (shieldActive && player.shield > 0) {
                player.shield -= enemy.damage * 2;
                if (player.shield < 0) player.shield = 0;
                
                const pushAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                enemy.x += Math.cos(pushAngle) * 20;
                enemy.y += Math.sin(pushAngle) * 20;
                
                createParticles(player.x, player.y, 7, '#4fc3f7', 'shield');
                
                if (soundEnabled) playShieldBlockSound();
            } else {
                // Проверяем неуязвимость от Вуали звёзд
                if (!veilOfStars.active) {
                    player.health -= applyVeilDamageReduction(enemy.damage);
                }
                startDamageBorderEffect(); // Красный эффект по краям
                
                const pushAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                player.x += Math.cos(pushAngle) * 15;
                player.y += Math.sin(pushAngle) * 15;
                
                createParticles(player.x, player.y, 7, '#ff0000', 'hit');
                
                // Добавляем тряску экрана при уроне от врага
                startScreenShake(4, 10);
                
                if (player.health <= 0) {
                    player.health = 0;
                    lives--;
                    updateLives();
                    
                    if (lives <= 0) {
                        gameOver();
                    } else {
                        player.health = player.maxHealth;
                        player.x = canvas.width / 2;
                        player.y = canvas.height / 2;
                        
                        // Активируем неуязвимость после потери жизни
                        activateInvulnerability();
                    }
                }
                
                if (soundEnabled) playCollisionSound();
            }
        }
    }
    
    // Очистка старых пуль врагов, если их слишком много (оптимизация памяти)
    if (enemyBullets.length > MAX_ENEMY_BULLETS) {
        enemyBullets = enemyBullets.slice(-MAX_ENEMY_BULLETS);
    }
    
    // Обновление пуль врагов
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        const bulletSpeed = bullet.speed * (deltaTime / 16.67);
        bullet.x += Math.cos(bullet.angle) * bulletSpeed;
        bullet.y += Math.sin(bullet.angle) * bulletSpeed;
        
        if (bullet.x < -bullet.radius || bullet.x > canvas.width + bullet.radius ||
            bullet.y < -bullet.radius || bullet.y > canvas.height + bullet.radius) {
            enemyBullets.splice(i, 1);
            continue;
        }
        
        const dx = player.x - bullet.x;
        const dy = player.y - bullet.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = player.radius + bullet.radius;
        
        if (distanceSquared < radiusSum * radiusSum) {
            // Пропускаем отраженные снаряды при попадании в игрока
            if (bullet.isReflected) {
                enemyBullets.splice(i, 1);
                continue;
            }
            
            // Если игрок неуязвим, игнорируем попадание
            if (invulnerable) {
                enemyBullets.splice(i, 1);
                continue;
            }
            
            if (shieldActive && player.shield > 0) {
                player.shield -= bullet.damage;
                if (player.shield < 0) player.shield = 0;
                
                createParticles(bullet.x, bullet.y, 5, '#4fc3f7', 'shield');
            } else {
                // Проверяем неуязвимость от Вуали звёзд
                if (!veilOfStars.active) {
                    player.health -= applyVeilDamageReduction(bullet.damage);
                }
                startDamageBorderEffect(); // Красный эффект по краям
                createParticles(bullet.x, bullet.y, 8, bullet.color, 'hit');
                
                // Добавляем тряску экрана при уроне от пули врага
                startScreenShake(3, 8);
                
                if (player.health <= 0) {
                    player.health = 0;
                    lives--;
                    updateLives();
                    
                    if (lives <= 0) {
                        gameOver();
                    } else {
                        player.health = player.maxHealth;
                        player.x = canvas.width / 2;
                        player.y = canvas.height / 2;
                        
                        // Активируем неуязвимость после потери жизни
                        activateInvulnerability();
                    }
                }
            }
            
            enemyBullets.splice(i, 1);
        }
        
        // Проверка столкновения отраженных снарядов с врагами
        if (bullet.isReflected) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distanceSquared = dx * dx + dy * dy;
                const radiusSum = bullet.radius + enemy.radius;
                
                if (distanceSquared < radiusSum * radiusSum) {
                    enemy.health -= bullet.damage;
                    createParticles(enemy.x, enemy.y, 5, '#ffff00', 'reflect');
                    
                    if (enemy.health <= 0) {
                        handleEnemyDeath(enemy, j);
                    }
                    
                    enemyBullets.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    // Обновление частиц (с оптимизацией)
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const particleSpeedX = particle.speedX * (deltaTime / 16.67);
        const particleSpeedY = particle.speedY * (deltaTime / 16.67);
        particle.x += particleSpeedX;
        particle.y += particleSpeedY;
        
        // Применение гравитации
        if (particle.gravity) {
            particle.speedY += particle.gravity * (deltaTime / 16.67);
        }
        
        // Замедление
        particle.speedX *= 0.995; // Уменьшили замедление для более плавного движения
        particle.speedY *= 0.995;
        
        // Обновление следа для критических частиц
        if (particle.trail) {
            particle.trail.push({x: particle.x, y: particle.y});
            if (particle.trail.length > 5) {
                particle.trail.shift();
            }
        }
        
        particle.life--;
        
        // Удаляем мертвые частицы или частицы за пределами экрана
        if (particle.life <= 0 || 
            particle.x < -100 || particle.x > canvas.width + 100 ||
            particle.y < -100 || particle.y > canvas.height + 100) {
            particles.splice(i, 1);
        }
    }
    
    // Дополнительная очистка, если частиц слишком много
    if (particles.length > MAX_PARTICLES) {
        particles = particles.slice(-MAX_PARTICLES);
    }
    
    // Принудительная очистка частиц за пределами экрана (каждые 60 кадров ~ 1 секунда)
    if (gameTime % 60 === 0) {
        particles = particles.filter(p => 
            p.x >= -200 && p.x <= canvas.width + 200 &&
            p.y >= -200 && p.y <= canvas.height + 200 &&
            p.life > 0
        );
    }
    
    // Обновление уведомлений
    for (let i = notifications.length - 1; i >= 0; i--) {
        const notification = notifications[i];
        notification.life--;
        
        if (notification.life <= 0) {
            notifications.splice(i, 1);
            updateNotificationsDisplay();
        }
    }
    
    // Обновление ядер здоровья
    for (let i = healthCores.length - 1; i >= 0; i--) {
        const core = healthCores[i];
        core.life--;
        core.pulse += 0.1;
        
        // Проверка столкновения с игроком
        const dx = player.x - core.x;
        const dy = player.y - core.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = player.radius + core.radius;
        
        if (distanceSquared < radiusSum * radiusSum) {
            if (player.health < player.maxHealth) {
                const healAmount = Math.min(10 + wave * 2, player.maxHealth - player.health);
                player.health += roundNumber(healAmount);
                
                showNotification('health', `+${roundNumber(healAmount)} HP`);
                createParticles(core.x, core.y, 10, '#00ff00', 'heal');
                
                if (soundEnabled) playUpgradeSound();
            }
            
            healthCores.splice(i, 1);
            continue;
        }
        
        // Удаление ядра, если истекло время жизни
        if (core.life <= 0) {
            healthCores.splice(i, 1);
        }
    }
    
    // Обновление звезд
    if (gameTime % 3 === 0) {
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const starSpeed = star.speed * (deltaTime / 16.67);
            star.y += starSpeed;
            
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        }
    }
}

// Проверка повышения уровня игрока
function checkLevelUp() {
    if (player.experience >= player.experienceToNextLevel) {
        player.playerLevel++;
        player.experience -= player.experienceToNextLevel;
        player.experienceToNextLevel = roundNumber(player.experienceToNextLevel * 1.35);
        
        // Бонусы за уровень
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.damage += 2;
        
        showNotification('level', `Уровень ${player.playerLevel}! +20 HP, +2 урона`);
        
        // Создаем праздничные частицы для повышения уровня
        createParticles(player.x, player.y, 20, '#ffcc00', 'levelup');
        
        // Обновляем отображение уровня
        updatePlayerLevelDisplay();
        
        // Показываем выбор дополнительного оружия
        showWeaponSelection();
    }
}

// Показать выбор дополнительного оружия
function showWeaponSelection() {
    weaponSelectionPaused = true;
    gamePaused = true;
    
    // Получаем список всех доступных оружий
    const allWeapons = [
        'orbitalShields', 'companionDrones', 'laserBeams', 'chainLightning',
        'damageWaves', 'meteors', 'fireBalls', 'iceSpikes', 'homingMissiles', 'bulletRing',
        // Новые оружия:
        'magneticMines', 'lightSabers', 'toxicClouds', 'sniperLasers',
        'veilOfStars', 'electricTraps', 'vortexTornadoes', 'crystalSpikes',
        'plasmaBalls', 'strategicStrike'
    ];
    
    const maxWeapons = player.playerLevel >= 30 ? 5 : 4;
    const selectedWeapons = [];
    
    // Если есть свободные слоты, добавляем новые оружия
    if (activeWeapons.length < maxWeapons) {
        // Исключаем уже выбранные оружия
        const availableWeapons = allWeapons.filter(w => !activeWeapons.find(aw => aw.type === w));
        
        // Выбираем случайные новые оружия
        const newWeaponsCount = Math.min(3, availableWeapons.length);
        for (let i = 0; i < newWeaponsCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            selectedWeapons.push(availableWeapons[randomIndex]);
            availableWeapons.splice(randomIndex, 1);
        }
        
        // Если есть уже имеющиеся оружия, добавляем их для разнообразия выбора
        while (selectedWeapons.length < 3 && activeWeapons.length > 0) {
            const randomWeapon = activeWeapons[Math.floor(Math.random() * activeWeapons.length)];
            if (!selectedWeapons.includes(randomWeapon.type)) {
                selectedWeapons.push(randomWeapon.type);
            } else {
                break;
            }
        }
    } else {
        // Если максимум оружий уже есть, предлагаем только улучшение существующих
        const shuffledWeapons = [...activeWeapons].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(3, shuffledWeapons.length); i++) {
            selectedWeapons.push(shuffledWeapons[i].type);
        }
    }
    
    // Если всё равно меньше 3, дополняем оставшимися
    while (selectedWeapons.length < 3 && allWeapons.length > selectedWeapons.length) {
        const remaining = allWeapons.filter(w => !selectedWeapons.includes(w));
        if (remaining.length > 0) {
            const randomIndex = Math.floor(Math.random() * remaining.length);
            selectedWeapons.push(remaining[randomIndex]);
        } else {
            break;
        }
    }
    
    // Отображаем модальное окно выбора
    const overlay = document.getElementById('weaponSelectionOverlay');
    const container = document.getElementById('weaponSelectionContainer');
    
    // Очищаем предыдущие варианты
    container.innerHTML = '<h2>Выберите дополнительное оружие</h2>';
    
    // Добавляем кнопку обновления
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-btn';
    refreshButton.innerHTML = `🔄 Обновить (${refreshCost} 💰)`;
    refreshButton.onclick = refreshWeaponSelection;
    
    // Отключаем кнопку если недостаточно денег
    if (money < refreshCost) {
        refreshButton.disabled = true;
    }
    
    container.appendChild(refreshButton);
    
    // Создаем контейнер для опций
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'weapon-options-grid';
    
    // Добавляем варианты оружия
    selectedWeapons.forEach((weaponType, index) => {
        const weaponData = getWeaponData(weaponType);
        const existingWeapon = activeWeapons.find(w => w.type === weaponType);
        const weaponDiv = document.createElement('div');
        weaponDiv.className = 'weapon-option';
        const buttonText = existingWeapon ? `Улучшить (Ур. ${existingWeapon.level + 1})` : 'Выбрать';
        weaponDiv.innerHTML = `
            <h3>${weaponData.name}</h3>
            <p>${weaponData.description}</p>
            <button onclick="selectWeapon('${weaponType}')" class="weapon-select-btn">
                ${buttonText}
            </button>
        `;
        optionsContainer.appendChild(weaponDiv);
    });
    
    container.appendChild(optionsContainer);
    
    overlay.style.display = 'flex';
}

// Обновление выбора оружия
function refreshWeaponSelection() {
    // Проверяем, достаточно ли денег
    if (money < refreshCost) {
        showNotification('money', `Недостаточно денег! Нужно ${refreshCost} 💰`);
        return;
    }
    
    // Списываем деньги
    money -= refreshCost;
    updateMoney();
    
    // Увеличиваем цену для следующего обновления (на 20% от текущей цены)
    refreshCost = Math.floor(refreshCost * 1.2);
    if (refreshCost < 5) refreshCost = 5; // Минимальная цена
    
    // Показываем уведомление
    showNotification('refresh', `Выбор оружия обновлен! Следующая цена: ${refreshCost} 💰`);
    
    // Перегенерируем выбор оружия
    showWeaponSelection();
}

// Получить данные оружия
function getWeaponData(type) {
    const weapons = {
        orbitalShields: { name: '🛡️ Орбитальные щиты', description: 'Щиты блокируют вражеские снаряды. Восстановление 5 сек. На 10 уровне: 2 удара + отражение' },
        companionDrones: { name: '🤖 Дроны-помощники', description: 'Дроны автоматически стреляют по ближайшим врагам' },
        laserBeams: { name: '⚡ Лазерные лучи', description: 'Лучи пронзают врагов по прямой линии' },
        chainLightning: { name: '⚡ Молнии', description: 'Цепные молнии перепрыгивают между врагами' },
        damageWaves: { name: '🌊 Волны урона', description: 'Периодические волны урона расходятся от игрока' },
        meteors: { name: '☄️ Метеориты', description: 'Метеориты падают на карту, нанося урон в области' },
        fireBalls: { name: '🔥 Огненные шары', description: 'Шары огня летают по траектории вокруг игрока' },
        iceSpikes: { name: '❄️ Ледяные шипы', description: 'Основной шип в случайном направлении + кольцо маленьких шипов' },
        homingMissiles: { name: '🚀 Снаряды с наведением', description: 'Снаряды автоматически наводятся на ближайших врагов' },
        bulletRing: { name: '💫 Кольцо из пуль', description: 'Периодически выпускает кольцо из пуль во все стороны' },
        // Новые оружия:
        magneticMines: { name: '🧲 Магнитные мины', description: 'Мины притягивают врагов и наносят урон' },
        lightSabers: { name: '⚔️ Световые клинки', description: 'Вращающиеся клинки разрубают врагов' },
        toxicClouds: { name: '☁️ Токсичные облака', description: 'Облака замедляют и отравляют врагов' },
        sniperLasers: { name: '🎯 Снайперские лазеры', description: 'Заряженный выстрел по самому сильному врагу' },
        veilOfStars: { name: '✨ Вуаль звёзд', description: 'Поглощает урон и даёт неуязвимость' },
        electricTraps: { name: '⚡ Электрические ловушки', description: 'Ловушки срабатывают при приближении врагов' },
        vortexTornadoes: { name: '🌪️ Вихревые торнадо', description: 'Торнадо отталкивают врагов с пути' },
        crystalSpikes: { name: '💎 Кристаллические шипы', description: 'Кристаллы вращаются и стреляют во врагов' },
        plasmaBalls: { name: '🔵 Плазменные шары', description: 'Шары стреляют веером по нескольким врагам' },
        strategicStrike: { name: '🚀 Стратегический удар', description: 'Авиаудар в указанное место (автоматический)' }
    };
    return weapons[type] || { name: 'Неизвестное оружие', description: '' };
}

// Выбор оружия
function selectWeapon(weaponType) {
    const overlay = document.getElementById('weaponSelectionOverlay');
    
    // Проверяем, есть ли уже такое оружие
    const existingWeapon = activeWeapons.find(w => w.type === weaponType);
    
    if (existingWeapon) {
        existingWeapon.level++;
    } else {
        activeWeapons.push({ type: weaponType, level: 1 });
    }
    
    // Инициализируем оружие
    initWeapon(weaponType);
    
    // Скрываем модальное окно
    overlay.style.display = 'none';
    
    // Снимаем паузу
    weaponSelectionPaused = false;
    gamePaused = false;
    
    // Показываем уведомление
    showNotification('level', getWeaponData(weaponType).name);
}

// Инициализация оружия
function initWeapon(type) {
    const weapon = activeWeapons.find(w => w.type === type);
    if (!weapon) return;
    
    switch(type) {
        case 'orbitalShields':
            // Создаем щиты-сегменты вокруг игрока
            const shieldCount = Math.min(2 + Math.floor(weapon.level / 2), 6);
            orbitalShields = [];
            for (let i = 0; i < shieldCount; i++) {
                const maxHits = weapon.level >= 10 ? 2 : 1; // На 10 уровне щиты держат 2 удара
                orbitalShields.push({
                    angle: (Math.PI * 2 / shieldCount) * i,
                    distance: 35 + weapon.level * 3,
                    radius: 12 + weapon.level,
                    rotationSpeed: 0.04 + weapon.level * 0.005, // Вращение вокруг игрока
                    maxHits: maxHits,
                    currentHits: maxHits,
                    recoveryTime: 5000 - (weapon.level * 200), // Восстановление уменьшается с уровнем
                    lastHitTime: 0,
                    broken: false,
                    hasReflection: weapon.level >= 10 // 50% шанс отражения на 10 уровне
                });
            }
            break;
        case 'companionDrones':
            const droneCount = Math.min(1 + weapon.level, 3);
            companionDrones = [];
            for (let i = 0; i < droneCount; i++) {
                companionDrones.push({
                    angle: (Math.PI * 2 / droneCount) * i,
                    distance: 50 + weapon.level * 10,
                    lastShot: 0,
                    fireRate: Math.max(800 - weapon.level * 100, 400),
                    x: 0,
                    y: 0
                });
            }
            break;
        case 'fireBalls':
            // Инициализация будет в updateFireBalls
            fireBalls = [];
            break;
        // Новые оружия:
        case 'magneticMines':
            magneticMines = [];
            break;
        case 'lightSabers':
            const saberCount = Math.min(2 + weapon.level, 4);
            lightSabers = [];
            for (let i = 0; i < saberCount; i++) {
                lightSabers.push({
                    angle: (Math.PI * 2 / saberCount) * i,
                    distance: 30 + weapon.level * 5,
                    length: 40 + weapon.level * 5,
                    rotationSpeed: 0.08 + weapon.level * 0.01,
                    damage: roundNumber(player.damage * 0.4 * weapon.level)
                });
            }
            break;
        case 'toxicClouds':
            toxicClouds = [];
            break;
        case 'sniperLasers':
            sniperLasers.cooldown = Math.max(3000 - weapon.level * 200, 1500);
            break;
        case 'veilOfStars':
            veilOfStars.lastInvulnerability = 0;
            veilOfStars.active = true;
            veilOfStars.endTime = 0;
            break;
        case 'electricTraps':
            electricTraps = [];
            break;
        case 'vortexTornadoes':
            vortexTornadoes = [];
            break;
        case 'crystalSpikes':
            const spikeCount = Math.min(6 + weapon.level * 2, 12);
            crystalSpikes = [];
            for (let i = 0; i < spikeCount; i++) {
                crystalSpikes.push({
                    angle: (Math.PI * 2 / spikeCount) * i,
                    distance: 40 + weapon.level * 10,
                    rotationSpeed: 0.03 + weapon.level * 0.005,
                    lastShot: 0,
                    fireRate: Math.max(1500 - weapon.level * 150, 800),
                    damage: roundNumber(player.damage * 0.7 * weapon.level)
                });
            }
            break;
        case 'plasmaBalls':
            const ballCount = Math.min(2 + weapon.level, 4);
            plasmaBalls = [];
            for (let i = 0; i < ballCount; i++) {
                plasmaBalls.push({
                    angle: (Math.PI * 2 / ballCount) * i,
                    distance: 60 + weapon.level * 10,
                    rotationSpeed: 0.04 + weapon.level * 0.005,
                    lastShot: 0,
                    fireRate: Math.max(2000 - weapon.level * 200, 1000),
                    damage: roundNumber(player.damage * 0.5 * weapon.level)
                });
            }
            break;
        case 'strategicStrike':
            strategicStrikes.cooldown = Math.max(5000 - weapon.level * 300, 2000);
            break;
    }
}

// Обновление дополнительного оружия
function updateWeapons(deltaTime) {
    for (const weapon of activeWeapons) {
        switch(weapon.type) {
            case 'orbitalShields':
                updateOrbitalShields(weapon, deltaTime);
                break;
            case 'companionDrones':
                updateCompanionDrones(weapon, deltaTime);
                break;
            case 'laserBeams':
                updateLaserBeams(weapon, deltaTime);
                break;
            case 'chainLightning':
                updateChainLightning(weapon, deltaTime);
                break;
            case 'damageWaves':
                updateDamageWaves(weapon, deltaTime);
                break;
            case 'meteors':
                updateMeteors(weapon, deltaTime);
                break;
            case 'fireBalls':
                updateFireBalls(weapon, deltaTime);
                break;
            case 'iceSpikes':
                updateIceSpikes(weapon, deltaTime);
                break;
            case 'homingMissiles':
                updateHomingMissiles(weapon, deltaTime);
                break;
            case 'bulletRing':
                updateBulletRing(weapon, deltaTime);
                break;
            // Новые оружия:
            case 'magneticMines':
                updateMagneticMines(weapon, deltaTime);
                break;
            case 'lightSabers':
                updateLightSabers(weapon, deltaTime);
                break;
            case 'toxicClouds':
                updateToxicClouds(weapon, deltaTime);
                break;
            case 'sniperLasers':
                updateSniperLasers(weapon, deltaTime);
                break;
            case 'veilOfStars':
                updateVeilOfStars(weapon, deltaTime);
                break;
            case 'electricTraps':
                updateElectricTraps(weapon, deltaTime);
                break;
            case 'vortexTornadoes':
                updateVortexTornadoes(weapon, deltaTime);
                break;
            case 'crystalSpikes':
                updateCrystalSpikes(weapon, deltaTime);
                break;
            case 'plasmaBalls':
                updatePlasmaBalls(weapon, deltaTime);
                break;
            case 'strategicStrike':
                updateStrategicStrike(weapon, deltaTime);
                break;
        }
    }
}

// Обновление орбитальных щитов
function updateOrbitalShields(weapon, deltaTime) {
    const now = Date.now();
    
    for (const shield of orbitalShields) {
        // Восстановление сломанных щитов
        if (shield.broken && now - shield.lastHitTime > shield.recoveryTime) {
            shield.broken = false;
            shield.currentHits = shield.maxHits;
            createParticles(player.x, player.y, 3, '#4fc3f7', 'shield');
        }
        
        // Пропускаем сломанные щиты
        if (shield.broken) continue;
        
        shield.angle += shield.rotationSpeed * (deltaTime / 16.67);
        if (shield.angle > Math.PI * 2) shield.angle -= Math.PI * 2;
        
        const shieldX = player.x + Math.cos(shield.angle) * shield.distance;
        const shieldY = player.y + Math.sin(shield.angle) * shield.distance;
        
        // Блокирование вражеских снарядов
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            const dx = shieldX - bullet.x;
            const dy = shieldY - bullet.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = shield.radius + bullet.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                shield.currentHits--;
                createParticles(bullet.x, bullet.y, 5, '#4fc3f7', 'shield');
                
                // Отражение снаряда (50% шанс на 10 уровне)
                if (shield.hasReflection && Math.random() < 0.5) {
                    // Отражаем снаряд назад к врагам
                    bullet.angle = Math.atan2(-dy, -dx);
                    bullet.speed = 5;
                    bullet.damage *= 0.8;
                    bullet.isReflected = true;
                    createParticles(bullet.x, bullet.y, 3, '#ffff00', 'reflect');
                } else {
                    enemyBullets.splice(i, 1);
                }
                
                if (shield.currentHits <= 0) {
                    shield.broken = true;
                    shield.lastHitTime = now;
                    createParticles(shieldX, shieldY, 8, '#ff0000', 'shield');
                }
                break;
            }
        }
        
        // Блокирование снарядов босса (без отражения)
        for (let i = bossProjectiles.length - 1; i >= 0; i--) {
            const projectile = bossProjectiles[i];
            const dx = shieldX - projectile.x;
            const dy = shieldY - projectile.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = shield.radius + projectile.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                shield.currentHits--;
                createParticles(projectile.x, projectile.y, 5, '#4fc3f7', 'shield');
                bossProjectiles.splice(i, 1);
                
                if (shield.currentHits <= 0) {
                    shield.broken = true;
                    shield.lastHitTime = now;
                    createParticles(shieldX, shieldY, 8, '#ff0000', 'shield');
                }
                break;
            }
        }
    }
}

// Обновление дронов-помощников
function updateCompanionDrones(weapon, deltaTime) {
    const now = Date.now();
    
    for (let i = 0; i < companionDrones.length; i++) {
        const drone = companionDrones[i];
        drone.angle += 0.02 * (deltaTime / 16.67);
        if (drone.angle > Math.PI * 2) drone.angle -= Math.PI * 2;
        
        drone.x = player.x + Math.cos(drone.angle) * drone.distance;
        drone.y = player.y + Math.sin(drone.angle) * drone.distance;
        
        // Стрельба по ближайшему врагу
        if (enemies.length > 0 && now - drone.lastShot > drone.fireRate) {
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                const dx = drone.x - enemy.x;
                const dy = drone.y - enemy.y;
                const distance = dx * dx + dy * dy;
                if (distance < closestDistance && distance < 160000) { // 400^2
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (closestEnemy) {
                const angle = Math.atan2(closestEnemy.y - drone.y, closestEnemy.x - drone.x);
                bullets.push({
                    x: drone.x,
                    y: drone.y,
                    radius: 3,
                    speed: player.bulletSpeed * 0.8,
                    damage: roundNumber(player.damage * 0.6 * weapon.level),
                    angle: angle,
                    color: '#00ffff',
                    splitLevel: 0,
                    ricochetCount: 0,
                    piercingCount: 0,
                    enemiesHit: [],
                    isCritical: false
                });
                drone.lastShot = now;
                createParticles(drone.x, drone.y, 2, '#00ffff', 'hit');
            }
        }
    }
}

// Обновление лазерных лучей
function updateLaserBeams(weapon, deltaTime) {
    const now = Date.now();
    const fireRate = Math.max(1500 - weapon.level * 150, 800);
    const beamDuration = 300; // Длительность луча в мс
    
    // Удаляем старые лучи
    activeLasers = activeLasers.filter(laser => now - laser.startTime < beamDuration);
    
    if (now - laserBeams.lastShot > fireRate && enemies.length > 0) {
        // Находим ближайшего врага
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = dx * dx + dy * dy;
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        
        if (closestEnemy && closestDistance < 250000) { // 500^2
            const angle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
            const beamCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
            
            for (let i = 0; i < beamCount; i++) {
                const spreadAngle = angle + (i - (beamCount - 1) / 2) * 0.15;
                const endX = player.x + Math.cos(spreadAngle) * Math.sqrt(closestDistance);
                const endY = player.y + Math.sin(spreadAngle) * Math.sqrt(closestDistance);
                
                // Создаем луч
                activeLasers.push({
                    startX: player.x,
                    startY: player.y,
                    endX: endX,
                    endY: endY,
                    angle: spreadAngle,
                    damage: roundNumber(player.damage * 0.8 * weapon.level),
                    startTime: now,
                    hitEnemies: []
                });
            }
            
            laserBeams.lastShot = now;
            
            // Наносим урон всем врагам на линии луча
            for (const laser of activeLasers) {
                const dx = laser.endX - laser.startX;
                const dy = laser.endY - laser.startY;
                const length = Math.sqrt(dx * dx + dy * dy);
                
                for (let j = enemies.length - 1; j >= 0; j--) {
                    const enemy = enemies[j];
                    if (laser.hitEnemies.includes(j)) continue;
                    
                    // Проверяем расстояние от врага до линии луча
                    const distToLine = Math.abs(
                        (laser.endY - laser.startY) * enemy.x - (laser.endX - laser.startX) * enemy.y + 
                        laser.endX * laser.startY - laser.endY * laser.startX
                    ) / length;
                    
                    // Проверяем, находится ли враг в пределах луча
                    const projX = ((enemy.x - laser.startX) * dx + (enemy.y - laser.startY) * dy) / (length * length);
                    const inRange = projX >= 0 && projX <= 1;
                    
                    if (distToLine < enemy.radius + 5 && inRange) {
                        enemy.health -= laser.damage;
                        laser.hitEnemies.push(j);
                        createParticles(enemy.x, enemy.y, 5, '#00ff00');
                        
                        if (enemy.health <= 0) {
                            handleEnemyDeath(enemy, j);
                        }
                    }
                }
                
                // Урон по боссу
                if (bossActive && boss && !laser.hitBoss) {
                    const distToLine = Math.abs(
                        (laser.endY - laser.startY) * boss.x - (laser.endX - laser.startX) * boss.y + 
                        laser.endX * laser.startY - laser.endY * laser.startX
                    ) / length;
                    
                    const projX = ((boss.x - laser.startX) * dx + (boss.y - laser.startY) * dy) / (length * length);
                    const inRange = projX >= 0 && projX <= 1;
                    
                    if (distToLine < boss.radius + 5 && inRange) {
                        if (boss.shieldActive && boss.shield > 0) {
                            boss.shield -= laser.damage * 0.5;
                        } else {
                            boss.health -= laser.damage * 0.5;
                        }
                        laser.hitBoss = true;
                        createParticles(boss.x, boss.y, 5, '#00ff00');
                    }
                }
            }
            
            createParticles(player.x, player.y, 5, '#00ff00');
        }
    }
}

// Обновление молний
function updateChainLightning(weapon, deltaTime) {
    const now = Date.now();
    chainLightning.cooldown = Math.max(2000 - weapon.level * 150, 1000);
    const lightningDuration = 200; // Длительность молнии в мс
    
    // Удаляем старые молнии
    activeLightning = activeLightning.filter(lightning => now - lightning.startTime < lightningDuration);
    
    if (now - chainLightning.lastCast > chainLightning.cooldown && enemies.length > 0) {
        // Находим ближайшего врага
        let target = null;
        let minDistance = Infinity;
        
        for (const enemy of enemies) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = dx * dx + dy * dy;
            if (distance < minDistance && distance < 90000) { // 300^2
                minDistance = distance;
                target = enemy;
            }
        }
        
        if (target) {
            // Создаем цепную молнию
            const chainLength = Math.min(3 + weapon.level, 8);
            const hitEnemies = [target];
            let currentTarget = target;
            const chainPath = [{ x: player.x, y: player.y }];
            
            for (let i = 0; i < chainLength - 1; i++) {
                let nextTarget = null;
                let minDist = Infinity;
                
                for (const enemy of enemies) {
                    if (hitEnemies.includes(enemy)) continue;
                    const dx = currentTarget.x - enemy.x;
                    const dy = currentTarget.y - enemy.y;
                    const distance = dx * dx + dy * dy;
                    if (distance < minDist && distance < 22500) { // 150^2
                        minDist = distance;
                        nextTarget = enemy;
                    }
                }
                
                if (nextTarget) {
                    hitEnemies.push(nextTarget);
                    chainPath.push({ x: currentTarget.x, y: currentTarget.y });
                    currentTarget = nextTarget;
                } else {
                    break;
                }
            }
            
            // Добавляем последнюю точку
            chainPath.push({ x: currentTarget.x, y: currentTarget.y });
            
            // Сохраняем молнию для визуализации
            activeLightning.push({
                chain: chainPath,
                startTime: now
            });
            
            // Наносим урон всем целям
            for (let i = 0; i < hitEnemies.length; i++) {
                const enemy = hitEnemies[i];
                const damage = roundNumber(player.damage * 0.8 * weapon.level * (1 - i * 0.1));
                enemy.health -= damage;
                createParticles(enemy.x, enemy.y, 8, '#ffff00');
                
                if (enemy.health <= 0) {
                    const index = enemies.indexOf(enemy);
                    if (index !== -1) handleEnemyDeath(enemy, index);
                }
            }
            
            chainLightning.lastCast = now;
        }
    }
}

// Обновление волн урона
function updateDamageWaves(weapon, deltaTime) {
    const now = Date.now();
    const waveCooldown = Math.max(2500 - weapon.level * 200, 1500);
    
    if (now - (damageWaves.lastWave || 0) > waveCooldown) {
        const waveObj = {
            radius: 0,
            maxRadius: 150 + weapon.level * 20,
            damage: roundNumber(player.damage * 0.5 * weapon.level),
            speed: 3 + weapon.level * 0.5,
            x: player.x,
            y: player.y
        };
        damageWaves.push(waveObj);
        damageWaves.lastWave = now;
    }
    
    // Обновляем волны
    for (let i = damageWaves.length - 1; i >= 0; i--) {
        const wave = damageWaves[i];
        if (typeof wave === 'object' && wave.radius !== undefined) {
            wave.radius += wave.speed * (deltaTime / 16.67);
            
            // Проверка столкновения с врагами
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const dx = wave.x - enemy.x;
                const dy = wave.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (Math.abs(distance - wave.radius) < 20) {
                    enemy.health -= wave.damage;
                    createParticles(enemy.x, enemy.y, 5, '#0099ff');
                    
                    if (enemy.health <= 0) {
                        handleEnemyDeath(enemy, j);
                    }
                }
            }
            
            // Проверка столкновения с боссом
            if (bossActive && boss) {
                const dx = wave.x - boss.x;
                const dy = wave.y - boss.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (Math.abs(distance - wave.radius) < 30) {
                    if (boss.shieldActive && boss.shield > 0) {
                        boss.shield -= wave.damage * 0.5;
                    } else {
                        boss.health -= wave.damage * 0.5;
                    }
                    createParticles(boss.x, boss.y, 5, '#0099ff');
                }
            }
            
            if (wave.radius > wave.maxRadius) {
                damageWaves.splice(i, 1);
            }
        }
    }
}

// Обновление метеоритов
function updateMeteors(weapon, deltaTime) {
    const now = Date.now();
    const meteorCooldown = Math.max(3000 - weapon.level * 200, 1500);
    
    if (now - (meteors.lastMeteor || 0) > meteorCooldown) {
        const meteorCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
        for (let i = 0; i < meteorCount; i++) {
            meteors.push({
                x: Math.random() * canvas.width,
                y: -30,
                targetX: player.x + (Math.random() - 0.5) * 200,
                targetY: player.y + (Math.random() - 0.5) * 200,
                speed: 4 + weapon.level * 0.5,
                radius: 15 + weapon.level * 3,
                damage: roundNumber(player.damage * 1.5 * weapon.level),
                explosionRadius: 60 + weapon.level * 10
            });
        }
        meteors.lastMeteor = now;
    }
    
    // Обновляем метеориты
    for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        if (typeof meteor === 'object' && meteor.targetX !== undefined) {
            const dx = meteor.targetX - meteor.x;
            const dy = meteor.targetY - meteor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                const oldX = meteor.x;
                const oldY = meteor.y;
                const moveStep = (dx / distance) * meteor.speed * (deltaTime / 16.67);
                const moveStepY = (dy / distance) * meteor.speed * (deltaTime / 16.67);
                
                meteor.x += moveStep;
                meteor.y += moveStepY;
                
                // Урон по пути движения (проверяем всех врагов между старой и новой позицией)
                const pathDx = meteor.x - oldX;
                const pathDy = meteor.y - oldY;
                const pathLength = Math.sqrt(pathDx * pathDx + pathDy * pathDy);
                if (pathLength > 0) {
                    for (let j = enemies.length - 1; j >= 0; j--) {
                        const enemy = enemies[j];
                        // Проверяем расстояние от врага до линии движения метеорита
                        const distToLine = Math.abs(
                            pathDy * enemy.x - pathDx * enemy.y + 
                            meteor.x * oldY - meteor.y * oldX
                        ) / pathLength;
                        
                        // Проверяем, находится ли враг на пути
                        const projX = ((enemy.x - oldX) * pathDx + (enemy.y - oldY) * pathDy) / (pathLength * pathLength);
                        const onPath = projX >= 0 && projX <= 1;
                        
                        if (distToLine < enemy.radius + meteor.radius && onPath && (!meteor.hitEnemies || !meteor.hitEnemies.includes(j))) {
                            const pathDamage = roundNumber(meteor.damage * 0.4);
                            enemy.health -= pathDamage;
                            if (!meteor.hitEnemies) meteor.hitEnemies = [];
                            meteor.hitEnemies.push(j);
                            createParticles(enemy.x, enemy.y, 5, '#ff6600');
                            
                            if (enemy.health <= 0) {
                                handleEnemyDeath(enemy, j);
                            }
                        }
                    }
                    
                    // Урон по пути для босса
                    if (bossActive && boss && (!meteor.hitBoss || !meteor.hitBoss)) {
                        const distToLine = Math.abs(
                            pathDy * boss.x - pathDx * boss.y + 
                            meteor.x * oldY - meteor.y * oldX
                        ) / pathLength;
                        
                        const projX = ((boss.x - oldX) * pathDx + (boss.y - oldY) * pathDy) / (pathLength * pathLength);
                        const onPath = projX >= 0 && projX <= 1;
                        
                        if (distToLine < boss.radius + meteor.radius && onPath) {
                            const pathDamage = roundNumber(meteor.damage * 0.2);
                            if (boss.shieldActive && boss.shield > 0) {
                                boss.shield -= pathDamage;
                            } else {
                                boss.health -= pathDamage;
                            }
                            meteor.hitBoss = true;
                            createParticles(boss.x, boss.y, 5, '#ff6600');
                        }
                    }
                }
            } else {
                // Взрыв метеорита
                for (let j = enemies.length - 1; j >= 0; j--) {
                    const enemy = enemies[j];
                    const dx = meteor.x - enemy.x;
                    const dy = meteor.y - enemy.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < meteor.explosionRadius) {
                        enemy.health -= meteor.damage;
                        createParticles(enemy.x, enemy.y, 10, '#ff6600');
                        
                        if (enemy.health <= 0) {
                            handleEnemyDeath(enemy, j);
                        }
                    }
                }
                
                // Взрыв по боссу
                if (bossActive && boss) {
                    const dx = meteor.x - boss.x;
                    const dy = meteor.y - boss.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < meteor.explosionRadius) {
                        if (boss.shieldActive && boss.shield > 0) {
                            boss.shield -= meteor.damage * 0.7;
                        } else {
                            boss.health -= meteor.damage * 0.7;
                        }
                        createParticles(boss.x, boss.y, 15, '#ff6600');
                    }
                }
                
                createParticles(meteor.x, meteor.y, 30, '#ff6600');
                meteors.splice(i, 1);
            }
        }
    }
}

// Обновление огненных шаров
function updateFireBalls(weapon, deltaTime) {
    const ballCount = Math.min(2 + weapon.level, 5);
    
    // Инициализация шаров при первом вызове
    if (fireBalls.length === 0 || fireBalls.length !== ballCount) {
        fireBalls = [];
        for (let i = 0; i < ballCount; i++) {
            fireBalls.push({
                angle: (Math.PI * 2 / ballCount) * i,
                distance: 60 + weapon.level * 10,
                radius: 8 + weapon.level * 2,
                speed: 0.05 + weapon.level * 0.01,
                trailAngle: 0
            });
        }
    }
    
    // Обновляем шары
    for (const ball of fireBalls) {
        ball.trailAngle += ball.speed * (deltaTime / 16.67);
        if (ball.trailAngle > Math.PI * 2) ball.trailAngle -= Math.PI * 2;
        
        const ballX = player.x + Math.cos(ball.angle + ball.trailAngle) * ball.distance;
        const ballY = player.y + Math.sin(ball.angle + ball.trailAngle) * ball.distance;
        
        // Проверка столкновения с врагами
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const dx = ballX - enemy.x;
            const dy = ballY - enemy.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = ball.radius + enemy.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                const damage = roundNumber(player.damage * 0.3 * weapon.level);
                enemy.health -= damage;
                createParticles(enemy.x, enemy.y, 5, '#ff3300');
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, i);
                } else {
                    if (soundEnabled) playHitSound();
                }
            }
        }
        
        // Проверка столкновения с боссом
        if (bossActive && boss) {
            const dx = ballX - boss.x;
            const dy = ballY - boss.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = ball.radius + boss.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                const damage = roundNumber(player.damage * 0.15 * weapon.level);
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= damage;
                } else {
                    boss.health -= damage;
                }
                createParticles(boss.x, boss.y, 5, '#ff3300');
            }
        }
    }
}

// Обновление ледяных шипов
function updateIceSpikes(weapon, deltaTime) {
    const now = Date.now();
    const spikeCooldown = Math.max(1500 - weapon.level * 100, 800);
    
    // Удаляем старые шипы
    if (!iceSpikes.activeSpikes) iceSpikes.activeSpikes = [];
    if (!iceSpikes.secondarySpikes) iceSpikes.secondarySpikes = [];
    
    iceSpikes.activeSpikes = iceSpikes.activeSpikes.filter(spike => now - spike.startTime < 5000);
    iceSpikes.secondarySpikes = iceSpikes.secondarySpikes.filter(spike => now - spike.startTime < 3000);
    
    // Создаем основной шип как снаряд
    if (now - iceSpikes.lastSpike > spikeCooldown) {
        // Находим ближайшего врага для направления
        let targetAngle = Math.random() * Math.PI * 2;
        if (enemies.length > 0) {
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (closestEnemy) {
                targetAngle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
            }
        }
        
        const spikeSpeed = 6 + weapon.level * 0.5;
        const spikeLength = 20 + weapon.level * 3;
        const spikeWidth = 6 + weapon.level;
        
        iceSpikes.activeSpikes.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(targetAngle) * spikeSpeed,
            vy: Math.sin(targetAngle) * spikeSpeed,
            angle: targetAngle,
            length: spikeLength,
            width: spikeWidth,
            damage: roundNumber(player.damage * 0.8 * weapon.level),
            startTime: now,
            lastSmallSpikeSpawn: now,
            type: 'main',
            level: weapon.level
        });
        
        iceSpikes.lastSpike = now;
        createParticles(player.x, player.y, 8, '#00ccff');
    }
    
    // Обновляем позицию основных шипов и спавним маленькие шипики
    for (let i = iceSpikes.activeSpikes.length - 1; i >= 0; i--) {
        const spike = iceSpikes.activeSpikes[i];
        
        // Движение шипа
        spike.x += spike.vx;
        spike.y += spike.vy;
        
        // Спавним маленькие шипики каждые 1 секунду (100% гарантия)
        if (now - spike.lastSmallSpikeSpawn >= 1000) {
            const smallSpikeCount = 4 + Math.floor(spike.level / 3); // 4 стартовых, растет с уровнем
            
            for (let j = 0; j < smallSpikeCount; j++) {
                const angle = (Math.PI * 2 / smallSpikeCount) * j;
                const smallSpeed = 2 + spike.level * 0.2;
                
                iceSpikes.secondarySpikes.push({
                    x: spike.x,
                    y: spike.y,
                    vx: Math.cos(angle) * smallSpeed,
                    vy: Math.sin(angle) * smallSpeed,
                    length: 8 + spike.level,
                    width: 3,
                    damage: roundNumber(spike.damage * 0.2),
                    startTime: now,
                    type: 'small'
                });
            }
            
            spike.lastSmallSpikeSpawn = now;
            createParticles(spike.x, spike.y, 4, '#99ccff');
        }
        
        // Проверка столкновений с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = enemy.x - spike.x;
            const dy = enemy.y - spike.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < enemy.radius + spike.width / 2) {
                enemy.health -= spike.damage;
                createParticles(enemy.x, enemy.y, 6, '#00ccff');
                
                // Замораживаем врага
                enemy.frozen = true;
                enemy.freezeEndTime = now + 2000;
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                } else {
                    if (soundEnabled) playHitSound();
                }
                
                iceSpikes.activeSpikes.splice(i, 1);
                break;
            }
        }
        
        // Проверка столкновений с боссом
        if (bossActive && boss) {
            const dx = boss.x - spike.x;
            const dy = boss.y - spike.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < boss.radius + spike.width / 2) {
                const damage = spike.damage * 0.5;
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= damage;
                } else {
                    boss.health -= damage;
                }
                createParticles(boss.x, boss.y, 6, '#00ccff');
                iceSpikes.activeSpikes.splice(i, 1);
            }
        }
        
        // Удаляем шип если вышел за границы
        if (spike.x < -50 || spike.x > canvas.width + 50 || 
            spike.y < -50 || spike.y > canvas.height + 50) {
            iceSpikes.activeSpikes.splice(i, 1);
        }
    }
    
    // Обновляем маленькие шипики
    for (let i = iceSpikes.secondarySpikes.length - 1; i >= 0; i--) {
        const spike = iceSpikes.secondarySpikes[i];
        
        // Движение
        spike.x += spike.vx;
        spike.y += spike.vy;
        
        // Проверка столкновений с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = enemy.x - spike.x;
            const dy = enemy.y - spike.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < enemy.radius + spike.width / 2) {
                if (spike.damage > 0) {
                    enemy.health -= spike.damage;
                    createParticles(enemy.x, enemy.y, 3, '#99ccff');
                }
                
                // Замедляем врага
                enemy.slowed = true;
                enemy.slowEndTime = now + 1500;
                enemy.slowFactor = 0.6;
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                }
                
                iceSpikes.secondarySpikes.splice(i, 1);
                break;
            }
        }
        
        // Удаляем если вышел за границы
        if (spike.x < -20 || spike.x > canvas.width + 20 || 
            spike.y < -20 || spike.y > canvas.height + 20) {
            iceSpikes.secondarySpikes.splice(i, 1);
        }
    }
}

// Вспомогательная функция для расчета расстояния от точки до линии
function pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
}

// Обновление снарядов с наведением
function updateHomingMissiles(weapon, deltaTime) {
    const now = Date.now();
    const missileCooldown = Math.max(2500 - weapon.level * 200, 1200);
    
    if (now - (homingMissiles.lastMissile || 0) > missileCooldown && enemies.length > 0) {
        const missileCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
        for (let i = 0; i < missileCount; i++) {
            // Находим ближайшего врага
            let target = null;
            let minDistance = Infinity;
            
            for (const enemy of enemies) {
                const dx = player.x - enemy.x;
                const dy = player.y - enemy.y;
                const distance = dx * dx + dy * dy;
                if (distance < minDistance && distance < 250000) { // 500^2
                    minDistance = distance;
                    target = enemy;
                }
            }
            
            if (target) {
                homingMissiles.push({
                    x: player.x,
                    y: player.y,
                    target: target,
                    speed: player.bulletSpeed * 0.8,
                    damage: roundNumber(player.damage * 1.0 * weapon.level),
                    radius: 5,
                    turnSpeed: 0.1,
                    angle: Math.atan2(target.y - player.y, target.x - player.x)
                });
            }
        }
        homingMissiles.lastMissile = now;
    }
    
    // Обновляем снаряды
    for (let i = homingMissiles.length - 1; i >= 0; i--) {
        const missile = homingMissiles[i];
        if (typeof missile === 'object' && missile.target !== undefined) {
            // Проверяем, жив ли цель
            if (missile.target.health <= 0 || !enemies.includes(missile.target)) {
                // Ищем новую цель
                let newTarget = null;
                let minDist = Infinity;
                
                for (const enemy of enemies) {
                    const dx = missile.x - enemy.x;
                    const dy = missile.y - enemy.y;
                    const distance = dx * dx + dy * dy;
                    if (distance < minDist) {
                        minDist = distance;
                        newTarget = enemy;
                    }
                }
                
                if (newTarget) {
                    missile.target = newTarget;
                } else {
                    homingMissiles.splice(i, 1);
                    continue;
                }
            }
            
            // Наводимся на цель
            const targetAngle = Math.atan2(missile.target.y - missile.y, missile.target.x - missile.x);
            let angleDiff = targetAngle - missile.angle;
            
            // Нормализуем угол
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            missile.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), missile.turnSpeed);
            
            // Движение
            missile.x += Math.cos(missile.angle) * missile.speed * (deltaTime / 16.67);
            missile.y += Math.sin(missile.angle) * missile.speed * (deltaTime / 16.67);
            
            // Проверка столкновения с целью
            const dx = missile.x - missile.target.x;
            const dy = missile.y - missile.target.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSum = missile.radius + missile.target.radius;
            
            if (distanceSquared < radiusSum * radiusSum) {
                missile.target.health -= missile.damage;
                createParticles(missile.target.x, missile.target.y, 10, '#ff9900');
                
                if (missile.target.health <= 0) {
                    const index = enemies.indexOf(missile.target);
                    if (index !== -1) handleEnemyDeath(missile.target, index);
                }
                
                homingMissiles.splice(i, 1);
            }
            
            // Удаляем если ушли за экран
            if (missile.x < -50 || missile.x > canvas.width + 50 ||
                missile.y < -50 || missile.y > canvas.height + 50) {
                homingMissiles.splice(i, 1);
            }
        }
    }
}

// Обновление кольца из пуль
function updateBulletRing(weapon, deltaTime) {
    const now = Date.now();
    bulletRings.cooldown = Math.max(3000 - weapon.level * 200, 1500);
    
    if (now - bulletRings.lastCast > bulletRings.cooldown) {
        const bulletCount = Math.min(8 + weapon.level * 2, 24);
        
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 / bulletCount) * i;
            bullets.push({
                x: player.x,
                y: player.y,
                radius: 4,
                speed: player.bulletSpeed * 0.9,
                damage: roundNumber(player.damage * 0.7 * weapon.level),
                angle: angle,
                color: '#42AAFF',
                splitLevel: 0,
                ricochetCount: 0,
                piercingCount: 0,
                enemiesHit: [],
                isCritical: false
            });
        }
        
        bulletRings.lastCast = now;
        createParticles(player.x, player.y, 15, '#42AAFF');
    }
}

// НОВЫЕ ФУНКЦИИ ДЛЯ ОРУЖИЙ

// Обновление магнитных мин
function updateMagneticMines(weapon, deltaTime) {
    const now = Date.now();
    const mineCooldown = Math.max(3000 - weapon.level * 200, 1500);
    
    // Создаем новые мины
    if (now - (magneticMines.lastMine || 0) > mineCooldown) {
        const mineCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
        for (let i = 0; i < mineCount; i++) {
            magneticMines.push({
                x: player.x + (Math.random() - 0.5) * 100,
                y: player.y + (Math.random() - 0.5) * 100,
                radius: 15 + weapon.level * 2,
                pullForce: 0.5 + weapon.level * 0.1,
                damage: roundNumber(player.damage * 0.3 * weapon.level),
                life: 180,
                maxLife: 180,
                explosionRadius: 60 + weapon.level * 10
            });
        }
        magneticMines.lastMine = now;
    }
    
    // Обновляем существующие мины
    for (let i = magneticMines.length - 1; i >= 0; i--) {
        const mine = magneticMines[i];
        mine.life--;
        
        // Притягиваем врагов к мине
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = mine.x - enemy.x;
            const dy = mine.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) { // Радиус притяжения
                const force = mine.pullForce * (1 - distance / 200);
                enemy.x += (dx / distance) * force * (deltaTime / 16.67);
                enemy.y += (dy / distance) * force * (deltaTime / 16.67);
            }
            
            // Проверка столкновения с врагами
            if (distance < mine.radius + enemy.radius) {
                enemy.health -= mine.damage * (deltaTime / 16.67);
                createParticles(enemy.x, enemy.y, 2, '#ff00ff');
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                }
            }
        }
        
        // Взрыв при окончании времени жизни
        if (mine.life <= 0) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const dx = mine.x - enemy.x;
                const dy = mine.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mine.explosionRadius) {
                    const explosionDamage = roundNumber(mine.damage * 2);
                    enemy.health -= explosionDamage;
                    createParticles(enemy.x, enemy.y, 10, '#ff00ff');
                    
                    if (enemy.health <= 0) {
                        handleEnemyDeath(enemy, j);
                    }
                }
            }
            
            // Взрыв по боссу
            if (bossActive && boss) {
                const dx = mine.x - boss.x;
                const dy = mine.y - boss.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mine.explosionRadius) {
                    const explosionDamage = roundNumber(mine.damage * 1.5);
                    if (boss.shieldActive && boss.shield > 0) {
                        boss.shield -= explosionDamage;
                    } else {
                        boss.health -= explosionDamage;
                    }
                    createParticles(boss.x, boss.y, 15, '#ff00ff');
                }
            }
            
            createParticles(mine.x, mine.y, 25, '#ff00ff');
            magneticMines.splice(i, 1);
        }
    }
}

// Обновление световых клинков
function updateLightSabers(weapon, deltaTime) {
    for (const saber of lightSabers) {
        saber.angle += saber.rotationSpeed * (deltaTime / 16.67);
        if (saber.angle > Math.PI * 2) saber.angle -= Math.PI * 2;
        
        const startX = player.x + Math.cos(saber.angle) * saber.distance;
        const startY = player.y + Math.sin(saber.angle) * saber.distance;
        const endX = startX + Math.cos(saber.angle) * saber.length;
        const endY = startY + Math.sin(saber.angle) * saber.length;
        
        // Проверка столкновения с врагами
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const pathDx = endX - startX;
            const pathDy = endY - startY;
            const pathLength = Math.sqrt(pathDx * pathDx + pathDy * pathDy);
            const distToLine = Math.abs(
                pathDy * enemy.x - pathDx * enemy.y + endX * startY - endY * startX
            ) / pathLength;
            
            const dx = enemy.x - startX;
            const dy = enemy.y - startY;
            const distAlongLine = Math.sqrt(dx * dx + dy * dy);
            
            if (distToLine < 10 && distAlongLine < pathLength + 20) {
                enemy.health -= saber.damage;
                createParticles(enemy.x, enemy.y, 5, '#00ffff');
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, i);
                }
            }
        }
        
        // Проверка столкновения с боссом
        if (bossActive && boss) {
            const pathDx = endX - startX;
            const pathDy = endY - startY;
            const pathLength = Math.sqrt(pathDx * pathDx + pathDy * pathDy);
            const distToLine = Math.abs(
                pathDy * boss.x - pathDx * boss.y + endX * startY - endY * startX
            ) / pathLength;
            
            const dx = boss.x - startX;
            const dy = boss.y - startY;
            const distAlongLine = Math.sqrt(dx * dx + dy * dy);
            
            if (distToLine < 15 && distAlongLine < pathLength + 30) {
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= saber.damage * 0.5;
                } else {
                    boss.health -= saber.damage * 0.5;
                }
                createParticles(boss.x, boss.y, 5, '#00ffff');
            }
        }
    }
}

// Обновление токсичных облаков
function updateToxicClouds(weapon, deltaTime) {
    const now = Date.now();
    const cloudCooldown = Math.max(4000 - weapon.level * 250, 2000);
    
    // Создаем новые облака
    if (now - (toxicClouds.lastCloud || 0) > cloudCooldown) {
        const cloudCount = Math.min(1 + Math.floor(weapon.level / 3), 2);
        for (let i = 0; i < cloudCount; i++) {
            toxicClouds.push({
                x: player.x + (Math.random() - 0.5) * 150,
                y: player.y + (Math.random() - 0.5) * 150,
                radius: 50 + weapon.level * 10,
                damage: roundNumber(player.damage * 0.1 * weapon.level),
                life: 300,
                maxLife: 300,
                slowEffect: 0.5 + weapon.level * 0.05
            });
        }
        toxicClouds.lastCloud = now;
    }
    
    // Обновляем существующие облака
    for (let i = toxicClouds.length - 1; i >= 0; i--) {
        const cloud = toxicClouds[i];
        cloud.life--;
        
        // Постепенно уменьшаем радиус
        cloud.radius *= 0.999;
        
        // Проверка столкновения с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = cloud.x - enemy.x;
            const dy = cloud.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < cloud.radius) {
                // Урон от отравления
                enemy.health -= cloud.damage * (deltaTime / 16.67);
                createParticles(enemy.x, enemy.y, 1, '#33ff33');
                
                // Замедление
                enemy.speed = enemy.speed * (1 - cloud.slowEffect * 0.5);
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                }
            }
        }
        
        // Проверка столкновения с боссом
        if (bossActive && boss) {
            const dx = cloud.x - boss.x;
            const dy = cloud.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < cloud.radius) {
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= cloud.damage * 0.3;
                } else {
                    boss.health -= cloud.damage * 0.3;
                }
                // Босс тоже замедляется
                boss.speed = boss.speed * (1 - cloud.slowEffect * 0.3);
                createParticles(boss.x, boss.y, 3, '#33ff33');
            }
        }
        
        // Удаляем облако после окончания времени жизни
        if (cloud.life <= 0) {
            toxicClouds.splice(i, 1);
        }
    }
}

// Обновление снайперских лазеров
function updateSniperLasers(weapon, deltaTime) {
    const now = Date.now();
    
    if (now - sniperLasers.lastShot > sniperLasers.cooldown && enemies.length > 0) {
        // Находим самого сильного врага (с максимальным здоровьем)
        let strongestEnemy = null;
        let maxHealth = 0;
        
        for (const enemy of enemies) {
            if (enemy.health > maxHealth) {
                maxHealth = enemy.health;
                strongestEnemy = enemy;
            }
        }
        
        if (strongestEnemy) {
            sniperLasers.activeTarget = strongestEnemy;
            sniperLasers.lastShot = now;
            
            // Заряжаем лазер (задержка перед выстрелом)
            setTimeout(() => {
                if (sniperLasers.activeTarget && enemies.includes(sniperLasers.activeTarget)) {
                    const damage = roundNumber(player.damage * 2.5 * weapon.level);
                    sniperLasers.activeTarget.health -= damage;
                    createParticles(sniperLasers.activeTarget.x, sniperLasers.activeTarget.y, 15, '#ff0000');
                    
                    // Пронзающий эффект - наносим урон врагам за целью
                    const angle = Math.atan2(
                        sniperLasers.activeTarget.y - player.y,
                        sniperLasers.activeTarget.x - player.x
                    );
                    const range = 800;
                    
                    for (let i = enemies.length - 1; i >= 0; i--) {
                        const enemy = enemies[i];
                        if (enemy === sniperLasers.activeTarget) continue;
                        
                        const pathDx = Math.cos(angle) * range;
                        const pathDy = Math.sin(angle) * range;
                        const pathLength = Math.sqrt(pathDx * pathDx + pathDy * pathDy);
                        const distToLine = Math.abs(
                            pathDy * enemy.x - pathDx * enemy.y + 
                            (player.x + pathDx) * player.y - (player.y + pathDy) * player.x
                        ) / pathLength;
                        
                        const dx = enemy.x - player.x;
                        const dy = enemy.y - player.y;
                        const dotProduct = dx * Math.cos(angle) + dy * Math.sin(angle);
                        
                        if (distToLine < 20 && dotProduct > 0 && dotProduct < range) {
                            const chainDamage = roundNumber(damage * 0.5);
                            enemy.health -= chainDamage;
                            createParticles(enemy.x, enemy.y, 8, '#ff0000');
                            
                            if (enemy.health <= 0) {
                                handleEnemyDeath(enemy, i);
                            }
                        }
                    }
                    
                    if (sniperLasers.activeTarget.health <= 0) {
                        const index = enemies.indexOf(sniperLasers.activeTarget);
                        if (index !== -1) handleEnemyDeath(sniperLasers.activeTarget, index);
                    }
                    
                    // Урон по боссу, если он на линии
                    if (bossActive && boss) {
                        const pathDx = Math.cos(angle) * range;
                        const pathDy = Math.sin(angle) * range;
                        const pathLength = Math.sqrt(pathDx * pathDx + pathDy * pathDy);
                        const distToLine = Math.abs(
                            pathDy * boss.x - pathDx * boss.y + 
                            (player.x + pathDx) * player.y - (player.y + pathDy) * player.x
                        ) / pathLength;
                        
                        const dx = boss.x - player.x;
                        const dy = boss.y - player.y;
                        const dotProduct = dx * Math.cos(angle) + dy * Math.sin(angle);
                        
                        if (distToLine < 30 && dotProduct > 0 && dotProduct < range) {
                            const bossDamage = roundNumber(damage * 0.7);
                            if (boss.shieldActive && boss.shield > 0) {
                                boss.shield -= bossDamage;
                            } else {
                                boss.health -= bossDamage;
                            }
                            createParticles(boss.x, boss.y, 10, '#ff0000');
                        }
                    }
                    
                    sniperLasers.activeTarget = null;
                }
            }, 500); // Задержка заряда 500мс
        }
    }
}

// Обновление Вуали звёзд
function updateVeilOfStars(weapon, deltaTime) {
    const now = Date.now();
    
    // Проверяем и активируем неуязвимость каждые 10 секунд на уровне 10+
    if (weapon.level >= 10 && now - veilOfStars.lastInvulnerability >= veilOfStars.cooldown) {
        veilOfStars.lastInvulnerability = now;
        veilOfStars.active = true;
        veilOfStars.endTime = now + 2000; // 2 секунды неуязвимости
        
        // Показываем уведомление
        showNotification('shield', '✨ Вуаль звёзд: Неуязвимость на 2 секунды!');
        createParticles(player.x, player.y, 15, '#ffff00', 'shield');
    }
    
    // Проверяем окончание неуязвимости
    if (veilOfStars.active && now > veilOfStars.endTime) {
        veilOfStars.active = false;
    }
}

// Обновление электрических ловушек
function updateElectricTraps(weapon, deltaTime) {
    const now = Date.now();
    const trapCooldown = Math.max(3500 - weapon.level * 250, 1500);
    
    // Создаем новые ловушки
    if (now - (electricTraps.lastTrap || 0) > trapCooldown) {
        const trapCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
        for (let i = 0; i < trapCount; i++) {
            electricTraps.push({
                x: player.x + (Math.random() - 0.5) * 200,
                y: player.y + (Math.random() - 0.5) * 200,
                radius: 20 + weapon.level * 3,
                damage: roundNumber(player.damage * 0.8 * weapon.level),
                life: 240,
                maxLife: 240,
                triggered: false,
                chainDistance: 100 + weapon.level * 10
            });
        }
        electricTraps.lastTrap = now;
    }
    
    // Обновляем существующие ловушки
    for (let i = electricTraps.length - 1; i >= 0; i--) {
        const trap = electricTraps[i];
        trap.life--;
        
        if (!trap.triggered) {
            // Проверяем, активирована ли ловушка врагом
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                const dx = trap.x - enemy.x;
                const dy = trap.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < trap.radius + enemy.radius) {
                    trap.triggered = true;
                    
                    // Цепная молния по всем врагам в радиусе
                    const hitEnemies = [enemy];
                    
                    for (let k = 0; k < enemies.length; k++) {
                        if (k === j) continue;
                        
                        const otherEnemy = enemies[k];
                        const dx2 = enemy.x - otherEnemy.x;
                        const dy2 = enemy.y - otherEnemy.y;
                        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        
                        if (distance2 < trap.chainDistance) {
                            hitEnemies.push(otherEnemy);
                        }
                    }
                    
                    // Наносим урон всем целям
                    for (let k = 0; k < hitEnemies.length; k++) {
                        const hitEnemy = hitEnemies[k];
                        const chainDamage = roundNumber(trap.damage * (1 - k * 0.2));
                        hitEnemy.health -= chainDamage;
                        createParticles(hitEnemy.x, hitEnemy.y, 8, '#ffff00');
                        
                        if (hitEnemy.health <= 0) {
                            const index = enemies.indexOf(hitEnemy);
                            if (index !== -1) handleEnemyDeath(hitEnemy, index);
                        }
                    }
                    
                    // Урон по боссу, если он в радиусе
                    if (bossActive && boss) {
                        const dx3 = trap.x - boss.x;
                        const dy3 = trap.y - boss.y;
                        const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
                        
                        if (distance3 < trap.radius + boss.radius) {
                            if (boss.shieldActive && boss.shield > 0) {
                                boss.shield -= trap.damage * 0.6;
                            } else {
                                boss.health -= trap.damage * 0.6;
                            }
                            createParticles(boss.x, boss.y, 10, '#ffff00');
                        }
                    }
                    
                    break;
                }
            }
        }
        
        // Удаляем ловушку после срабатывания или окончания времени жизни
        if (trap.triggered || trap.life <= 0) {
            electricTraps.splice(i, 1);
        }
    }
}

// Обновление вихревых торнадо
function updateVortexTornadoes(weapon, deltaTime) {
    const now = Date.now();
    const tornadoCooldown = Math.max(4000 - weapon.level * 250, 2000);
    
    // Создаем новые торнадо
    if (now - (vortexTornadoes.lastTornado || 0) > tornadoCooldown) {
        const tornadoCount = Math.min(1 + Math.floor(weapon.level / 3), 2);
        for (let i = 0; i < tornadoCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            vortexTornadoes.push({
                x: player.x,
                y: player.y,
                angle: angle,
                speed: 3 + weapon.level * 0.3,
                pushForce: 2 + weapon.level * 0.2,
                damage: roundNumber(player.damage * 0.2 * weapon.level),
                radius: 25 + weapon.level * 3,
                life: 180,
                maxLife: 180
            });
        }
        vortexTornadoes.lastTornado = now;
    }
    
    // Обновляем существующие торнадо
    for (let i = vortexTornadoes.length - 1; i >= 0; i--) {
        const tornado = vortexTornadoes[i];
        tornado.life--;
        
        // Движение торнадо
        tornado.x += Math.cos(tornado.angle) * tornado.speed * (deltaTime / 16.67);
        tornado.y += Math.sin(tornado.angle) * tornado.speed * (deltaTime / 16.67);
        
        // Проверка границ
        if (tornado.x < tornado.radius) {
            tornado.x = tornado.radius;
            tornado.angle = Math.PI - tornado.angle;
        }
        if (tornado.x > canvas.width - tornado.radius) {
            tornado.x = canvas.width - tornado.radius;
            tornado.angle = Math.PI - tornado.angle;
        }
        if (tornado.y < tornado.radius) {
            tornado.y = tornado.radius;
            tornado.angle = -tornado.angle;
        }
        if (tornado.y > canvas.height - tornado.radius) {
            tornado.y = canvas.height - tornado.radius;
            tornado.angle = -tornado.angle;
        }
        
        // Проверка столкновения с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = tornado.x - enemy.x;
            const dy = tornado.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < tornado.radius + enemy.radius) {
                // Урон
                enemy.health -= tornado.damage * (deltaTime / 16.67);
                createParticles(enemy.x, enemy.y, 2, '#0099ff');
                
                // Отталкивание
                const pushAngle = Math.atan2(enemy.y - tornado.y, enemy.x - tornado.x);
                enemy.x += Math.cos(pushAngle) * tornado.pushForce * (deltaTime / 16.67);
                enemy.y += Math.sin(pushAngle) * tornado.pushForce * (deltaTime / 16.67);
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, j);
                }
            }
        }
        
        // Проверка столкновения с боссом
        if (bossActive && boss) {
            const dx = tornado.x - boss.x;
            const dy = tornado.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < tornado.radius + boss.radius) {
                // Урон боссу
                const bossDamage = roundNumber(tornado.damage * 0.5);
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= bossDamage;
                } else {
                    boss.health -= bossDamage;
                }
                
                // Отталкивание босса
                const pushAngle = Math.atan2(boss.y - tornado.y, boss.x - tornado.x);
                boss.x += Math.cos(pushAngle) * tornado.pushForce * 0.5 * (deltaTime / 16.67);
                boss.y += Math.sin(pushAngle) * tornado.pushForce * 0.5 * (deltaTime / 16.67);
                
                createParticles(boss.x, boss.y, 3, '#0099ff');
            }
        }
        
        // Удаляем торнадо после окончания времени жизни
        if (tornado.life <= 0) {
            vortexTornadoes.splice(i, 1);
        }
    }
}

// Обновление кристаллических шипов
function updateCrystalSpikes(weapon, deltaTime) {
    const now = Date.now();
    
    for (const spike of crystalSpikes) {
        spike.angle += spike.rotationSpeed * (deltaTime / 16.67);
        if (spike.angle > Math.PI * 2) spike.angle -= Math.PI * 2;
        
        const spikeX = player.x + Math.cos(spike.angle) * spike.distance;
        const spikeY = player.y + Math.sin(spike.angle) * spike.distance;
        
        // Стрельба кристаллов
        if (now - spike.lastShot > spike.fireRate && enemies.length > 0) {
            // Находим ближайшего врага
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                const dx = spikeX - enemy.x;
                const dy = spikeY - enemy.y;
                const distance = dx * dx + dy * dy;
                if (distance < closestDistance && distance < 90000) { // 300^2
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (closestEnemy) {
                const angle = Math.atan2(closestEnemy.y - spikeY, closestEnemy.x - spikeX);
                bullets.push({
                    x: spikeX,
                    y: spikeY,
                    radius: 3,
                    speed: player.bulletSpeed * 0.7,
                    damage: spike.damage,
                    angle: angle,
                    color: '#ff66ff',
                    splitLevel: 0,
                    ricochetCount: 0,
                    piercingCount: 0,
                    enemiesHit: [],
                    isCritical: false
                });
                spike.lastShot = now;
                createParticles(spikeX, spikeY, 2, '#ff66ff', 'hit');
            }
        }
    }
}

// Обновление плазменных шаров
function updatePlasmaBalls(weapon, deltaTime) {
    const now = Date.now();
    
    for (const ball of plasmaBalls) {
        ball.angle += ball.rotationSpeed * (deltaTime / 16.67);
        if (ball.angle > Math.PI * 2) ball.angle -= Math.PI * 2;
        
        const ballX = player.x + Math.cos(ball.angle) * ball.distance;
        const ballY = player.y + Math.sin(ball.angle) * ball.distance;
        
        // Стрельба веером
        if (now - ball.lastShot > ball.fireRate && enemies.length > 0) {
            const arcAngle = Math.PI / 4; // 45 градусов
            const projectileCount = Math.min(3 + weapon.level, 8);
            
            // Находим ближайшего врага для определения направления
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                const dx = ballX - enemy.x;
                const dy = ballY - enemy.y;
                const distance = dx * dx + dy * dy;
                if (distance < closestDistance && distance < 160000) { // 400^2
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (closestEnemy) {
                const baseAngle = Math.atan2(closestEnemy.y - ballY, closestEnemy.x - ballX);
                
                for (let i = 0; i < projectileCount; i++) {
                    const spreadAngle = baseAngle + (arcAngle * (i / (projectileCount - 1))) - (arcAngle / 2);
                    
                    bullets.push({
                        x: ballX,
                        y: ballY,
                        radius: 4,
                        speed: player.bulletSpeed * 0.6,
                        damage: roundNumber(ball.damage * 0.7),
                        angle: spreadAngle,
                        color: '#66ffcc',
                        splitLevel: 0,
                        ricochetCount: 0,
                        piercingCount: 0,
                        enemiesHit: [],
                        isCritical: false
                    });
                }
                
                ball.lastShot = now;
                createParticles(ballX, ballY, 5, '#66ffcc', 'hit');
            }
        }
    }
}

// Обновление стратегического удара - САМ ВЫБИРАЕТ ЦЕЛЬ
function updateStrategicStrike(weapon, deltaTime) {
    const now = Date.now();
    
    // Автоматический удар по таймеру
    if (now - strategicStrikes.lastStrike > strategicStrikes.cooldown) {
        let bestTarget = null;
        let bestTargetScore = 0;
        
        // Поиск лучшей цели среди всех врагов
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            
            // Вычисляем "ценность" цели по нескольким параметрам
            let targetScore = 0;
            
            // 1. Приоритет боссу (если есть)
            if (bossActive && boss) {
                targetScore = calculateBossScore(boss);
                if (targetScore > bestTargetScore) {
                    bestTargetScore = targetScore;
                    bestTarget = {
                        type: 'boss',
                        x: boss.x,
                        y: boss.y,
                        target: boss,
                        score: targetScore
                    };
                }
            }
            
            // 2. Приоритет танкам (большое здоровье)
            if (enemy.type === 'tank') {
                targetScore += enemy.maxHealth * 2; // Танки ценнее
            } else if (enemy.type === 'shooter') {
                targetScore += enemy.maxHealth * 1.5; // Стрелки ценнее обычных
            } else {
                targetScore += enemy.maxHealth; // Обычные враги
            }
            
            // 3. Приоритет врагам с большим текущим здоровьем
            targetScore += enemy.health * 0.5;
            
            // 4. Приоритет врагам, которые близко к игроку (опасность)
            const dxToPlayer = player.x - enemy.x;
            const dyToPlayer = player.y - enemy.y;
            const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);
            targetScore += Math.max(0, 200 - distanceToPlayer); // Ближе = опаснее
            
            // 5. Приоритет скоплениям врагов
            let clusterScore = 0;
            for (let j = 0; j < enemies.length; j++) {
                if (i === j) continue;
                const otherEnemy = enemies[j];
                const dx = enemy.x - otherEnemy.x;
                const dy = enemy.y - otherEnemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) { // Враги в радиусе 100 пикселей
                    clusterScore += 50;
                }
            }
            targetScore += clusterScore;
            
            // 6. Штраф за слишком далеких врагов (чтобы не целиться в край экрана)
            const dxToCenter = canvas.width/2 - enemy.x;
            const dyToCenter = canvas.height/2 - enemy.y;
            const distanceToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter);
            targetScore -= distanceToCenter * 0.1;
            
            // Обновляем лучшую цель
            if (targetScore > bestTargetScore) {
                bestTargetScore = targetScore;
                bestTarget = {
                    type: 'enemy',
                    x: enemy.x,
                    y: enemy.y,
                    target: enemy,
                    score: targetScore
                };
            }
        }
        
        // Если нашли цель, наносим удар
        if (bestTarget && bestTargetScore > 50) { // Минимальный порог
            strategicStrikes.lastStrike = now;
            
            // Цель для удара - позиция врага или область с врагами
            let strikeX = bestTarget.x;
            let strikeY = bestTarget.y;
            
            // Если это скопление врагов, выбираем центр скопления
            if (bestTarget.type === 'enemy') {
                const cluster = findEnemyCluster(bestTarget.target);
                if (cluster.count > 1) {
                    strikeX = cluster.centerX;
                    strikeY = cluster.centerY;
                }
            }
            
            // Визуальный эффект прицеливания
            showStrategicTarget = true;
            strategicTargetX = strikeX;
            strategicTargetY = strikeY;
            
            // Показываем тип цели в уведомлении
            let targetName = "область";
            if (bestTarget.type === 'boss') {
                targetName = "БОССА";
            } else if (bestTarget.target.type === 'tank') {
                targetName = "ТАНКА";
            } else if (bestTarget.target.type === 'shooter') {
                targetName = "СТРЕЛКА";
            } else if (bestTarget.target.type === 'fast') {
                targetName = "БЫСТРОГО врага";
            } else {
                targetName = "скопление врагов";
            }
            
            showNotification('strategic', `🎯 Цель: ${targetName}`);
            
            // Наносим удар через 1 секунду (время прицеливания)
            setTimeout(() => {
                executeStrategicStrike(strikeX, strikeY, weapon.level);
                
                // Скрываем цель
                setTimeout(() => {
                    showStrategicTarget = false;
                }, 500);
                
            }, 1000); // Задержка перед ударом
        }
    }
}

// Вычисление ценности босса как цели
function calculateBossScore(boss) {
    if (!boss) return 0;
    
    let score = 0;
    
    // 1. Босс всегда имеет высокий приоритет
    score += 5000;
    
    // 2. Приоритет боссу с низким здоровьем (добивание)
    const healthPercent = boss.health / boss.maxHealth;
    score += (1 - healthPercent) * 2000;
    
    // 3. Приоритет боссу близко к игроку
    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    score += Math.max(0, 300 - distance);
    
    // 4. Приоритет боссу в последней фазе
    if (boss.phase === 3) score += 1000;
    else if (boss.phase === 2) score += 500;
    
    return score;
}

// Поиск скопления врагов вокруг указанного врага
function findEnemyCluster(centerEnemy) {
    let totalX = centerEnemy.x;
    let totalY = centerEnemy.y;
    let count = 1;
    
    for (const enemy of enemies) {
        if (enemy === centerEnemy) continue;
        
        const dx = centerEnemy.x - enemy.x;
        const dy = centerEnemy.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) { // Враги в радиусе 120 пикселей
            totalX += enemy.x;
            totalY += enemy.y;
            count++;
        }
    }
    
    return {
        centerX: totalX / count,
        centerY: totalY / count,
        count: count
    };
}

// Выполнение стратегического удара
function executeStrategicStrike(x, y, weaponLevel) {
    const explosionRadius = 80 + weaponLevel * 15;
    const damage = roundNumber(player.damage * 3 * weaponLevel);
    let totalDamage = 0;
    let enemiesHit = 0;
    
    // Урон по врагам
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const dx = x - enemy.x;
        const dy = y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < explosionRadius) {
            const distanceFactor = 1 - (distance / explosionRadius);
            const actualDamage = roundNumber(damage * distanceFactor);
            enemy.health -= actualDamage;
            totalDamage += actualDamage;
            enemiesHit++;
            
            createParticles(enemy.x, enemy.y, 10, '#ff6600');
            
            if (enemy.health <= 0) {
                handleEnemyDeath(enemy, i);
            }
        }
    }
    
    // Урон по боссу
    if (bossActive && boss) {
        const dx = x - boss.x;
        const dy = y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < explosionRadius) {
            const distanceFactor = 1 - (distance / explosionRadius);
            const actualDamage = roundNumber(damage * distanceFactor * 0.7);
            totalDamage += actualDamage;
            
            if (boss.shieldActive && boss.shield > 0) {
                boss.shield -= actualDamage;
                showNotification('strategic', '💥 Удар по щиту босса!');
            } else {
                boss.health -= actualDamage;
                showNotification('strategic', '💥 Прямое попадание по боссу!');
            }
            createParticles(boss.x, boss.y, 20, '#ff6600');
        }
    }
    
    // Эффект взрыва
    createParticles(x, y, 50, '#ff6600', 'explosion');
    
    // Тряска экрана (сильнее при большем уроне)
    const shakeIntensity = Math.min(15, Math.floor(totalDamage / 50));
    startScreenShake(shakeIntensity, 20);
    
    // Уведомление о результатах
    if (enemiesHit > 0 || totalDamage > 0) {
        showNotification('strategic', `🎯 Удар нанес ${totalDamage} урона по ${enemiesHit} целям`);
        
        // Особые уведомления для эффективных ударов
        if (enemiesHit >= 3) {
            showNotification('strategic', '🔥 МНОЖЕСТВЕННОЕ ПОРАЖЕНИЕ!');
        }
        if (totalDamage > 500) {
            showNotification('strategic', '💥 МОЩНЫЙ УДАР!');
        }
    }
    
    if (soundEnabled) {
        // Играем звук в зависимости от эффективности
        playStrategicStrikeSound(enemiesHit, totalDamage);
    }
}

// Обновление отображения уровня игрока
function updatePlayerLevelDisplay() {
    const levelElement = document.getElementById('playerLevel');
    if (levelElement) {
        levelElement.textContent = `Ур. ${player.playerLevel}`;
    }
    
    updateExperienceBar();
}

// Обновление полоски опыта с анимацией
function updateExperienceBar() {
    const expPercent = (player.experience / player.experienceToNextLevel) * 100;
    const expBar = document.getElementById('playerExp');
    const expText = document.getElementById('playerExpText');
    
    expBar.style.width = expPercent + '%';
    expText.textContent = `${Math.floor(player.experience)}/${Math.floor(player.experienceToNextLevel)}`;
    
    // Анимация при повышении уровня
    if (player.experience >= player.experienceToNextLevel) {
        expBar.classList.add('level-up');
        setTimeout(() => {
            expBar.classList.remove('level-up');
        }, 500);
    }
}

// Применение эффектов босса к игроку
function applyBossEffect(bossType) {
    if (!bossActive || !boss) return;
    
    const now = Date.now();
    const effectDuration = 3000; // 3 секунды
    
    switch(bossType) {
        case 0: // Огненный босс - поджигает
            player.onFire = true;
            player.fireEndTime = now + effectDuration;
            showNotification('boss', 'Вы подожжены!');
            break;
        case 1: // Ледяной босс - замедляет движение
            player.movementSlowed = true;
            player.movementSlowEndTime = now + effectDuration;
            player.speed = player.baseSpeed * 0.5; // Уменьшаем скорость в 2 раза
            showNotification('boss', 'Вы замедлены!');
            break;
        case 2: // Ядовитый босс - замедляет атаку
            player.attackSlowed = true;
            player.attackSlowEndTime = now + effectDuration;
            player.fireRate = player.baseFireRate * 2; // Увеличиваем задержку между выстрелами в 2 раза
            showNotification('boss', 'Атака замедлена!');
            break;
    }
}

// Обновление эффектов боссов
function updateBossEffects() {
    const now = Date.now();
    
    // Обновление горения
    if (player.onFire) {
        if (now >= player.fireEndTime) {
            player.onFire = false;
            player.lastFireTick = 0;
        } else {
            // Урон от горения каждые 500мс
            if (!player.lastFireTick || now - player.lastFireTick >= 500) {
                player.health -= 2;
                startDamageBorderEffect(); // Красный эффект по краям
                player.lastFireTick = now;
                createParticles(player.x, player.y, 3, '#ff3300');
                
                if (player.health <= 0) {
                    player.health = 0;
                    lives--;
                    updateLives();
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
        }
    }
    
    // Обновление замедления движения
    if (player.movementSlowed) {
        if (now >= player.movementSlowEndTime) {
            player.movementSlowed = false;
            player.speed = player.baseSpeed; // Восстанавливаем нормальную скорость
        }
    }
    
    // Обновление замедления атаки
    if (player.attackSlowed) {
        if (now >= player.attackSlowEndTime) {
            player.attackSlowed = false;
            player.fireRate = player.baseFireRate; // Восстанавливаем нормальную скорость стрельбы
        }
    }
}

// Обновление щита с анимацией
function updateShield(deltaTime) {
    const now = Date.now();
    
    if (now - player.lastShieldRegen > 1000) {
        if (!shieldActive && player.shield < player.maxShield) {
            player.shield = Math.min(player.maxShield, 
                player.shield + player.maxShield * player.shieldRegen);
        }
        player.lastShieldRegen = now;
    }
    
    if (shieldActive) {
        const shieldDuration = 3000 + upgradeSystem.shield.level * 1000;
        if (now - player.shieldActiveTime > shieldDuration) {
            deactivateShield();
            shieldCooldown = true;
            player.shieldCooldownTime = now;
        }
        
        const shieldDrain = 0.3 * (deltaTime / 16.67);
        player.shield -= shieldDrain;
        if (player.shield < 0) {
            player.shield = 0;
            deactivateShield();
            shieldCooldown = true;
            player.shieldCooldownTime = now;
        }
    }
    
    if (shieldCooldown) {
        const cooldownTime = 5000;
        if (now - player.shieldCooldownTime > cooldownTime) {
            shieldCooldown = false;
        }
    }
    
    const shieldPercent = player.maxShield > 0 ? Math.round((player.shield / player.maxShield) * 100) : 0;
    const shieldElement = document.getElementById('shield');
    shieldElement.textContent = shieldPercent + '%';
    
    // Анимация при регенерации щита
    if (player.shield > 0 && player.lastShieldRegen > 0) {
        shieldElement.classList.add('recharging');
        setTimeout(() => {
            shieldElement.classList.remove('recharging');
        }, 500);
    }
}

// Показать уведомление (с лимитом для оптимизации памяти)
function showNotification(type, message) {
    // Удаляем старые уведомления, если их слишком много
    if (notifications.length >= MAX_NOTIFICATIONS) {
        notifications.shift();
    }
    
    const notification = {
        id: Date.now(),
        type: type,
        message: message,
        element: null
    };
    
    notifications.push(notification);
    
    // Создаем HTML элемент для уведомления
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    notificationElement.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.element = notificationElement;
    
    // Добавляем в контейнер
    const container = document.getElementById('notificationsContainer');
    container.appendChild(notificationElement);
    
    // Добавляем анимацию появления
    setTimeout(() => {
        notificationElement.classList.add('bounce');
    }, 100);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        notificationElement.classList.add('fade-out');
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
            
            // Удаляем из массива
            const index = notifications.indexOf(notification);
            if (index > -1) {
                notifications.splice(index, 1);
            }
        }, 500);
    }, 3000);
}

// Получение иконки для типа уведомления
function getNotificationIcon(type) {
    const icons = {
        wave: 'water',
        boss: 'skull',
        level: 'star',
        health: 'heart',
        damage: 'bolt',
        fireRate: 'tachometer-alt',
        movement: 'running',
        shield: 'shield-alt',
        split: 'code-branch',
        ricochet: 'reply-all',
        piercing: 'arrow-right',
        lifeSteal: 'tint',
        criticalChance: 'crosshairs',
        criticalMultiplier: 'bomb',
        bulletSpeed: 'bullseye',
        experienceGain: 'chart-line',
        refresh: 'sync',
        money: 'coins'
    };
    
    return icons[type] || 'info-circle';
}

// Обновить отображение уведомлений
function updateNotificationsDisplay() {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = '';
    
    const recentNotifications = notifications.slice(-5);
    
    for (const notification of recentNotifications) {
        if (notification.element && notification.element.parentNode) {
            container.appendChild(notification.element);
        }
    }
}

// Покупка улучшения
function buyUpgrade(type) {
    const upgrade = upgradeSystem[type];
    
    if (upgrade.level >= upgrade.maxLevel) {
        showNotification(type, "Максимальный уровень!");
        return;
    }
    
    if (money >= upgrade.cost) {
        money -= upgrade.cost;
        upgrade.level++;
        
        switch(type) {
            case 'damage':
                player.damage += 3;
                upgrade.description = `Урон +3 (${player.damage})`;
                break;
            case 'fireRate':
                player.baseFireRate = Math.max(150, player.baseFireRate * 0.92);
                if (!player.attackSlowed) {
                    player.fireRate = player.baseFireRate;
                }
                upgrade.description = `Скорострельность +8% (${roundNumber(player.baseFireRate)}мс)`;
                break;
            case 'health':
                player.maxHealth += 20;
                player.health = player.maxHealth;
                upgrade.description = `Здоровье +20 (${player.maxHealth})`;
                break;
            case 'movement':
                player.baseSpeed += 0.3;
                if (!player.movementSlowed) {
                    player.speed = player.baseSpeed;
                }
                upgrade.description = `Скорость +0.3 (${player.baseSpeed.toFixed(1)})`;
                break;
            case 'shield':
                player.maxShield += 15;
                player.shield = player.maxShield;
                upgrade.description = `Щит +15% (${player.maxShield}%)`;
                break;
            case 'split':
                player.splitLevel = Math.min(3, player.splitLevel + 1);
                upgrade.description = `Разделение x${player.splitLevel}`;
                break;
            case 'ricochet':
                player.ricochetLevel = Math.min(5, player.ricochetLevel + 1);
                upgrade.description = `Рикошет ${player.ricochetLevel}`;
                break;
            case 'piercing':
                player.piercingLevel = Math.min(5, player.piercingLevel + 1);
                upgrade.description = `Пробивание ${player.piercingLevel}`;
                break;
            case 'lifeSteal':
                player.lifeSteal += 1;
                upgrade.description = `Кража жизни +1% (${player.lifeSteal}%)`;
                break;
            case 'criticalChance':
                player.criticalChance += 5;
                upgrade.description = `Шанс крита +5% (${player.criticalChance}%)`;
                break;
            case 'criticalMultiplier':
                player.criticalMultiplier += 0.5;
                upgrade.description = `Множитель крита +0.5 (${player.criticalMultiplier.toFixed(1)}x)`;
                break;
            case 'bulletSpeed':
                player.bulletSpeed *= 1.05;
                upgrade.description = `Скорость пуль +5% (${player.bulletSpeed.toFixed(1)})`;
                break;
            case 'experienceGain':
                upgrade.description = `Опыт +20% (${upgrade.level * 20}%)`;
                break;
        }
        
        upgrade.cost = roundNumber(upgrade.cost * 1.4);
        
        updateMoney();
        updateUpgradeDisplay(type);
        
        showNotification(type, upgrade.description);
        
        if (soundEnabled) playUpgradeSound();
    } else {
        showNotification(type, "Недостаточно денег!");
    }
}

// Обновление отображения улучшения
function updateUpgradeDisplay(type) {
    const upgrade = upgradeSystem[type];
    const upgradeElement = document.getElementById(`upgrade${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (upgradeElement) {
        const levelValue = upgradeElement.querySelector('.level-value');
        const upgradeCost = upgradeElement.querySelector('.upgrade-cost');
        const upgradeBtn = upgradeElement.querySelector('.upgrade-btn');
        
        levelValue.textContent = upgrade.level;
        upgradeCost.textContent = `Стоимость: ${upgrade.cost}`;
        
        if (upgrade.level === 0) {
            upgradeBtn.textContent = 'Купить';
        } else if (upgrade.level >= upgrade.maxLevel) {
            upgradeBtn.textContent = 'Макс. уровень';
            upgradeBtn.disabled = true;
        } else {
            upgradeBtn.textContent = 'Улучшить';
            upgradeBtn.disabled = false;
        }
    }
}

// Запуск таймера волн
function startWaveTimer() {
    clearInterval(waveInterval);
    
    waveInterval = setInterval(() => {
        // Не запускаем новую волну, если босс активен или игра на паузе
        if (bossActive || gamePaused) return;
        
        waveTimer--;
        updateWaveDisplay();
        
        if (waveTimer <= 0) {
            startWave();
        }
    }, 1000);
}

// Обновление отображения волны
function updateWaveDisplay() {
    const timerElement = document.getElementById('waveTimer');
    const progressElement = document.getElementById('waveProgress');
    const skipBtn = document.getElementById('skipWaveBtn');
    
    if (timerElement) {
        timerElement.textContent = Math.max(0, waveTimer);
    }
    
    if (progressElement) {
        const progress = ((waveMaxTimer - waveTimer) / waveMaxTimer) * 100;
        progressElement.style.width = `${progress}%`;
    }
    
    // Управление кнопкой пропуска
    if (skipBtn) {
        skipBtn.disabled = bossActive || gamePaused || waveTimer <= 0;
        
        // Добавляем пульсацию если доступно
        if (!bossActive && !gamePaused && waveTimer > 3) {
            skipBtn.classList.add('pulse');
        } else {
            skipBtn.classList.remove('pulse');
        }
    }
}

// Пропуск таймера волны
function skipWaveTimer() {
    if (bossActive || gamePaused || waveTimer <= 0) return;
    
    waveTimer = 0;
    updateWaveDisplay();
    
    showNotification('wave', 'Волна начата досрочно!');
    
    // Небольшая тряска экрана для эффекта
    startScreenShake(2, 5);
}

// Начало волны врагов
function startWave() {
    const currentWave = wave + 1; // Следующая волна
    wave = currentWave;
    document.getElementById('wave').textContent = wave;
    
    // НЕ очищаем врагов никогда - они остаются всегда
    
    if (currentWave % 10 === 0) {
        // Волна босса - добавляем босса к существующим врагам
        createBoss();
        waveMaxTimer = 30;
        document.getElementById('wave').textContent = `Босс ${currentWave/10}`;
    } else {
        // Обычная волна - добавляем новых врагов к существующим
        const enemyCount = 4 + Math.floor(currentWave * 1.5);
        createEnemies(enemyCount);
        waveMaxTimer = 12 + Math.floor(currentWave / 3);
    }
    
    // Сбрасываем таймер и отображение
    waveTimer = waveMaxTimer;
    updateWaveDisplay();
    
    if (currentWave % 10 !== 0) {
        showNotification('wave', `Волна ${currentWave}!`);
        
        // Анимация для заголовка волны
        const waveTitleElement = document.querySelector('.wave-info h3');
        if (waveTitleElement) {
            waveTitleElement.classList.remove('new-wave');
            void waveTitleElement.offsetWidth; // Trigger reflow
            waveTitleElement.classList.add('new-wave');
            
            setTimeout(() => {
                waveTitleElement.classList.remove('new-wave');
            }, 500);
        }
    }
}

// Обновление валюты с анимацией
function updateMoney() {
    const moneyElement = document.getElementById('money');
    moneyElement.textContent = money;
    
    // Добавляем анимацию при получении денег
    moneyElement.classList.remove('pulse');
    void moneyElement.offsetWidth; // Trigger reflow
    moneyElement.classList.add('pulse');
    
    setTimeout(() => {
        moneyElement.classList.remove('pulse');
    }, 1000);
}

// Обновление рекордных очков
function updateScore() {
    // Очки отображаются в overlay при gameOver
}

// Обновление жизней с анимацией
function updateLives() {
    const livesElement = document.getElementById('lives');
    livesElement.textContent = lives;
    
    // Добавляем предупреждение при низком здоровье
    if (lives <= 2) {
        livesElement.classList.add('health-warning');
    } else {
        livesElement.classList.remove('health-warning');
    }
}

// Игровой цикл
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    accumulator += deltaTime;
    
    // Сначала очищаем canvas с запасом для компенсации тряски
    const shakeMargin = 50; // Запас в 50 пикселей
    ctx.clearRect(-shakeMargin, -shakeMargin, canvas.width + shakeMargin * 2, canvas.height + shakeMargin * 2);
    
    // Полная заливка черным фоном для гарантированной очистки
    ctx.fillStyle = '#000011';
    ctx.fillRect(-shakeMargin, -shakeMargin, canvas.width + shakeMargin * 2, canvas.height + shakeMargin * 2);
    
    // Сбрасываем состояние canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.restore();
    
    // Обновляем тряску экрана
    updateScreenShake();
    applyScreenShakeToContainer();
    
    // Обновляем эффект красной рамки
    updateDamageBorderEffect(deltaTime);
    
    drawBackground();
    
    if (gameActive) {
        while (accumulator >= FIXED_TIMESTEP) {
            updateGame(FIXED_TIMESTEP);
            accumulator -= FIXED_TIMESTEP;
        }
        
        drawPlayer();
        drawBullets();
        drawEnemyBullets();
        drawEnemies();
        drawBoss();
        drawBossProjectiles();
        drawHealthCores();
        drawWeapons();
        drawParticles();
        drawUI();
        
        // Рисуем цель стратегического удара
        if (showStrategicTarget) {
            drawStrategicTarget();
        }
    } else {
        drawStars();
    }
    
    requestAnimationFrame(gameLoop);
}

// Рисование цели стратегического удара
function drawStrategicTarget() {
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 5) * 5 + 10;
    
    // Внешнее кольцо
    ctx.strokeStyle = '#ff3300';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(strategicTargetX, strategicTargetY, 30 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    
    // Внутренний круг
    ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(strategicTargetX, strategicTargetY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Перекрестие
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    // Горизонтальная линия
    ctx.beginPath();
    ctx.moveTo(strategicTargetX - 25, strategicTargetY);
    ctx.lineTo(strategicTargetX + 25, strategicTargetY);
    ctx.stroke();
    
    // Вертикальная линия
    ctx.beginPath();
    ctx.moveTo(strategicTargetX, strategicTargetY - 25);
    ctx.lineTo(strategicTargetX, strategicTargetY + 25);
    ctx.stroke();
    
    // Блики
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + time * 2;
        const distance = 35;
        const blinkX = strategicTargetX + Math.cos(angle) * distance;
        const blinkY = strategicTargetY + Math.sin(angle) * distance;
        const blinkSize = Math.sin(time * 10 + i) * 2 + 3;
        
        ctx.beginPath();
        ctx.arc(blinkX, blinkY, blinkSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Улучшенное рисование фона
function drawBackground() {
    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000011');
    gradient.addColorStop(0.3, '#000033');
    gradient.addColorStop(0.7, '#000022');
    gradient.addColorStop(1, '#000011');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Добавляем туманность
    ctx.fillStyle = 'rgba(20, 20, 60, 0.1)';
    for (let i = 0; i < 3; i++) {
        const x = (gameTime * 0.01 * (i + 1)) % (canvas.width + 200) - 100;
        const y = canvas.height * 0.3 + Math.sin(gameTime * 0.001 + i) * 50;
        
        ctx.beginPath();
        ctx.arc(x, y, 100 + i * 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawStars();
    
    // Сброс состояния после отрисовки фона
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

// Улучшенное рисование звезд
function drawStars() {
    const time = gameTime * 0.01;
    
    for (const star of stars) {
        // Движение звезд
        star.x -= star.speed;
        if (star.x < -10) {
            star.x = canvas.width + 10;
            star.y = Math.random() * canvas.height;
        }
        
        // Мерцание звезд
        const twinkle = Math.sin(time * star.brightness * 2) * 0.3 + 0.7;
        const brightness = star.brightness * twinkle;
        
        // Рисование звезды с свечением
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = star.size * 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Добавляем след для быстрых звезд
        if (star.speed > 0.2) {
            const trailLength = star.speed * 20;
            const gradient = ctx.createLinearGradient(
                star.x + trailLength, star.y,
                star.x, star.y
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${brightness * 0.5})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.size;
            ctx.beginPath();
            ctx.moveTo(star.x + trailLength, star.y);
            ctx.lineTo(star.x, star.y);
            ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
    }
}

// Рисование игрока
function drawPlayer() {
    // Визуальный эффект горения
    if (player.onFire) {
        const firePulse = Math.sin(gameTime * 0.2) * 2;
        ctx.strokeStyle = '#ff3300';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 5 + firePulse, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8 + firePulse, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Визуальный эффект замедления движения
    if (player.movementSlowed) {
        ctx.strokeStyle = '#0099ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 3, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Визуальный эффект замедления атаки
    if (player.attackSlowed) {
        ctx.strokeStyle = '#33ff33';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Визуальный эффект неуязвимости
    if (invulnerable) {
        const invulnerablePulse = Math.sin(gameTime * 0.3) * 3;
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8 + invulnerablePulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Желтое свечение вокруг игрока
        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 12 + invulnerablePulse, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (shieldActive && player.shield > 0) {
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        const pulse = Math.sin(gameTime * 0.08) * 1.5;
        ctx.strokeStyle = `rgba(79, 195, 247, ${0.3 + Math.abs(Math.sin(gameTime * 0.04)) * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8 + pulse, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    let targetX = player.mouseX;
    let targetY = player.mouseY;
    
    if (enemies.length > 0) {
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = dx * dx + dy * dy;
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        
        if (closestEnemy) {
            targetX = closestEnemy.x;
            targetY = closestEnemy.y;
        }
    }
    
    const angle = Math.atan2(targetY - player.y, targetX - player.x);
    const pointerLength = player.radius + 6;
    const pointerX = player.x + Math.cos(angle) * pointerLength;
    const pointerY = player.y + Math.sin(angle) * pointerLength;
    
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(pointerX, pointerY);
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    const healthBarWidth = 40;
    const healthBarHeight = 5;
    const healthPercent = player.health / player.maxHealth;
    
    ctx.fillStyle = '#330000';
    ctx.fillRect(player.x - healthBarWidth/2, player.y - player.radius - 15, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(player.x - healthBarWidth/2, player.y - player.radius - 15, healthBarWidth * healthPercent, healthBarHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(player.x - healthBarWidth/2, player.y - player.radius - 15, healthBarWidth, healthBarHeight);
    
    if (player.maxShield > 0) {
        const shieldBarWidth = 40;
        const shieldBarHeight = 4;
        const shieldPercent = player.shield / player.maxShield;
        
        ctx.fillStyle = '#003333';
        ctx.fillRect(player.x - shieldBarWidth/2, player.y - player.radius - 20, shieldBarWidth, shieldBarHeight);
        
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(player.x - shieldBarWidth/2, player.y - player.radius - 20, shieldBarWidth * shieldPercent, shieldBarHeight);
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(player.x - shieldBarWidth/2, player.y - player.radius - 20, shieldBarWidth, shieldBarHeight);
    }
}

// Улучшенное рисование босса
function drawBoss() {
    if (!bossActive || !boss) return;
    
    const time = Date.now() / 1000;
    const pulseScale = 1 + Math.sin(time * 3) * 0.05;
    
    // Рисование щита с анимацией
    if (boss.shieldActive && boss.shield > 0) {
        const shieldPercent = boss.shield / boss.maxShield;
        const shieldRadius = (boss.radius + 15) * pulseScale;
        
        // Внешний щит с пульсацией
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, shieldRadius, 0, Math.PI * 2 * shieldPercent);
        ctx.stroke();
        
        // Внутренний щит
        ctx.strokeStyle = `rgba(79, 195, 247, 0.3)`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, shieldRadius - 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Энергетические частицы на щите
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i + time;
            const particleX = boss.x + Math.cos(angle) * shieldRadius;
            const particleY = boss.y + Math.sin(angle) * shieldRadius;
            
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    }
    
    // Основное тело босса с градиентом
    const gradient = ctx.createRadialGradient(boss.x, boss.y, 0, boss.x, boss.y, boss.radius);
    gradient.addColorStop(0, boss.color);
    gradient.addColorStop(0.7, boss.color);
    gradient.addColorStop(1, shadeColor(boss.color, -30));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.radius * pulseScale, 0, Math.PI * 2);
    ctx.fill();
    
    // Добавление деталей в зависимости от типа босса
    drawBossDetails(boss);
    
    // Обводка
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Улучшенная полоска здоровья
    const healthBarWidth = 80;
    const healthBarHeight = 8;
    const healthPercent = boss.health / boss.maxHealth;
    
    // Фон полоски здоровья
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 20, healthBarWidth, healthBarHeight);
    
    // Полоска здоровья с градиентом
    const healthGradient = ctx.createLinearGradient(
        boss.x - healthBarWidth/2, 0, 
        boss.x + healthBarWidth/2, 0
    );
    
    if (healthPercent > 0.5) {
        healthGradient.addColorStop(0, '#00ff00');
        healthGradient.addColorStop(1, '#00cc00');
    } else if (healthPercent > 0.25) {
        healthGradient.addColorStop(0, '#ffff00');
        healthGradient.addColorStop(1, '#ff9900');
    } else {
        healthGradient.addColorStop(0, '#ff0000');
        healthGradient.addColorStop(1, '#cc0000');
    }
    
    ctx.fillStyle = healthGradient;
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 20, healthBarWidth * healthPercent, healthBarHeight);
    
    // Обводка полоски здоровья
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 20, healthBarWidth, healthBarHeight);
    
    // Имя босса с анимацией
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = boss.color;
    ctx.shadowBlur = 10;
    ctx.fillText(boss.name, boss.x, boss.y - boss.radius - 30);
    ctx.shadowBlur = 0;
}

// Рисование деталей босса в зависимости от типа
function drawBossDetails(boss) {
    const time = Date.now() / 1000;
    
    switch(boss.type) {
        case 0: // Огненный босс
            // Огненные языки пламени
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 / 6) * i + time * 2;
                const flameLength = boss.radius * 0.3;
                const flameX = boss.x + Math.cos(angle) * (boss.radius - 5);
                const flameY = boss.y + Math.sin(angle) * (boss.radius - 5);
                
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                ctx.moveTo(flameX, flameY);
                ctx.lineTo(
                    flameX + Math.cos(angle) * flameLength,
                    flameY + Math.sin(angle) * flameLength
                );
                ctx.lineTo(
                    flameX + Math.cos(angle + 0.2) * flameLength * 0.7,
                    flameY + Math.sin(angle + 0.2) * flameLength * 0.7
                );
                ctx.closePath();
                ctx.fill();
            }
            break;
            
        case 1: // Ледяной босс
            // Ледяные кристаллы
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const crystalX = boss.x + Math.cos(angle) * (boss.radius * 0.7);
                const crystalY = boss.y + Math.sin(angle) * (boss.radius * 0.7);
                
                ctx.fillStyle = '#00ccff';
                ctx.beginPath();
                ctx.moveTo(crystalX, crystalY);
                for (let j = 0; j < 6; j++) {
                    const spikeAngle = (Math.PI * 2 / 6) * j;
                    const spikeLength = 5;
                    ctx.lineTo(
                        crystalX + Math.cos(spikeAngle) * spikeLength,
                        crystalY + Math.sin(spikeAngle) * spikeLength
                    );
                }
                ctx.closePath();
                ctx.fill();
            }
            break;
            
        case 2: // Токсичный босс
            // Токсичные пузыри
            for (let i = 0; i < 5; i++) {
                const bubbleAngle = time + (Math.PI * 2 / 5) * i;
                const bubbleDistance = boss.radius * 0.8;
                const bubbleX = boss.x + Math.cos(bubbleAngle) * bubbleDistance;
                const bubbleY = boss.y + Math.sin(bubbleAngle) * bubbleDistance;
                const bubbleSize = 3 + Math.sin(time * 3 + i) * 2;
                
                ctx.fillStyle = 'rgba(51, 255, 51, 0.7)';
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
    }
    
    // Глаза босса, которые следят за игроком
    const eyeAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    const eyeDistance = boss.radius * 0.5;
    
    // Левый глаз
    const leftEyeX = boss.x + Math.cos(eyeAngle - 0.3) * eyeDistance;
    const leftEyeY = boss.y + Math.sin(eyeAngle - 0.3) * eyeDistance;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Правый глаз
    const rightEyeX = boss.x + Math.cos(eyeAngle + 0.3) * eyeDistance;
    const rightEyeY = boss.y + Math.sin(eyeAngle + 0.3) * eyeDistance;
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, 2, 0, Math.PI * 2);
    ctx.fill();
}

// Вспомогательная функция для затемнения цвета
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// Улучшенное рисование снарядов босса
function drawBossProjectiles() {
    const time = Date.now() / 1000;
    
    for (const projectile of bossProjectiles) {
        // Основа снаряда
        const gradient = ctx.createRadialGradient(
            projectile.x, projectile.y, 0,
            projectile.x, projectile.y, projectile.radius
        );
        
        // Градиент в зависимости от типа
        switch(projectile.type) {
            case 'fire':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#ff6600');
                gradient.addColorStop(1, '#ff3300');
                break;
            case 'ice':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#00ccff');
                gradient.addColorStop(1, '#0099ff');
                break;
            case 'poison':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#66ff66');
                gradient.addColorStop(1, '#33ff33');
                break;
            default:
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.7, projectile.color);
                gradient.addColorStop(1, projectile.color);
        }
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = projectile.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Дополнительные эффекты
        switch(projectile.type) {
            case 'fire':
                // Огненный след
                for (let i = 0; i < 3; i++) {
                    const trailX = projectile.x - Math.cos(projectile.angle) * (i * 5);
                    const trailY = projectile.y - Math.sin(projectile.angle) * (i * 5);
                    const trailSize = projectile.radius * (1 - i * 0.3);
                    const trailAlpha = 0.5 - i * 0.15;
                    
                    ctx.fillStyle = `rgba(255, 102, 0, ${trailAlpha})`;
                    ctx.beginPath();
                    ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Искры
                for (let i = 0; i < 2; i++) {
                    const sparkAngle = projectile.angle + (Math.random() - 0.5) * 0.5;
                    const sparkDistance = projectile.radius + Math.random() * 3;
                    const sparkX = projectile.x + Math.cos(sparkAngle) * sparkDistance;
                    const sparkY = projectile.y + Math.sin(sparkAngle) * sparkDistance;
                    
                    ctx.fillStyle = '#ffcc00';
                    ctx.beginPath();
                    ctx.arc(sparkX, sparkY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'ice':
                // Ледяные осколки
                for (let i = 0; i < 4; i++) {
                    const shardAngle = (Math.PI * 2 / 4) * i + time * 2;
                    const shardDistance = projectile.radius + 2;
                    const shardX = projectile.x + Math.cos(shardAngle) * shardDistance;
                    const shardY = projectile.y + Math.sin(shardAngle) * shardDistance;
                    
                    ctx.fillStyle = '#00ccff';
                    ctx.beginPath();
                    ctx.moveTo(shardX, shardY);
                    for (let j = 0; j < 4; j++) {
                        const angle = (Math.PI * 2 / 4) * j;
                        const length = 2;
                        ctx.lineTo(
                            shardX + Math.cos(angle) * length,
                            shardY + Math.sin(angle) * length
                        );
                    }
                    ctx.closePath();
                    ctx.fill();
                }
                break;
                
            case 'poison':
                // Токсичные частицы
                for (let i = 0; i < 3; i++) {
                    const particleAngle = time * 3 + (Math.PI * 2 / 3) * i;
                    const particleDistance = projectile.radius + Math.sin(time * 2 + i) * 2;
                    const particleX = projectile.x + Math.cos(particleAngle) * particleDistance;
                    const particleY = projectile.y + Math.sin(particleAngle) * particleDistance;
                    const particleSize = 1 + Math.sin(time * 4 + i) * 0.5;
                    
                    ctx.fillStyle = 'rgba(51, 255, 51, 0.7)';
                    ctx.beginPath();
                    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        ctx.shadowBlur = 0;
    }
}

// Рисование пуль
function drawBullets() {
    for (const bullet of bullets) {
        let glowColor = bullet.color;
        let glowSize = 8;
        
        if (bullet.isCritical) {
            glowColor = '#ff0000';
            glowSize = 15;
        } else if (bullet.splitLevel > 0) {
            glowColor = '#ff9900';
            glowSize = 6;
        } else if (bullet.ricochetCount > 0) {
            glowColor = '#ff00aa';
            glowSize = 10;
        } else if (bullet.piercingCount > 0) {
            glowColor = '#00ffff';
            glowSize = 10;
        }
        
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowSize;
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Рисование пуль врагов
function drawEnemyBullets() {
    for (const bullet of enemyBullets) {
        if (bullet.isReflected) {
            // Отраженные снаряды с желтым свечением
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
        } else {
            // Обычные вражеские снаряды
            ctx.shadowColor = bullet.color;
            ctx.shadowBlur = 5;
            ctx.fillStyle = bullet.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
        }
        
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// Рисование врагов
function drawEnemies() {
    for (const enemy of enemies) {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        const healthBarWidth = 30;
        const healthBarHeight = 4;
        const healthPercent = enemy.health / enemy.maxHealth;
        
        ctx.fillStyle = '#330000';
        ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - enemy.radius - 8, healthBarWidth, healthBarHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - enemy.radius - 8, healthBarWidth * healthPercent, healthBarHeight);
        
        const eyeRadius = enemy.radius * 0.3;
        const eyeOffset = enemy.radius * 0.5;
        const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        
        const leftEyeX = enemy.x + Math.cos(angleToPlayer + Math.PI/6) * eyeOffset;
        const leftEyeY = enemy.y + Math.sin(angleToPlayer + Math.PI/6) * eyeOffset;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        const rightEyeX = enemy.x + Math.cos(angleToPlayer - Math.PI/6) * eyeOffset;
        const rightEyeY = enemy.y + Math.sin(angleToPlayer - Math.PI/6) * eyeOffset;
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (enemy.type === 'fast') {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 0.7);
            ctx.stroke();
        } else if (enemy.type === 'tank') {
            ctx.strokeStyle = '#ff9900';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        } else if (enemy.type === 'shooter') {
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = '#ff00ff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚡', enemy.x, enemy.y + 4);
        }
    }
}

// Рисование ядер здоровья
function drawHealthCores() {
    for (const core of healthCores) {
        const pulseSize = 1 + Math.sin(core.pulse) * 0.3;
        const currentRadius = core.radius * pulseSize;
        
        // Внешнее свечение
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#00ff00';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(core.x, core.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Внутренний круг
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(core.x, core.y, currentRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Центральная точка
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(core.x, core.y, currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Символ сердца
        ctx.fillStyle = '#ff0000';
        ctx.font = `${currentRadius * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', core.x, core.y);
    }
}

// Рисование дополнительного оружия
function drawWeapons() {
    for (const weapon of activeWeapons) {
        switch(weapon.type) {
            case 'orbitalShields':
                drawOrbitalShields();
                break;
            case 'companionDrones':
                drawCompanionDrones();
                break;
            case 'laserBeams':
                drawLaserBeams();
                break;
            case 'chainLightning':
                drawChainLightning();
                break;
            case 'damageWaves':
                drawDamageWaves();
                break;
            case 'meteors':
                drawMeteors();
                break;
            case 'fireBalls':
                drawFireBalls();
                break;
            case 'iceSpikes':
                drawIceSpikes();
                break;
            case 'homingMissiles':
                drawHomingMissiles();
                break;
            // Новые оружия:
            case 'magneticMines':
                drawMagneticMines();
                break;
            case 'lightSabers':
                drawLightSabers();
                break;
            case 'toxicClouds':
                drawToxicClouds();
                break;
            case 'sniperLasers':
                drawSniperLasers();
                break;
            case 'veilOfStars':
                drawVeilOfStars();
                break;
            case 'electricTraps':
                drawElectricTraps();
                break;
            case 'vortexTornadoes':
                drawVortexTornadoes();
                break;
            case 'crystalSpikes':
                drawCrystalSpikes();
                break;
            case 'plasmaBalls':
                drawPlasmaBalls();
                break;
        }
    }
    // Добавляем отрисовку снарядов босса
    drawBossProjectiles();
}

// Рисование орбитальных щитов
function drawOrbitalShields() {
    for (const shield of orbitalShields) {
        const shieldX = player.x + Math.cos(shield.angle) * shield.distance;
        const shieldY = player.y + Math.sin(shield.angle) * shield.distance;
        
        // Пропускаем сломанные щиты
        if (shield.broken) continue;
        
        // Цвет зависит от количества оставшихся ударов
        let shieldColor, alpha;
        if (shield.currentHits === shield.maxHits) {
            shieldColor = '#4fc3f7'; // Полный щит - голубой
            alpha = 0.8;
        } else if (shield.currentHits === 1 && shield.maxHits === 2) {
            shieldColor = '#ffaa00'; // Поврежденный щит - оранжевый
            alpha = 0.6;
        } else {
            shieldColor = '#ff4444'; // Критически поврежденный - красный
            alpha = 0.4;
        }
        
        ctx.shadowColor = shieldColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = shieldColor;
        ctx.globalAlpha = alpha;
        
        // Рисуем щит как сегмент круга (дуга)
        ctx.beginPath();
        const arcStart = shield.angle - 0.45; // Фиксированная ширина сегмента без наложения
        const arcEnd = shield.angle + 0.45;
        ctx.arc(shieldX, shieldY, shield.radius, arcStart, arcEnd);
        ctx.arc(shieldX, shieldY, shield.radius * 0.6, arcEnd, arcStart, true);
        ctx.closePath();
        ctx.fill();
        
        // Внутренняя обводка для эффекта сегмента
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha * 0.8;
        ctx.stroke();
        
        // Индикатор отражения на 10 уровне
        if (shield.hasReflection) {
            ctx.fillStyle = '#ffff00';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(shieldX, shieldY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// Рисование дронов-помощников
function drawCompanionDrones() {
    for (const drone of companionDrones) {
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(drone.x, drone.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Детали дрона
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(drone.x, drone.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Рисование волн урона
function drawDamageWaves() {
    for (const wave of damageWaves) {
        if (typeof wave === 'object' && wave.radius !== undefined) {
            ctx.strokeStyle = '#0099ff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1 - (wave.radius / wave.maxRadius);
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
}

// Рисование метеоритов
function drawMeteors() {
    for (const meteor of meteors) {
        if (typeof meteor === 'object' && meteor.targetX !== undefined) {
            ctx.shadowColor = '#ff6600';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Хвост метеорита
            const tailLength = 20;
            const tailAngle = Math.atan2(meteor.targetY - meteor.y, meteor.targetX - meteor.x) + Math.PI;
            ctx.strokeStyle = '#ff9900';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(
                meteor.x + Math.cos(tailAngle) * tailLength,
                meteor.y + Math.sin(tailAngle) * tailLength
            );
            ctx.stroke();
        }
    }
}

// Рисование огненных шаров
function drawFireBalls() {
    for (const ball of fireBalls) {
        const ballX = player.x + Math.cos(ball.angle + ball.trailAngle) * ball.distance;
        const ballY = player.y + Math.sin(ball.angle + ball.trailAngle) * ball.distance;
        
        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff3300';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Рисование ледяных шипов
function drawIceSpikes() {
    const now = Date.now();
    
    // Рисуем основные шипы как летящие снаряды-шипы
    for (const spike of iceSpikes.activeSpikes) {
        const age = now - spike.startTime;
        const alpha = Math.max(0, 1 - (age / 5000)); // Угасание за 5 секунд
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.9;
        
        // Рисуем шип как треугольную форму
        ctx.translate(spike.x, spike.y);
        ctx.rotate(spike.angle);
        
        // Основной шип (треугольник)
        ctx.fillStyle = '#00ccff';
        ctx.strokeStyle = '#0099ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ccff';
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        ctx.moveTo(spike.length / 2, 0); // Кончик шипа
        ctx.lineTo(-spike.length / 2, -spike.width / 2); // Левая сторона
        ctx.lineTo(-spike.length / 4, 0); // Центр задней части
        ctx.lineTo(-spike.length / 2, spike.width / 2); // Правая сторона
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Ледяной блеск на кончике
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(spike.length / 2, 0);
        ctx.lineTo(spike.length / 3, -spike.width / 4);
        ctx.lineTo(spike.length / 3, spike.width / 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Рисуем маленькие шипики
    for (const spike of iceSpikes.secondarySpikes) {
        const age = now - spike.startTime;
        const alpha = Math.max(0, 1 - (age / 3000)); // Угасание за 3 секунды
        
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        
        // Маленький шип как миниатюрный треугольник
        const angle = Math.atan2(spike.vy, spike.vx);
        ctx.translate(spike.x, spike.y);
        ctx.rotate(angle);
        
        ctx.fillStyle = '#99ccff';
        ctx.strokeStyle = '#6699ff';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#99ccff';
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(spike.length / 2, 0);
        ctx.lineTo(-spike.length / 2, -spike.width / 2);
        ctx.lineTo(-spike.length / 4, 0);
        ctx.lineTo(-spike.length / 2, spike.width / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Маленький блеск
        ctx.fillStyle = '#ccddff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(spike.length / 3, 0, spike.width / 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Рисование лазерных лучей
function drawLaserBeams() {
    for (const laser of activeLasers) {
        const age = Date.now() - laser.startTime;
        const alpha = 1 - (age / 300); // Угасание за 300мс
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4;
        ctx.globalAlpha = alpha * 0.9;
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.endX, laser.endY);
        ctx.stroke();
        
        // Внутренняя яркая линия
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.endX, laser.endY);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
    }
}

// Рисование молний
function drawChainLightning() {
    for (const lightning of activeLightning) {
        const age = Date.now() - lightning.startTime;
        const alpha = 1 - (age / 200); // Угасание за 200мс
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.globalAlpha = alpha * 0.9;
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
        
        // Рисуем цепь молний
        for (let i = 0; i < lightning.chain.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(lightning.chain[i].x, lightning.chain[i].y);
            ctx.lineTo(lightning.chain[i + 1].x, lightning.chain[i + 1].y);
            ctx.stroke();
        }
        
        // Яркая внутренняя линия
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 0;
        for (let i = 0; i < lightning.chain.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(lightning.chain[i].x, lightning.chain[i].y);
            ctx.lineTo(lightning.chain[i + 1].x, lightning.chain[i + 1].y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
}

// Рисование снарядов с наведением
function drawHomingMissiles() {
    for (const missile of homingMissiles) {
        if (typeof missile === 'object' && missile.target !== undefined) {
            ctx.shadowColor = '#ff9900';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ff9900';
            ctx.beginPath();
            ctx.arc(missile.x, missile.y, missile.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Хвост
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(missile.x, missile.y);
            ctx.lineTo(
                missile.x - Math.cos(missile.angle) * 10,
                missile.y - Math.sin(missile.angle) * 10
            );
            ctx.stroke();
        }
    }
}

// НОВЫЕ ФУНКЦИИ ДЛЯ РИСОВАНИЯ ОРУЖИЙ

// Рисование магнитных мин
function drawMagneticMines() {
    for (const mine of magneticMines) {
        const alpha = mine.life / mine.maxLife;
        const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
        
        // Внешнее кольцо
        ctx.strokeStyle = `rgba(255, 0, 255, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, mine.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        // Внутренний круг
        ctx.fillStyle = `rgba(255, 0, 255, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(mine.x, mine.y, mine.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Магнитные линии
        for (let i = 0; i < 3; i++) {
            const angle = (Date.now() / 1000) + (Math.PI * 2 / 3) * i;
            const startX = mine.x + Math.cos(angle) * mine.radius * 0.3;
            const startY = mine.y + Math.sin(angle) * mine.radius * 0.3;
            const endX = mine.x + Math.cos(angle) * mine.radius * 0.9;
            const endY = mine.y + Math.sin(angle) * mine.radius * 0.9;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

// Рисование световых клинков
function drawLightSabers() {
    for (const saber of lightSabers) {
        const startX = player.x + Math.cos(saber.angle) * saber.distance;
        const startY = player.y + Math.sin(saber.angle) * saber.distance;
        const endX = startX + Math.cos(saber.angle) * saber.length;
        const endY = startY + Math.sin(saber.angle) * saber.length;
        
        // Ядро клинка
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Внешнее свечение
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Рукоять
        ctx.fillStyle = '#444444';
        ctx.beginPath();
        ctx.arc(startX, startY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Рисование токсичных облаков
function drawToxicClouds() {
    for (const cloud of toxicClouds) {
        const alpha = cloud.life / cloud.maxLife;
        
        // Внешнее облако
        ctx.fillStyle = `rgba(51, 255, 51, ${alpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Внутреннее облако
        ctx.fillStyle = `rgba(51, 255, 51, ${alpha * 0.1})`;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Частицы в облаке
        for (let i = 0; i < 5; i++) {
            const angle = (Date.now() / 1000) + (Math.PI * 2 / 5) * i;
            const distance = Math.sin(Date.now() / 500 + i) * cloud.radius * 0.5;
            const particleX = cloud.x + Math.cos(angle) * distance;
            const particleY = cloud.y + Math.sin(angle) * distance;
            const size = 2 + Math.sin(Date.now() / 300 + i) * 1;
            
            ctx.fillStyle = `rgba(51, 255, 51, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Рисование снайперских лазеров
function drawSniperLasers() {
    if (sniperLasers.activeTarget) {
        const chargeTime = Date.now() - sniperLasers.lastShot;
        const chargePercent = Math.min(chargeTime / 500, 1);
        
        // Линия прицеливания
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + chargePercent * 0.4})`;
        ctx.lineWidth = 1 + chargePercent * 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(sniperLasers.activeTarget.x, sniperLasers.activeTarget.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Прицел на цели
        const pulse = Math.sin(Date.now() / 100) * 5 + 10;
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sniperLasers.activeTarget.x, sniperLasers.activeTarget.y, 10 + pulse * chargePercent, 0, Math.PI * 2);
        ctx.stroke();
        
        // Заряжающийся круг
        if (chargePercent < 1) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(player.x, player.y, 20 + chargePercent * 30, 0, Math.PI * 2 * chargePercent);
            ctx.stroke();
        }
    }
}

// Рисование Вуали звёзд
function drawVeilOfStars() {
    if (!veilOfStars.active) return;
    
    const now = Date.now();
    const timeLeft = Math.max(0, veilOfStars.endTime - now);
    const progress = timeLeft / 2000; // Прогресс 2 секунд
    
    // Рисуем вуаль звёзд вокруг игрока
    ctx.save();
    ctx.globalAlpha = 0.3 + progress * 0.4; // Пульсирующая прозрачность
    
    // Внешний круг
    const gradient = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, 60);
    gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 150, 0, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Звёздочки
    ctx.globalAlpha = progress * 0.8;
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + Date.now() / 500;
        const distance = 40 + Math.sin(Date.now() / 300 + i) * 10;
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        const size = 2 + Math.sin(Date.now() / 200 + i * 2) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Внутреннее свечение
    ctx.globalAlpha = progress * 0.2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Рисование электрических ловушек
function drawElectricTraps() {
    for (const trap of electricTraps) {
        const alpha = trap.life / trap.maxLife;
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
        
        // Внешний круг
        ctx.strokeStyle = trap.triggered ? '#ffff00' : `rgba(255, 255, 0, ${alpha * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, trap.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        // Внутренний узор (треугольник)
        ctx.fillStyle = trap.triggered ? 'rgba(255, 255, 0, 0.4)' : `rgba(255, 255, 0, ${alpha * 0.3})`;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i;
            const x = trap.x + Math.cos(angle) * trap.radius * 0.5;
            const y = trap.y + Math.sin(angle) * trap.radius * 0.5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Молнии для активированной ловушки
        if (trap.triggered) {
            for (let i = 0; i < 3; i++) {
                const angle = (Math.PI * 2 / 3) * i + Date.now() / 500;
                const endX = trap.x + Math.cos(angle) * trap.chainDistance;
                const endY = trap.y + Math.sin(angle) * trap.chainDistance;
                
                ctx.strokeStyle = `rgba(255, 255, 0, ${0.5 + Math.sin(Date.now() / 100) * 0.3})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(trap.x, trap.y);
                
                // Зигзагообразная молния
                const segments = 5;
                for (let j = 1; j <= segments; j++) {
                    const progress = j / segments;
                    const midX = trap.x + (endX - trap.x) * progress + (Math.random() - 0.5) * 20;
                    const midY = trap.y + (endY - trap.y) * progress + (Math.random() - 0.5) * 20;
                    ctx.lineTo(midX, midY);
                }
                ctx.stroke();
            }
        }
    }
}

// Рисование вихревых торнадо
function drawVortexTornadoes() {
    for (const tornado of vortexTornadoes) {
        const alpha = tornado.life / tornado.maxLife;
        
        // Внешняя спираль
        ctx.strokeStyle = `rgba(0, 153, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tornado.x, tornado.y, tornado.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Внутренняя спираль
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tornado.x, tornado.y, tornado.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Центральная точка
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(tornado.x, tornado.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Вращающиеся частицы
        for (let i = 0; i < 8; i++) {
            const angle = (Date.now() / 200) + (Math.PI * 2 / 8) * i;
            const distance = tornado.radius * 0.8;
            const particleX = tornado.x + Math.cos(angle) * distance;
            const particleY = tornado.y + Math.sin(angle) * distance;
            
            ctx.fillStyle = `rgba(0, 204, 255, ${alpha * 0.7})`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Хвост торнадо
        const tailLength = 30;
        const tailAngle = tornado.angle + Math.PI;
        ctx.strokeStyle = `rgba(0, 153, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tornado.x, tornado.y);
        ctx.lineTo(
            tornado.x + Math.cos(tailAngle) * tailLength,
            tornado.y + Math.sin(tailAngle) * tailLength
        );
        ctx.stroke();
    }
}

// Рисование кристаллических шипов
function drawCrystalSpikes() {
    for (const spike of crystalSpikes) {
        const spikeX = player.x + Math.cos(spike.angle) * spike.distance;
        const spikeY = player.y + Math.sin(spike.angle) * spike.distance;
        const rotation = Date.now() / 1000;
        
        // Поворачиваем контекст
        ctx.save();
        ctx.translate(spikeX, spikeY);
        ctx.rotate(rotation);
        
        // Кристалл (шестиугольник)
        ctx.fillStyle = '#ff66ff';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const radius = 6;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Внутренний кристалл
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + Math.PI / 6;
            const radius = 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
        
        // Свечение
        ctx.shadowColor = '#ff66ff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255, 102, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(spikeX, spikeY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Рисование плазменных шаров
function drawPlasmaBalls() {
    for (const ball of plasmaBalls) {
        const ballX = player.x + Math.cos(ball.angle) * ball.distance;
        const ballY = player.y + Math.sin(ball.angle) * ball.distance;
        const pulse = Math.sin(Date.now() / 300) * 0.2 + 0.8;
        
        // Внешний шар
        ctx.shadowColor = '#66ffcc';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#66ffcc';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 8 * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Внутренний шар
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Вращающиеся кольца
        for (let i = 0; i < 2; i++) {
            const ringAngle = (Date.now() / 1000) + (Math.PI * i);
            const ringRadius = 12 + Math.sin(Date.now() / 400 + i) * 3;
            
            ctx.strokeStyle = `rgba(102, 255, 204, ${0.5 + Math.sin(Date.now() / 200 + i) * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ballX, ballY, ringRadius, ringAngle, ringAngle + Math.PI * 1.5);
            ctx.stroke();
        }
    }
}

// Улучшенное рисование частиц
function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Пропускаем частицы за пределами экрана
        if (particle.x < -100 || particle.x > canvas.width + 100 ||
            particle.y < -100 || particle.y > canvas.height + 100) {
            continue;
        }
        
        // Расчет прозрачности
        const alpha = Math.min(1, particle.life / (particle.maxLife || 20));
        ctx.globalAlpha = alpha;
        
        // Рисование следа для критических ударов
        if (particle.trail) {
            particle.trail.push({x: particle.x, y: particle.y});
            if (particle.trail.length > 5) {
                particle.trail.shift();
            }
            
            // Рисование следа
            for (let j = 0; j < particle.trail.length - 1; j++) {
                const trailAlpha = (j / particle.trail.length) * alpha * 0.5;
                ctx.globalAlpha = trailAlpha;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.trail[j].x, particle.trail[j].y, particle.radius * (j / particle.trail.length), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Основное рисование частицы
        ctx.fillStyle = particle.color;
        
        // Добавление свечения для некоторых типов частиц
        if (particle.type === 'critical' || particle.type === 'levelup') {
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * (particle.life / (particle.maxLife || 20)), 0, Math.PI * 2);
        ctx.fill();
        
        // Сброс свечения
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// Рисование интерфейса
function drawUI() {
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ПАУЗА', canvas.width/2, canvas.height/2);
        
        ctx.font = '20px Arial';
        ctx.fillText('Нажмите ПРОБЕЛ для продолжения', canvas.width/2, canvas.height/2 + 50);
    }
    
    if (shieldActive) {
        ctx.fillStyle = 'rgba(79, 195, 247, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4fc3f7';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ЩИТ АКТИВЕН', canvas.width/2, 40);
        
        const shieldPercent = roundNumber((player.shield / player.maxShield) * 100);
        ctx.font = '20px Arial';
        ctx.fillText(`Щит: ${shieldPercent}%`, canvas.width/2, 70);
    }
    
    if (shieldCooldown) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff3300';
        ctx.font = 'bold 25px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ЩИТ ПЕРЕЗАРЯЖАЕТСЯ', canvas.width/2, 40);
    }
    
    // Финальный сброс состояния canvas для предотвращения артефактов
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Получить или создать единый AudioContext (оптимизация памяти)
function getAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log("Аудио не поддерживается или отключено");
            return null;
        }
    }
    // Восстанавливаем контекст, если он был приостановлен
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

// Звуковые эффекты для босса
function playBossAttackSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playBossDefeatSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(100, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playEnemyShootSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

// Существующие звуковые эффекты
function playShootSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playHitSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playEnemyDestroySound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playCollisionSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playUpgradeSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playShieldSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

function playShieldBlockSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

// Управление игрой
function startGame() {
    console.log("Запуск игры...");
    
    document.getElementById('gameOverlay').style.display = 'none';
    
    gameActive = true;
    gamePaused = false;
    money = 0;
    score = 0;
    lives = 5;
    wave = 1;
    level = 1;
    waveTimer = 10;
    waveMaxTimer = 10;
    shieldActive = false;
    shieldCooldown = false;
    bossActive = false;
    boss = null;
    
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.health = 100;
    player.maxHealth = 100;
    player.damage = 10;
    player.fireRate = 400;
    player.baseFireRate = 400;
    player.speed = 4;
    player.baseSpeed = 4;
    player.shield = 0;
    player.maxShield = 0;
    player.splitLevel = 0;
    player.ricochetLevel = 0;
    player.piercingLevel = 0;
    player.lifeSteal = 0;
    player.criticalChance = 5;
    player.criticalMultiplier = 2;
    player.bulletSpeed = 7;
    player.experience = 0;
    player.experienceToNextLevel = 100;
    player.playerLevel = 1;
    player.onFire = false;
    player.fireEndTime = 0;
    player.lastFireTick = 0;
    player.movementSlowed = false;
    player.movementSlowEndTime = 0;
    player.attackSlowed = false;
    player.attackSlowEndTime = 0;
    
    // Сброс неуязвимости
    invulnerable = false;
    invulnerableEndTime = 0;
    
    // Сброс улучшений
    for (const key in upgradeSystem) {
        if (key === 'damage') upgradeSystem[key].level = 1;
        else if (key === 'fireRate') upgradeSystem[key].level = 1;
        else if (key === 'health') upgradeSystem[key].level = 1;
        else if (key === 'movement') upgradeSystem[key].level = 1;
        else upgradeSystem[key].level = 0;
        
        switch(key) {
            case 'damage': upgradeSystem[key].cost = 100; break;
            case 'fireRate': upgradeSystem[key].cost = 150; break;
            case 'health': upgradeSystem[key].cost = 200; break;
            case 'movement': upgradeSystem[key].cost = 120; break;
            case 'shield': upgradeSystem[key].cost = 250; break;
            case 'split': upgradeSystem[key].cost = 400; break;
            case 'ricochet': upgradeSystem[key].cost = 350; break;
            case 'piercing': upgradeSystem[key].cost = 400; break;
            case 'lifeSteal': upgradeSystem[key].cost = 300; break;
            case 'criticalChance': upgradeSystem[key].cost = 400; break;
            case 'criticalMultiplier': upgradeSystem[key].cost = 500; break;
            case 'bulletSpeed': upgradeSystem[key].cost = 200; break;
            case 'experienceGain': upgradeSystem[key].cost = 600; break;
        }
    }
    
    document.getElementById('money').textContent = money;
    document.getElementById('lives').textContent = lives;
    document.getElementById('wave').textContent = wave;
    document.getElementById('level').textContent = level;
    document.getElementById('waveTimer').textContent = waveTimer;
    document.getElementById('shield').textContent = '0%';
    document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Пауза';
    
    for (const key in upgradeSystem) {
        updateUpgradeDisplay(key);
    }
    
    updatePlayerLevelDisplay();
    updateShootModeDisplay();
    
    bullets = [];
    enemies = [];
    enemyBullets = [];
    particles = [];
    upgrades = [];
    notifications = [];
    bossProjectiles = [];
    healthCores = [];
    
    // Сброс дополнительного оружия
    activeWeapons = [];
    orbitalShields = [];
    companionDrones = [];
    laserBeams = { lastShot: 0 };
    chainLightning = { lastCast: 0, cooldown: 2000 };
    damageWaves = [];
    meteors = [];
    fireBalls = [];
    iceSpikes = { lastSpike: 0, activeSpikes: [], secondarySpikes: [] };
    homingMissiles = [];
    bulletRings = { lastCast: 0, cooldown: 3000 };
    activeLasers = [];
    activeLightning = [];
    
    // Сброс новых оружий
    magneticMines = [];
    lightSabers = [];
    toxicClouds = [];
    sniperLasers = { lastShot: 0, cooldown: 3000, activeTarget: null };
    boomerangs = [];
    electricTraps = [];
    vortexTornadoes = [];
    crystalSpikes = [];
    plasmaBalls = [];
    strategicStrikes = { lastStrike: 0, cooldown: 5000, targetX: 0, targetY: 0 };
    showStrategicTarget = false;
    strategicTargetX = 0;
    strategicTargetY = 0;
    
    // Сброс цены обновления оружия
    refreshCost = 5;
    
    weaponSelectionPaused = false;
    
    document.getElementById('notificationsContainer').innerHTML = '';
    const overlay = document.getElementById('weaponSelectionOverlay');
    overlay.style.display = 'none';
    
    // Очистка интервалов
    clearInterval(waveInterval);
    clearInterval(bossEnemySpawnInterval);
    
    createStars();
    
    startWaveTimer();
    
    console.log("Игра запущена успешно");
}

function togglePause() {
    if (!gameActive) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i> Продолжить';
        showNotification('pause', 'Игра на паузе');
    } else {
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Пауза';
        showNotification('pause', 'Игра продолжена');
    }
    
    // Обновляем отображение кнопки пропуска
    updateWaveDisplay();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundBtn').innerHTML = soundEnabled ? 
        '<i class="fas fa-volume-up"></i> Звук' : 
        '<i class="fas fa-volume-mute"></i> Звук';
}

function toggleFullscreen() {
    const gameContainer = document.querySelector('.game-container');
    
    if (!isFullscreen) {
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) {
            gameContainer.msRequestFullscreen();
        }
        gameContainer.classList.add('fullscreen');
        isFullscreen = true;
        document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i> Обычный экран';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        gameContainer.classList.remove('fullscreen');
        isFullscreen = false;
        document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i> На весь экран';
    }
    
    setTimeout(resizeCanvas, 100);
}

// Обработчик изменения полноэкранного режима
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const gameContainer = document.querySelector('.game-container');
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    
    if (isFullscreen) {
        gameContainer.classList.add('fullscreen');
        document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i> Обычный экран';
    } else {
        gameContainer.classList.remove('fullscreen');
        document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i> На весь экран';
    }
    
    resizeCanvas();
}

function restartGame() {
    gameOver();
    setTimeout(startGame, 500);
}

function gameOver() {
    gameActive = false;
    clearInterval(waveInterval);
    clearInterval(bossEnemySpawnInterval);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceSurvivorHighScore', highScore);
        document.getElementById('highScoreValue').textContent = highScore;
    }
    
    document.getElementById('overlayTitle').textContent = 'Игра окончена!';
    document.getElementById('overlayText').textContent = `Вы набрали ${score} очков и дошли до ${wave} волны.`;
    document.getElementById('startBtn').innerHTML = '<i class="fas fa-redo"></i> Играть снова';
    document.getElementById('gameOverlay').style.display = 'flex';
}

// Инициализация игры при загрузке страницы
window.onload = function() {
    console.log("Загрузка страницы завершена");
    initGame();
    
    for (const key in upgradeSystem) {
        updateUpgradeDisplay(key);
    }
    
    updatePlayerLevelDisplay();
};
