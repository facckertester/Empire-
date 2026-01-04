// Класс артефакта
export class Artifact {
    constructor() {
        // Базовые характеристики
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 12;
        
        // Характеристики артефакта
        this.type = 'speed';
        this.rarity = 'common';
        this.duration = 60; // секунд
        this.value = 1;
        
        // Поведение
        this.floatAmplitude = 3;
        this.floatFrequency = 1.5;
        this.floatOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = 2;
        this.rotation = 0;
        
        // Визуальные эффекты
        this.glowRadius = 25;
        this.pulseFrequency = 2;
        this.pulseAmplitude = 0.4;
        this.particleFrequency = 5;
        
        // Таймеры
        this.age = 0;
        this.lifetime = 45; // 45 секунд до исчезновения
        this.fadeTime = 10; // Начать затухание за 10 секунд до исчезновения
        
        // Флаги
        this.active = true;
        this.alive = true;
        this.collected = false;
        this.permanent = false;
        
        // Эффекты артефакта
        this.effects = [];
        
        // Цвета в зависимости от редкости
        this.colors = {
            common: {
                primary: '#4CAF50',
                glow: 'rgba(76, 175, 80, 0.3)',
                particle: '#8BC34A'
            },
            rare: {
                primary: '#2196F3',
                glow: 'rgba(33, 150, 243, 0.4)',
                particle: '#03A9F4'
            },
            epic: {
                primary: '#9C27B0',
                glow: 'rgba(156, 39, 176, 0.5)',
                particle: '#E91E63'
            },
            legendary: {
                primary: '#FFD700',
                glow: 'rgba(255, 215, 0, 0.6)',
                particle: '#FFC107'
            }
        };
        
        this.currentColor = this.colors.common;
        
        // Уникальный ID
        this.id = Date.now() + Math.random();
    }
    
