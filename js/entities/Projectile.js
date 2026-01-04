// Класс снаряда
export class Projectile {
    constructor() {
        // Базовые характеристики
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 5;
        
        // Характеристики снаряда
        this.damage = 10;
        this.speed = 10;
        this.type = 'magic';
        this.owner = null;
        
        // Поведение
        this.piercing = false;
        this.homing = false;
        this.exploding = false;
        this.splitting = false;
        this.chain = false;
        this.bouncing = false;
        
        // Эффекты
        this.poison = false;
        this.freeze = false;
        this.burn = false;
        this.slow = false;
        
        // Таймеры и счетчики
        this.lifetime = 5;
        this.age = 0;
        this.piercesLeft = 0;
        this.bouncesLeft = 0;
        this.chainTargetsLeft = 0;
        this.splitsLeft = 0;
        
        // Визуальные эффекты
        this.trail = true;
        this.glow = true;
        this.color = '#FFC107';
        
        // Флаги
        this.active = true;
        this.alive = true;
        this.hit = false;
        
        // Цели для хоуминга и цепей
        this.target = null;
        this.hitTargets = new Set();
        
        // Уникальный ID
        this.id = Date.now() + Math.random();
    }
    
    init(type, x, y, vx, vy, owner) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.owner = owner;
        
