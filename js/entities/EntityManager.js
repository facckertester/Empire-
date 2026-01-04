// Менеджер сущностей - Entity Component System
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';
import { ExperienceOrb } from './ExperienceOrb.js';
import { Artifact } from './Artifact.js';
import { Particle } from './Particle.js';
import { WeaponSystem } from '../systems/WeaponSystem.js';

export class EntityManager {
    constructor(objectPool) {
        this.objectPool = objectPool;
        
        // Массивы сущностей
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.experienceOrbs = [];
        this.artifacts = [];
        this.particles = [];
        
        // Системы для обработки сущностей
        this.systems = [];
        this.weaponSystem = new WeaponSystem(this);
        
        // Очереди для добавления/удаления сущностей
        this.toAdd = {
            enemies: [],
            projectiles: [],
            experienceOrbs: [],
            artifacts: [],
            particles: []
        };
        
        this.toRemove = {
            enemies: [],
            projectiles: [],
            experienceOrbs: [],
            artifacts: [],
            particles: []
        };
    }
    
    update(deltaTime) {
        // Обновление игрока
        if (this.player) {
            this.player.update(deltaTime);
            this.weaponSystem.updateWeapons(deltaTime, this.player);
        }
        
        // Обновление врагов
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Обновление снарядов
        this.projectiles.forEach(projectile => projectile.update(deltaTime));
        
        // Обновление орбов опыта
        this.experienceOrbs.forEach(orb => orb.update(deltaTime));
        
        // Обновление артефактов
        this.artifacts.forEach(artifact => artifact.update(deltaTime));
        
        // Обновление частиц
        this.particles.forEach(particle => particle.update(deltaTime));
        
        // Добавление новых сущностей
        this.processAddQueue();
        
        // Удаление помеченных сущностей
        this.processRemoveQueue();
        
        // Обработка систем
        this.systems.forEach(system => system.update(this, deltaTime));
        
        // Обработка опыта (притяжение к игроку)
        this.processExperienceCollection();
    }
    
    processAddQueue() {
        // Добавление врагов
        this.toAdd.enemies.forEach(enemy => {
            this.enemies.push(enemy);
        });
        this.toAdd.enemies = [];
        
        // Добавление снарядов
        this.toAdd.projectiles.forEach(projectile => {
            this.projectiles.push(projectile);
        });
        this.toAdd.projectiles = [];
        
        // Добавление орбов опыта
        this.toAdd.experienceOrbs.forEach(orb => {
            this.experienceOrbs.push(orb);
        });
        this.toAdd.experienceOrbs = [];
        
        // Добавление артефактов
        this.toAdd.artifacts.forEach(artifact => {
            this.artifacts.push(artifact);
        });
        this.toAdd.artifacts = [];
        
        // Добавление частиц
        this.toAdd.particles.forEach(particle => {
            this.particles.push(particle);
        });
        this.toAdd.particles = [];
    }
    
