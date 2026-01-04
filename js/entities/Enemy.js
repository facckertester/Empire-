// Класс врага
export class Enemy {
    constructor() {
        // Базовые характеристики
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 15;
        
        // Характеристики здоровья
        this.health = 20;
        this.maxHealth = 20;
        this.damage = 5;
        
        // Характеристики движения
        this.speed = 2;
        this.baseSpeed = 2;
        
        // Тип врага и поведение
        this.type = 'zombie';
        this.behavior = 'chase';
        this.target = null;
        
        // Эффекты
        this.slowed = false;
        this.poisoned = false;
        this.frozen = false;
        this.stunned = false;
        this.effects = [];
        
        // Таймеры
        this.effectTimers = {};
        this.attackCooldown = 0;
        this.lastAttackTime = 0;
        
        // Флаги
        this.active = true;
        this.alive = true;
        this.canAttack = true;
        
        // Награды
        this.experienceValue = 1;
        this.coinValue = 1;
        
        // AI параметры
        this.detectionRadius = 200;
        this.attackRadius = 30;
        this.retargetTimer = 0;
        this.wanderAngle = Math.random() * Math.PI * 2;
    }
    
    init(type) {
        this.type = type;
        this.loadEnemyData(type);
        this.reset();
    }
    
    loadEnemyData(type) {
        // Базовые враги (24 типа)
        const basicEnemies = {
            zombie: {
                health: 20, damage: 5, speed: 2, radius: 18,
                experience: 1, coins: 1, detectionRadius: 150, attackRadius: 25,
                behavior: 'chase'
            },
            skeleton: {
                health: 15, damage: 8, speed: 3, radius: 16,
                experience: 2, coins: 1, detectionRadius: 180, attackRadius: 20,
                behavior: 'chase'
            },
            ghost: {
                health: 10, damage: 6, speed: 5, radius: 14,
                experience: 3, coins: 1, detectionRadius: 200, attackRadius: 15,
                behavior: 'chase', canPhase: true
            },
            vampire: {
                health: 25, damage: 12, speed: 4, radius: 20,
                experience: 4, coins: 2, detectionRadius: 250, attackRadius: 30,
                behavior: 'chase', lifesteal: 0.1
            },
            wolf: {
                health: 18, damage: 7, speed: 6, radius: 16,
                experience: 2, coins: 1, detectionRadius: 220, attackRadius: 20,
                behavior: 'chase'
            },
            bear: {
                health: 50, damage: 15, speed: 3, radius: 25,
                experience: 5, coins: 3, detectionRadius: 180, attackRadius: 35,
                behavior: 'chase'
            },
            bookMonster: {
                health: 12, damage: 9, speed: 2.5, radius: 14,
                experience: 3, coins: 2, detectionRadius: 160, attackRadius: 18,
                behavior: 'ranged'
            },
            ghostScholar: {
                health: 22, damage: 11, speed: 3.5, radius: 18,
                experience: 4, coins: 2, detectionRadius: 200, attackRadius: 25,
                behavior: 'chase'
            },
            knight: {
                health: 35, damage: 14, speed: 2.5, radius: 22,
                experience: 6, coins: 3, detectionRadius: 170, attackRadius: 30,
                behavior: 'chase', armor: 0.2
            },
            guard: {
                health: 28, damage: 10, speed: 3, radius: 20,
                experience: 5, coins: 3, detectionRadius: 180, attackRadius: 25,
                behavior: 'patrol'
            },
            scorpion: {
                health: 22, damage: 9, speed: 3.5, radius: 16,
                experience: 3, coins: 2, detectionRadius: 190, attackRadius: 20,
                behavior: 'chase', poison: true
            },
            sandWorm: {
                health: 40, damage: 18, speed: 2, radius: 24,
                experience: 7, coins: 4, detectionRadius: 150, attackRadius: 40,
                behavior: 'ambush'
            },
            iceElemental: {
                health: 30, damage: 12, speed: 2, radius: 20,
                experience: 6, coins: 3, detectionRadius: 160, attackRadius: 30,
                behavior: 'chase', freeze: true
            },
            snowMonster: {
                health: 25, damage: 10, speed: 4, radius: 18,
                experience: 5, coins: 3, detectionRadius: 200, attackRadius: 25,
                behavior: 'chase'
            },
            fireDemon: {
                health: 35, damage: 16, speed: 3.5, radius: 20,
                experience: 7, coins: 4, detectionRadius: 210, attackRadius: 28,
                behavior: 'chase', burn: true
            },
            lavaGolem: {
                health: 45, damage: 20, speed: 2.5, radius: 26,
                experience: 8, coins: 5, detectionRadius: 140, attackRadius: 35,
                behavior: 'chase', immuneToFire: true
            },
            swampMonster: {
                health: 32, damage: 13, speed: 2.5, radius: 22,
                experience: 6, coins: 4, detectionRadius: 170, attackRadius: 30,
                behavior: 'chase', slow: true
            },
            frogMutant: {
                health: 20, damage: 8, speed: 4, radius: 16,
                experience: 4, coins: 2, detectionRadius: 190, attackRadius: 20,
                behavior: 'jump'
            },
            goblin: {
                health: 12, damage: 6, speed: 5, radius: 12,
                experience: 2, coins: 1, detectionRadius: 180, attackRadius: 15,
                behavior: 'pack'
            },
            caveSpider: {
                health: 16, damage: 7, speed: 4.5, radius: 14,
                experience: 3, coins: 2, detectionRadius: 200, attackRadius: 18,
                behavior: 'chase', poison: true
            },
            angelScavenger: {
                health: 28, damage: 12, speed: 4.5, radius: 20,
                experience: 6, coins: 3, detectionRadius: 220, attackRadius: 25,
                behavior: 'chase', flying: true
            },
            griffin: {
                health: 38, damage: 15, speed: 5.5, radius: 24,
                experience: 8, coins: 4, detectionRadius: 250, attackRadius: 30,
                behavior: 'dive', flying: true
            },
            shadowMonster: {
                health: 24, damage: 11, speed: 4, radius: 18,
                experience: 5, coins: 3, detectionRadius: 200, attackRadius: 25,
                behavior: 'stealth'
            },
            demonDarkness: {
                health: 42, damage: 17, speed: 3, radius: 22,
                experience: 9, coins: 5, detectionRadius: 180, attackRadius: 32,
                behavior: 'chase'
            }
        };
        
        // Элитные враги (12 типов)
        const eliteEnemies = {
            bossZombie: {
                health: 150, damage: 25, speed: 1.5, radius: 30,
                experience: 20, coins: 10, detectionRadius: 200, attackRadius: 40,
                behavior: 'chase', elite: true
            },
            skeletonKing: {
                health: 180, damage: 30, speed: 2, radius: 32,
                experience: 25, coins: 12, detectionRadius: 220, attackRadius: 45,
                behavior: 'chase', elite: true, summons: true
            },
            ancientBear: {
                health: 200, damage: 35, speed: 2.5, radius: 35,
                experience: 30, coins: 15, detectionRadius: 200, attackRadius: 50,
                behavior: 'chase', elite: true
            },
            demonKnowledge: {
                health: 160, damage: 28, speed: 3, radius: 28,
                experience: 25, coins: 12, detectionRadius: 240, attackRadius: 40,
                behavior: 'ranged', elite: true
            },
            knightKing: {
                health: 220, damage: 40, speed: 2, radius: 30,
                experience: 35, coins: 18, detectionRadius: 190, attackRadius: 45,
                behavior: 'chase', elite: true, armor: 0.3
            },
            sandDragon: {
                health: 250, damage: 45, speed: 3.5, radius: 35,
                experience: 40, coins: 20, detectionRadius: 280, attackRadius: 55,
                behavior: 'dive', elite: true
            },
            iceTitan: {
                health: 190, damage: 32, speed: 2.5, radius: 32,
                experience: 30, coins: 15, detectionRadius: 200, attackRadius: 45,
                behavior: 'chase', elite: true, freeze: true
            },
            volcano: {
                health: 280, damage: 50, speed: 2, radius: 40,
                experience: 45, coins: 25, detectionRadius: 180, attackRadius: 60,
                behavior: 'stationary', elite: true, immuneToFire: true
            },
            swampKing: {
                health: 210, damage: 38, speed: 2.5, radius: 30,
                experience: 35, coins: 18, detectionRadius: 190, attackRadius: 48,
                behavior: 'chase', elite: true, slow: true
            },
            undergroundDragon: {
                health: 240, damage: 42, speed: 3, radius: 35,
                experience: 40, coins: 20, detectionRadius: 220, attackRadius: 52,
                behavior: 'ambush', elite: true
            },
            fallenAngel: {
                health: 200, damage: 36, speed: 4, radius: 28,
                experience: 35, coins: 18, detectionRadius: 250, attackRadius: 40,
                behavior: 'dive', elite: true, flying: true
            },
            shadowLord: {
                health: 260, damage: 48, speed: 3.5, radius: 32,
                experience: 45, coins: 25, detectionRadius: 240, attackRadius: 50,
                behavior: 'stealth', elite: true
            }
        };
        
        // Специальные враги (6 типов)
        const specialEnemies = {
            invisibleHunter: {
                health: 40, damage: 30, speed: 6, radius: 20,
                experience: 15, coins: 8, detectionRadius: 200, attackRadius: 30,
                behavior: 'stealth', invisible: true
            },
            teleportingDemon: {
                health: 35, damage: 25, speed: 4, radius: 18,
                experience: 12, coins: 6, detectionRadius: 180, attackRadius: 28,
                behavior: 'teleport', teleportCooldown: 5
            },
            kamikaze: {
                health: 20, damage: 80, speed: 7, radius: 16,
                experience: 10, coins: 5, detectionRadius: 250, attackRadius: 50,
                behavior: 'kamikaze', explosion: true
            },
            regeneratingGiant: {
                health: 100, damage: 20, speed: 3, radius: 30,
                experience: 18, coins: 10, detectionRadius: 170, attackRadius: 40,
                behavior: 'chase', regeneration: 5
            },
            cloner: {
                health: 30, damage: 15, speed: 4, radius: 18,
                experience: 14, coins: 7, detectionRadius: 190, attackRadius: 25,
                behavior: 'clone', cloneCooldown: 10
            },
            experienceThief: {
                health: 25, damage: 10, speed: 8, radius: 14,
                experience: 0, coins: 15, detectionRadius: 300, attackRadius: 20,
                behavior: 'thief', stealsExperience: true
            }
        };
        
        // Объединение всех типов врагов
        const allEnemies = { ...basicEnemies, ...eliteEnemies, ...specialEnemies };
        const enemyData = allEnemies[type] || allEnemies.zombie;
        
        // Применение характеристик
        this.maxHealth = enemyData.health;
        this.health = enemyData.health;
        this.damage = enemyData.damage;
        this.speed = enemyData.speed;
        this.baseSpeed = enemyData.speed;
        this.radius = enemyData.radius;
        this.experienceValue = enemyData.experience;
        this.coinValue = enemyData.coins;
        this.detectionRadius = enemyData.detectionRadius;
        this.attackRadius = enemyData.attackRadius;
        this.behavior = enemyData.behavior;
        
        // Специальные свойства
        this.canPhase = enemyData.canPhase || false;
        this.lifesteal = enemyData.lifesteal || 0;
        this.armor = enemyData.armor || 0;
        this.poison = enemyData.poison || false;
        this.freeze = enemyData.freeze || false;
        this.burn = enemyData.burn || false;
        this.immuneToFire = enemyData.immuneToFire || false;
        this.slow = enemyData.slow || false;
        this.flying = enemyData.flying || false;
        this.stealth = enemyData.stealth || false;
        this.elite = enemyData.elite || false;
        this.summons = enemyData.summons || false;
        this.invisible = enemyData.invisible || false;
        this.teleportCooldown = enemyData.teleportCooldown || 0;
        this.explosion = enemyData.explosion || false;
        this.regeneration = enemyData.regeneration || 0;
        this.cloneCooldown = enemyData.cloneCooldown || 0;
        this.stealsExperience = enemyData.stealsExperience || false;
        
        // Установка уникального ID
        this.id = Date.now() + Math.random();
    }
    
    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
        this.alive = true;
        this.health = this.maxHealth;
        this.speed = this.baseSpeed;
        this.target = null;
        this.slowed = false;
        this.poisoned = false;
        this.frozen = false;
        this.stunned = false;
        this.effects = [];
        this.effectTimers = {};
        this.attackCooldown = 0;
        this.lastAttackTime = 0;
        this.retargetTimer = 0;
        this.canAttack = true;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    update(deltaTime) {
        if (!this.active || !this.alive) return;
        
        // Обновление эффектов
        this.updateEffects(deltaTime);
        
        // Регенерация
        if (this.regeneration > 0) {
            this.health = Math.min(this.health + this.regeneration * deltaTime, this.maxHealth);
        }
        
        // Обновление AI
        this.updateAI(deltaTime);
        
        // Движение
        this.updateMovement(deltaTime);
        
        // Атака
        this.updateAttack(deltaTime);
    }
    
