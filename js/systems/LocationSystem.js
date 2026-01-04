// Система локаций
export class LocationSystem {
    constructor() {
        // Локации
        this.locations = {
            // Лесная зона (начальная)
            forest: {
                name: 'Лесная зона',
                description: 'Спокойный лес, идеальное место для новичков',
                difficulty: 1,
                enemyTypes: ['zombie', 'skeleton', 'wolf', 'bear'],
                eliteTypes: [],
                specialTypes: [],
                spawnRate: 1,
                maxEnemies: 30,
                backgroundColor: '#1a3d1a',
                groundColor: '#2d5a2d',
                treeColor: '#4a7c4a',
                ambientColor: 'rgba(74, 124, 74, 0.1)',
                unlockRequirement: null
            },
            
            // Заброшенное кладбище
            graveyard: {
                name: 'Заброшенное кладбище',
                description: 'Мрачное кладбище, полное нежити',
                difficulty: 2,
                enemyTypes: ['zombie', 'skeleton', 'ghost', 'vampire'],
                eliteTypes: ['bossZombie'],
                specialTypes: [],
                spawnRate: 1.2,
                maxEnemies: 40,
                backgroundColor: '#1a1a2e',
                groundColor: '#2d2d4a',
                treeColor: '#4a4a7c',
                ambientColor: 'rgba(74, 74, 124, 0.1)',
                unlockRequirement: 'survive_5_minutes'
            },
            
            // Пещеры
            caves: {
                name: 'Темные пещеры',
                description: 'Запутанные пещеры с опасными существами',
                difficulty: 3,
                enemyTypes: ['skeleton', 'bat', 'spider', 'scorpion'],
                eliteTypes: ['skeletonKing'],
                specialTypes: ['invisibleHunter'],
                spawnRate: 1.5,
                maxEnemies: 50,
                backgroundColor: '#0f0f1a',
                groundColor: '#1a1a2e',
                treeColor: '#2d2d4a',
                ambientColor: 'rgba(45, 45, 74, 0.1)',
                unlockRequirement: 'kill_100_enemies'
            },
            
            // Болота
            swamp: {
                name: 'Токсичные болота',
                description: 'Ядовитые болота с мутантами',
                difficulty: 3,
                enemyTypes: ['frogMutant', 'snake', 'crocodile', 'swampMonster'],
                eliteTypes: ['swampKing'],
                specialTypes: ['poisonCloud'],
                spawnRate: 1.3,
                maxEnemies: 45,
                backgroundColor: '#1a2e1a',
                groundColor: '#2d4a2d',
                treeColor: '#4a7c4a',
                ambientColor: 'rgba(74, 124, 74, 0.1)',
                unlockRequirement: 'collect_50_artifacts'
            },
            
            // Ледяные пики
            icePeaks: {
                name: 'Ледяные пики',
                description: 'Замерзшие горы с ледяными монстрами',
                difficulty: 4,
                enemyTypes: ['iceElemental', 'snowMonster', 'yeti', 'frostGiant'],
                eliteTypes: ['iceTitan'],
                specialTypes: ['freezeWave'],
                spawnRate: 1.4,
                maxEnemies: 55,
                backgroundColor: '#1a2e3d',
                groundColor: '#2d4a5a',
                treeColor: '#4a7c8c',
                ambientColor: 'rgba(74, 124, 140, 0.1)',
                unlockRequirement: 'reach_level_10'
            },
            
            // Вулкан
            volcano: {
                name: 'Действующий вулкан',
                description: 'Раскаленный кратер с огненными демонами',
                difficulty: 5,
                enemyTypes: ['fireDemon', 'lavaGolem', 'fireElemental', 'hellhound'],
                eliteTypes: ['volcano'],
                specialTypes: ['lavaFlow'],
                spawnRate: 1.6,
                maxEnemies: 60,
                backgroundColor: '#3d1a1a',
                groundColor: '#5a2d2d',
                treeColor: '#7c4a4a',
                ambientColor: 'rgba(124, 74, 74, 0.1)',
                unlockRequirement: 'kill_500_enemies'
            },
            
            // Пустыня
            desert: {
                name: 'Бескрайняя пустыня',
                description: 'Выжженная пустыня с песчаными червями',
                difficulty: 4,
                enemyTypes: ['sandWorm', 'scorpion', 'vulture', 'desertSpirit'],
                eliteTypes: ['sandDragon'],
                specialTypes: ['sandstorm'],
                spawnRate: 1.5,
                maxEnemies: 50,
                backgroundColor: '#3d3d1a',
                groundColor: '#5a5a2d',
                treeColor: '#7c7c4a',
                ambientColor: 'rgba(124, 124, 74, 0.1)',
                unlockRequirement: 'survive_10_minutes'
            },
            
            // Небесный город
            skyCity: {
                name: 'Забытый небесный город',
                description: 'Парящий город с ангелами и демонами',
                difficulty: 6,
                enemyTypes: ['angelScavenger', 'fallenAngel', 'divineWarrior', 'shadowDemon'],
                eliteTypes: ['fallenAngel'],
                specialTypes: ['holyLight'],
                spawnRate: 1.8,
                maxEnemies: 70,
                backgroundColor: '#1a1a3d',
                groundColor: '#2d2d5a',
                treeColor: '#4a4a7c',
                ambientColor: 'rgba(74, 74, 124, 0.1)',
                unlockRequirement: 'reach_level_20'
            },
            
            // Темный лес
            darkForest: {
                name: 'Темный лес',
                description: 'Древний лес с теневыми монстрами',
                difficulty: 5,
                enemyTypes: ['shadowMonster', 'darkWolf', 'nightmare', 'shadowBeast'],
                eliteTypes: ['shadowLord'],
                specialTypes: ['darkness'],
                spawnRate: 1.7,
                maxEnemies: 65,
                backgroundColor: '#0d0d1a',
                groundColor: '#1a1a2e',
                treeColor: '#2d2d4a',
                ambientColor: 'rgba(45, 45, 74, 0.1)',
                unlockRequirement: 'kill_1000_enemies'
            },
            
            // Подземелья
            underworld: {
                name: 'Подземелья',
                description: 'Мрачные подземелья с некромантами',
                difficulty: 7,
                enemyTypes: ['necromancer', 'undead', 'boneGolem', 'soulEater'],
                eliteTypes: ['necromancer'],
                specialTypes: ['deathWave'],
                spawnRate: 2,
                maxEnemies: 80,
                backgroundColor: '#1a0d0d',
                groundColor: '#2e1a1a',
                treeColor: '#4a2d2d',
                ambientColor: 'rgba(74, 45, 45, 0.1)',
                unlockRequirement: 'kill_2000_enemies'
            },
            
            // Драконье гнездо
            dragonLair: {
                name: 'Гнездо дракона',
                description: 'Древнее гнездо могущественных драконов',
                difficulty: 8,
                enemyTypes: ['dragon', 'dragonWhelp', 'fireDrake', 'iceDragon'],
                eliteTypes: ['dragon'],
                specialTypes: ['dragonBreath'],
                spawnRate: 2.5,
                maxEnemies: 100,
                backgroundColor: '#3d1a1a',
                groundColor: '#5a2d2d',
                treeColor: '#7c4a4a',
                ambientColor: 'rgba(124, 74, 74, 0.1)',
                unlockRequirement: 'reach_level_30'
            },
            
            // Хаос realm
            chaosRealm: {
                name: 'Измерение хаоса',
                description: 'Нестабильное измерение с хаотичными существами',
                difficulty: 10,
                enemyTypes: ['chaosBeast', 'voidWalker', 'realityBender', 'timeAnomaly'],
                eliteTypes: ['chaosLord'],
                specialTypes: ['chaosField'],
                spawnRate: 3,
                maxEnemies: 150,
                backgroundColor: '#1a0d3d',
                groundColor: '#2e1a5a',
                treeColor: '#4a2d7c',
                ambientColor: 'rgba(74, 45, 124, 0.1)',
                unlockRequirement: 'survive_30_minutes'
            }
        };
        
        // Текущая локация
        this.currentLocation = 'forest';
        
        // Разблокированные локации
        this.unlockedLocations = ['forest'];
        
        // Настройки спавна для локации
        this.locationSettings = {};
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.loadUnlockedLocations();
        this.initLocationSettings();
    }
    
