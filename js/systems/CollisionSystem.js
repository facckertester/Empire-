// Система обработки коллизий
export class CollisionSystem {
    constructor(spatialHashing) {
        this.spatialHashing = spatialHashing;
        
        // Типы коллизий
        this.collisionTypes = {
            playerEnemy: 'player-enemy',
            playerProjectile: 'player-projectile',
            enemyProjectile: 'enemy-projectile',
            projectileEnemy: 'projectile-enemy',
            playerExperience: 'player-experience',
            playerArtifact: 'player-artifact'
        };
        
        // Обратные вызовы для обработки коллизий
        this.callbacks = {};
        
        // Статистика
        this.stats = {
            totalChecks: 0,
            actualCollisions: 0,
            playerHits: 0,
            enemyHits: 0,
            experienceCollected: 0,
            artifactsCollected: 0
        };
    }
    
    init() {
        // Настройка обратных вызовов
        this.setupCallbacks();
    }
    
    setupCallbacks() {
        // Коллбэки будут установлены при интеграции с Game
        this.callbacks.onPlayerHit = (damage, enemy) => {};
        this.callbacks.onEnemyHit = (damage, projectile, enemy) => {};
        this.callbacks.onExperienceCollected = (value, orb) => {};
        this.callbacks.onArtifactCollected = (artifact) => {};
        this.callbacks.onProjectileHit = (projectile, target) => {};
    }
    
    update(deltaTime) {
        if (!this.spatialHashing) return;
        
        // Получение всех коллизий
        const collisions = this.spatialHashing.getAllCollisions();
        
        // Обработка коллизий
        this.processCollisions(collisions);
        
        // Обновление статистики
        this.stats.totalChecks += collisions.length;
    }
    
    processCollisions(collisions) {
        for (const [obj1, obj2] of collisions) {
            this.handleCollision(obj1, obj2);
        }
    }
    
    handleCollision(obj1, obj2) {
        const collisionType = this.getCollisionType(obj1, obj2);
        
        switch (collisionType) {
            case this.collisionTypes.playerEnemy:
                this.handlePlayerEnemyCollision(obj1, obj2);
                break;
            case this.collisionTypes.playerProjectile:
                this.handlePlayerProjectileCollision(obj1, obj2);
                break;
            case this.collisionTypes.projectileEnemy:
                this.handleProjectileEnemyCollision(obj1, obj2);
                break;
            case this.collisionTypes.playerExperience:
                this.handlePlayerExperienceCollision(obj1, obj2);
                break;
            case this.collisionTypes.playerArtifact:
                this.handlePlayerArtifactCollision(obj1, obj2);
                break;
        }
    }
    
    getCollisionType(obj1, obj2) {
        // Определение типов объектов
        const type1 = this.getObjectType(obj1);
        const type2 = this.getObjectType(obj2);
        
        // Проверка комбинаций
        if (type1 === 'player' && type2 === 'enemy') return this.collisionTypes.playerEnemy;
        if (type1 === 'enemy' && type2 === 'player') return this.collisionTypes.playerEnemy;
        
        if (type1 === 'player' && type2 === 'projectile') return this.collisionTypes.playerProjectile;
        if (type1 === 'projectile' && type2 === 'player') return this.collisionTypes.playerProjectile;
        
        if (type1 === 'projectile' && type2 === 'enemy') return this.collisionTypes.projectileEnemy;
        if (type1 === 'enemy' && type2 === 'projectile') return this.collisionTypes.projectileEnemy;
        
        if (type1 === 'player' && type2 === 'experienceOrb') return this.collisionTypes.playerExperience;
        if (type1 === 'experienceOrb' && type2 === 'player') return this.collisionTypes.playerExperience;
        
        if (type1 === 'player' && type2 === 'artifact') return this.collisionTypes.playerArtifact;
        if (type1 === 'artifact' && type2 === 'player') return this.collisionTypes.playerArtifact;
        
        return null;
    }
    
    getObjectType(obj) {
        if (!obj) return null;
        
        // Проверка по классу или свойствам
        if (obj.constructor.name === 'Player') return 'player';
        if (obj.constructor.name === 'Enemy') return 'enemy';
        if (obj.constructor.name === 'Projectile') return 'projectile';
        if (obj.constructor.name === 'ExperienceOrb') return 'experienceOrb';
        if (obj.constructor.name === 'Artifact') return 'artifact';
        
        // Проверка по свойствам
        if (obj.health !== undefined && obj.maxHealth !== undefined && obj.weapons) return 'player';
        if (obj.health !== undefined && obj.maxHealth !== undefined && obj.type) return 'enemy';
        if (obj.damage !== undefined && obj.owner !== undefined) return 'projectile';
        if (obj.value !== undefined && obj.type === 'experience') return 'experienceOrb';
        if (obj.type === 'artifact' && obj.rarity) return 'artifact';
        
        return null;
    }
    