    updateEffects(deltaTime) {
        // Обновление таймеров эффектов
        Object.keys(this.effectTimers).forEach(effect => {
            this.effectTimers[effect] -= deltaTime;
            if (this.effectTimers[effect] <= 0) {
                this.removeEffect(effect);
            }
        });
        
        // Применение эффектов
        if (this.poisoned) {
            this.takeDamage(2 * deltaTime, false); // 2 урона в секунду от яда
        }
        
        if (this.burn) {
            this.takeDamage(3 * deltaTime, false); // 3 урона в секунду от огня
        }
    }
    
    updateAI(deltaTime) {
        // Обновление цели
        this.retargetTimer -= deltaTime;
        if (this.retargetTimer <= 0 || !this.target) {
            this.findTarget();
            this.retargetTimer = 2; // Перепроверка цели каждые 2 секунды
        }
        
        // Поведение в зависимости от типа
        switch (this.behavior) {
            case 'chase':
                this.chaseBehavior(deltaTime);
                break;
            case 'patrol':
                this.patrolBehavior(deltaTime);
                break;
            case 'ranged':
                this.rangedBehavior(deltaTime);
                break;
            case 'ambush':
                this.ambushBehavior(deltaTime);
                break;
            case 'jump':
                this.jumpBehavior(deltaTime);
                break;
            case 'pack':
                this.packBehavior(deltaTime);
                break;
            case 'dive':
                this.diveBehavior(deltaTime);
                break;
            case 'stealth':
                this.stealthBehavior(deltaTime);
                break;
            case 'teleport':
                this.teleportBehavior(deltaTime);
                break;
            case 'kamikaze':
                this.kamikazeBehavior(deltaTime);
                break;
            case 'clone':
                this.cloneBehavior(deltaTime);
                break;
            case 'thief':
                this.thiefBehavior(deltaTime);
                break;
            case 'stationary':
                this.stationaryBehavior(deltaTime);
                break;
        }
    }
    
