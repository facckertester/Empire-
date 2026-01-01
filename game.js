// Основные переменные игры
let canvas, ctx;
let gameActive = false;
let gamePaused = false;
let soundEnabled = true;
let score = 0;
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
    playerLevel: 1
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
    
    // Запрещаем ПКМ на canvas
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
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

// Создание звезд для фона
function createStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            brightness: Math.random() * 0.5 + 0.5
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
        shieldRegen: 0.01
    };
    
    showNotification('boss', `БОСС: ${name}!`);
    createBossAppearanceEffect(boss.x, boss.y, boss.color);
    
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
    
    // Движение по X
    boss.moveTimerX += deltaTime;
    if (boss.moveTimerX > 2000) {
        boss.moveDirectionX *= -1;
        boss.moveTimerX = 0;
    }
    
    boss.x += bossSpeed * boss.moveDirectionX;
    if (boss.x < margin) {
        boss.x = margin;
        boss.moveDirectionX = 1;
        boss.moveTimerX = 0;
    }
    if (boss.x > canvas.width - margin) {
        boss.x = canvas.width - margin;
        boss.moveDirectionX = -1;
        boss.moveTimerX = 0;
    }
    
    // Движение по Y
    boss.moveTimerY += deltaTime;
    if (boss.moveTimerY > 2000) {
        boss.moveDirectionY *= -1;
        boss.moveTimerY = 0;
    }
    
    boss.y += bossSpeed * boss.moveDirectionY;
    if (boss.y < margin) {
        boss.y = margin;
        boss.moveDirectionY = 1;
        boss.moveTimerY = 0;
    }
    if (boss.y > canvas.height - margin) {
        boss.y = canvas.height - margin;
        boss.moveDirectionY = -1;
        boss.moveTimerY = 0;
    }
    
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
                createParticles(bullet.x, bullet.y, 8, '#4fc3f7');
                
                if (boss.shield <= 0) {
                    boss.shield = 0;
                    boss.shieldActive = false;
                    showNotification('boss', 'Щит босса разрушен!');
                    createParticles(boss.x, boss.y, 25, '#4fc3f7');
                }
            } else {
                boss.health -= bullet.damage;
                createParticles(bullet.x, bullet.y, 5, boss.color);
                
                if (boss.health < boss.maxHealth * 0.5 && boss.phase === 1) {
                    boss.phase = 2;
                    boss.attackCooldown = 1500;
                    boss.speed *= 1.5;
                    showNotification('boss', 'Босс в ярости!');
                }
                
                if (boss.health < boss.maxHealth * 0.25 && boss.phase === 2) {
                    boss.phase = 3;
                    boss.attackCooldown = 1000;
                    showNotification('boss', 'БОСС В БЕШЕНСТВЕ!');
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
            
            createParticles(player.x, player.y, 10, '#4fc3f7');
        } else {
            player.health -= boss.damage;
            
            const pushAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
            player.x += Math.cos(pushAngle) * 30;
            player.y += Math.sin(pushAngle) * 30;
            
            createParticles(player.x, player.y, 12, '#ff0000');
            
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
                createParticles(projectile.x, projectile.y, 6, '#4fc3f7');
            } else {
                player.health -= projectile.damage;
                createParticles(projectile.x, projectile.y, 8, projectile.color);
                
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
    const bossReward = 1000 + (wave * 200);
    score += bossReward;
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
    
    showNotification('boss', `БОСС ПОВЕРЖЕН! +${bossReward} очков`);
    
    // Останавливаем спавн врагов во время босса
    clearInterval(bossEnemySpawnInterval);
    
    bossActive = false;
    boss = null;
    bossProjectiles = [];
    
    // Восстанавливаем таймер волны
    waveTimer = 12 + Math.floor(wave / 3);
    document.getElementById('waveTimer').textContent = waveTimer;
    document.getElementById('waveProgress').style.width = '0%';
    
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
    
    createParticles(player.x, player.y, 15, '#4fc3f7');
    
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

// Ручной выстрел
function handleManualShoot(e) {
    if (!gameActive || gamePaused) return;
    
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
        createParticles(player.x, player.y, 2, '#ffcc00');
        
        if (soundEnabled) playShootSound();
    }
}

// Создание врага-стрелка
function createShooterEnemy(x, y) {
    return {
        x: x,
        y: y,
        radius: 12,
        speed: 0.5,
        health: 30 + (wave * 5),
        maxHealth: 30 + (wave * 5),
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
        createParticles(enemy.x, enemy.y, 3, '#ff00ff');
        
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

// Создание частиц для эффектов (с лимитом для оптимизации памяти)
function createParticles(x, y, count, color) {
    // Удаляем старые частицы, если их слишком много
    if (particles.length > MAX_PARTICLES * 0.8) {
        particles = particles.filter(p => p.life > 10);
    }
    
    const particlesToCreate = Math.min(count, MAX_PARTICLES - particles.length);
    for (let i = 0; i < particlesToCreate; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 2 + 1,
            color: color,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            life: 20
        });
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
        
        const enemyHealth = roundNumber(20 + (wave * 3) + (level * 2));
        const enemyType = Math.random();
        
        if (enemyType < 0.6) {
            // Обычный враг (60%)
            const speed = 0.8 + wave * 0.08 + level * 0.03;
            const radius = 10 + wave * 0.4;
            const damage = 4 + wave * 0.4;
            
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
            // Быстрый враг (25%)
            const speed = 1.5 + wave * 0.12 + level * 0.06;
            const radius = 7 + wave * 0.25;
            const damage = 2 + wave * 0.25;
            
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
            // Танк (10%)
            const speed = 0.4 + wave * 0.04 + level * 0.015;
            const radius = 18 + wave * 0.6;
            const damage = 8 + wave * 0.6;
            
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
    if (!gameActive || gamePaused) return;
    
    gameTime++;
    
    // Движение игрока
    const moveSpeed = player.speed * (deltaTime / 16.67);
    if (player.isMoving.up && player.y > player.radius) player.y -= moveSpeed;
    if (player.isMoving.down && player.y < canvas.height - player.radius) player.y += moveSpeed;
    if (player.isMoving.left && player.x > player.radius) player.x -= moveSpeed;
    if (player.isMoving.right && player.x < canvas.width - player.radius) player.x += moveSpeed;
    
    // Автоматическая стрельба
    autoShoot();
    
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
        
        if (!bossActive) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                
                if (bullet.enemiesHit.includes(j)) continue;
                
                const distance = Math.sqrt(
                    Math.pow(bullet.x - enemy.x, 2) + Math.pow(bullet.y - enemy.y, 2)
                );
                
                if (distance < bullet.radius + enemy.radius) {
                    enemy.health -= bullet.damage;
                    bullet.enemiesHit.push(j);
                    
                    createParticles(bullet.x, bullet.y, 3, '#ff3300');
                    
                    // Кража жизни
                    if (player.lifeSteal > 0 && enemy.health <= 0) {
                        const healAmount = roundNumber(bullet.damage * (player.lifeSteal / 100));
                        player.health = Math.min(player.maxHealth, player.health + healAmount);
                    }
                    
                    if (enemy.health <= 0) {
                        let points = 10 + wave * 1.5;
                        if (enemy.type === 'fast') points *= 1.3;
                        if (enemy.type === 'tank') points *= 1.8;
                        if (enemy.type === 'shooter') points *= 2;
                        
                        score += roundNumber(points);
                        updateScore();
                        
                        // Получение опыта
                        const expGain = 10 * (1 + upgradeSystem.experienceGain.level * 0.2);
                        player.experience += expGain;
                        checkLevelUp();
                        
                        createParticles(enemy.x, enemy.y, 10, '#ff9900');
                        
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
                
                createParticles(player.x, player.y, 7, '#4fc3f7');
                
                if (soundEnabled) playShieldBlockSound();
            } else {
                player.health -= enemy.damage;
                
                const pushAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
                player.x += Math.cos(pushAngle) * 15;
                player.y += Math.sin(pushAngle) * 15;
                
                createParticles(player.x, player.y, 7, '#ff0000');
                
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
                
                createParticles(bullet.x, bullet.y, 5, '#4fc3f7');
            } else {
                player.health -= bullet.damage;
                createParticles(bullet.x, bullet.y, 8, bullet.color);
                
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
                createParticles(core.x, core.y, 10, '#00ff00');
                
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
        player.experienceToNextLevel = roundNumber(player.experienceToNextLevel * 1.5);
        
        // Бонусы за уровень
        player.maxHealth += 20;
        player.health = player.maxHealth;
        player.damage += 2;
        
        showNotification('level', `Уровень ${player.playerLevel}! +20 HP, +2 урона`);
        
        // Обновляем отображение уровня
        updatePlayerLevelDisplay();
    }
}

// Обновление отображения уровня игрока
function updatePlayerLevelDisplay() {
    const levelElement = document.getElementById('playerLevel');
    if (levelElement) {
        levelElement.textContent = `Ур. ${player.playerLevel}`;
    }
    
    const expElement = document.getElementById('playerExp');
    if (expElement) {
        const expPercent = (player.experience / player.experienceToNextLevel) * 100;
        expElement.textContent = `${roundNumber(player.experience)}/${player.experienceToNextLevel}`;
        expElement.style.width = `${expPercent}%`;
    }
}

// Обновление щита
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
    
    const shieldPercent = player.maxShield > 0 ? roundNumber((player.shield / player.maxShield) * 100) : 0;
    document.getElementById('shield').textContent = shieldPercent + '%';
}

// Показать уведомление (с лимитом для оптимизации памяти)
function showNotification(type, message) {
    // Удаляем старые уведомления, если их слишком много
    if (notifications.length >= MAX_NOTIFICATIONS) {
        notifications.shift();
    }
    
    const notification = {
        type: type,
        message: message,
        life: 180,
        id: Date.now() + Math.random()
    };
    
    notifications.push(notification);
    updateNotificationsDisplay();
}

// Обновить отображение уведомлений
function updateNotificationsDisplay() {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = '';
    
    const recentNotifications = notifications.slice(-5);
    
    for (const notification of recentNotifications) {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.type}`;
        
        let icon = '';
        switch(notification.type) {
            case 'health': icon = '♥'; break;
            case 'damage': icon = '⚔'; break;
            case 'fireRate': icon = '⚡'; break;
            case 'movement': icon = '↻'; break;
            case 'shield': icon = '⛨'; break;
            case 'split': icon = '⇉'; break;
            case 'ricochet': icon = '↶'; break;
            case 'piercing': icon = '➹'; break;
            case 'lifeSteal': icon = '🩸'; break;
            case 'criticalChance': icon = '🎯'; break;
            case 'criticalMultiplier': icon = '💥'; break;
            case 'bulletSpeed': icon = '🚀'; break;
            case 'experienceGain': icon = '📈'; break;
            case 'boss': icon = '👹'; break;
            case 'wave': icon = '🌊'; break;
            case 'level': icon = '⭐'; break;
            case 'life': icon = '💖'; break;
        }
        
        notificationElement.innerHTML = `${icon} ${notification.message}`;
        container.appendChild(notificationElement);
    }
}

// Покупка улучшения
function buyUpgrade(type) {
    const upgrade = upgradeSystem[type];
    
    if (upgrade.level >= upgrade.maxLevel) {
        showNotification(type, "Максимальный уровень!");
        return;
    }
    
    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.level++;
        
        switch(type) {
            case 'damage':
                player.damage += 3;
                upgrade.description = `Урон +3 (${player.damage})`;
                break;
            case 'fireRate':
                player.fireRate = Math.max(150, player.fireRate * 0.92);
                upgrade.description = `Скорострельность +8% (${roundNumber(player.fireRate)}мс)`;
                break;
            case 'health':
                player.maxHealth += 20;
                player.health = player.maxHealth;
                upgrade.description = `Здоровье +20 (${player.maxHealth})`;
                break;
            case 'movement':
                player.speed += 0.3;
                upgrade.description = `Скорость +0.3 (${player.speed.toFixed(1)})`;
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
        
        updateScore();
        updateUpgradeDisplay(type);
        
        showNotification(type, upgrade.description);
        
        if (soundEnabled) playUpgradeSound();
    } else {
        showNotification(type, "Недостаточно очков!");
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
        if (!gameActive || gamePaused) return;
        
        // Не запускаем новую волну, если босс активен
        if (bossActive) return;
        
        waveTimer--;
        document.getElementById('waveTimer').textContent = waveTimer;
        
        const progress = (10 - waveTimer) / 10 * 100;
        document.getElementById('waveProgress').style.width = `${progress}%`;
        
        if (waveTimer <= 0) {
            startWave();
        }
    }, 1000);
}

// Запуск спавна врагов во время босса
function startBossEnemySpawn() {
    clearInterval(bossEnemySpawnInterval);
    
    bossEnemySpawnInterval = setInterval(() => {
        if (!gameActive || gamePaused || !bossActive) {
            clearInterval(bossEnemySpawnInterval);
            return;
        }
        
        // Спавним 1-2 врага каждые 3-5 секунд во время босса
        const enemyCount = Math.floor(Math.random() * 2) + 1;
        createEnemies(enemyCount);
    }, 3000 + Math.random() * 2000);
}

// Начало волны врагов
function startWave() {
    wave++;
    
    // Проверяем, является ли эта волна боссом
    if (wave % 10 === 0) {
        // Волна босса
        enemies = [];
        createBoss();
        waveTimer = 30;
        document.getElementById('wave').textContent = `Босс ${wave/10}`;
    } else {
        // Обычная волна
        document.getElementById('wave').textContent = wave;
        
        if (wave % 4 === 0) {
            level++;
            document.getElementById('level').textContent = level;
        }
        
        const enemyCount = 4 + Math.floor(wave * 1.5);
        createEnemies(enemyCount);
        waveTimer = 12 + Math.floor(wave / 3);
    }
    
    document.getElementById('waveTimer').textContent = waveTimer;
    document.getElementById('waveProgress').style.width = '0%';
    
    if (wave % 10 !== 0) {
        showNotification('wave', `Волна ${wave}!`);
    }
}

// Обновление счета
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Обновление жизней
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Игровой цикл
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    accumulator += deltaTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
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
        drawParticles();
        drawUI();
    } else {
        drawStars();
    }
    
    requestAnimationFrame(gameLoop);
}

// Рисование фона
function drawBackground() {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars();
}

// Рисование звезд
function drawStars() {
    for (const star of stars) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Рисование игрока
function drawPlayer() {
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

// Рисование босса
function drawBoss() {
    if (!bossActive || !boss) return;
    
    if (boss.shieldActive && boss.shield > 0) {
        const shieldPercent = boss.shield / boss.maxShield;
        const shieldRadius = boss.radius + 15;
        
        ctx.strokeStyle = '#4fc3f7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, shieldRadius, 0, Math.PI * 2 * shieldPercent);
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(79, 195, 247, 0.3)`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, shieldRadius - 2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    const healthBarWidth = 80;
    const healthBarHeight = 8;
    const healthPercent = boss.health / boss.maxHealth;
    
    ctx.fillStyle = '#330000';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 15, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 15, healthBarWidth * healthPercent, healthBarHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(boss.x - healthBarWidth/2, boss.y - boss.radius - 15, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(boss.name, boss.x, boss.y - boss.radius - 25);
}

// Рисование снарядов босса
function drawBossProjectiles() {
    for (const projectile of bossProjectiles) {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
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

// Рисование частиц
function drawParticles() {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 20;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
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
    score = 0;
    lives = 5;
    wave = 1;
    level = 1;
    waveTimer = 10;
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
    player.speed = 4;
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
    
    document.getElementById('score').textContent = score;
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
    
    bullets = [];
    enemies = [];
    enemyBullets = [];
    particles = [];
    upgrades = [];
    notifications = [];
    bossProjectiles = [];
    healthCores = [];
    document.getElementById('notificationsContainer').innerHTML = '';
    
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
    document.getElementById('pauseBtn').innerHTML = gamePaused ? 
        '<i class="fas fa-play"></i> Продолжить' : 
        '<i class="fas fa-pause"></i> Пауза';
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