    loadUnlockedLocations() {
        const savedData = localStorage.getItem('unlockedLocations');
        if (savedData) {
            try {
                this.unlockedLocations = JSON.parse(savedData);
            } catch (error) {
                console.error('Ошибка загрузки разблокированных локаций:', error);
            }
        }
    }
    
    saveUnlockedLocations() {
        try {
            localStorage.setItem('unlockedLocations', JSON.stringify(this.unlockedLocations));
        } catch (error) {
            console.error('Ошибка сохранения разблокированных локаций:', error);
        }
    }
    
    initLocationSettings() {
        Object.keys(this.locations).forEach(key => {
            const location = this.locations[key];
            this.locationSettings[key] = {
                spawnTimer: 0,
                spawnInterval: 2000 / location.spawnRate,
                currentEnemies: 0,
                maxEnemies: location.maxEnemies,
                lastEliteSpawn: 0,
                lastSpecialSpawn: 0
            };
        });
    }
    
    // Получение информации о локации
    getLocationInfo(locationKey) {
        const location = this.locations[locationKey];
        if (!location) return null;
        
        return {
            ...location,
            unlocked: this.unlockedLocations.includes(locationKey),
            settings: this.locationSettings[locationKey]
        };
    }
    
    // Разблокировка локации
    unlockLocation(locationKey) {
        if (!this.locations[locationKey]) return false;
        if (this.unlockedLocations.includes(locationKey)) return false;
        
        this.unlockedLocations.push(locationKey);
        this.saveUnlockedLocations();
        
        return true;
    }
    