    findTarget() {
        // Поиск ближайшей цели (игрока)
        // Этот метод будет реализован в системе AI
        this.target = null; // Временно
    }
    
    chaseBehavior(deltaTime) {
        if (!this.target) return;
        
        // Преследование цели
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.attackRadius) {
            // Движение к цели
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        } else {
            // Остановка рядом с целью
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    patrolBehavior(deltaTime) {
        // Патрулирование территории
        if (!this.target) {
            // Случайное блуждание
            this.wanderAngle += (Math.random() - 0.5) * 0.5;
            this.vx = Math.cos(this.wanderAngle) * this.speed * 0.5;
            this.vy = Math.sin(this.wanderAngle) * this.speed * 0.5;
        } else {
            this.chaseBehavior(deltaTime);
        }
    }
    
    rangedBehavior(deltaTime) {
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.attackRadius * 2) {
            // Движение к цели на оптимальную дистанцию
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        } else if (distance < this.attackRadius) {
            // Отступление от цели
            this.vx = -(dx / distance) * this.speed;
            this.vy = -(dy / distance) * this.speed;
        } else {
            // Остановка на оптимальной дистанции
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    ambushBehavior(deltaTime) {
        // Засадное поведение - неподвижность до приближения цели
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.detectionRadius * 0.5) {
            // Быстрое рывок к цели
            this.vx = (dx / distance) * this.speed * 2;
            this.vy = (dy / distance) * this.speed * 2;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    }
    
    jumpBehavior(deltaTime) {
        // Прыгающее поведение
        if (!this.target) {
            this.patrolBehavior(deltaTime);
            return;
        }
        
        // Прыжок каждые 2 секунды
        if (Math.random() < 0.01) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            this.vx = (dx / distance) * this.speed * 3;
            this.vy = (dy / distance) * this.speed * 3;
        } else {
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }
    
    packBehavior(deltaTime) {
        // Поведение стаи - держаться вместе
        // Будет реализовано с учетом других врагов того же типа
        this.chaseBehavior(deltaTime);
    }
    
    diveBehavior(deltaTime) {
        // Атака с пикирования
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.detectionRadius * 0.7) {
            // Круговой полет над целью
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            this.vx = Math.cos(angle) * this.speed;
            this.vy = Math.sin(angle) * this.speed;
        } else {
            // Пикирование
            this.vx = (dx / distance) * this.speed * 2;
            this.vy = (dy / distance) * this.speed * 2;
        }
    }
    
    stealthBehavior(deltaTime) {
        // Хищническое поведение - незаметное приближение
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.detectionRadius * 0.3) {
            // Быстрая атака
            this.vx = (dx / distance) * this.speed * 1.5;
            this.vy = (dy / distance) * this.speed * 1.5;
        } else {
            // Медленное незаметное приближение
            this.vx = (dx / distance) * this.speed * 0.5;
            this.vy = (dy / distance) * this.speed * 0.5;
        }
    }
    