    init(type, x, y) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        this.loadArtifactData(type);
        this.reset();
    }
    
    loadArtifactData(type) {
        // Обычные артефакты (6 видов)
        const commonArtifacts = {
            speed: {
                rarity: 'common',
                duration: 60,
                effects: ['speed', 'moveSpeed'],
                values: [0.15, 0.15],
                description: '+15% скорость движения'
            },
            health: {
                rarity: 'common',
                duration: 60,
                effects: ['maxHealth'],
                values: [0.2],
                description: '+20% максимальное здоровье'
            },
            damage: {
                rarity: 'common',
                duration: 60,
                effects: ['damage'],
                values: [0.15],
                description: '+15% урон'
            },
            experienceMagnet: {
                rarity: 'common',
                duration: 60,
                effects: ['experienceMagnet'],
                values: [0.5],
                description: '+50% радиус притяжения опыта'
            },
            attackSpeed: {
                rarity: 'common',
                duration: 60,
                effects: ['attackSpeed'],
                values: [0.15],
                description: '+15% скорость атаки'
            },
            dodge: {
                rarity: 'common',
                duration: 60,
                effects: ['dodge'],
                values: [0.1],
                description: '+10% шанс уклонения'
            }
        };
        
        // Редкие артефакты (5 видов)
        const rareArtifacts = {
            regeneration: {
                rarity: 'rare',
                duration: 60,
                effects: ['regeneration'],
                values: [2],
                description: '+2 HP/сек регенерация'
            },
            invisibility: {
                rarity: 'rare',
                duration: 30,
                effects: ['invisibility'],
                values: [0.2],
                description: '20% шанс невидимости'
            },
            cooldownReduction: {
                rarity: 'rare',
                duration: 60,
                effects: ['cooldownReduction'],
                values: [0.2],
                description: '-20% кулдаун оружия'
            },
            critical: {
                rarity: 'rare',
                duration: 60,
                effects: ['criticalChance'],
                values: [0.1],
                description: '+10% шанс критического удара'
            },
            lifesteal: {
                rarity: 'rare',
                duration: 60,
                effects: ['lifesteal'],
                values: [0.15],
                description: '+15% вампиризм'
            }
        };
        
        // Эпические артефакты (3 вида)
        const epicArtifacts = {
            phoenix: {
                rarity: 'epic',
                duration: -1, // Постоянный до использования
                effects: ['resurrection'],
                values: [50],
                description: 'Воскрешение при смерти (50 HP)'
            },
            infiniteAmmo: {
                rarity: 'epic',
                duration: 60,
                effects: ['infiniteAmmo'],
                values: [1],
                description: 'Бесконечные патроны'
            },
            timeStone: {
                rarity: 'epic',
                duration: 60,
                effects: ['cooldownReduction'],
                values: [0.5],
                description: '-50% кулдаун всего оружия'
            }
        };
        
        // Легендарные артефакты (2 вида)
        const legendaryArtifacts = {
            godArtifact: {
                rarity: 'legendary',
                duration: 60,
                effects: ['allStats'],
                values: [0.5],
                description: '+50% ко всем характеристикам'
            },
            dragonSoul: {
                rarity: 'legendary',
                duration: -1, // Постоянный до использования
                effects: ['periodicHeal'],
                values: [120],
                description: 'Полное восстановление здоровья каждые 2 минуты'
            }
        };
        
        // Объединение всех артефактов
        const allArtifacts = { 
            ...commonArtifacts, 
            ...rareArtifacts, 
            ...epicArtifacts, 
            ...legendaryArtifacts 
        };
        
        const artifactData = allArtifacts[type] || allArtifacts.speed;
        
        // Применение характеристик
        this.rarity = artifactData.rarity;
        this.duration = artifactData.duration;
        this.effects = artifactData.effects;
        this.values = artifactData.values;
        this.description = artifactData.description;
        
        // Постоянные артефакты
        this.permanent = this.duration === -1;
        
        // Применение цветов и размеров
        this.currentColor = this.colors[this.rarity];
        this.applyRaritySettings();
    }
    
    applyRaritySettings() {
        switch (this.rarity) {
            case 'common':
                this.radius = 12;
                this.glowRadius = 25;
                this.particleFrequency = 5;
                break;
            case 'rare':
                this.radius = 14;
                this.glowRadius = 30;
                this.particleFrequency = 4;
                break;
            case 'epic':
                this.radius = 16;
                this.glowRadius = 35;
                this.particleFrequency = 3;
                break;
            case 'legendary':
                this.radius = 18;
                this.glowRadius = 40;
                this.particleFrequency = 2;
                break;
        }
    }
    
    reset() {
        this.age = 0;
        this.active = true;
        this.alive = true;
        this.collected = false;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        
        // Случайное смещение для эффекта парения
        this.floatOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        if (!this.active || !this.alive) return;
        
        // Обновление возраста
        this.age += deltaTime;
        
        // Проверка времени жизни
        if (!this.permanent && this.age >= this.lifetime) {
            this.alive = false;
            return;
        }
        
        // Обновление движения
        this.updateMovement(deltaTime);
        
        // Обновление вращения
        this.rotation += this.rotationSpeed * deltaTime;
        
        // Создание частиц
        this.updateParticles(deltaTime);
        
        // Проверка границ
        this.checkBounds();
    }
    
    updateMovement(deltaTime) {
        // Эффект парения
        const floatY = Math.sin(this.age * this.floatFrequency + this.floatOffset) * this.floatAmplitude;
        const floatX = Math.cos(this.age * this.floatFrequency * 0.7 + this.floatOffset) * this.floatAmplitude * 0.5;
        
        // Плавное движение к целевой позиции
        const targetX = this.x + floatX * deltaTime * 60;
        const targetY = this.y + floatY * deltaTime * 60;
        
        // Применение движения с затуханием
        this.vx += (targetX - this.x) * 0.05;
        this.vy += (targetY - this.y) * 0.05;
        
        // Затухание скорости
        this.vx *= 0.9;
        this.vy *= 0.9;
        
        // Обновление позиции
        this.x += this.vx * deltaTime * 60;
        this.y += this.vy * deltaTime * 60;
    }
    
    updateParticles(deltaTime) {
        // Создание частиц с определенной частотой
        if (Math.random() < this.particleFrequency * deltaTime) {
            this.createParticle();
        }
    }
    
    createParticle() {
        // Создание частицы вокруг артефакта
        const angle = Math.random() * Math.PI * 2;
        const distance = this.radius + Math.random() * 10;
        
        const particleX = this.x + Math.cos(angle) * distance;
        const particleY = this.y + Math.sin(angle) * distance;
        
        const particleVx = Math.cos(angle) * 2;
        const particleVy = Math.sin(angle) * 2;
        
        // Будет реализовано в EntityManager
        return {
            x: particleX,
            y: particleY,
            vx: particleVx,
            vy: particleVy,
            color: this.currentColor.particle,
            lifetime: 2
        };
    }
    
    checkBounds() {
        // Проверка выхода за границы мира
        if (this.x < -50 || this.x > 1970 || this.y < -50 || this.y > 1130) {
            this.alive = false;
        }
    }
    
    collect(player) {
        if (this.collected) return false;
        
        this.collected = true;
        this.alive = false;
        
        // Применение эффектов к игроку
        this.applyEffects(player);
        
        // Создание эффекта сбора
        this.createCollectEffect();
        
        return true;
    }
    
    applyEffects(player) {
        this.effects.forEach((effect, index) => {
            const value = this.values[index];
            
            switch (effect) {
                case 'speed':
                case 'moveSpeed':
                    player.speed *= (1 + value);
                    player.baseSpeed *= (1 + value);
                    break;
                case 'maxHealth':
                    player.maxHealth *= (1 + value);
                    player.health *= (1 + value);
                    break;
                case 'damage':
                    player.damage *= (1 + value);
                    player.baseDamage *= (1 + value);
                    break;
                case 'experienceMagnet':
                    player.experienceMagnetRadius *= (1 + value);
                    break;
                case 'attackSpeed':
                    // Увеличивает скорость атаки
                    break;
                case 'dodge':
                    player.dodgeChance += value;
                    break;
                case 'regeneration':
                    player.regeneration += value;
                    break;
                case 'invisibility':
                    player.addEffect('invisible', this.duration);
                    break;
                case 'cooldownReduction':
                    // Уменьшает кулдаун оружия
                    break;
                case 'criticalChance':
                    player.criticalChance += value;
                    break;
                case 'lifesteal':
                    // Добавляет вампиризм
                    break;
                case 'resurrection':
                    player.addEffect('resurrection', -1); // Постоянный
                    break;
                case 'infiniteAmmo':
                    player.addEffect('infiniteAmmo', this.duration);
                    break;
                case 'allStats':
                    player.maxHealth *= (1 + value);
                    player.health *= (1 + value);
                    player.speed *= (1 + value);
                    player.baseSpeed *= (1 + value);
                    player.damage *= (1 + value);
                    player.baseDamage *= (1 + value);
                    break;
                case 'periodicHeal':
                    player.addEffect('periodicHeal', -1); // Постоянный
                    break;
            }
        });
    }
    
    createCollectEffect() {
        // Создание эффектов при сборе
        // Будет реализовано в EntityManager
    }
    
    // Получение прозрачности для затухания
    getAlpha() {
        if (this.permanent) return 1;
        
        if (this.age < this.lifetime - this.fadeTime) {
            return 1;
        }
        
        const fadeProgress = (this.age - (this.lifetime - this.fadeTime)) / this.fadeTime;
        return Math.max(0, 1 - fadeProgress);
    }
    
    // Получение размера для пульсации
    getScale() {
        const pulse = Math.sin(this.age * this.pulseFrequency) * this.pulseAmplitude;
        return 1 + pulse;
    }
    
    // Получение цвета с учетом прозрачности
    getColor() {
        const alpha = this.getAlpha();
        const color = this.currentColor.primary;
        
        // Преобразование hex в rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Получение цвета свечения
    getGlowColor() {
        const alpha = this.getAlpha() * 0.6;
        return this.currentColor.glow.replace(/[\d.]+\)/, `${alpha})`);
    }
    
    // Статические методы для создания артефактов
    static getRandomByRarity(rarity) {
        const artifacts = {
            common: ['speed', 'health', 'damage', 'experienceMagnet', 'attackSpeed', 'dodge'],
            rare: ['regeneration', 'invisibility', 'cooldownReduction', 'critical', 'lifesteal'],
            epic: ['phoenix', 'infiniteAmmo', 'timeStone'],
            legendary: ['godArtifact', 'dragonSoul']
        };
        
        const pool = artifacts[rarity] || artifacts.common;
        const type = pool[Math.floor(Math.random() * pool.length)];
        
        return type;
    }
    
    static getRandomByChance() {
        const chance = Math.random();
        
        if (chance < 0.6) {
            return this.getRandomByRarity('common');
        } else if (chance < 0.85) {
            return this.getRandomByRarity('rare');
        } else if (chance < 0.95) {
            return this.getRandomByRarity('epic');
        } else {
            return this.getRandomByRarity('legendary');
        }
    }
    
    // Геттеры
    isAlive() {
        return this.alive;
    }
    
    isActive() {
        return this.active;
    }
    
    isCollected() {
        return this.collected;
    }
    
    isPermanent() {
        return this.permanent;
    }
    
    getDescription() {
        return this.description;
    }
    
    // Очистка объекта перед возвратом в пул
    cleanup() {
        this.reset();
        this.type = 'speed';
        this.rarity = 'common';
        this.duration = 60;
        this.effects = [];
        this.values = [];
        this.permanent = false;
        this.currentColor = this.colors.common;
        this.radius = 12;
        this.glowRadius = 25;
    }
}
