// Система сохранений игры
export class SaveSystem {
    constructor() {
        // Ключи для LocalStorage
        this.keys = {
            gameData: 'browserSurvivalGame',
            settings: 'browserSurvivalSettings',
            statistics: 'browserSurvivalStats',
            achievements: 'browserSurvivalAchievements',
            leaderboard: 'browserSurvivalLeaderboard'
        };
        
        // Версия формата сохранений
        this.version = '1.0.0';
        
        // Данные по умолчанию
        this.defaultData = {
            version: this.version,
            player: {
                coins: 0,
                totalPlayTime: 0,
                totalKills: 0,
                totalDeaths: 0,
                longestSurvival: 0,
                currentLevel: 1
            },
            unlocks: {
                characters: ['survivor'], // Только выживший разблокирован по умолчанию
                weapons: ['staff', 'knife', 'bow', 'pistol', 'club'],
                achievements: []
            },
            upgrades: {
                health: 0,
                speed: 0,
                damage: 0,
                attackSpeed: 0,
                experienceMagnet: 0,
                startingHealth: 0,
                criticalChance: 0,
                dodge: 0
            },
            statistics: {
                gamesPlayed: 0,
                totalExperience: 0,
                enemiesKilled: 0,
                artifactsCollected: 0,
                weaponsUnlocked: 5,
                charactersUnlocked: 1
            }
        };
        
        // Данные лидерборда по умолчанию
        this.defaultLeaderboard = {
            local: {
                topKills: [],
                topSurvival: [],
                topLevel: [],
                topCoins: []
            },
            global: {
                topKills: [],
                topSurvival: [],
                topLevel: [],
                topCoins: []
            }
        };
        
        this.defaultSettings = {
            soundEnabled: false,
            particlesEnabled: true,
            showFPS: false,
            autoSave: true,
            language: 'ru'
        };
        
        // Текущие данные
        this.currentData = null;
        this.currentSettings = null;
        this.currentLeaderboard = null;
        
        // Флаг инициализации
        this.initialized = false;
    }
    
    async init() {
        try {
            await this.loadAll();
            this.initialized = true;
            console.log('Система сохранений инициализирована');
        } catch (error) {
            console.error('Ошибка инициализации системы сохранений:', error);
            // Создание новых данных при ошибке
            this.createNewSave();
        }
    }
    
    async loadAll() {
        this.currentData = await this.loadData(this.keys.gameData) || this.createNewSave();
        this.currentSettings = await this.loadData(this.keys.settings) || this.defaultSettings;
        this.currentLeaderboard = await this.loadData(this.keys.leaderboard) || this.defaultLeaderboard;
        
        // Проверка версии и миграция данных
        await this.migrateData();
        
        return {
            gameData: this.currentData,
            settings: this.currentSettings,
            leaderboard: this.currentLeaderboard
        };
    }
    
    async loadData(key) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            
            // Проверка контрольной суммы
            if (parsed.checksum && this.calculateChecksum(parsed.data) !== parsed.checksum) {
                console.warn('Обнаружено повреждение сохраненных данных для ключа:', key);
                return null;
            }
            
