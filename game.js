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

// Данные для дополнительного оружия
let orbitalShields = []; // Орбитальные щиты
let companionDrones = []; // Дроны-помощники
let laserBeams = { lastShot: 0 }; // Лазерные лучи (состояние)
let chainLightning = { lastCast: 0, cooldown: 2000 }; // Молнии
let damageWaves = []; // Волны урона
let meteors = []; // Метеориты
let fireBalls = []; // Огненные шары
let iceSpikes = { lastSpike: 0, activeSpikes: [] }; // Ледяные шипы (состояние и активные шипы)
let homingMissiles = []; // Снаряды с наведением
let bulletRings = { lastCast: 0, cooldown: 3000 }; // Кольцо из пуль
let activeLasers = []; // Активные лазерные лучи
let activeLightning = []; // Активные молнии

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
        phase: 1,
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

// Обновление босса
function updateBoss(deltaTime) {
    if (!bossActive || !boss) return;
    
    const bossSpeed = boss.speed * (deltaTime / 16.67);
    const margin = boss.radius + 20;
    
    // === НОВЫЙ КОД ДВИЖЕНИЯ ===
    
    if (boss.phase === 3) {
        // Фаза 3 (последняя) - преследование игрока
        const angleToPlayer = Math.atan2(player.y - boss.y, player.x - boss.x);
        boss.x += Math.cos(angleToPlayer) * bossSpeed * 1.3; // На 30% быстрее при преследовании
        boss.y += Math.sin(angleToPlayer) * bossSpeed * 1.3;
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
        const distance = Math.sqrt(
            Math.pow(bullet.x - boss.x, 2) + Math.pow(bullet.y - boss.y, 2)
        );
        
        if (distance < bullet.radius + boss.radius) {
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
    
    const distanceToPlayer = Math.sqrt(
        Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2)
    );
    
    if (distanceToPlayer < player.radius + boss.radius) {
        if (shieldActive && player.shield > 0) {
            player.shield -= boss.damage * 2;
            if (player.shield < 0) player.shield = 0;
            
            const pushAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
            player.x += Math.cos(pushAngle) * 25;
            player.y += Math.sin(pushAngle) * 25;
            
            createParticles(player.x, player.y, 10, '#4fc3f7', 'shield');
        } else {
            player.health -= boss.damage;
            
            const pushAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
            player.x += Math.cos(pushAngle) * 30;
            player.y += Math.sin(pushAngle) * 30;
            
            createParticles(player.x, player.y, 12, '#ff0000', 'hit');
            
            // Добавляем тряску экрана при уроне от босса
            startScreenShake(8, 15);
            
            // Применяем эффекты босса в зависимости от типа
            applyBossEffect(boss.type);
            
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

// Обновление снарядов босса
function updateBossProjectiles(deltaTime) {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const projectile = bossProjectiles[i];
        const projSpeed = projectile.speed * (deltaTime / 16.67);
        
        projectile.x += Math.cos(projectile.angle) * projSpeed;
        projectile.y += Math.sin(projectile.angle) * projSpeed;
        
        projectile.life--;
        
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - projectile.x, 2) + Math.pow(player.y - projectile.y, 2)
        );
        
        if (distanceToPlayer < player.radius + projectile.radius) {
            if (shieldActive && player.shield > 0) {
                player.shield -= projectile.damage;
                if (player.shield < 0) player.shield = 0;
                createParticles(projectile.x, projectile.y, 6, '#4fc3f7', 'shield');
            } else {
                player.health -= projectile.damage;
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
                    }
                }
            }
            
            bossProjectiles.splice(i, 1);
            continue;
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
        const distance = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
        );
        
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
    if (particles.length > MAX_PARTICLES * 0.8) {
        particles = particles.filter(p => p.life > 10);
    }
    
    const particlesToCreate = Math.min(count, MAX_PARTICLES - particles.length);
    
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
                const speed = Math.random() * 6 + 2;
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
                const critSpeed = Math.random() * 8 + 3;
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

// Обновление состояния игры
function updateGame(deltaTime) {
    if (!gameActive || gamePaused || weaponSelectionPaused) return;
    
    gameTime++;
    
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
            
            const distance = Math.sqrt(
                Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2)
            );
            
            if (distance < bullet.radius + enemy.radius) {
                    enemy.health -= bullet.damage;
                    bullet.enemiesHit.push(j);
                    
                    createParticles(bullet.x, bullet.y, 3, '#ff3300', 'hit');
                    
                    // Кража жизни
                    if (player.lifeSteal > 0 && enemy.health <= 0) {
                        const healAmount = roundNumber(bullet.damage * (player.lifeSteal / 100));
                        player.health = Math.min(player.maxHealth, player.health + healAmount);
                    }
                    
                    if (enemy.health <= 0) {
                        // Очки для рекорда
                        let recordPoints = 10 + wave * 1.5;
                        if (enemy.type === 'fast') recordPoints *= 1.3;
                        if (enemy.type === 'tank') recordPoints *= 1.8;
                        if (enemy.type === 'shooter') recordPoints *= 2;
                        score += roundNumber(recordPoints);
                        
                        // Валюта для улучшений (уменьшена в 5 раз)
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
                        
                        createParticles(enemy.x, enemy.y, 10, '#ff9900', 'explosion');
                        
                        // Добавляем небольшую тряску при уничтожении врага
                        startScreenShake(2, 5);
                        
                        // Шанс выпадения ядра здоровья (30%)
                        if (Math.random() < 0.3) {
                            createHealthCore(enemy.x, enemy.y);
                        }
                        
                        enemies.splice(j, 1);
                        
                        if (soundEnabled) playEnemyDestroySound();
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
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
        );
        
        if (distanceToPlayer < player.radius + enemy.radius) {
            if (shieldActive && player.shield > 0) {
                player.shield -= enemy.damage * 2;
                if (player.shield < 0) player.shield = 0;
                
                const pushAngle = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                enemy.x += Math.cos(pushAngle) * 20;
                enemy.y += Math.sin(pushAngle) * 20;
                
                createParticles(player.x, player.y, 7, '#4fc3f7', 'shield');
                
                if (soundEnabled) playShieldBlockSound();
            } else {
                player.health -= enemy.damage;
                
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
        
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - bullet.x, 2) + Math.pow(player.y - bullet.y, 2)
        );
        
        if (distanceToPlayer < player.radius + bullet.radius) {
            if (shieldActive && player.shield > 0) {
                player.shield -= bullet.damage;
                if (player.shield < 0) player.shield = 0;
                
                createParticles(bullet.x, bullet.y, 5, '#4fc3f7', 'shield');
            } else {
                player.health -= bullet.damage;
                createParticles(bullet.x, bullet.y, 8, bullet.color, 'hit');
                
                // Добавляем тряску экрана при уроне от пули врага
                startScreenShake(3, 8);
                
                if (player.health <= 0) {
                    player.health = 0;
                    lives--;
                    updateLives();
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
            
            enemyBullets.splice(i, 1);
        }
    }
    
    // Обновление частиц (с оптимизацией)
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const particleSpeedX = particle.speedX * (deltaTime / 16.67);
        const particleSpeedY = particle.speedY * (deltaTime / 16.67);
        particle.x += particleSpeedX;
        particle.y += particleSpeedY;
        particle.life--;
        
        // Удаляем мертвые частицы или частицы за пределами экрана
        if (particle.life <= 0 || 
            particle.x < -50 || particle.x > canvas.width + 50 ||
            particle.y < -50 || particle.y > canvas.height + 50) {
            particles.splice(i, 1);
        }
    }
    
    // Дополнительная очистка, если частиц слишком много
    if (particles.length > MAX_PARTICLES) {
        particles = particles.slice(-MAX_PARTICLES);
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
        const distanceToPlayer = Math.sqrt(
            Math.pow(player.x - core.x, 2) + Math.pow(player.y - core.y, 2)
        );
        
        if (distanceToPlayer < player.radius + core.radius) {
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
        'damageWaves', 'meteors', 'fireBalls', 'iceSpikes', 'homingMissiles', 'bulletRing'
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
    
    // Создаем контейнер для опций
    const optionsContainer = document.createElement('div');
    
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

// Получить данные оружия
function getWeaponData(type) {
    const weapons = {
        orbitalShields: { name: '🛡️ Орбитальные щиты', description: 'Щиты вращаются вокруг игрока и наносят урон врагам' },
        companionDrones: { name: '🤖 Дроны-помощники', description: 'Дроны автоматически стреляют по ближайшим врагам' },
        laserBeams: { name: '⚡ Лазерные лучи', description: 'Лучи пронзают врагов по прямой линии' },
        chainLightning: { name: '⚡ Молнии', description: 'Цепные молнии перепрыгивают между врагами' },
        damageWaves: { name: '🌊 Волны урона', description: 'Периодические волны урона расходятся от игрока' },
        meteors: { name: '☄️ Метеориты', description: 'Метеориты падают на карту, нанося урон в области' },
        fireBalls: { name: '🔥 Огненные шары', description: 'Шары огня летают по траектории вокруг игрока' },
        iceSpikes: { name: '❄️ Ледяные шипы', description: 'Шипы появляются перед игроком в направлении движения' },
        homingMissiles: { name: '🚀 Снаряды с наведением', description: 'Снаряды автоматически наводятся на ближайших врагов' },
        bulletRing: { name: '💫 Кольцо из пуль', description: 'Периодически выпускает кольцо из пуль во все стороны' }
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
            // Создаем щиты вокруг игрока
            const shieldCount = Math.min(2 + weapon.level, 6);
            orbitalShields = [];
            for (let i = 0; i < shieldCount; i++) {
                orbitalShields.push({
                    angle: (Math.PI * 2 / shieldCount) * i,
                    distance: 40 + weapon.level * 5,
                    radius: 8 + weapon.level * 2,
                    rotationSpeed: 0.03 + weapon.level * 0.005
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
        }
    }
}

// Обновление орбитальных щитов
function updateOrbitalShields(weapon, deltaTime) {
    // Обновляем позиции щитов
    for (const shield of orbitalShields) {
        shield.angle += shield.rotationSpeed * (deltaTime / 16.67);
        if (shield.angle > Math.PI * 2) shield.angle -= Math.PI * 2;
        
        const shieldX = player.x + Math.cos(shield.angle) * shield.distance;
        const shieldY = player.y + Math.sin(shield.angle) * shield.distance;
        
        // Проверка столкновения с врагами
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const distance = Math.sqrt(
                Math.pow(shieldX - enemy.x, 2) + Math.pow(shieldY - enemy.y, 2)
            );
            
            if (distance < shield.radius + enemy.radius) {
                const damage = roundNumber(player.damage * 0.5 * weapon.level);
                enemy.health -= damage;
                createParticles(enemy.x, enemy.y, 5, '#4fc3f7', 'shield');
                
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy, i);
                } else {
                    if (soundEnabled) playHitSound();
                }
            }
        }
        
        // Проверка столкновения с боссом
        if (bossActive && boss) {
            const distance = Math.sqrt(
                Math.pow(shieldX - boss.x, 2) + Math.pow(shieldY - boss.y, 2)
            );
            
            if (distance < shield.radius + boss.radius) {
                const damage = roundNumber(player.damage * 0.3 * weapon.level);
                if (boss.shieldActive && boss.shield > 0) {
                    boss.shield -= damage;
                } else {
                    boss.health -= damage;
                }
                createParticles(boss.x, boss.y, 5, '#4fc3f7', 'shield');
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
                const distance = Math.sqrt(
                    Math.pow(drone.x - enemy.x, 2) + Math.pow(drone.y - enemy.y, 2)
                );
                if (distance < closestDistance && distance < 400) {
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
            const distance = Math.sqrt(
                Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
            );
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }
        
        if (closestEnemy && closestDistance < 500) {
            const angle = Math.atan2(closestEnemy.y - player.y, closestEnemy.x - player.x);
            const beamCount = Math.min(1 + Math.floor(weapon.level / 2), 3);
            
            for (let i = 0; i < beamCount; i++) {
                const spreadAngle = angle + (i - (beamCount - 1) / 2) * 0.15;
                const endX = player.x + Math.cos(spreadAngle) * closestDistance;
                const endY = player.y + Math.sin(spreadAngle) * closestDistance;
                
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
            const distance = Math.sqrt(
                Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
            );
            if (distance < minDistance && distance < 300) {
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
                    const distance = Math.sqrt(
                        Math.pow(currentTarget.x - enemy.x, 2) + Math.pow(currentTarget.y - enemy.y, 2)
                    );
                    if (distance < minDist && distance < 150) {
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
        damageWaves.push({
            radius: 0,
            maxRadius: 150 + weapon.level * 20,
            damage: roundNumber(player.damage * 0.5 * weapon.level),
            speed: 3 + weapon.level * 0.5,
            x: player.x,
            y: player.y
        });
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
                const distance = Math.sqrt(
                    Math.pow(wave.x - enemy.x, 2) + Math.pow(wave.y - enemy.y, 2)
                );
                
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
                const distance = Math.sqrt(
                    Math.pow(wave.x - boss.x, 2) + Math.pow(wave.y - boss.y, 2)
                );
                
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
                const pathLength = Math.sqrt(Math.pow(meteor.x - oldX, 2) + Math.pow(meteor.y - oldY, 2));
                if (pathLength > 0) {
                    for (let j = enemies.length - 1; j >= 0; j--) {
                        const enemy = enemies[j];
                        // Проверяем расстояние от врага до линии движения метеорита
                        const distToLine = Math.abs(
                            (meteor.y - oldY) * enemy.x - (meteor.x - oldX) * enemy.y + 
                            meteor.x * oldY - meteor.y * oldX
                        ) / pathLength;
                        
                        // Проверяем, находится ли враг на пути
                        const projX = ((enemy.x - oldX) * (meteor.x - oldX) + (enemy.y - oldY) * (meteor.y - oldY)) / (pathLength * pathLength);
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
                            (meteor.y - oldY) * boss.x - (meteor.x - oldX) * boss.y + 
                            meteor.x * oldY - meteor.y * oldX
                        ) / pathLength;
                        
                        const projX = ((boss.x - oldX) * (meteor.x - oldX) + (boss.y - oldY) * (meteor.y - oldY)) / (pathLength * pathLength);
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
                    const dist = Math.sqrt(
                        Math.pow(meteor.x - enemy.x, 2) + Math.pow(meteor.y - enemy.y, 2)
                    );
                    
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
                    const dist = Math.sqrt(
                        Math.pow(meteor.x - boss.x, 2) + Math.pow(meteor.y - boss.y, 2)
                    );
                    
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
            const distance = Math.sqrt(
                Math.pow(ballX - enemy.x, 2) + Math.pow(ballY - enemy.y, 2)
            );
            
            if (distance < ball.radius + enemy.radius) {
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
            const distance = Math.sqrt(
                Math.pow(ballX - boss.x, 2) + Math.pow(ballY - boss.y, 2)
            );
            
            if (distance < ball.radius + boss.radius) {
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
    const spikeCooldown = Math.max(2000 - weapon.level * 150, 1000);
    
    const spikeDuration = 400; // Длительность видимости шипов в мс
    
    // Удаляем старые шипы
    if (!iceSpikes.activeSpikes) iceSpikes.activeSpikes = [];
    iceSpikes.activeSpikes = iceSpikes.activeSpikes.filter(spike => now - spike.startTime < spikeDuration);
    
    if (now - iceSpikes.lastSpike > spikeCooldown) {
        // Определяем направление движения игрока
        let moveAngle = Math.atan2(player.mouseY - player.y, player.mouseX - player.x);
        if (player.isMoving.up || player.isMoving.down || player.isMoving.left || player.isMoving.right) {
            if (player.isMoving.up && player.isMoving.left) moveAngle = -Math.PI * 3/4;
            else if (player.isMoving.up && player.isMoving.right) moveAngle = -Math.PI/4;
            else if (player.isMoving.down && player.isMoving.left) moveAngle = Math.PI * 3/4;
            else if (player.isMoving.down && player.isMoving.right) moveAngle = Math.PI/4;
            else if (player.isMoving.up) moveAngle = -Math.PI/2;
            else if (player.isMoving.down) moveAngle = Math.PI/2;
            else if (player.isMoving.left) moveAngle = Math.PI;
            else if (player.isMoving.right) moveAngle = 0;
        }
        
        const spikeCount = Math.min(3 + weapon.level, 8);
        const spikeLength = 80 + weapon.level * 10;
        const spikeWidth = 15 + weapon.level * 3;
        
        for (let i = 0; i < spikeCount; i++) {
            const angle = moveAngle + (i - (spikeCount - 1) / 2) * 0.3;
            const startX = player.x + Math.cos(angle) * 30;
            const startY = player.y + Math.sin(angle) * 30;
            const endX = startX + Math.cos(angle) * spikeLength;
            const endY = startY + Math.sin(angle) * spikeLength;
            
            // Сохраняем шип для визуализации
            iceSpikes.activeSpikes.push({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                width: spikeWidth,
                startTime: now
            });
            
            // Проверка столкновения с врагами
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const distToLine = Math.abs(
                    (endY - startY) * enemy.x - (endX - startX) * enemy.y + endX * startY - endY * startX
                ) / Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));
                
                const distAlongLine = Math.sqrt(
                    Math.pow(enemy.x - startX, 2) + Math.pow(enemy.y - startY, 2)
                );
                
                if (distToLine < spikeWidth && distAlongLine < spikeLength + 20) {
                    const damage = roundNumber(player.damage * 0.8 * weapon.level);
                    enemy.health -= damage;
                    createParticles(enemy.x, enemy.y, 5, '#00ccff');
                    
                    if (enemy.health <= 0) {
                        handleEnemyDeath(enemy, j);
                    } else {
                        if (soundEnabled) playHitSound();
                    }
                }
            }
            
            // Проверка столкновения с боссом
            if (bossActive && boss) {
                const distToLine = Math.abs(
                    (endY - startY) * boss.x - (endX - startX) * boss.y + endX * startY - endY * startX
                ) / Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));
                
                const distAlongLine = Math.sqrt(
                    Math.pow(boss.x - startX, 2) + Math.pow(boss.y - startY, 2)
                );
                
                if (distToLine < spikeWidth && distAlongLine < spikeLength + 30) {
                    const damage = roundNumber(player.damage * 0.4 * weapon.level);
                    if (boss.shieldActive && boss.shield > 0) {
                        boss.shield -= damage;
                    } else {
                        boss.health -= damage;
                    }
                    createParticles(boss.x, boss.y, 5, '#00ccff');
                }
            }
        }
        
        iceSpikes.lastSpike = now;
        createParticles(player.x, player.y, 10, '#00ccff');
    }
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
                const distance = Math.sqrt(
                    Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
                );
                if (distance < minDistance && distance < 500) {
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
                    const distance = Math.sqrt(
                        Math.pow(missile.x - enemy.x, 2) + Math.pow(missile.y - enemy.y, 2)
                    );
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
            const distance = Math.sqrt(
                Math.pow(missile.x - missile.target.x, 2) + Math.pow(missile.y - missile.target.y, 2)
            );
            
            if (distance < missile.radius + missile.target.radius) {
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
            player.shield += player.maxShield * player.shieldRegen;
            if (player.shield > player.maxShield) player.shield = player.maxShield;
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
        experienceGain: 'chart-line'
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

// Упрощенная система управления волнами
let waveMaxTimer = 10;

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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем тряску экрана
    updateScreenShake();
    applyScreenShakeToContainer();
    
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
    } else {
        drawStars();
    }
    
    requestAnimationFrame(gameLoop);
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
            const distance = Math.sqrt(
                Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
            );
            
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
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
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
        }
    }
}

// Рисование орбитальных щитов
function drawOrbitalShields() {
    for (const shield of orbitalShields) {
        const shieldX = player.x + Math.cos(shield.angle) * shield.distance;
        const shieldY = player.y + Math.sin(shield.angle) * shield.distance;
        
        ctx.shadowColor = '#4fc3f7';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#4fc3f7';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(shieldX, shieldY, shield.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
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
    for (const spike of iceSpikes.activeSpikes) {
        const age = Date.now() - spike.startTime;
        const alpha = 1 - (age / 400); // Угасание за 400мс
        
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = spike.width;
        ctx.globalAlpha = alpha * 0.8;
        ctx.shadowColor = '#00ccff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(spike.startX, spike.startY);
        ctx.lineTo(spike.endX, spike.endY);
        ctx.stroke();
        
        // Кончик шипа
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(spike.endX, spike.endY, spike.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
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

// Улучшенное рисование частиц
function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Обновление позиции частицы
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Применение гравитации
        if (particle.gravity) {
            particle.speedY += particle.gravity;
        }
        
        // Замедление
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;
        
        // Уменьшение жизни
        particle.life -= 1;
        
        // Удаление мертвых частиц
        if (particle.life <= 0) {
            particles.splice(i, 1);
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
    iceSpikes = { lastSpike: 0, activeSpikes: [] };
    homingMissiles = [];
    bulletRings = { lastCast: 0, cooldown: 3000 };
    activeLasers = [];
    activeLightning = [];
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