        this.loadProjectileData(type);
        this.reset();
    }
    
    loadProjectileData(type) {
        // Базовое оружие (5 видов)
        const basicProjectiles = {
            magic: {
                damage: 10, speed: 15, radius: 5, lifetime: 3,
                color: '#FF9800', piercing: false, trail: true
            },
            arrow: {
                damage: 12, speed: 20, radius: 3, lifetime: 2,
                color: '#8BC34A', piercing: true, trail: false
            },
            bolt: {
                damage: 25, speed: 25, radius: 4, lifetime: 1.5,
                color: '#FFC107', piercing: true, trail: false
            },
            knife: {
                damage: 15, speed: 18, radius: 3, lifetime: 1,
                color: '#795548', piercing: false, bouncing: true, bouncesLeft: 2
            },
            club: {
                damage: 20, speed: 10, radius: 8, lifetime: 0.8,
                color: '#795548', exploding: true, trail: false
            }
        };
        
        // Обычное оружие (15 видов)
        const commonProjectiles = {
            fireball: {
                damage: 20, speed: 12, radius: 8, lifetime: 2.5,
                color: '#FF5722', exploding: true, burn: true, trail: true
            },
            iceArrow: {
                damage: 15, speed: 18, radius: 4, lifetime: 2,
                color: '#03A9F4', freeze: true, piercing: true
            },
            lightning: {
                damage: 25, speed: 30, radius: 3, lifetime: 0.5,
                color: '#FFEB3B', chain: true, chainTargetsLeft: 3
            },
            throwingStar: {
                damage: 8, speed: 22, radius: 3, lifetime: 1.5,
                color: '#607D8B', piercing: true, count: 3
            },
            axe: {
                damage: 35, speed: 8, radius: 10, lifetime: 3,
                color: '#795548', bouncing: true, bouncesLeft: 1
            },
            katana: {
                damage: 20, speed: 15, radius: 4, lifetime: 1,
                color: '#FAFAFA', piercing: false
            },
            turret: {
                damage: 15, speed: 20, radius: 4, lifetime: 2,
                color: '#FF5722', homing: true
            },
            mine: {
                damage: 60, speed: 0, radius: 12, lifetime: 10,
                color: '#F44336', exploding: true, triggerRadius: 30
            },
            poisonClaw: {
                damage: 12, speed: 16, radius: 4, lifetime: 1.2,
                color: '#4CAF50', poison: true, piercing: false
            },
            soundWave: {
                damage: 16, speed: 25, radius: 15, lifetime: 0.8,
                color: '#9C27B0', piercing: true, pushForce: 100
            },
            healingCrystal: {
                damage: 15, speed: 14, radius: 6, lifetime: 2,
                color: '#00BCD4', healing: true, piercing: false
            },
            boomerang: {
                damage: 18, speed: 12, radius: 5, lifetime: 2,
                color: '#FF9800', returning: true
            },
            spear: {
                damage: 30, speed: 20, radius: 4, lifetime: 1.8,
                color: '#795548', piercing: true
            },
            whip: {
                damage: 22, speed: 15, radius: 3, lifetime: 1.5,
                color: '#795548', piercing: true, chain: true
            },
            laser: {
                damage: 28, speed: 40, radius: 2, lifetime: 1,
                color: '#F44336', piercing: true, trail: true
            },
            ghostBlade: {
                damage: 22, speed: 17, radius: 4, lifetime: 1.8,
                color: '#E91E63', piercing: true, phase: true
            }
        };
        
        // Редкое оружие (15 видов)
        const rareProjectiles = {
            earthquake: {
                damage: 30, speed: 0, radius: 20, lifetime: 0.5,
                color: '#795548', exploding: true, aoe: true
            },
            shadowDagger: {
                damage: 35, speed: 20, radius: 4, lifetime: 2,
                color: '#9E9E9E', piercing: true, phase: true
            },
            lightBeam: {
                damage: 40, speed: 50, radius: 3, lifetime: 1.5,
                color: '#FFEB3B', piercing: true, continuous: true
            },
            whirlwind: {
                damage: 50, speed: 8, radius: 12, lifetime: 4,
                color: '#03A9F4', pulling: true, piercing: false
            },
            gravityField: {
                damage: 10, speed: 0, radius: 15, lifetime: 3,
                color: '#9C27B0', slowing: true, aoe: true
            },
            rocket: {
                damage: 80, speed: 15, radius: 8, lifetime: 2.5,
                color: '#FF5722', exploding: true, trail: true
            },
            lightningTotem: {
                damage: 25, speed: 25, radius: 3, lifetime: 0.3,
                color: '#FFEB3B', chain: true, chainTargetsLeft: 3
            },
            scythe: {
                damage: 28, radius: 6, lifetime: 2,
                color: '#795548', returning: true, piercing: false
            },
            halberd: {
                damage: 38, speed: 14, radius: 5, lifetime: 1.8,
                color: '#795548', piercing: true
            },
            twoHandedSword: {
                damage: 50, speed: 10, radius: 8, lifetime: 1.5,
                color: '#795548', stunning: true
            },
            nunchucks: {
                damage: 16, speed: 25, radius: 3, lifetime: 1,
                color: '#795548', count: 2
            },
            boneClub: {
                damage: 32, speed: 12, radius: 7, lifetime: 1.8,
                color: '#FAFAFA', lifesteal: 0.1
            },
            portalGun: {
                damage: 45, speed: 18, radius: 5, lifetime: 2,
                color: '#9C27B0', teleporting: true
            },
            timeCrystal: {
                damage: 0, speed: 0, radius: 20, lifetime: 2,
                color: '#3F51B5', timeSlow: true, aoe: true
            },
            spellBook: {
                damage: 30, speed: 16, radius: 6, lifetime: 2.2,
                color: '#673AB7', random: true
            }
        };
        
        // Эпическое оружие (10 видов)
        const epicProjectiles = {
            chaosSphere: {
                damage: 60, speed: 10, radius: 10, lifetime: 3,
                color: '#E91E63', random: true, exploding: true
            },
            runeOfPower: {
                damage: 35, speed: 15, radius: 8, lifetime: 2.5,
                color: '#FFD700', empowering: true, aoe: true
            },
            astralProjection: {
                damage: 40, speed: 20, radius: 4, lifetime: 3,
                color: '#3F51B5', phase: true, piercing: true
            },
            electricNet: {
                damage: 25, speed: 12, radius: 3, lifetime: 2,
                color: '#FFEB3B', chain: true, chainTargetsLeft: 5
            },
            fireBreath: {
                damage: 15, speed: 5, radius: 12, lifetime: 1,
                color: '#FF5722', continuous: true, burn: true
            },
            iceBreath: {
                damage: 12, speed: 5, radius: 14, lifetime: 1,
                color: '#03A9F4', continuous: true, freeze: true
            },
            poisonCloud: {
                damage: 8, speed: 3, radius: 15, lifetime: 4,
                color: '#4CAF50', aoe: true, poison: true
            },
            portal: {
                damage: 0, speed: 0, radius: 10, lifetime: 5,
                color: '#9C27B0', teleporting: true, aoe: true
            },
            boneDeath: {
                damage: 35, speed: 14, radius: 8, lifetime: 2,
                color: '#FAFAFA', instantDeath: 0.1
            },
            totem: {
                damage: 20, speed: 0, radius: 15, lifetime: 10,
                color: '#795548', multiEffect: true, aoe: true
            }
        };
        
        // Легендарное оружие (5 видов)
        const legendaryProjectiles = {
            shieldHammer: {
                damage: 40, speed: 12, radius: 10, lifetime: 1.5,
                color: '#795548', blocking: true, stunning: true
            },
            divineHammer: {
                damage: 70, speed: 15, radius: 12, lifetime: 2,
                color: '#FFD700', lightning: true, exploding: true
            },
            chaos: {
                damage: 40, speed: 20, radius: 8, lifetime: 2.5,
                color: '#E91E63', random: true, piercing: true
            },
            phoenix: {
                damage: 0, speed: 0, radius: 20, lifetime: 1,
                color: '#FF5722', resurrection: true, aoe: true
            },
            dragonSoul: {
                damage: 50, speed: 18, radius: 10, lifetime: 3,
                color: '#FF5722', healing: true, burn: true
            }
        };
        
        // Объединение всех типов снарядов
        const allProjectiles = { 
            ...basicProjectiles, 
            ...commonProjectiles, 
            ...rareProjectiles, 
            ...epicProjectiles, 
            ...legendaryProjectiles 
        };
        
        const projectileData = allProjectiles[type] || allProjectiles.magic;
        
        // Применение характеристик
        this.damage = projectileData.damage;
        this.speed = projectileData.speed;
        this.radius = projectileData.radius;
        this.lifetime = projectileData.lifetime;
        this.color = projectileData.color;
        
        // Поведение
        this.piercing = projectileData.piercing || false;
        this.homing = projectileData.homing || false;
        this.exploding = projectileData.exploding || false;
        this.splitting = projectileData.splitting || false;
        this.chain = projectileData.chain || false;
        this.bouncing = projectileData.bouncing || false;
        this.trail = projectileData.trail !== false;
        this.glow = projectileData.glow !== false;
        
        // Эффекты
        this.poison = projectileData.poison || false;
        this.freeze = projectileData.freeze || false;
        this.burn = projectileData.burn || false;
        this.slow = projectileData.slow || false;
        
        // Специальные свойства
        this.count = projectileData.count || 1;
        this.piercesLeft = projectileData.piercing ? 3 : 0;
        this.bouncesLeft = projectileData.bouncesLeft || 0;
        this.chainTargetsLeft = projectileData.chainTargetsLeft || 0;
        this.splitsLeft = projectileData.splitsLeft || 0;
        this.triggerRadius = projectileData.triggerRadius || 0;
        this.pushForce = projectileData.pushForce || 0;
        this.healing = projectileData.healing || false;
        this.returning = projectileData.returning || false;
        this.phase = projectileData.phase || false;
        this.continuous = projectileData.continuous || false;
        this.pulling = projectileData.pulling || false;
        this.stunning = projectileData.stunning || false;
        this.lifesteal = projectileData.lifesteal || 0;
        this.teleporting = projectileData.teleporting || false;
        this.timeSlow = projectileData.timeSlow || false;
        this.empowering = projectileData.empowering || false;
        this.instantDeath = projectileData.instantDeath || 0;
        this.multiEffect = projectileData.multiEffect || false;
        this.blocking = projectileData.blocking || false;
        this.lightning = projectileData.lightning || false;
        this.resurrection = projectileData.resurrection || false;
        this.random = projectileData.random || false;
        this.aoe = projectileData.aoe || false;
    }
    
    reset() {
        this.age = 0;
        this.active = true;
        this.alive = true;
        this.hit = false;
        this.target = null;
        this.hitTargets.clear();
        
        // Сброс счетчиков
        this.piercesLeft = this.piercing ? 3 : 0;
        this.bouncesLeft = this.bouncesLeft || 0;
        this.chainTargetsLeft = this.chainTargetsLeft || 0;
        this.splitsLeft = this.splitsLeft || 0;
    }
    
    update(deltaTime) {
        if (!this.active || !this.alive) return;
        
        // Обновление возраста
        this.age += deltaTime;
        
        // Проверка времени жизни
        if (this.age >= this.lifetime) {
            this.alive = false;
            if (this.exploding) {
                this.explode();
            }
            return;
        }
        
        // Обновление движения
        this.updateMovement(deltaTime);
        
        // Специальное поведение
        this.updateSpecialBehavior(deltaTime);
        
        // Проверка границ
        this.checkBounds();
    }
    
    updateMovement(deltaTime) {
        // Хоуминг
        if (this.homing && this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const homingStrength = 0.1;
                this.vx += (dx / distance) * this.speed * homingStrength * deltaTime * 60;
                this.vy += (dy / distance) * this.speed * homingStrength * deltaTime * 60;
                
                // Нормализация скорости
                const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (currentSpeed > this.speed) {
                    this.vx = (this.vx / currentSpeed) * this.speed;
                    this.vy = (this.vy / currentSpeed) * this.speed;
                }
            }
        }
        
        // Возвращающийся снаряд
        if (this.returning && this.age > this.lifetime * 0.6) {
            if (this.owner) {
                const dx = this.owner.x - this.x;
                const dy = this.owner.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    this.vx = (dx / distance) * this.speed * 1.5;
                    this.vy = (dy / distance) * this.speed * 1.5;
                }
            }
        }
        
        // Обновление позиции
        this.x += this.vx * deltaTime * 60;
        this.y += this.vy * deltaTime * 60;
    }
    
    updateSpecialBehavior(deltaTime) {
        // Непрерывный эффект (луч, дыхание)
        if (this.continuous) {
            this.applyContinuousEffect();
        }
        
        // Эффект замедления времени
        if (this.timeSlow) {
            this.applyTimeSlow();
        }
        
        // Случайные эффекты
        if (this.random) {
            this.applyRandomEffect();
        }
    }
    
    applyContinuousEffect() {
        // Применение непрерывного урона в области
        // Будет реализовано в системе коллизий
    }
    
    applyTimeSlow() {
        // Замедление времени в области
        // Будет реализовано в системе игры
    }
    
    applyRandomEffect() {
        // Случайный эффект каждый кадр
        if (Math.random() < 0.1) {
            const effects = ['explode', 'split', 'chain', 'heal'];
            const effect = effects[Math.floor(Math.random() * effects.length)];
            
            switch (effect) {
                case 'explode':
                    this.explode();
                    break;
                case 'split':
                    this.split();
                    break;
                case 'chain':
                    this.chain();
                    break;
                case 'heal':
                    this.heal();
                    break;
            }
        }
    }
    
    checkBounds() {
        // Проверка выхода за границы мира
        if (this.x < -50 || this.x > 1970 || this.y < -50 || this.y > 1130) {
            this.alive = false;
        }
    }
    
    onHit(target) {
        if (this.hitTargets.has(target)) return false;
        
        this.hitTargets.add(target);
        
        // Нанесение урона
        let damage = this.damage;
        
        // Мгновенная смерть
        if (this.instantDeath > 0 && Math.random() < this.instantDeath) {
            damage = 9999;
        }
        
        const success = target.takeDamage(damage);
        
        if (success) {
            // Применение эффектов
            this.applyHitEffects(target);
            
            // Вампиризм
            if (this.lifesteal > 0 && this.owner) {
                this.owner.heal(damage * this.lifesteal);
            }
            
            // Лечение
            if (this.healing && this.owner) {
                this.owner.heal(damage * 0.5);
            }
            
            // Обработка поведения при попадании
            if (this.piercing && this.piercesLeft > 0) {
                this.piercesLeft--;
                return true; // Продолжить полет
            }
            
            if (this.bouncing && this.bouncesLeft > 0) {
                this.bounce(target);
                return true; // Продолжить полет
            }
            
            if (this.chain && this.chainTargetsLeft > 0) {
                this.chainToNext(target);
                return true; // Продолжить полет
            }
            
            if (this.splitting && this.splitsLeft > 0) {
                this.split();
            }
            
            // Взрыв при попадании
            if (this.exploding) {
                this.explode();
            }
            
            this.alive = false;
        }
        
        return false;
    }
    
    applyHitEffects(target) {
        if (this.poison) {
            target.addEffect('poisoned', 5);
        }
        
        if (this.freeze) {
            target.addEffect('frozen', 2);
        }
        
        if (this.burn) {
            target.addEffect('burned', 3);
        }
        
        if (this.slow) {
            target.addEffect('slowed', 3);
        }
        
        if (this.stunning) {
            target.addEffect('stunned', 1);
        }
        
        if (this.pushForce > 0) {
            this.applyPushForce(target);
        }
    }
    
    applyPushForce(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const force = this.pushForce / distance;
            target.vx += (dx / distance) * force;
            target.vy += (dy / distance) * force;
        }
    }
    
    bounce(target) {
        this.bouncesLeft--;
        
        // Отскок от цели
        const dx = this.x - target.x;
        const dy = this.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Отражение вектора скорости
            const normal = { x: dx / distance, y: dy / distance };
            const dot = this.vx * normal.x + this.vy * normal.y;
            
            this.vx -= 2 * dot * normal.x;
            this.vy -= 2 * dot * normal.y;
            
            // Немного смещаемся от цели
            this.x += normal.x * 5;
            this.y += normal.y * 5;
        }
    }
    
    chainToNext(currentTarget) {
        this.chainTargetsLeft--;
        
        // Поиск следующей цели
        // Будет реализовано в EntityManager
        this.target = null; // Временно
    }
    
    split() {
        this.splitsLeft--;
        
        // Создание нескольких новых снарядов
        // Будет реализовано в EntityManager
    }
    
    explode() {
        // Создание взрыва
        // Будет реализовано в EntityManager
    }
    
    heal() {
        // Лечение nearby союзников
        // Будет реализовано в EntityManager
    }
    
    // Геттеры
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    
    getDirection() {
        const speed = this.getSpeed();
        if (speed === 0) return { x: 0, y: 1 };
        return { x: this.vx / speed, y: this.vy / speed };
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
        this.owner = null;
        this.target = null;
        this.hitTargets.clear();
    }
}
