// Система спавна врагов и скейлинга сложности
export class SpawnSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        
        // Параметры спавна
        this.spawnInterval = 2000; // 2 секунды между спавнами
        this.lastSpawnTime = 0;
        this.maxEnemies = 100;
        this.spawnRadius = 500;
        
        // Сложность
        this.difficultyLevel = 1;
        this.difficultyTimer = 0;
        this.difficultyInterval = 60; // Каждую минуту сложность растет
        
        // Типы врагов для спавна
        this.basicEnemyTypes = [
            'zombie', 'skeleton', 'ghost', 'vampire', 'wolf', 'bear',
            'bookMonster', 'ghostScholar', 'knight', 'guard', 'scorpion',
            'sandWorm', 'iceElemental', 'snowMonster', 'fireDemon',
            'lavaGolem', 'swampMonster', 'frogMutant', 'goblin',
            'caveSpider', 'angelScavenger', 'griffin', 'shadowMonster',
            'demonDarkness'
        ];
        
        this.eliteEnemyTypes = [
            'bossZombie', 'skeletonKing', 'ancientBear', 'demonKnowledge',
            'knightKing', 'sandDragon', 'iceTitan', 'volcano',
            'swampKing', 'undergroundDragon', 'fallenAngel', 'shadowLord'
        ];
        
        this.specialEnemyTypes = [
            'invisibleHunter', 'teleportingDemon', 'kamikaze',
            'regeneratingGiant', 'cloner', 'experienceThief'
        ];
        
        // Текущие волны
        this.currentWave = 1;
        this.waveEnemies = [];
        this.waveTimer = 0;
        this.waveInterval = 30; // Новая волна каждые 30 секунд
        
        // Боссы
        this.bossTimer = 0;
        this.bossInterval = 600; // Босс каждые 10 минут
        this.lastBossTime = 0;
        
        // Спавн артефактов
        this.artifactTimer = 0;
        this.artifactInterval = 180; // Артефакт каждые 3 минуты
        
        // Статистика
        this.totalEnemiesSpawned = 0;
        this.totalKills = 0;
        this.wavesCompleted = 0;
        
        // Активные враги
        this.activeEnemies = new Map();
        
        // Позиции спавна
        this.spawnPoints = this.generateSpawnPoints();
        
        // Флаги
        this.active = false;
        this.paused = false;
    }
    
    generateSpawnPoints() {
        const points = [];
        const margin = 100;
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = 400 + Math.random() * 200; // 400-600 от центра
            
            points.push({
                x: 960 + Math.cos(angle) * distance,
                y: 540 + Math.sin(angle) * distance
            });
        }
        
        return points;
    }
    
    start() {
        this.active = true;
        this.paused = false;
        this.reset();
    }
    
    reset() {
        this.difficultyLevel = 1;
        this.difficultyTimer = 0;
        this.currentWave = 1;
        this.waveTimer = 0;
        this.bossTimer = 0;
        this.artifactTimer = 0;
        this.lastSpawnTime = 0;
        this.lastBossTime = 0;
        this.totalEnemiesSpawned = 0;
        this.totalKills = 0;
        this.wavesCompleted = 0;
        this.activeEnemies.clear();
        this.spawnPoints = this.generateSpawnPoints();
    }
    
    update(deltaTime, gameTime) {
        if (!this.active || this.paused) return;
        
        // Обновление таймеров
        this.updateTimers(deltaTime);
        
        // Обновление сложности
        this.updateDifficulty(deltaTime);
        
        // Спавн врагов
        this.spawnEnemies(deltaTime, gameTime);
        
        // Спавн боссов
        this.spawnBosses(gameTime);
        
        // Спавн артефактов
        this.spawnArtifacts(gameTime);
        
        // Управление волнами
        this.manageWaves(deltaTime);
        
        // Обновление активных врагов
        this.updateActiveEnemies();
    }
    
    updateTimers(deltaTime) {
        this.spawnInterval = Math.max(500, 2000 - (this.difficultyLevel - 1) * 100);
        this.lastSpawnTime += deltaTime;
        this.difficultyTimer += deltaTime;
        this.waveTimer += deltaTime;
        this.bossTimer += deltaTime;
        this.artifactTimer += deltaTime;
    }
    
    updateDifficulty(deltaTime) {
        // Увеличение сложности каждые 60 секунд
        if (this.difficultyTimer >= this.difficultyInterval) {
            this.difficultyLevel++;
            this.difficultyTimer = 0;
            
            // Увеличение максимального количества врагов
            this.maxEnemies = Math.min(200, 100 + (this.difficultyLevel - 1) * 10);
            
            console.log(`Сложность увеличена до уровня ${this.difficultyLevel}`);
        }
    }
    
    spawnEnemies(deltaTime, gameTime) {
        if (this.lastSpawnTime >= this.spawnInterval / 1000) {
            const currentEnemyCount = this.entityManager.enemies.length;
            
            if (currentEnemyCount < this.maxEnemies) {
                // Определение типа врага для спавна
                const enemyType = this.selectEnemyType();
                
                // Выбор точки спавна
                const spawnPoint = this.selectSpawnPoint();
                
                // Создание врага
                const enemy = this.entityManager.createEnemy(enemyType, spawnPoint.x, spawnPoint.y);
                
                if (enemy) {
                    this.totalEnemiesSpawned++;
                    this.activeEnemies.set(enemy.id, {
                        enemy: enemy,
                        spawnTime: gameTime,
                        type: enemyType
                    });
                    
                    // Применение модификаторов сложности
                    this.applyDifficultyModifiers(enemy);
                }
            }
            
            this.lastSpawnTime = 0;
        }
    }
    
    selectEnemyType() {
        const rand = Math.random();
        
        // Специальные враги (5% шанс)
        if (rand < 0.05 && this.difficultyLevel >= 3) {
            return this.specialEnemyTypes[Math.floor(Math.random() * this.specialEnemyTypes.length)];
        }
        
        // Элитные враги (10% шанс после уровня 5)
        if (rand < 0.15 && this.difficultyLevel >= 5) {
            return this.eliteEnemyTypes[Math.floor(Math.random() * this.eliteEnemyTypes.length)];
        }
        
        // Базовые враги (85% шанс)
        return this.basicEnemyTypes[Math.floor(Math.random() * this.basicEnemyTypes.length)];
    }
    
    selectSpawnPoint() {
        // Выбор случайной точки спавна
        return this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    }
    
    applyDifficultyModifiers(enemy) {
        // Увеличение здоровья врагов
        const healthMultiplier = 1 + (this.difficultyLevel - 1) * 0.2;
        enemy.maxHealth *= healthMultiplier;
        enemy.health *= healthMultiplier;
        
        // Увеличение урона врагов
        const damageMultiplier = 1 + (this.difficultyLevel - 1) * 0.1;
        enemy.damage *= damageMultiplier;
        
        // Увеличение скорости врагов (небольшое)
        const speedMultiplier = 1 + (this.difficultyLevel - 1) * 0.05;
        enemy.speed *= speedMultiplier;
        enemy.baseSpeed *= speedMultiplier;
    }
    
    spawnBosses(gameTime) {
        // Спавн босса каждые 10 минут
        if (gameTime - this.lastBossTime >= this.bossInterval) {
            const bossType = this.selectBossType();
            const spawnPoint = this.selectSpawnPoint();
            
            const boss = this.entityManager.createEnemy(bossType, spawnPoint.x, spawnPoint.y);
            
            if (boss) {
                this.totalEnemiesSpawned++;
                this.lastBossTime = gameTime;
                
                console.log(`Босс ${bossType} заспавнен!`);
                
                // Уведомление о появлении босса
                this.notifyBossSpawn(boss);
            }
        }
    }
    
    selectBossType() {
        // Выбор босса в зависимости от сложности
        const availableBosses = this.eliteEnemyTypes.filter((boss, index) => {
            return index < Math.min(this.eliteEnemyTypes.length, Math.ceil(this.difficultyLevel / 2));
        });
        
        return availableBosses[Math.floor(Math.random() * availableBosses.length)];
    }
    
    notifyBossSpawn(boss) {
        // Создание уведомления о появлении босса
        // Будет реализовано в UI системе
    }
    
    spawnArtifacts(gameTime) {
        // Спавн артефакта каждые 3 минуты
        if (this.artifactTimer >= this.artifactInterval) {
            const artifactType = this.selectArtifactType();
            const spawnPoint = this.selectSpawnPoint();
            
            const artifact = this.entityManager.createArtifact(artifactType, spawnPoint.x, spawnPoint.y);
            
            if (artifact) {
                this.artifactTimer = 0;
                
                console.log(`Артефакт ${artifactType} заспавнен!`);
            }
        }
    }
    
    selectArtifactType() {
        // Выбор артефакта в зависимости от времени игры
        const gameTimeMinutes = Math.floor(this.artifactTimer / 60);
        
        if (gameTimeMinutes >= 20) {
            // После 20 минут - шанс легендарных
            return Artifact.getRandomByChance();
        } else if (gameTimeMinutes >= 10) {
            // После 10 минут - шанс эпических
            const rand = Math.random();
            if (rand < 0.1) return Artifact.getRandomByRarity('epic');
            if (rand < 0.3) return Artifact.getRandomByRarity('rare');
            return Artifact.getRandomByRarity('common');
        } else {
            // Первые 10 минут - только обычные и редкие
            return Math.random() < 0.3 ? 
                Artifact.getRandomByRarity('rare') : 
                Artifact.getRandomByRarity('common');
        }
    }
    
    manageWaves(deltaTime) {
        // Управление волнами врагов
        if (this.waveTimer >= this.waveInterval) {
            this.startNewWave();
            this.waveTimer = 0;
        }
    }
    
    startNewWave() {
        this.currentWave++;
        
        // Создание волны врагов
        const waveSize = Math.min(20, 5 + this.currentWave * 2);
        const waveTypes = this.selectWaveEnemies();
        
        for (let i = 0; i < waveSize; i++) {
            setTimeout(() => {
                const enemyType = waveTypes[Math.floor(Math.random() * waveTypes.length)];
                const spawnPoint = this.selectSpawnPoint();
                
                const enemy = this.entityManager.createEnemy(enemyType, spawnPoint.x, spawnPoint.y);
                
                if (enemy) {
                    this.totalEnemiesSpawned++;
                    this.applyDifficultyModifiers(enemy);
                }
            }, i * 200); // Спавн с интервалом 0.2 секунды
        }
        
        console.log(`Началась волна ${this.currentWave} (${waveSize} врагов)`);
    }
    
    selectWaveEnemies() {
        // Выбор типов врагов для волны
        const enemies = [];
        
        // Базовые враги всегда есть
        enemies.push(...this.basicEnemyTypes);
        
        // Элитные враги добавляются с увеличением сложности
        if (this.currentWave >= 3) {
            enemies.push(...this.eliteEnemyTypes.slice(0, Math.min(3, this.currentWave - 2)));
        }
        
        // Специальные враги добавляются позже
        if (this.currentWave >= 5) {
            enemies.push(...this.specialEnemyTypes.slice(0, Math.min(2, this.currentWave - 4)));
        }
        
        return enemies;
    }
    
    updateActiveEnemies() {
        // Обновление списка активных врагов
        for (const [id, data] of this.activeEnemies) {
            if (!data.enemy.alive) {
                this.totalKills++;
                this.activeEnemies.delete(id);
                
                // Создание опыта при смерти врага
                this.spawnExperience(data.enemy);
            }
        }
    }
    
    spawnExperience(enemy) {
        // Создание орбов опыта на месте смерти врага
        const experienceData = ExperienceOrb.createFromEnemy(enemy);
        
        const orb = this.entityManager.createExperienceOrb(
            experienceData.x, 
            experienceData.y, 
            experienceData.value
        );
    }
    
    // Управление спавном
    pause() {
        this.paused = true;
    }
    
    resume() {
        this.paused = false;
    }
    
    stop() {
        this.active = false;
        this.paused = false;
    }
    
    // Получение статистики
    getStats() {
        return {
            difficultyLevel: this.difficultyLevel,
            currentWave: this.currentWave,
            totalEnemiesSpawned: this.totalEnemiesSpawned,
            totalKills: this.totalKills,
            activeEnemies: this.activeEnemies.size,
            maxEnemies: this.maxEnemies,
            spawnInterval: this.spawnInterval,
            wavesCompleted: this.wavesCompleted
        };
    }
    
    // Получение информации о текущем состоянии
    getCurrentState() {
        return {
            difficultyLevel: this.difficultyLevel,
            spawnRate: 1000 / this.spawnInterval,
            enemyCount: this.entityManager.enemies.length,
            maxEnemies: this.maxEnemies,
            nextBossIn: this.bossInterval - (this.bossTimer * 1000),
            nextArtifactIn: this.artifactInterval - (this.artifactTimer * 1000),
            nextWaveIn: this.waveInterval - (this.waveTimer * 1000)
        };
    }
    
    // Принудительный спавн для тестирования
    forceSpawnEnemy(type = null, x = null, y = null) {
        const enemyType = type || this.selectEnemyType();
        const spawnPoint = x && y ? { x, y } : this.selectSpawnPoint();
        
        const enemy = this.entityManager.createEnemy(enemyType, spawnPoint.x, spawnPoint.y);
        
        if (enemy) {
            this.totalEnemiesSpawned++;
            this.activeEnemies.set(enemy.id, {
                enemy: enemy,
                spawnTime: performance.now(),
                type: enemyType
            });
            
            this.applyDifficultyModifiers(enemy);
        }
        
        return enemy;
    }
    
    forceSpawnBoss(type = null) {
        const bossType = type || this.selectBossType();
        const spawnPoint = this.selectSpawnPoint();
        
        const boss = this.entityManager.createEnemy(bossType, spawnPoint.x, spawnPoint.y);
        
        if (boss) {
            this.totalEnemiesSpawned++;
            this.lastBossTime = performance.now();
            
            this.notifyBossSpawn(boss);
        }
        
        return boss;
    }
    
    forceSpawnArtifact(type = null) {
        const artifactType = type || this.selectArtifactType();
        const spawnPoint = this.selectSpawnPoint();
        
        return this.entityManager.createArtifact(artifactType, spawnPoint.x, spawnPoint.y);
    }
    
    // Изменение параметров спавна
    setSpawnInterval(interval) {
        this.spawnInterval = Math.max(100, interval);
    }
    
    setMaxEnemies(max) {
        this.maxEnemies = Math.min(500, max);
    }
    
    setDifficultyLevel(level) {
        this.difficultyLevel = Math.max(1, level);
        this.maxEnemies = Math.min(200, 100 + (this.difficultyLevel - 1) * 10);
    }
    
    // Очистка
    clear() {
        this.reset();
        this.activeEnemies.clear();
    }
}
