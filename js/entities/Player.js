// Класс игрока
export class Player {
    constructor() {
        // Базовые характеристики
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 20;
        
        // Характеристики здоровья
        this.health = 100;
        this.maxHealth = 100;
        this.regeneration = 0;
        
        // Характеристики движения
        this.speed = 5;
        this.baseSpeed = 5;
        
        // Характеристики атаки
        this.damage = 10;
        this.baseDamage = 10;
        this.criticalChance = 0;
        this.criticalDamage = 2;
        this.dodgeChance = 0;
        
        // Характеристики опыта
        this.experienceMagnetRadius = 3;
        this.baseExperienceMagnetRadius = 3;
        
        // Персонаж
        this.characterType = 'survivor';
        this.ability = null;
        
        // Оружие
        this.weapons = [];
        this.weaponSlots = 1;
        this.maxWeaponSlots = 6;
        
        // Артефакты
        this.artifacts = [];
        
        // Эффекты
        this.invincible = false;
        this.slowed = false;
        this.poisoned = false;
        this.effects = [];
        
        // Таймеры
        this.weaponTimers = {};
        this.abilityTimer = 0;
        this.effectTimers = {};
        
        // Флаги
        this.alive = true;
        this.moving = false;
    }
    
    init(characterType) {
        this.characterType = characterType;
        this.loadCharacterData(characterType);
        this.resetWeapons();
    }
    
    loadCharacterData(characterType) {
        const characters = {
            survivor: {
                health: 100,
                speed: 5,
                damage: 10,
                ability: null,
                startWeapon: 'staff'
            },
            archer: {
                health: 90,
                speed: 5.5,
                damage: 12,
                ability: 'attackRadius',
                abilityValue: 0.2,
                startWeapon: 'bow'
            },
            hunter: {
                health: 95,
                speed: 6,
                damage: 15,
                ability: 'attackSpeed',
                abilityValue: 0.15,
                startWeapon: 'crossbow'
            },
            mage: {
                health: 80,
                speed: 5,
                damage: 20,
                ability: 'cooldownReduction',
                abilityValue: 0.1,
                startWeapon: 'fireball'
            },
            knight: {
                health: 120,
                speed: 4,
                damage: 20,
                ability: 'maxHealth',
                abilityValue: 0.2,
                startWeapon: 'sword'
            },
            scout: {
                health: 85,
                speed: 7,
                damage: 8,
                ability: 'moveSpeed',
                abilityValue: 0.25,
                startWeapon: 'throwingStars'
            },
            healer: {
                health: 110,
                speed: 4.5,
                damage: 15,
                ability: 'regeneration',
                abilityValue: 1,
                startWeapon: 'healingCrystal'
            },
            sniper: {
                health: 85,
                speed: 4.5,
                damage: 50,
                ability: 'attackRadius',
                abilityValue: 0.4,
                startWeapon: 'sniperRifle'
            },
            engineer: {
                health: 100,
                speed: 4,
                damage: 15,
                ability: 'extraWeapon',
                abilityValue: 1,
                startWeapon: 'turret'
            },
            cyborg: {
                health: 140,
                speed: 4.5,
                damage: 28,
                ability: 'damage',
                abilityValue: 0.2,
                startWeapon: 'laserGun'
            },
            mutant: {
                health: 130,
                speed: 5.5,
                damage: 12,
                ability: 'attackSpeed',
                abilityValue: 0.3,
                startWeapon: 'poisonClaws'
            },
            shaman: {
                health: 75,
                speed: 5,
                damage: 25,
                ability: 'cooldownReduction',
                abilityValue: 0.25,
                startWeapon: 'lightningTotem'
            },
            ghost: {
                health: 60,
                speed: 8,
                damage: 22,
                ability: 'dodge',
                abilityValue: 0.15,
                startWeapon: 'ghostBlades'
            },
            tank: {
                health: 200,
                speed: 3,
                damage: 40,
                ability: 'damageReduction',
                abilityValue: 0.2,
                startWeapon: 'shieldHammer'
            },
            assassin: {
                health: 70,
                speed: 9,
                damage: 18,
                ability: 'criticalDamage',
                abilityValue: 0.5,
                startWeapon: 'daggers'
            },
            necromancer: {
                health: 90,
                speed: 4.5,
                damage: 35,
                ability: 'necromancy',
                abilityValue: 5,
                startWeapon: 'boneDeath'
            },
            dragon: {
                health: 180,
                speed: 6,
                damage: 15,
                ability: 'fireDamage',
                abilityValue: 0.3,
                startWeapon: 'fireBreath'
            },
            god: {
                health: 150,
                speed: 7,
                damage: 70,
                ability: 'allStats',
                abilityValue: 0.25,
                startWeapon: 'divineHammer'
            }
        };
        
        const character = characters[characterType] || characters.survivor;
        
        this.maxHealth = character.health;
        this.health = character.health;
        this.baseSpeed = character.speed;
        this.speed = character.speed;
        this.baseDamage = character.damage;
        this.damage = character.damage;
        
        this.ability = character.ability;
        this.abilityValue = character.abilityValue;
        
        // Применение способности
        this.applyAbility();
        
        // Добавление стартового оружия
        this.addWeapon(character.startWeapon);
    }
    
