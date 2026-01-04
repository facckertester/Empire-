// Система управления оружием
export class WeaponSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        
        // Активное оружие игрока
        this.activeWeapons = new Map();
        
        // Таймеры оружия
        this.weaponTimers = new Map();
        
        // Снаряды
        this.projectiles = [];
        
        // Статистика
        this.stats = {
            shotsFired: 0,
            enemiesHit: 0,
            damageDealt: 0
        };
        
        // Инициализация
        this.init();
    }
    
    init() {
        // Настройка системы
        this.setupWeaponData();
    }
    
    setupWeaponData() {
        // Данные оружия для всех типов
        this.weaponData = {
            // Базовое оружие (5 видов)
            staff: {
                fireRate: 0.67, // 1.5 секунды между выстрелами
                projectileType: 'magic',
                damage: 10,
                radius: 15,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            bow: {
                fireRate: 0.5, // 2 секунды
                projectileType: 'arrow',
                damage: 12,
                radius: 20,
                speed: 20,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            crossbow: {
                fireRate: 1, // 1 секунда
                projectileType: 'bolt',
                damage: 25,
                radius: 22,
                speed: 25,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            knife: {
                fireRate: 0.25, // 4 выстрела в секунду
                projectileType: 'knife',
                damage: 15,
                radius: 8,
                speed: 18,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            club: {
                fireRate: 0.67, // 1.5 секунды
                projectileType: 'club',
                damage: 20,
                radius: 8,
                speed: 10,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            
            // Обычное оружие (15 видов)
            fireball: {
                fireRate: 1,
                projectileType: 'fireball',
                damage: 20,
                radius: 12,
                speed: 12,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                exploding: true
            },
            iceArrow: {
                fireRate: 2,
                projectileType: 'iceArrow',
                damage: 15,
                radius: 18,
                speed: 18,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            lightning: {
                fireRate: 0.8,
                projectileType: 'lightning',
                damage: 25,
                radius: 20,
                speed: 30,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                chain: true
            },
            throwingStar: {
                fireRate: 4,
                projectileType: 'throwingStar',
                damage: 8,
                radius: 12,
                speed: 22,
                count: 3,
                spread: 30, // градусов
                piercing: false,
                homing: false
            },
            axe: {
                fireRate: 1.2,
                projectileType: 'axe',
                damage: 35,
                radius: 10,
                speed: 8,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                bouncing: true
            },
            katana: {
                fireRate: 3,
                projectileType: 'katana',
                damage: 20,
                radius: 8,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            turret: {
                fireRate: 2.5,
                projectileType: 'turret',
                damage: 15,
                radius: 18,
                speed: 20,
                count: 1,
                spread: 0,
                piercing: false,
                homing: true
            },
            mine: {
                fireRate: 0.3,
                projectileType: 'mine',
                damage: 60,
                radius: 12,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                exploding: true
            },
            poisonClaws: {
                fireRate: 4,
                projectileType: 'poisonClaws',
                damage: 12,
                radius: 6,
                speed: 16,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            soundWave: {
                fireRate: 2.2,
                projectileType: 'soundWave',
                damage: 16,
                radius: 15,
                speed: 25,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            healingCrystal: {
                fireRate: 1.8,
                projectileType: 'healingCrystal',
                damage: 15,
                radius: 8,
                speed: 14,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            boomerang: {
                fireRate: 1.5,
                projectileType: 'boomerang',
                damage: 18,
                radius: 15,
                speed: 12,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                returning: true
            },
            spear: {
                fireRate: 0.8,
                projectileType: 'spear',
                damage: 30,
                radius: 16,
                speed: 20,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            whip: {
                fireRate: 1.5,
                projectileType: 'whip',
                damage: 22,
                radius: 14,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            laser: {
                fireRate: 1.5,
                projectileType: 'laser',
                damage: 28,
                radius: 3,
                speed: 40,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            ghostBlade: {
                fireRate: 2.8,
                projectileType: 'ghostBlade',
                damage: 22,
                radius: 12,
                speed: 17,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false,
                phase: true
            },
            
            // Редкое оружие (15 видов)
            earthquake: {
                fireRate: 0.5,
                projectileType: 'earthquake',
                damage: 30,
                radius: 20,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                aoe: true
            },
            shadowDagger: {
                fireRate: 1.2,
                projectileType: 'shadowDagger',
                damage: 35,
                radius: 16,
                speed: 20,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false,
                phase: true
            },
            lightBeam: {
                fireRate: 0.6,
                projectileType: 'lightBeam',
                damage: 40,
                radius: 25,
                speed: 50,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false,
                continuous: true
            },
            whirlwind: {
                fireRate: 0.4,
                projectileType: 'whirlwind',
                damage: 50,
                radius: 12,
                speed: 8,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                pulling: true
            },
            gravityField: {
                fireRate: 1,
                projectileType: 'gravityField',
                damage: 10,
                radius: 15,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                slowing: true
            },
            rocket: {
                fireRate: 0.4,
                projectileType: 'rocket',
                damage: 80,
                radius: 25,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                exploding: true
            },
            lightningTotem: {
                fireRate: 1.5,
                projectileType: 'lightningTotem',
                damage: 25,
                radius: 15,
                speed: 25,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                chain: true
            },
            scythe: {
                fireRate: 1.8,
                projectileType: 'scythe',
                damage: 28,
                radius: 6,
                speed: 14,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                returning: true
            },
            halberd: {
                fireRate: 1.4,
                projectileType: 'halberd',
                damage: 38,
                radius: 9,
                speed: 14,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false
            },
            twoHandedSword: {
                fireRate: 0.9,
                projectileType: 'twoHandedSword',
                damage: 50,
                radius: 8,
                speed: 10,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                stunning: true
            },
            nunchucks: {
                fireRate: 4.5,
                projectileType: 'nunchucks',
                damage: 16,
                radius: 6,
                speed: 25,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false
            },
            boneClub: {
                fireRate: 1.6,
                projectileType: 'boneClub',
                damage: 32,
                radius: 8,
                speed: 12,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                lifesteal: 0.1
            },
            portalGun: {
                fireRate: 0.7,
                projectileType: 'portalGun',
                damage: 45,
                radius: 18,
                speed: 5,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                teleporting: true
            },
            
            // Эпическое оружие (10 видов)
            chaosSphere: {
                fireRate: 0.3,
                projectileType: 'chaosSphere',
                damage: 60,
                radius: 12,
                speed: 10,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                random: true,
                exploding: true
            },
            runeOfPower: {
                fireRate: 0.9,
                projectileType: 'runeOfPower',
                damage: 35,
                radius: 16,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                empowering: true,
                aoe: true
            },
            astralProjection: {
                fireRate: 0.5,
                projectileType: 'astralProjection',
                damage: 40,
                radius: 28,
                speed: 20,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false,
                phase: true
            },
            electricNet: {
                fireRate: 1.5,
                projectileType: 'electricNet',
                damage: 25,
                radius: 20,
                speed: 12,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                chain: true
            },
            fireBreath: {
                fireRate: 1,
                projectileType: 'fireBreath',
                damage: 15,
                radius: 12,
                speed: 5,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                continuous: true,
                burn: true
            },
            iceBreath: {
                fireRate: 1,
                projectileType: 'iceBreath',
                damage: 12,
                radius: 14,
                speed: 5,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                continuous: true,
                freeze: true
            },
            poisonCloud: {
                fireRate: 1,
                projectileType: 'poisonCloud',
                damage: 8,
                radius: 15,
                speed: 3,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                aoe: true,
                poison: true
            },
            portal: {
                fireRate: 0.5,
                projectileType: 'portal',
                damage: 0,
                radius: 15,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                teleporting: true,
                aoe: true
            },
            boneDeath: {
                fireRate: 0.7,
                projectileType: 'boneDeath',
                damage: 35,
                radius: 16,
                speed: 14,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                instantDeath: 0.1
            },
            totem: {
                fireRate: 1.2,
                projectileType: 'totem',
                damage: 20,
                radius: 20,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                multiEffect: true,
                aoe: true
            },
            
            // Легендарное оружие (5 видов)
            shieldHammer: {
                fireRate: 1.1,
                projectileType: 'shieldHammer',
                damage: 40,
                radius: 10,
                speed: 12,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                blocking: true,
                stunning: true
            },
            divineHammer: {
                fireRate: 0.8,
                projectileType: 'divineHammer',
                damage: 70,
                radius: 25,
                speed: 15,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                lightning: true,
                exploding: true
            },
            chaos: {
                fireRate: 2.5,
                projectileType: 'chaos',
                damage: 40,
                radius: 20,
                speed: 8,
                count: 1,
                spread: 0,
                piercing: true,
                homing: false,
                random: true
            },
            phoenix: {
                fireRate: 1,
                projectileType: 'phoenix',
                damage: 0,
                radius: 25,
                speed: 0,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                resurrection: true,
                aoe: true
            },
            dragonSoul: {
                fireRate: 3,
                projectileType: 'dragonSoul',
                damage: 50,
                radius: 18,
                speed: 10,
                count: 1,
                spread: 0,
                piercing: false,
                homing: false,
                healing: true,
                burn: true
            }
        };
    }
    
    // Добавление оружия игроку
    addWeapon(player, weaponType, level = 1) {
        if (!player || !weaponType || !this.weaponData[weaponType]) {
            return false;
        }
        
        // Проверка слотов оружия
        if (player.weapons.length >= player.maxWeaponSlots) {
            return false;
        }
        
        // Проверка, что оружие еще не добавлено
        if (this.activeWeapons.has(weaponType)) {
            return false;
        }
        
        // Создание объекта оружия
        const weapon = {
            type: weaponType,
            level: level,
            data: { ...this.weaponData[weaponType] },
            active: true,
            timer: 0
        };
        
        // Применение уровня оружия
        this.applyWeaponLevel(weapon);
        
        // Добавление в активные оружия
        this.activeWeapons.set(weaponType, weapon);
        this.weaponTimers.set(weaponType, 0);
        
        // Добавление в массив оружия игрока
        player.weapons.push(weapon);
        
        return true;
    }
    
    // Улучшение оружия
    upgradeWeapon(player, weaponType) {
        const weapon = this.activeWeapons.get(weaponType);
        if (!weapon || weapon.level >= 8) {
            return false;
        }
        
        weapon.level++;
        this.applyWeaponLevel(weapon);
        
        return true;
    }
    
    // Применение уровня оружия
    applyWeaponLevel(weapon) {
        const baseData = this.weaponData[weapon.type];
        const levelMultiplier = 1 + (weapon.level - 1) * 0.1;
        
        // Улучшение характеристик
        weapon.damage = baseData.damage * levelMultiplier;
        weapon.fireRate = baseData.fireRate * (1 - (weapon.level - 1) * 0.1);
        weapon.speed = baseData.speed * levelMultiplier;
        weapon.radius = baseData.radius * (1 + (weapon.level - 1) * 0.05);
        weapon.count = baseData.count;
        weapon.spread = baseData.spread;
        weapon.piercing = baseData.piercing || (weapon.level >= 3);
        weapon.homing = baseData.homing || (weapon.level >= 5);
        
        // Специальные улучшения на высоких уровнях
        if (weapon.level >= 4) {
            weapon.exploding = baseData.exploding;
            weapon.chain = baseData.chain;
            weapon.aoe = baseData.aoe;
        }
    }
    
    // Удаление оружия
    removeWeapon(player, weaponType) {
        const weapon = this.activeWeapons.get(weaponType);
        if (!weapon) return false;
        
        weapon.active = false;
        this.activeWeapons.delete(weaponType);
        this.weaponTimers.delete(weaponType);
        
        // Удаление из массива оружия игрока
        const index = player.weapons.findIndex(w => w.type === weaponType);
        if (index > -1) {
            player.weapons.splice(index, 1);
        }
        
        return true;
    }
    
    // Обновление оружия
    updateWeapons(deltaTime, player) {
        if (!player || !player.alive) return;
        
        // Обновление таймеров
        for (const [weaponType, timer] of this.weaponTimers) {
            this.weaponTimers.set(weaponType, timer - deltaTime);
        }
        
        // Стрельба из активного оружия
        for (const [weaponType, weapon] of this.activeWeapons) {
            if (!weapon.active) continue;
            
            const timer = this.weaponTimers.get(weaponType);
            
            // Проверка возможности выстрела
            if (timer <= 0) {
                this.fireWeapon(player, weapon);
                this.weaponTimers.set(weaponType, weapon.fireRate);
            }
        }
        
        // Обновление снарядов
        this.updateProjectiles(deltaTime);
    }
    
    // Выстрел из оружия
    fireWeapon(player, weapon) {
        if (!player || !weapon || !weapon.active) return;
        
        const target = this.findNearestEnemy(player);
        const direction = target ? 
            this.getDirectionToTarget(player, target) : 
            this.getPlayerDirection(player);
        
        // Создание снарядов
        for (let i = 0; i < weapon.count; i++) {
            const spreadAngle = weapon.spread * (Math.PI / 180);
            const angle = direction.angle + (spreadAngle * (i - (weapon.count - 1) / 2));
            
            const vx = Math.cos(angle) * weapon.speed;
            const vy = Math.sin(angle) * weapon.speed;
            
            const projectile = this.entityManager.createProjectile(
                weapon.projectileType,
                player.x,
                player.y,
                vx,
                vy,
                player
            );
            
            if (projectile) {
                // Применение характеристик оружия к снаряду
                projectile.damage = weapon.damage;
                projectile.radius = weapon.radius;
                projectile.owner = player;
                
                // Специальные эффекты
                if (weapon.exploding) projectile.exploding = true;
                if (weapon.chain) projectile.chainTargetsLeft = 3;
                if (weapon.homing && target) projectile.target = target;
                if (weapon.piercing) projectile.piercesLeft = 3;
                if (weapon.bouncing) projectile.bouncesLeft = 2;
                if (weapon.returning) projectile.returning = true;
                if (weapon.phase) projectile.phase = true;
                if (weapon.continuous) projectile.continuous = true;
                if (weapon.aoe) projectile.aoe = true;
                if (weapon.random) projectile.random = true;
                if (weapon.teleporting) projectile.teleporting = true;
                if (weapon.instantDeath) projectile.instantDeath = 0.1;
                if (weapon.resurrection) projectile.resurrection = true;
                if (weapon.healing) projectile.healing = true;
                if (weapon.burn) projectile.burn = true;
                if (weapon.freeze) projectile.freeze = true;
                if (weapon.poison) projectile.poison = true;
                if (weapon.slowing) projectile.slowing = true;
                if (weapon.stunning) projectile.stunning = true;
                if (weapon.blocking) projectile.blocking = true;
                if (weapon.lightning) projectile.lightning = true;
                if (weapon.empowering) projectile.empowering = true;
                if (weapon.multiEffect) projectile.multiEffect = true;
                if (weapon.lifesteal) projectile.lifesteal = weapon.lifesteal;
                
                this.stats.shotsFired++;
            }
        }
    }
    
    // Поиск ближайшего врага
    findNearestEnemy(player) {
        if (!this.entityManager || !this.entityManager.enemies.length) {
            return null;
        }
        
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        for (const enemy of this.entityManager.enemies) {
            if (!enemy.alive) continue;
            
            const distance = this.getDistance(player, enemy);
            if (distance < nearestDistance && distance <= 200) { // Радиус обнаружения
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
    
    // Получение направления к цели
    getDirectionToTarget(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return {
            x: dx / distance,
            y: dy / distance,
            distance: distance,
            angle: Math.atan2(dy, dx)
        };
    }
    
    // Получение направления движения игрока
    getPlayerDirection(player) {
        const input = this.entityManager.game?.inputHandler;
        if (input && input.isMousePressed()) {
            const mousePos = input.getMousePosition();
            return this.getDirectionToTarget(player, { x: mousePos.x, y: mousePos.y });
        }
        
        // Если мышь не нажата, используем направление движения
        const movement = input ? input.getMovementVector() : { x: 0, y: 0 };
        if (movement.x !== 0 || movement.y !== 0) {
            return {
                x: movement.x,
                y: movement.y,
                distance: 1,
                angle: Math.atan2(movement.y, movement.x)
            };
        }
        
        // По умолчанию стреляем вверх
        return { x: 0, y: -1, distance: 1, angle: -Math.PI / 2 };
    }
    
    // Расчет расстояния
    getDistance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Обновление снарядов
    updateProjectiles(deltaTime) {
        // Снаряды обновляются через EntityManager
        // Здесь можно добавить дополнительную логику
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            activeWeapons: this.activeWeapons.size,
            totalProjectiles: this.projectiles.length
        };
    }
    
    // Сброс статистики
    resetStats() {
        this.stats = {
            shotsFired: 0,
            enemiesHit: 0,
            damageDealt: 0
        };
    }
    
    // Получение информации об оружии
    getWeaponInfo(weaponType) {
        const weapon = this.activeWeapons.get(weaponType);
        if (!weapon) return null;
        
        return {
            type: weapon.type,
            level: weapon.level,
            damage: weapon.damage,
            fireRate: weapon.fireRate,
            active: weapon.active,
            timer: this.weaponTimers.get(weaponType)
        };
    }
    
    // Получение всех активных оружий
    getActiveWeapons() {
        const weapons = [];
        for (const [type, weapon] of this.activeWeapons) {
            if (weapon.active) {
                weapons.push(this.getWeaponInfo(type));
            }
        }
        return weapons;
    }
    
    // Очистка
    clear() {
        this.activeWeapons.clear();
        this.weaponTimers.clear();
        this.projectiles = [];
        this.resetStats();
    }
    
    // Уничтожение
    destroy() {
        this.clear();
        this.weaponData = null;
        this.entityManager = null;
    }
}