    processRemoveQueue() {
        // Удаление врагов
        this.toRemove.enemies.forEach(enemy => {
            const index = this.enemies.indexOf(enemy);
            if (index > -1) {
                this.enemies.splice(index, 1);
                this.objectPool.returnEnemy(enemy);
            }
        });
        this.toRemove.enemies = [];
        
        // Удаление снарядов
        this.toRemove.projectiles.forEach(projectile => {
            const index = this.projectiles.indexOf(projectile);
            if (index > -1) {
                this.projectiles.splice(index, 1);
                this.objectPool.returnProjectile(projectile);
            }
        });
        this.toRemove.projectiles = [];
        
        // Удаление орбов опыта
        this.toRemove.experienceOrbs.forEach(orb => {
            const index = this.experienceOrbs.indexOf(orb);
            if (index > -1) {
                this.experienceOrbs.splice(index, 1);
                this.objectPool.returnExperienceOrb(orb);
            }
        });
        this.toRemove.experienceOrbs = [];
        
        // Удаление артефактов
        this.toRemove.artifacts.forEach(artifact => {
            const index = this.artifacts.indexOf(artifact);
            if (index > -1) {
                this.artifacts.splice(index, 1);
                this.objectPool.returnArtifact(artifact);
            }
        });
        this.toRemove.artifacts = [];
        
        // Удаление частиц
        this.toRemove.particles.forEach(particle => {
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
                this.objectPool.returnParticle(particle);
            }
        });
        this.toRemove.particles = [];
    }
    
    // Методы создания сущностей
    createPlayer(characterType = 'survivor') {
        this.player = this.objectPool.getPlayer();
        this.player.init(characterType);
        this.player.setPosition(960, 540); // Центр экрана
        return this.player;
    }
    
    createEnemy(type, x, y) {
        const enemy = this.objectPool.getEnemy();
        enemy.init(type);
        enemy.setPosition(x, y);
        this.toAdd.enemies.push(enemy);
        return enemy;
    }
    
    createProjectile(type, x, y, vx, vy, owner) {
        const projectile = this.objectPool.getProjectile();
        projectile.init(type, x, y, vx, vy, owner);
        this.toAdd.projectiles.push(projectile);
        return projectile;
    }
    
    createExperienceOrb(x, y, value) {
        const orb = this.objectPool.getExperienceOrb();
        orb.init(x, y, value);
        this.toAdd.experienceOrbs.push(orb);
        return orb;
    }
    
    createArtifact(type, x, y) {
        const artifact = this.objectPool.getArtifact();
        artifact.init(type, x, y);
        this.toAdd.artifacts.push(artifact);
        return artifact;
    }
    
    createParticle(x, y, vx, vy, color, lifetime) {
        const particle = this.objectPool.getParticle();
        particle.init(x, y, vx, vy, color, lifetime);
        this.toAdd.particles.push(particle);
        return particle;
    }
    
    // Методы удаления сущностей
    removeEnemy(enemy) {
        if (!this.toRemove.enemies.includes(enemy)) {
            this.toRemove.enemies.push(enemy);
        }
    }
    
    removeProjectile(projectile) {
        if (!this.toRemove.projectiles.includes(projectile)) {
            this.toRemove.projectiles.push(projectile);
        }
    }
    
    removeExperienceOrb(orb) {
        if (!this.toRemove.experienceOrbs.includes(orb)) {
            this.toRemove.experienceOrbs.push(orb);
        }
    }
    
    removeArtifact(artifact) {
        if (!this.toRemove.artifacts.includes(artifact)) {
            this.toRemove.artifacts.push(artifact);
        }
    }
    
    removeParticle(particle) {
        if (!this.toRemove.particles.includes(particle)) {
            this.toRemove.particles.push(particle);
        }
    }
    
    // Методы для работы с системами
    addSystem(system) {
        this.systems.push(system);
    }
    
    removeSystem(system) {
        const index = this.systems.indexOf(system);
        if (index > -1) {
            this.systems.splice(index, 1);
        }
    }
    
    // Обработка опыта (притяжение к игроку)
    processExperienceCollection() {
        if (!this.player) return;
        
        this.experienceOrbs.forEach(orb => {
            if (orb.alive && !orb.collected) {
                orb.magnetize(this.player.x, this.player.y, this.player.experienceMagnetRadius);
            }
        });
    }
    
    // Методы для работы с оружием
    addWeaponToPlayer(weaponType) {
        if (this.player) {
            return this.weaponSystem.addWeapon(this.player, weaponType);
        }
        return false;
    }
    
    upgradePlayerWeapon(weaponType) {
        if (this.player) {
            return this.weaponSystem.upgradeWeapon(this.player, weaponType);
        }
        return false;
    }
    
    getPlayerWeaponInfo() {
        if (this.player) {
            return this.weaponSystem.getActiveWeapons();
        }
        return [];
    }
    
    getEnemiesInRadius(x, y, radius) {
        return this.enemies.filter(enemy => {
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }
    
    getProjectilesInRadius(x, y, radius) {
        return this.projectiles.filter(projectile => {
            const dx = projectile.x - x;
            const dy = projectile.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }
    
    getArtifactsInRadius(x, y, radius) {
        return this.artifacts.filter(artifact => {
            const dx = artifact.x - x;
            const dy = artifact.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }
    
    // Методы для очистки
    clear() {
        // Возвращение всех сущностей в пул
        if (this.player) {
            this.objectPool.returnPlayer(this.player);
            this.player = null;
        }
        
        this.enemies.forEach(enemy => this.objectPool.returnEnemy(enemy));
        this.enemies = [];
        
        this.projectiles.forEach(projectile => this.objectPool.returnProjectile(projectile));
        this.projectiles = [];
        
        this.experienceOrbs.forEach(orb => this.objectPool.returnExperienceOrb(orb));
        this.experienceOrbs = [];
        
        this.artifacts.forEach(artifact => this.objectPool.returnArtifact(artifact));
        this.artifacts = [];
        
        this.particles.forEach(particle => this.objectPool.returnParticle(particle));
        this.particles = [];
        
        // Очистка очередей
        this.toAdd.enemies = [];
        this.toAdd.projectiles = [];
        this.toAdd.experienceOrbs = [];
        this.toAdd.artifacts = [];
        this.toAdd.particles = [];
        
        this.toRemove.enemies = [];
        this.toRemove.projectiles = [];
        this.toRemove.experienceOrbs = [];
        this.toRemove.artifacts = [];
        this.toRemove.particles = [];
    }
    
    // Метод для добавления в spatial hashing
    addToSpatialHashing(spatialHashing) {
        if (this.player) {
            spatialHashing.add(this.player);
        }
        
        this.enemies.forEach(enemy => spatialHashing.add(enemy));
        this.projectiles.forEach(projectile => spatialHashing.add(projectile));
        this.experienceOrbs.forEach(orb => spatialHashing.add(orb));
        this.artifacts.forEach(artifact => spatialHashing.add(artifact));
    }
    
    // Получение статистики
    getStats() {
        return {
            enemies: this.enemies.length,
            projectiles: this.projectiles.length,
            experienceOrbs: this.experienceOrbs.length,
            artifacts: this.artifacts.length,
            particles: this.particles.length
        };
    }
    
    // Метод для сброса EntityManager
    reset() {
        this.clear();
        
        // Сброс систем
        if (this.weaponSystem) {
            this.weaponSystem.reset();
        }
        
        // Очистка систем
        this.systems = [];
    }
    
    // Метод для уничтожения EntityManager
    destroy() {
        this.clear();
        
        if (this.weaponSystem) {
            this.weaponSystem.destroy();
        }
        
        // Очистка всех ссылок
        this.objectPool = null;
        this.weaponSystem = null;
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.experienceOrbs = [];
        this.artifacts = [];
        this.particles = [];
        this.systems = [];
        this.toAdd = {
            enemies: [],
            projectiles: [],
            experienceOrbs: [],
            artifacts: [],
            particles: []
        };
        this.toRemove = {
            enemies: [],
            projectiles: [],
            experienceOrbs: [],
            artifacts: [],
            particles: []
        };
    }
}