    applyAbility() {
        if (!this.ability) return;
        
        switch (this.ability) {
            case 'attackRadius':
                // Увеличивает радиус атаки оружия
                break;
            case 'attackSpeed':
                // Увеличивает скорость атаки
                break;
            case 'cooldownReduction':
                // Уменьшает кулдаун оружия
                break;
            case 'maxHealth':
                this.maxHealth *= (1 + this.abilityValue);
                this.health *= (1 + this.abilityValue);
                break;
            case 'moveSpeed':
                this.speed *= (1 + this.abilityValue);
                this.baseSpeed *= (1 + this.abilityValue);
                break;
            case 'regeneration':
                this.regeneration = this.abilityValue;
                break;
            case 'extraWeapon':
                this.weaponSlots += this.abilityValue;
                break;
            case 'damage':
                this.damage *= (1 + this.abilityValue);
                this.baseDamage *= (1 + this.abilityValue);
                break;
            case 'dodge':
                this.dodgeChance = this.abilityValue;
                break;
            case 'damageReduction':
                // Обрабатывается в системе получения урона
                break;
            case 'criticalDamage':
                this.criticalDamage = 2 + this.abilityValue;
                break;
            case 'necromancy':
                // Обрабатывается при смерти врагов
                break;
            case 'fireDamage':
                // Обрабатывается при атаке огненным оружием
                break;
            case 'allStats':
                this.maxHealth *= (1 + this.abilityValue);
                this.health *= (1 + this.abilityValue);
                this.speed *= (1 + this.abilityValue);
                this.baseSpeed *= (1 + this.abilityValue);
                this.damage *= (1 + this.abilityValue);
                this.baseDamage *= (1 + this.abilityValue);
                break;
        }
    }
    
    resetWeapons() {
        this.weapons = [];
        this.weaponTimers = {};
    }
    
    addWeapon(weaponType) {
        if (this.weapons.length >= this.weaponSlots) {
            return false;
        }
        
        const weapon = {
            type: weaponType,
            level: 1,
            timer: 0,
            active: true
        };
        
        this.weapons.push(weapon);
        this.weaponTimers[weaponType] = 0;
        
        return true;
    }
    
