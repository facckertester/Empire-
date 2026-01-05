// Система Object Pooling для оптимизации производительности
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';
import { ExperienceOrb } from '../entities/ExperienceOrb.js';
import { Artifact } from '../entities/Artifact.js';
import { Particle } from '../entities/Particle.js';

export class ObjectPool {
    constructor() {
        // Пулы объектов
        this.playerPool = [];
        this.enemyPool = [];
        this.projectilePool = [];
        this.experienceOrbPool = [];
        this.artifactPool = [];
        this.particlePool = [];
        
        // Начальные размеры пулов
        this.initialPoolSizes = {
            player: 1,
            enemy: 100,
            projectile: 500,
            experienceOrb: 200,
            artifact: 50,
            particle: 1000
        };
        
        // Максимальные размеры пулов
        this.maxPoolSizes = {
            player: 1,
            enemy: 500,
            projectile: 2000,
            experienceOrb: 500,
            artifact: 100,
            particle: 5000
        };
        
        // Инициализация пулов
        this.initializePools();
        
        // Статистика
        this.stats = {
            created: 0,
            reused: 0,
            total: 0
        };
    }
    
    initializePools() {
        // Создание начальных объектов в пулах
        this.createPoolObjects('player', this.initialPoolSizes.player);
        this.createPoolObjects('enemy', this.initialPoolSizes.enemy);
        this.createPoolObjects('projectile', this.initialPoolSizes.projectile);
        this.createPoolObjects('experienceOrb', this.initialPoolSizes.experienceOrb);
        this.createPoolObjects('artifact', this.initialPoolSizes.artifact);
        this.createPoolObjects('particle', this.initialPoolSizes.particle);
    }
    
    createPoolObjects(type, count) {
        const pool = this.getPool(type);
        const maxSize = this.maxPoolSizes[type];
        
        // Инициализация статистики если нужно
        if (!this.stats) {
            this.stats = {
                created: 0,
                reused: 0,
                total: 0
            };
        }
        
        for (let i = 0; i < count && pool.length < maxSize; i++) {
            const object = this.createObject(type);
            if (object) {
                pool.push(object);
                this.stats.created++;
            }
        }
    }
    
    createObject(type) {
        try {
            switch (type) {
                case 'player':
                    return new Player('survivor'); // Начальный персонаж
                case 'enemy':
                    return new Enemy('zombie'); // Начальный тип врага
                case 'projectile':
                    return new Projectile();
                case 'experienceOrb':
                    return new ExperienceOrb();
                case 'artifact':
                    return new Artifact();
                case 'particle':
                    return new Particle();
                default:
                    console.warn(`Unknown object type: ${type}`);
                    return null;
            }
        } catch (error) {
            console.error(`Error creating object of type ${type}:`, error);
            return null;
        }
    }
    
    getPool(type) {
        switch (type) {
            case 'player': return this.playerPool;
            case 'enemy': return this.enemyPool;
            case 'projectile': return this.projectilePool;
            case 'experienceOrb': return this.experienceOrbPool;
            case 'artifact': return this.artifactPool;
            case 'particle': return this.particlePool;
            default: return [];
        }
    }
    
    // Методы получения объектов из пула
    getPlayer() {
        return this.getObject('player');
    }
    
    getEnemy() {
        return this.getObject('enemy');
    }
    
    getProjectile() {
        return this.getObject('projectile');
    }
    
    getExperienceOrb() {
        return this.getObject('experienceOrb');
    }
    
    getArtifact() {
        return this.getObject('artifact');
    }
    
    getParticle() {
        return this.getObject('particle');
    }
    
    getObject(type) {
        const pool = this.getPool(type);
        
        // Инициализация статистики если нужно
        if (!this.stats) {
            this.stats = {
                created: 0,
                reused: 0,
                total: 0
            };
        }
        
        if (pool.length > 0) {
            const object = pool.pop();
            this.resetObject(object);
            this.stats.reused++;
            this.stats.total++;
            return object;
        }
        
        // Если пул пуст, создаем новый объект
        const maxSize = this.maxPoolSizes[type];
        if (pool.length < maxSize) {
            const object = this.createObject(type);
            if (object) {
                this.resetObject(object);
                this.stats.created++;
                this.stats.total++;
                return object;
            }
        }
        
        console.warn(`Pool ${type} is full and cannot create more objects`);
        return null;
    }
    
    // Методы возврата объектов в пул
    returnPlayer(player) {
        this.returnObject('player', player);
    }
    
    returnEnemy(enemy) {
        this.returnObject('enemy', enemy);
    }
    
    returnProjectile(projectile) {
        this.returnObject('projectile', projectile);
    }
    
    returnExperienceOrb(orb) {
        this.returnObject('experienceOrb', orb);
    }
    
    returnArtifact(artifact) {
        this.returnObject('artifact', artifact);
    }
    
    returnParticle(particle) {
        this.returnObject('particle', particle);
    }
    
    returnObject(type, object) {
        if (!object) return;
        
        const pool = this.getPool(type);
        const maxSize = this.maxPoolSizes[type];
        
        if (pool.length < maxSize) {
            this.cleanupObject(object);
            pool.push(object);
        }
    }
    