    handlePlayerEnemyCollision(player, enemy) {
        if (!player.alive || !enemy.alive) return;
        
        // Нанесение урона игроку
        const damage = enemy.damage;
        const success = player.takeDamage(damage);
        
        if (success) {
            this.stats.playerHits++;
            this.stats.actualCollisions++;
            
            // Вызов коллбэка
            this.callbacks.onPlayerHit(damage, enemy);
            
            // Создание эффекта столкновения
            this.createImpactEffect(player.x, player.y, 'player-hit');
        }
    }
    
    handlePlayerProjectileCollision(player, projectile) {
        // Игрок не должен получать урон от своих снарядов
        // Но можно добавить эффекты или взаимодействие
        if (projectile.owner === player) {
            // Снаряд игрока - можно добавить эффекты
            return;
        }
        
        // Вражеский снаряд попадает в игрока
        const damage = projectile.damage;
        const success = player.takeDamage(damage);
        
        if (success) {
            this.stats.playerHits++;
            this.stats.actualCollisions++;
            
            this.callbacks.onPlayerHit(damage, projectile);
            projectile.alive = false;
            
            this.createImpactEffect(player.x, player.y, 'projectile-hit');
        }
    }
    
    handleProjectileEnemyCollision(projectile, enemy) {
        if (!projectile.alive || !enemy.alive) return;
        
        // Проверка, что снаряд не от этого врага
        if (projectile.owner === enemy) return;
        
        // Нанесение урона врагу
        const success = projectile.onHit(enemy);
        
        if (success) {
            this.stats.enemyHits++;
            this.stats.actualCollisions++;
            
            this.callbacks.onEnemyHit(projectile.damage, projectile, enemy);
            this.callbacks.onProjectileHit(projectile, enemy);
            
            // Создание эффекта попадания
            this.createImpactEffect(enemy.x, enemy.y, 'enemy-hit');
        }
    }
    
    handlePlayerExperienceCollision(player, orb) {
        if (!orb.alive || orb.collected) return;
        
        // Сбор опыта
        const value = orb.collect();
        
        if (value > 0) {
            this.stats.experienceCollected++;
            this.stats.actualCollisions++;
            
            // Добавление опыта игроку
            player.experience = (player.experience || 0) + value;
            
            this.callbacks.onExperienceCollected(value, orb);
            
            // Создание эффекта сбора
            this.createCollectEffect(orb.x, orb.y, 'experience');
        }
    }
    
    handlePlayerArtifactCollision(player, artifact) {
        if (!artifact.alive || artifact.collected) return;
        
        // Сбор артефакта
        const success = artifact.collect(player);
        
        if (success) {
            this.stats.artifactsCollected++;
            this.stats.actualCollisions++;
            
            this.callbacks.onArtifactCollected(artifact);
            
            // Создание эффекта сбора
            this.createCollectEffect(artifact.x, artifact.y, 'artifact');
        }
    }
    
    // Проверка коллизии между двумя объектами
    checkCollision(obj1, obj2) {
        if (!obj1 || !obj2 || !obj1.alive || !obj2.alive) return false;
        
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < obj1.radius + obj2.radius;
    }
    
    // Raycast для проверки столкновений луча с объектами
    raycast(startX, startY, endX, endY, radius = 0, filter = null) {
        const hits = this.spatialHashing.raycast(startX, startY, endX, endY, radius);
        
        if (filter) {
            return hits.filter(filter);
        }
        
        return hits;
    }
    
    // Получение объектов в радиусе
    getObjectsInRadius(x, y, radius, filter = null) {
        const objects = this.spatialHashing.getObjectsInRadius(x, y, radius);
        
        if (filter) {
            return objects.filter(filter);
        }
        
        return objects;
    }
    
    // Создание эффектов
    createImpactEffect(x, y, type) {
        // Создание частиц для эффекта столкновения
        // Будет реализовано в EntityManager
        console.log(`Impact effect at (${x}, ${y}): ${type}`);
    }
    
    createCollectEffect(x, y, type) {
        // Создание частиц для эффекта сбора
        // Будет реализовано в EntityManager
        console.log(`Collect effect at (${x}, ${y}): ${type}`);
    }
    
    // Установка коллбэков
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            efficiency: this.stats.totalChecks > 0 ? 
                this.stats.actualCollisions / this.stats.totalChecks : 0
        };
    }
    
    // Сброс статистики
    resetStats() {
        this.stats = {
            totalChecks: 0,
            actualCollisions: 0,
            playerHits: 0,
            enemyHits: 0,
            experienceCollected: 0,
            artifactsCollected: 0
        };
    }
    
    // Настройка параметров
    setSpatialHashing(spatialHashing) {
        this.spatialHashing = spatialHashing;
    }
    
    // Отладка
    enableDebugMode() {
        this.debugMode = true;
    }
    
    disableDebugMode() {
        this.debugMode = false;
    }
    
    // Очистка
    destroy() {
        this.callbacks = {};
        this.spatialHashing = null;
        this.resetStats();
    }
}