    upgradeWeapon(weaponType) {
        const weapon = this.weapons.find(w => w.type === weaponType);
        if (weapon && weapon.level < 8) {
            weapon.level++;
            return true;
        }
        return false;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    update(deltaTime) {
        if (!this.alive) return;
        
        // Обновление движения
        this.updateMovement(deltaTime);
        
        // Обновление оружия
        this.updateWeapons(deltaTime);
        
        // Обновление эффектов
        this.updateEffects(deltaTime);
        
        // Регенерация здоровья
        if (this.regeneration > 0) {
            this.health = Math.min(this.health + this.regeneration * deltaTime, this.maxHealth);
        }
    }
    
    updateMovement(deltaTime) {
        // Применение скорости
        this.x += this.vx * this.speed * deltaTime * 60;
        this.y += this.vy * this.speed * deltaTime * 60;
        
        // Ограничение движения границами мира
        this.x = Math.max(this.radius, Math.min(1920 - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(1080 - this.radius, this.y));
    }
    
    updateWeapons(deltaTime) {
        this.weapons.forEach(weapon => {
            if (!weapon.active) return;
            
            // Обновление таймера оружия
            this.weaponTimers[weapon.type] -= deltaTime;
            
            // Проверка возможности атаки
            const fireRate = this.getWeaponFireRate(weapon.type, weapon.level);
            if (this.weaponTimers[weapon.type] <= 0) {
                this.fireWeapon(weapon);
                this.weaponTimers[weapon.type] = fireRate;
            }
        });
    }
    
    getWeaponFireRate(weaponType, level) {
        // Базовые характеристики оружия
        const weaponStats = {
            staff: { fireRate: 0.67 },
            bow: { fireRate: 0.5 },
            crossbow: { fireRate: 1 },
            fireball: { fireRate: 1 },
            sword: { fireRate: 0.33 },
            knife: { fireRate: 0.25 },
            pistol: { fireRate: 0.25 },
            club: { fireRate: 0.67 }
        };
        
        const stats = weaponStats[weaponType] || weaponStats.staff;
        let fireRate = stats.fireRate;
        
        // Уменьшение кулдауна с уровнем
        fireRate *= (1 - (level - 1) * 0.1);
        
        // Применение способностей персонажа
        if (this.ability === 'attackSpeed') {
            fireRate *= (1 - this.abilityValue);
        }
        
        if (this.ability === 'cooldownReduction') {
            fireRate *= (1 - this.abilityValue);
        }
        
        return Math.max(fireRate, 0.1);
    }
    
    fireWeapon(weapon) {
        // Создание снарядов или эффектов оружия
        // Этот метод будет реализован в системе оружия
        
        // Эффекты стрельбы
        this.createMuzzleFlash(weapon.type);
    }
    
    createMuzzleFlash(weaponType) {
        // Визуальный эффект выстрела
        // Будет реализован в системе частиц
    }
    
    updateEffects(deltaTime) {
        // Обновление таймеров эффектов
        Object.keys(this.effectTimers).forEach(effect => {
            this.effectTimers[effect] -= deltaTime;
            if (this.effectTimers[effect] <= 0) {
                this.removeEffect(effect);
            }
        });
    }
    
    addEffect(effect, duration) {
        this.effects.push(effect);
        this.effectTimers[effect] = duration;
        
        // Применение эффекта
        switch (effect) {
            case 'invincible':
                this.invincible = true;
                break;
            case 'slowed':
                this.slowed = true;
                this.speed *= 0.5;
                break;
            case 'poisoned':
                this.poisoned = true;
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
            case 'invincible':
                this.invincible = false;
                break;
            case 'slowed':
                this.slowed = false;
                this.speed = this.baseSpeed;
                break;
            case 'poisoned':
                this.poisoned = false;
                break;
        }
    }
    
    takeDamage(damage) {
        if (!this.alive || this.invincible) return false;
        
        // Проверка уклонения
        if (Math.random() < this.dodgeChance) {
            return false;
        }
        
        // Применение снижения урона
        if (this.ability === 'damageReduction') {
            damage *= (1 - this.abilityValue);
        }
        
        this.health -= damage;
        
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.onDeath();
        }
        
        return true;
    }
    
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    onDeath() {
        // Обработка смерти игрока
        // Создание частиц, звуковые эффекты и т.д.
    }
    
    addArtifact(artifact) {
        if (this.artifacts.length < 5) {
            this.artifacts.push(artifact);
            this.applyArtifactEffects(artifact);
            return true;
        }
        return false;
    }
    
    applyArtifactEffects(artifact) {
        // Применение эффектов артефакта
        switch (artifact.type) {
            case 'speed':
                this.speed *= 1.15;
                this.baseSpeed *= 1.15;
                break;
            case 'health':
                this.maxHealth *= 1.2;
                this.health *= 1.2;
                break;
            case 'damage':
                this.damage *= 1.15;
                this.baseDamage *= 1.15;
                break;
            case 'experienceMagnet':
                this.experienceMagnetRadius *= 1.5;
                break;
            case 'attackSpeed':
                // Увеличивает скорость атаки
                break;
            case 'dodge':
                this.dodgeChance += 0.1;
                break;
            case 'regeneration':
                this.regeneration += 2;
                break;
            case 'critical':
                this.criticalChance += 0.1;
                break;
            case 'lifesteal':
                // Добавляет вампиризм
                break;
        }
    }
    
    // Геттеры
    getWeaponCount() {
        return this.weapons.length;
    }
    
    getActiveWeapons() {
        return this.weapons.filter(w => w.active && w.level > 0);
    }
    
    isAlive() {
        return this.alive;
    }
    
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
}