    // Сброс объекта в начальное состояние
    resetObject(object) {
        if (!object) return;
        
        // Сброс общих свойств
        object.x = 0;
        object.y = 0;
        object.vx = 0;
        object.vy = 0;
        object.active = true;
        object.alive = true;
        
        // Специфический сброс для разных типов
        if (object.reset) {
            object.reset();
        }
    }
    
    // Очистка объекта перед возвратом в пул
    cleanupObject(object) {
        if (!object) return;
        
        // Деактивация объекта
        object.active = false;
        object.alive = false;
        
        // Очистка специфических свойств
        if (object.cleanup) {
            object.cleanup();
        }
        
        // Сброс таймеров
        if (object.timers) {
            Object.keys(object.timers).forEach(key => {
                object.timers[key] = 0;
            });
        }
        
        // Очистка массивов
        if (object.effects) {
            object.effects = [];
        }
        
        if (object.children) {
            object.children = [];
        }
    }
    
    // Методы для управления пулами
    expandPool(type, count) {
        this.createPoolObjects(type, count);
    }
    
    shrinkPool(type, targetSize) {
        const pool = this.getPool(type);
        while (pool.length > targetSize) {
            pool.pop();
        }
    }
    
    clearPool(type) {
        const pool = this.getPool(type);
        pool.length = 0;
    }
    
    clearAllPools() {
        this.playerPool = [];
        this.enemyPool = [];
        this.projectilePool = [];
        this.experienceOrbPool = [];
        this.artifactPool = [];
        this.particlePool = [];
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            poolSizes: {
                player: this.playerPool.length,
                enemy: this.enemyPool.length,
                projectile: this.projectilePool.length,
                experienceOrb: this.experienceOrbPool.length,
                artifact: this.artifactPool.length,
                particle: this.particlePool.length
            },
            efficiency: this.stats.reused / (this.stats.total || 1)
        };
    }
    
    // Оптимизация пулов на основе использования
    optimizePools() {
        const stats = this.getStats();
        
        // Если эффективность использования низкая, увеличиваем пулы
        if (stats.efficiency < 0.5) {
            Object.keys(stats.poolSizes).forEach(type => {
                const currentSize = stats.poolSizes[type];
                const maxSize = this.maxPoolSizes[type];
                if (currentSize < maxSize * 0.8) {
                    this.expandPool(type, Math.floor(maxSize * 0.1));
                }
            });
        }
        
        // Если пулы слишком большие, уменьшаем их
        Object.keys(stats.poolSizes).forEach(type => {
            const currentSize = stats.poolSizes[type];
            const initialSize = this.initialPoolSizes[type];
            if (currentSize > initialSize * 2) {
                this.shrinkPool(type, Math.floor(currentSize * 0.8));
            }
        });
    }
    
    // Сброс статистики
    resetStats() {
        this.stats = {
            created: 0,
            reused: 0,
            total: 0
        };
    }
    
    // Пре-варминг пулов (создание объектов заранее)
    preWarmPools() {
        Object.keys(this.initialPoolSizes).forEach(type => {
            const currentSize = this.getPool(type).length;
            const targetSize = this.initialPoolSizes[type];
            if (currentSize < targetSize) {
                this.createPoolObjects(type, targetSize - currentSize);
            }
        });
    }
    
    // Очистка неиспользуемых объектов
    garbageCollection() {
        // Принудительная очистка пулов от "мертвых" объектов
        Object.keys(this.maxPoolSizes).forEach(type => {
            const pool = this.getPool(type);
            for (let i = pool.length - 1; i >= 0; i--) {
                const object = pool[i];
                if (object.active || object.alive) {
                    // Объект все еще используется, перемещаем в конец
                    pool.splice(i, 1);
                    pool.push(object);
                }
            }
        });
    }
    
    // Получение информации о памяти
    getMemoryInfo() {
        const stats = this.getStats();
        let totalObjects = 0;
        
        Object.values(stats.poolSizes).forEach(size => {
            totalObjects += size;
        });
        
        return {
            totalObjects,
            poolSizes: stats.poolSizes,
            efficiency: stats.efficiency,
            memoryUsage: this.estimateMemoryUsage()
        };
    }
    
    estimateMemoryUsage() {
        // Приблизительная оценка использования памяти в байтах
        const stats = this.getStats();
        let totalBytes = 0;
        
        // Примерные размеры объектов
        const objectSizes = {
            player: 1024,      // ~1 KB
            enemy: 512,        // ~512 B
            projectile: 256,    // ~256 B
            experienceOrb: 128, // ~128 B
            artifact: 384,     // ~384 B
            particle: 64       // ~64 B
        };
        
        Object.keys(stats.poolSizes).forEach(type => {
            const count = stats.poolSizes[type];
            const size = objectSizes[type] || 256;
            totalBytes += count * size;
        });
        
        return totalBytes;
    }
    
    // Метод для уничтожения ObjectPool
    destroy() {
        // Очистка всех пулов
        this.clearAllPools();
        
        // Очистка статистики
        this.stats = {
            created: 0,
            reused: 0,
            total: 0
        };
        
        // Очистка ссылок
        this.playerPool = null;
        this.enemyPool = null;
        this.projectilePool = null;
        this.experienceOrbPool = null;
        this.artifactPool = null;
        this.particlePool = null;
    }
}