    // Проверка условия разблокировки
    checkUnlockConditions() {
        // Проверка условий для каждой локации
        Object.keys(this.locations).forEach(key => {
            if (this.unlockedLocations.includes(key)) return;
            
            const location = this.locations[key];
            const condition = location.unlockRequirement;
            
            if (this.evaluateCondition(condition)) {
                this.unlockLocation(key);
                console.log(`Локация "${location.name}" разблокирована!`);
            }
        });
    }
    
    evaluateCondition(condition) {
        if (!condition) return true;
        
        // Парсинг условия
        if (condition.startsWith('survive_')) {
            const minutes = parseInt(condition.split('_')[1]);
            return this.checkSurvivalTime(minutes);
        } else if (condition.startsWith('kill_')) {
            const count = parseInt(condition.split('_')[1]);
            return this.checkKillCount(count);
        } else if (condition.startsWith('reach_level_')) {
            const level = parseInt(condition.split('_')[2]);
            return this.checkLevelReached(level);
        } else if (condition.startsWith('collect_')) {
            const count = parseInt(condition.split('_')[1]);
            return this.checkCollectCount(count);
        }
        
        return false;
    }
    
    checkSurvivalTime(minutes) {
        // Проверка будет реализована в Game
        return false;
    }
    
    checkKillCount(count) {
        // Проверка будет реализована в Game
        return false;
    }
    
    checkLevelReached(level) {
        // Проверка будет реализована в Game
        return false;
    }
    
    checkCollectCount(count) {
        // Проверка будет реализована в Game
        return false;
    }
    
    // Смена локации
    changeLocation(locationKey) {
        if (!this.unlockedLocations.includes(locationKey)) {
            console.error('Локация не разблокирована:', locationKey);
            return false;
        }
        
        this.currentLocation = locationKey;
        this.initLocationSettings();
        
        return true;
    }
    
    // Получение текущей локации
    getCurrentLocation() {
        return this.getLocationInfo(this.currentLocation);
    }
    
    // Получение всех разблокированных локаций
    getUnlockedLocations() {
        return this.unlockedLocations.map(key => this.getLocationInfo(key));
    }
    