    teleportBehavior(deltaTime) {
        // Телепортация
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Телепортация каждые 5 секунд
        if (this.effectTimers.teleport <= 0 && distance > this.attackRadius) {
            // Телепортация рядом с целью
            const angle = Math.random() * Math.PI * 2;
            const teleportDistance = this.attackRadius * 1.5;
            
            this.x = this.target.x + Math.cos(angle) * teleportDistance;
            this.y = this.target.y + Math.sin(angle) * teleportDistance;
            
            this.effectTimers.teleport = this.teleportCooldown;
        } else {
            this.chaseBehavior(deltaTime);
        }
    }
    
    kamikazeBehavior(deltaTime) {
        // Камикадзе - быстрое рывок к цели
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * this.speed * 1.5;
        this.vy = (dy / distance) * this.speed * 1.5;
        
        // Взрыв при контакте
        if (distance < this.attackRadius) {
            this.explode();
        }
    }
    
    cloneBehavior(deltaTime) {
        // Клонирование
        this.chaseBehavior(deltaTime);
        
        // Создание клона каждые 10 секунд
        if (this.effectTimers.clone <= 0 && this.health < this.maxHealth * 0.5) {
            this.createClone();
            this.effectTimers.clone = this.cloneCooldown;
        }
    }
    
    thiefBehavior(deltaTime) {
        // Вор опыта - убегает от игрока
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.detectionRadius) {
            // Поиск и сбор опыта
            this.collectExperience();
            // Убегание от игрока
            this.vx = -(dx / distance) * this.speed;
            this.vy = -(dy / distance) * this.speed;
        } else {
            this.patrolBehavior(deltaTime);
        }
    }
    
    stationaryBehavior(deltaTime) {
        // Неподвижный враг
        this.vx = 0;
        this.vy = 0;
    }
    
    updateMovement(deltaTime) {
        if (this.frozen || this.stunned) {
            this.vx = 0;
            this.vy = 0;
            return;
        }
        
        // Применение замедления
        let currentSpeed = this.speed;
        if (this.slowed) {
            currentSpeed *= 0.5;
        }
        
        // Обновление позиции
        this.x += this.vx * currentSpeed * deltaTime * 60;
        this.y += this.vy * currentSpeed * deltaTime * 60;
        
        // Ограничение движения границами мира
        this.x = Math.max(this.radius, Math.min(1920 - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(1080 - this.radius, this.y));
    }
    
    updateAttack(deltaTime) {
        if (!this.target || !this.canAttack) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.attackRadius) {
            // Атака цели
            if (this.attackCooldown <= 0) {
                this.performAttack();
                this.attackCooldown = 1; // 1 секунда между атаками
            }
        }
        
        this.attackCooldown -= deltaTime;
    }
    
    performAttack() {
        if (!this.target) return;
        
        // Нанесение урона цели
        this.target.takeDamage(this.damage);
        
        // Применение специальных эффектов
        if (this.poison) {
            this.target.addEffect('poisoned', 5);
        }
        
        if (this.freeze) {
            this.target.addEffect('frozen', 2);
        }
        
        if (this.burn) {
            this.target.addEffect('burned', 3);
        }
        
        if (this.slow) {
            this.target.addEffect('slowed', 3);
        }
        
        // Вампиризм
        if (this.lifesteal > 0) {
            this.health = Math.min(this.health + this.damage * this.lifesteal, this.maxHealth);
        }
    }
    
    takeDamage(damage, ignoreArmor = false) {
        if (!this.alive) return false;
        
        // Применение брони
        if (!ignoreArmor && this.armor > 0) {
            damage *= (1 - this.armor);
        }
        
        this.health -= damage;
        
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.onDeath();
        }
        
        return true;
    }
    
    onDeath() {
        // Создание опыта
        this.createExperienceOrb();
        
        // Создание монет
        this.createCoins();
        
        // Создание частиц смерти
        this.createDeathParticles();
        
        // Специальные эффекты при смерти
        if (this.explosion) {
            this.explode();
        }
        
        if (this.summons) {
            this.summonMinions();
        }
    }
    
    createExperienceOrb() {
        // Будет реализовано в EntityManager
    }
    
    createCoins() {
        // Будет реализовано в EntityManager
    }
    
    createDeathParticles() {
        // Будет реализовано в EntityManager
    }
    
    explode() {
        // Взрыв наносит урон по области
        // Будет реализовано в системе коллизий
    }
    
    createClone() {
        // Создание клона с частью здоровья
        // Будет реализовано в EntityManager
    }
    
    summonMinions() {
        // Призыв помощников
        // Будет реализовано в EntityManager
    }
    
    collectExperience() {
        // Сбор опыта поблизости
        // Будет реализовано в EntityManager
    }
    
    addEffect(effect, duration) {
        if (!this.effects.includes(effect)) {
            this.effects.push(effect);
        }
        
        this.effectTimers[effect] = duration;
        
        // Применение эффекта
        switch (effect) {
            case 'slowed':
                this.slowed = true;
                break;
            case 'poisoned':
                this.poisoned = true;
                break;
            case 'frozen':
                this.frozen = true;
                break;
            case 'stunned':
                this.stunned = true;
                break;
            case 'burned':
                this.burn = true;
                break;
        }
    }
    
    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
        }
        
        delete this.effectTimers[effect];
        
        // Удаление эффекта
        switch (effect) {
            case 'slowed':
                this.slowed = false;
                break;
            case 'poisoned':
                this.poisoned = false;
                break;
            case 'frozen':
                this.frozen = false;
                break;
            case 'stunned':
                this.stunned = false;
                break;
            case 'burned':
                this.burn = false;
                break;
        }
    }
    
    // Геттеры
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
    
    isAlive() {
        return this.alive;
    }
    
    isActive() {
        return this.active;
    }
    
    // Очистка объекта перед возвратом в пул
    cleanup() {
        this.reset();
        this.target = null;
        this.effects = [];
        this.effectTimers = {};
    }
}
