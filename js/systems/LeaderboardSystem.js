// Система лидерборда
export class LeaderboardSystem {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        
        // Лидерборд
        this.leaderboard = {
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
        
        // Настройки
        this.settings = {
            showGlobal: false,
            maxEntries: 100,
            updateInterval: 60000 // 1 минута
        };
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.loadLeaderboard();
        this.setupAutoUpdate();
    }
    
    setupAutoUpdate() {
        // Автообновление глобального лидерборда
        setInterval(() => {
            if (this.settings.showGlobal) {
                this.updateGlobalLeaderboard();
            }
        }, this.settings.updateInterval);
    }
    
    loadLeaderboard() {
        const savedData = this.saveSystem.getLeaderboard();
        if (savedData) {
            this.leaderboard = savedData;
        }
    }
    
    saveLeaderboard() {
        this.saveSystem.saveLeaderboard(this.leaderboard);
    }
    
    // Добавление записи в лидерборд
    addEntry(category, type, entry) {
        const board = this.leaderboard[category][type];
        
        // Проверка на дубликаты
        const existingIndex = board.findIndex(e => e.name === entry.name);
        if (existingIndex > -1) {
            // Обновление существующей записи
            if (entry.value > board[existingIndex].value) {
                board[existingIndex] = entry;
            }
        } else {
            // Добавление новой записи
            board.push(entry);
        }
        
        // Сортировка и ограничение
        this.sortLeaderboard(category, type);
        this.trimLeaderboard(category, type);
        
        // Сохранение
        this.saveLeaderboard();
    }
    
    sortLeaderboard(category, type) {
        this.leaderboard[category][type].sort((a, b) => b.value - a.value);
    }
    
    trimLeaderboard(category, type) {
        const board = this.leaderboard[category][type];
        if (board.length > this.settings.maxEntries) {
            this.leaderboard[category][type] = board.slice(0, this.settings.maxEntries);
        }
    }
    
    // Обновление глобального лидерборда
    updateGlobalLeaderboard() {
        // Симуляция глобальных данных (в реальной игре здесь будет API запрос)
        this.simulateGlobalLeaderboard();
    }
    
    simulateGlobalLeaderboard() {
        // Симуляция глобального лидерboard
        const globalData = {
            topKills: [
                { name: 'GlobalChampion', value: 50000, date: Date.now() },
                { name: 'ProPlayer', value: 45000, date: Date.now() },
                { name: 'SpeedRunner', value: 40000, date: Date.now() },
                { name: 'Survivor', value: 35000, date: Date.now() },
                { name: 'Legend', value: 30000, date: Date.now() }
            ],
            topSurvival: [
                { name: 'Immortal', value: 7200, date: Date.now() },
                { name: 'TimeMaster', value: 6000, date: Date.now() },
                { name: 'Endurance', value: 5400, date: Date.now() },
                { name: 'Marathon', value: 4800, date: Date.now() },
                { name: 'Endurance', value: 4200, date: Date.now() },
                { name: 'Marathon', value: 3600, date: Date.now() }
            ],
            topLevel: [
                { name: 'Godlike', value: 200, date: Date.now() },
                { name: 'Champion', value: 150, date: Date.now() },
                { name: 'Master', value: 120, date: Date.now() },
                { name: 'Expert', value: 100, date: Date.now() },
                { name: 'Advanced', value: 80, date: Date.now() },
                { name: 'Skilled', value: 60, date: Date.now() }
            ],
            topCoins: [
                { name: 'Billionaire', value: 5000000, date: Date.now() },
                { name: 'Rich', value: 1000000, date: Date.now() },
                { name: 'Wealthy', value: 500000, date: Date.now() },
                { name: 'Collector', value: 100000, date: Date.now() },
                { name: 'Trader', value: 50000, date: Date.now() },
                { name: 'Merchant', value: 10000, date: Date.now() }
            ]
        };
        
        this.leaderboard.global = globalData;
        this.saveLeaderboard();
    }
    
    // Получение лидерборда
    getLeaderboard(category = 'local', type = 'topKills') {
        return this.leaderboard[category][type] || [];
    }
    
    // Получение всех лидербордов
    getAllLeaderboards() {
        return this.leaderboard;
    }
    
    // Получение позиции в лидерборде
    getRank(category, type, value) {
        const board = this.leaderboard[category][type];
        const index = board.findIndex(entry => entry.value <= value);
        return index === -1 ? board.length : index + 1;
    }
    
    // Получение топ-N записей
    getTopEntries(category, type, count = 10) {
        return this.leaderboard[category][type].slice(0, count);
    }
    
    // Очистка лидерборда
    clearLeaderboard(category = 'local', type = null) {
        if (type) {
            this.leaderboard[category][type] = [];
        } else {
            this.leaderboard[category] = {
                topKills: [],
                topSurvival: [],
                topLevel: [],
                topCoins: []
            };
        }
        
        this.saveLeaderboard();
    }
    
    // Обновление настроек
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
    }
    
    // Получение статистики
    getStats() {
        return {
            local: {
                totalEntries: Object.values(this.leaderboard.local)
                    .reduce((sum, board) => sum + board.length, 0),
                categories: {
                    topKills: this.leaderboard.local.topKills.length,
                    topSurvival: this.leaderboard.local.topSurvival.length,
                    topLevel: this.leaderboard.local.topLevel.length,
                    topCoins: this.leaderboard.local.topCoins.length
                }
            },
            global: {
                totalEntries: Object.values(this.leaderboard.global)
                    .reduce((sum, board) => sum + board.length, 0),
                categories: {
                    topKills: this.leaderboard.global.topKills.length,
                    topSurvival: this.leader.global.topSurvival.length,
                    topLevel: this.leaderboard.global.topLevel.length,
                    topCoins: this.leaderboard.global.topCoins.length
                }
            }
        };
    }
    
    // Экспорт лидерборда
    exportLeaderboard() {
        return JSON.stringify(this.leaderboard);
    }
    
    // Импорт лидерборда
    importLeaderboard(data) {
        try {
            const imported = JSON.parse(data);
            this.leaderboard = imported;
            this.saveLeaderboard();
            return true;
        } catch (error) {
            console.error('Ошибка импорта лидерборда:', error);
            return false;
        }
    }
    
    // Сброс лидерборда
    resetLeaderboard() {
        this.clearLeaderboard('local');
        this.clearLeaderboard('global');
    }
    
    // Очистка
    destroy() {
        this.leaderboard = null;
        this.saveSystem = null;
    }
}