    // Получение доступных локаций
    getAvailableLocations() {
        return Object.keys(this.locations)
            .filter(key => this.unlockedLocations.includes(key))
            .map(key => this.getLocationInfo(key));
    }
    
    // Получение локаций по сложности
    getLocationsByDifficulty(maxDifficulty) {
        return this.getAvailableLocations()
            .filter(location => location.difficulty <= maxDifficulty)
            .sort((a, b) => a.difficulty - b.difficulty);
    }
    
    // Получение следующей локации по сложности
    getNextLocation() {
        const current = this.getCurrentLocation();
        const available = this.getLocationsByDifficulty(current.difficulty + 1);
        
        return available.length > 0 ? available[0] : null;
    }
    
    // Обновление настроек локации
    updateLocationSettings(locationKey, deltaTime, gameTime) {
        const settings = this.locationSettings[locationKey];
        if (!settings) return;
        
        // Обновление таймеров
        settings.spawnTimer += deltaTime * 1000;
        
        // Спавн элитных врагов
        if (gameTime - settings.lastEliteSpawn > 60000) { // Каждую минуту
            settings.lastEliteSpawn = gameTime;
        }
        
        // Спавн специальных врагов
        if (gameTime - settings.lastSpecialSpawn > 120000) { // Каждые 2 минуты
            settings.lastSpecialSpawn = gameTime;
        }
        
        // Обновление количества врагов
        settings.currentEnemies = this.getCurrentEnemyCount(locationKey);
    }
    
    getCurrentEnemyCount(locationKey) {
        // Будет реализовано в EntityManager
        return 0;
    }
    
    // Получение врагов для локации
    getEnemiesForLocation(locationKey) {
        const location = this.locations[locationKey];
        if (!location) return [];
        
        return {
            basic: location.enemyTypes,
            elite: location.eliteTypes,
            special: location.specialTypes
        };
    }
    
    // Получение визуальных настроек локации
    getVisualSettings(locationKey) {
        const location = this.locations[locationKey];
        if (!location) return null;
        
        return {
            backgroundColor: location.backgroundColor,
            groundColor: location.groundColor,
            treeColor: location.treeColor,
            ambientColor: location.ambientColor,
            particleColors: this.getParticleColors(locationKey)
        };
    }
    
    getParticleColors(locationKey) {
        const colorSchemes = {
            forest: ['#2d5a2d', '#4a7c4a', '#6fa86f'],
            graveyard: ['#2d2d4a', '#4a4a7c', '#6a6a8c'],
            caves: ['#1a1a2e', '#2d2d4a', '#4a4a7c'],
            swamp: ['#2d4a2d', '#4a7c4a', '#6fa86f'],
            icePeaks: ['#2d4a5a', '#4a7c8c', '#6fa8ac'],
            volcano: ['#5a2d2d', '#7c4a4a', '#ac6a6a'],
            desert: ['#5a5a2d', '#7c7c4a', '#acac6a'],
            skyCity: ['#2d2d5a', '#4a4a7c', '#6a6a8c'],
            darkForest: ['#1a1a2e', '#2d2d4a', '#4a4a7c'],
            underworld: ['#2e1a1a', '#4a2d2d', '#7c4a4a'],
            dragonLair: ['#5a2d2d', '#7c4a4a', '#ac6a6a'],
            chaosRealm: ['#2e1a5a', '#4a2d7c', '#7c4aac']
        };
        
        return colorSchemes[locationKey] || colorSchemes.forest;
    }
    
    // Получение статистики
    getStats() {
        return {
            totalLocations: Object.keys(this.locations).length,
            unlockedLocations: this.unlockedLocations.length,
            currentLocation: this.currentLocation,
            completion: (this.unlockedLocations.length / Object.keys(this.locations).length) * 100
        };
    }
    
    // Сброс прогресса (для отладки)
    resetProgress() {
        this.unlockedLocations = ['forest'];
        this.currentLocation = 'forest';
        this.saveUnlockedLocations();
        this.initLocationSettings();
    }
    
    // Очистка
    destroy() {
        this.locations = null;
        this.locationSettings = null;
        this.unlockedLocations = null;
    }
}