            return parsed.data;
        } catch (error) {
            console.error('Ошибка загрузки данных для ключа', key, ':', error);
            return null;
        }
    }
    
    async saveData(key, data) {
        try {
            const payload = {
                version: this.version,
                timestamp: Date.now(),
                data: data,
                checksum: this.calculateChecksum(data)
            };
            
            localStorage.setItem(key, JSON.stringify(payload));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных для ключа', key, ':', error);
            return false;
        }
    }
    
    createNewSave() {
        this.currentData = JSON.parse(JSON.stringify(this.defaultData));
        this.saveAll();
        return this.currentData;
    }
    
    async migrateData() {
        if (!this.currentData || this.currentData.version === this.version) {
            return;
        }
        
        console.log('Миграция данных с версии', this.currentData.version, 'до', this.version);
        
        // Логика миграции для разных версий
        switch (this.currentData.version) {
            case '0.9.0':
                this.migrateFrom090();
                break;
            // Добавить другие версии по мере необходимости
        }
        
        // Обновление версии
        this.currentData.version = this.version;
        await this.saveAll();
    }
    
    migrateFrom090() {
        // Пример миграции с версии 0.9.0
        if (!this.currentData.player.coins) {
            this.currentData.player.coins = 0;
        }
        
        if (!this.currentData.unlocks.characters) {
            this.currentData.unlocks.characters = ['survivor'];
        }
    }
    
    calculateChecksum(data) {
        // Простая контрольная сумма на основе JSON
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Преобразование в 32-bit integer
        }
        return hash.toString(36);
    }
    
    // Сохранение всех данных
    async saveAll() {
        if (!this.initialized) return false;
        
        try {
            await Promise.all([
                this.saveData(this.keys.gameData, this.currentData),
                this.saveData(this.keys.settings, this.currentSettings)
            ]);
            
            return true;
        } catch (error) {
            console.error('Ошибка сохранения всех данных:', error);
            return false;
        }
    }
    
    // Автосохранение
    async autoSave() {
        if (this.currentSettings?.autoSave) {
            return await this.saveAll();
        }
        return true;
    }
    
    // Методы для работы с данными игрока
    getPlayerData() {
        return this.currentData?.player || this.defaultData.player;
    }
    
    updatePlayerData(updates) {
        if (!this.currentData) return false;
        
        this.currentData.player = { ...this.currentData.player, ...updates };
        return this.autoSave();
    }
    
    addCoins(amount) {
        if (!this.currentData) return false;
        
        this.currentData.player.coins += amount;
        return this.autoSave();
    }
    
    spendCoins(amount) {
        if (!this.currentData || this.currentData.player.coins < amount) {
            return false;
        }
        
        this.currentData.player.coins -= amount;
        return this.autoSave();
    }
    
    // Методы для работы с разблокировками
    getUnlocks() {
        return this.currentData?.unlocks || this.defaultData.unlocks;
    }
    
    unlockCharacter(characterId) {
        if (!this.currentData) return false;
        
        if (!this.currentData.unlocks.characters.includes(characterId)) {
            this.currentData.unlocks.characters.push(characterId);
            this.currentData.statistics.charactersUnlocked++;
            return this.autoSave();
        }
        
        return false;
    }
    
    unlockWeapon(weaponId) {
        if (!this.currentData) return false;
        
        if (!this.currentData.unlocks.weapons.includes(weaponId)) {
            this.currentData.unlocks.weapons.push(weaponId);
            this.currentData.statistics.weaponsUnlocked++;
            return this.autoSave();
        }
        
        return false;
    }
    
    unlockAchievement(achievementId) {
        if (!this.currentData) return false;
        
        if (!this.currentData.unlocks.achievements.includes(achievementId)) {
            this.currentData.unlocks.achievements.push(achievementId);
            return this.autoSave();
        }
        
        return false;
    }
    
    // Методы для работы с улучшениями
    getUpgrades() {
        return this.currentData?.upgrades || this.defaultData.upgrades;
    }
    
    upgradeStat(stat, levels = 1) {
        if (!this.currentData) return false;
        
        const currentLevel = this.currentData.upgrades[stat] || 0;
        const maxLevel = 100;
        
        if (currentLevel < maxLevel) {
            this.currentData.upgrades[stat] = Math.min(currentLevel + levels, maxLevel);
            return this.autoSave();
        }
        
        return false;
    }
    
    // Методы для работы со статистикой
    getStatistics() {
        return this.currentData?.statistics || this.defaultData.statistics;
    }
    
    updateStatistics(updates) {
        if (!this.currentData) return false;
        
        this.currentData.statistics = { ...this.currentData.statistics, ...updates };
        return this.autoSave();
    }
    
    recordGame(survivalTime, kills, experience, coins) {
        if (!this.currentData) return false;
        
        const player = this.currentData.player;
        const stats = this.currentData.statistics;
        
        // Обновление данных игрока
        player.totalPlayTime += survivalTime;
        player.totalKills += kills;
        player.totalDeaths++;
        player.longestSurvival = Math.max(player.longestSurvival, survivalTime);
        
        // Обновление статистики
        stats.gamesPlayed++;
        stats.totalExperience += experience;
        stats.enemiesKilled += kills;
        
        // Добавление монет
        this.addCoins(coins);
        
        return this.autoSave();
    }
    
    // Методы для работы с настройками
    getSettings() {
        return this.currentSettings || this.defaultSettings;
    }
    
    updateSettings(updates) {
        if (!this.currentSettings) return false;
        
        this.currentSettings = { ...this.currentSettings, ...updates };
        return this.saveData(this.keys.settings, this.currentSettings);
    }
    
    // Методы для работы с достижениями
    getAchievements() {
        return this.currentData?.unlocks?.achievements || [];
    }
    
    checkAchievements() {
        // Проверка условий достижений
        const achievements = [
            {
                id: 'first_kill',
                name: 'Первый урон',
                condition: () => this.currentData.player.totalKills >= 1
            },
            {
                id: 'survivor_5min',
                name: 'Выживший',
                condition: () => this.currentData.player.longestSurvival >= 300
            },
            {
                id: 'killer_100',
                name: 'Охотник',
                condition: () => this.currentData.player.totalKills >= 100
            },
            {
                id: 'collector_1000',
                name: 'Коллекционер',
                condition: () => this.currentData.statistics.totalExperience >= 1000
            }
        ];
        
        achievements.forEach(achievement => {
            if (!this.getAchievements().includes(achievement.id) && achievement.condition()) {
                this.unlockAchievement(achievement.id);
                this.showAchievementNotification(achievement);
            }
        });
    }
    
    showAchievementNotification(achievement) {
        // Показ уведомления о достижении
        // Будет реализовано в UI системе
        console.log('Достижение разблокировано:', achievement.name);
    }
    
    // Методы для работы с лидербордом
    getLeaderboard() {
        return this.currentLeaderboard || this.defaultLeaderboard;
    }
    
    saveLeaderboard(leaderboard) {
        this.currentLeaderboard = leaderboard;
        return this.saveData(this.keys.leaderboard, leaderboard);
    }
    
    // Методы для импорта/экспорта
    exportData() {
        const exportData = {
            version: this.version,
            exportDate: new Date().toISOString(),
            gameData: this.currentData,
            settings: this.currentSettings
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    importData(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            // Проверка версии
            if (importData.version !== this.version) {
                console.warn('Версия импортируемых данных отличается от текущей');
            }
            
            // Импорт данных
            this.currentData = importData.gameData;
            this.currentSettings = importData.settings;
            
            // Сохранение
            return this.saveAll();
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            return false;
        }
    }
    
    // Методы для сброса данных
    resetGame() {
        this.currentData = JSON.parse(JSON.stringify(this.defaultData));
        return this.saveAll();
    }
    
    resetSettings() {
        this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        return this.saveData(this.keys.settings, this.currentSettings);
    }
    
    resetAll() {
        this.currentData = JSON.parse(JSON.stringify(this.defaultData));
        this.currentSettings = JSON.parse(JSON.stringify(this.defaultSettings));
        return this.saveAll();
    }
    
    // Методы для получения информации о сохранениях
    getSaveInfo() {
        return {
            version: this.currentData?.version || 'unknown',
            lastSaved: this.getLastSaveTime(),
            fileSize: this.getSaveSize(),
            checksum: this.calculateChecksum(this.currentData)
        };
    }
    
    getLastSaveTime() {
        try {
            const data = localStorage.getItem(this.keys.gameData);
            if (data) {
                const parsed = JSON.parse(data);
                return new Date(parsed.timestamp);
            }
        } catch (error) {
            console.error('Ошибка получения времени последнего сохранения:', error);
        }
        
        return null;
    }
    
    getSaveSize() {
        try {
            const gameDataSize = localStorage.getItem(this.keys.gameData)?.length || 0;
            const settingsSize = localStorage.getItem(this.keys.settings)?.length || 0;
            return gameDataSize + settingsSize;
        } catch (error) {
            console.error('Ошибка получения размера сохранения:', error);
            return 0;
        }
    }
    
    // Методы для отладки
    debugPrintData() {
        console.log('Текущие данные игры:', this.currentData);
        console.log('Текущие настройки:', this.currentSettings);
        console.log('Информация о сохранении:', this.getSaveInfo());
    }
    
    validateData() {
        const issues = [];
        
        // Проверка целостности данных
        if (!this.currentData) {
            issues.push('Отсутствуют данные игры');
            return issues;
        }
        
        // Проверка обязательных полей
        const requiredFields = ['player', 'unlocks', 'upgrades', 'statistics'];
        requiredFields.forEach(field => {
            if (!this.currentData[field]) {
                issues.push(`Отсутствует поле: ${field}`);
            }
        });
        
        // Проверка диапазонов значений
        if (this.currentData.player.coins < 0) {
            issues.push('Отрицательное количество монет');
        }
        
        if (this.currentData.player.longestSurvival < 0) {
            issues.push('Отрицательное время выживания');
        }
        
        return issues;
    }
    
    // Очистка
    destroy() {
        this.currentData = null;
        this.currentSettings = null;
        this.initialized = false;
    }
}
