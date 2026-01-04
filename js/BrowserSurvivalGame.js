// Интеграция всех систем игры
import { Game } from './engine/Game.js';
import { UIManager } from './ui/UIManager.js';
import { SaveSystem } from './systems/SaveSystem.js';
import { GlobalUpgradeSystem } from './systems/GlobalUpgradeSystem.js';
import { LocationSystem } from './systems/LocationSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';
import { LeaderboardSystem } from './systems/LeaderboardSystem.js';

// Основной класс игры
export class BrowserSurvivalGame {
    constructor() {
        // Системы
        this.game = null;
        this.uiManager = null;
        this.saveSystem = null;
        this.globalUpgradeSystem = null;
        this.locationSystem = null;
        this.achievementSystem = null;
        this.leaderboardSystem = null;
        
        // Состояние
        this.initialized = false;
        this.running = false;
        
        // Инициализация
        this.init();
    }
    
    async init() {
        try {
            console.log('🎮 Инициализация Browser Survival Game...');
            
            // Инициализация системы сохранений
            this.saveSystem = new SaveSystem();
            await this.saveSystem.init();
            
            // Инициализация глобальных улучшений
            this.globalUpgradeSystem = new GlobalUpgradeSystem(this.saveSystem);
            
            // Инициализация системы локаций
            this.locationSystem = new LocationSystem();
            
            // Инициализация системы достижений
            this.achievementSystem = new AchievementSystem(this.saveSystem);
            
            // Инициализация лидерборда
            this.leaderboardSystem = new LeaderboardSystem(this.saveSystem);
            
            // Инициализация UI
            this.uiManager = new UIManager();
            
            // Инициализация игры
            this.game = new Game();
            this.game.init();
            
            // Настройка связей между системами
            this.setupSystemConnections();
            
            // Настройка обработчиков событий
            this.setupEventHandlers();
            
            // Загрузка сохраненных данных
            this.loadGameData();
            
            this.initialized = true;
            console.log('✅ Игра успешно инициализирована!');
            
            // Запуск игры
            this.start();
            
        } catch (error) {
            console.error('❌ Ошибка инициализации игры:', error);
            this.showError('Ошибка инициализации игры: ' + error.message);
        }
    }
    
    setupSystemConnections() {
        // Связь игры с другими системами
        if (this.game) {
            this.game.setSaveSystem(this.saveSystem);
            this.game.setGlobalUpgradeSystem(this.globalUpgradeSystem);
            this.game.setLocationSystem(this.locationSystem);
            this.game.setAchievementSystem(this.achievementSystem);
            this.game.setLeaderboardSystem(this.leaderboardSystem);
        }
        
        // Связь UI с системами
        if (this.uiManager) {
            this.uiManager.setSaveSystem(this.saveSystem);
            this.uiManager.setGlobalUpgradeSystem(this.globalUpgradeSystem);
            this.uiManager.setLocationSystem(this.locationSystem);
            this.uiManager.setAchievementSystem(this.achievementSystem);
            this.uiManager.setLeaderboardSystem(this.leaderboardSystem);
        }
    }
    
    setupEventHandlers() {
        // Обработчики событий игры
        document.addEventListener('gameStart', (e) => this.onGameStart(e.detail));
        document.addEventListener('gamePause', () => this.onGamePause());
        document.addEventListener('gameResume', () => this.onGameResume());
        document.addEventListener('gameOver', (e) => this.onGameOver(e.detail));
        document.addEventListener('gameMainMenu', () => this.onGameMainMenu());
        
        // Обработчики событий UI
        document.addEventListener('upgradeSelected', (e) => this.onUpgradeSelected(e.detail));
        document.addEventListener('locationSelected', (e) => this.onLocationSelected(e.detail));
        document.addEventListener('characterSelected', (e) => this.onCharacterSelected(e.detail));
        
        // Обработчики событий достижений
        document.addEventListener('achievementUnlocked', (e) => this.onAchievementUnlocked(e.detail));
        
        // Обработчики событий лидерборда
        document.addEventListener('leaderboardUpdate', () => this.onLeaderboardUpdate());
        
        // Обработчики клавиатуры
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.onResize());
        
        // Обработчик закрытия окна
        window.addEventListener('beforeunload', () => this.onBeforeUnload());
    }
    
    loadGameData() {
        try {
            // Загрузка сохраненных данных
            const gameData = this.saveSystem.getPlayerData();
            const settings = this.saveSystem.getSettings();
            
            // Применение настроек
            if (settings) {
                this.applySettings(settings);
            }
            
            // Применение глобальных улучшений
            if (this.game && this.game.entityManager && this.game.entityManager.player) {
                this.globalUpgradeSystem.applyUpgradesToPlayer(this.game.entityManager.player);
            }
            
            // Загрузка разблокированных локаций
            this.locationSystem.loadUnlockedLocations();
            
            // Загрузка достижений
            this.achievementSystem.loadAchievements();
            
            // Загрузка лидерборда
            this.leaderboardSystem.loadLeaderboard();
            
            console.log('📁 Данные игры загружены');
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных игры:', error);
        }
    }
    
    saveGameData() {
        try {
            // Сохранение данных игры
            this.saveSystem.saveAll();
            
            // Сохранение глобальных улучшений
            this.globalUpgradeSystem.saveUpgrades();
            
            // Сохранение локаций
            this.locationSystem.saveUnlockedLocations();
            
            // Сохранение достижений
            this.achievementSystem.saveAchievements();
            
            // Сохранение лидерборда
            this.leaderboardSystem.saveLeaderboard();
            
            console.log('💾 Данные игры сохранены');
            
        } catch (error) {
            console.error('❌ Ошибка сохранения данных игры:', error);
        }
    }
    
    start() {
        if (!this.initialized) {
            console.error('❌ Игра не инициализирована');
            return;
        }
        
        if (this.running) {
            console.log('⚠️ Игра уже запущена');
            return;
        }
        
        console.log('🚀 Запуск игры...');
        
        // Запуск игрового цикла
        if (this.game) {
            this.game.start();
        }
        
        // Показ главного меню
        if (this.uiManager) {
            this.uiManager.showScreen('mainMenu');
        }
        
        this.running = true;
        console.log('✅ Игра запущена!');
    }
    
    stop() {
        if (!this.running) {
            console.log('⚠️ Игра уже остановлена');
            return;
        }
        
        console.log('🛑 Остановка игры...');
        
        // Остановка игрового цикла
        if (this.game) {
            this.game.stop();
        }
        
        // Сохранение данных
        this.saveGameData();
        
        this.running = false;
        console.log('✅ Игра остановлена');
    }
    
    // Обработчики событий
    onGameStart(detail) {
        console.log('🎮 Начало игры:', detail);
        
        // Применение глобальных улучшений к игроку
        if (detail.character && this.game.entityManager.player) {
            this.globalUpgradeSystem.applyUpgradesToPlayer(this.game.entityManager.player);
        }
        
        // Обновление статистики
        this.updateGameStats();
    }
    
    onGamePause() {
        console.log('⏸️ Игра приостановлена');
        
        // Сохранение данных
        this.saveGameData();
    }
    
    onGameResume() {
        console.log('▶️ Игра возобновлена');
    }
    
    onGameOver(detail) {
        console.log('💀 Игра окончена:', detail);
        
        // Обновление лидерборда
        this.updateLeaderboard(detail);
        
        // Проверка достижений
        this.checkAchievements(detail);
        
        // Сохранение данных
        this.saveGameData();
    }
    
    onGameMainMenu() {
        console.log('🏠 Возврат в главное меню');
        
        // Сохранение данных
        this.saveGameData();
    }
    
    onUpgradeSelected(detail) {
        console.log('⬆️ Выбрано улучшение:', detail);
        
        // Применение улучшения
        if (this.game && this.game.upgradeSystem) {
            this.game.upgradeSystem.applyUpgrade(detail);
        }
    }
    
    onLocationSelected(detail) {
        console.log('🗺️ Выбрана локация:', detail);
        
        // Смена локации
        if (this.locationSystem) {
            this.locationSystem.changeLocation(detail.location);
        }
    }
    
    onCharacterSelected(detail) {
        console.log('👤 Выбран персонаж:', detail);
        
        // Разблокировка персонажа
        if (detail.character && this.saveSystem) {
            this.saveSystem.unlockCharacter(detail.character);
        }
    }
    
    onAchievementUnlocked(detail) {
        console.log('🏆 Достижение разблокировано:', detail);
        
        // Показ уведомления
        if (this.uiManager) {
            this.uiManager.showAchievementNotification(detail);
        }
        
        // Обновление статистики
        this.updateGameStats();
    }
    
    onLeaderboardUpdate() {
        console.log('📊 Обновление лидерборда');
        
        // Обновление UI
        if (this.uiManager) {
            this.uiManager.updateLeaderboard();
        }
    }
    
    onKeyDown(e) {
        // Глобальные горячие клавиши
        switch (e.key) {
            case 'F5':
                e.preventDefault();
                this.restart();
                break;
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'F12':
                e.preventDefault();
                this.toggleDebug();
                break;
        }
    }
    
    onResize() {
        // Обработка изменения размера окна
        if (this.game) {
            this.game.onResize();
        }
    }
    
    onBeforeUnload() {
        // Сохранение данных перед закрытием
        this.saveGameData();
    }
    
    // Вспомогательные методы
    updateGameStats() {
        // Обновление статистики игры
        if (this.game && this.game.entityManager.player) {
            const player = this.game.entityManager.player;
            
            // Обновление условий достижений
            this.achievementSystem.updateCondition('level', player.level || 1);
            this.achievementSystem.updateCondition('health', player.health || 0);
            this.achievementSystem.updateCondition('max_health', player.maxHealth || 0);
            
            // Проверка достижений
            this.achievementSystem.checkAchievements();
        }
    }
    
    updateLeaderboard(gameData) {
        // Обновление лидерборда
        if (this.leaderboardSystem && gameData) {
            // Добавление записей в локальный лидерборд
            this.leaderboardSystem.addEntry('local', 'topKills', {
                name: 'Player',
                value: gameData.kills || 0,
                date: Date.now()
            });
            
            this.leaderboardSystem.addEntry('local', 'topSurvival', {
                name: 'Player',
                value: gameData.survivalTime || 0,
                date: Date.now()
            });
            
            this.leaderboardSystem.addEntry('local', 'topLevel', {
                name: 'Player',
                value: gameData.level || 1,
                date: Date.now()
            });
            
            this.leaderboardSystem.addEntry('local', 'topCoins', {
                name: 'Player',
                value: gameData.coins || 0,
                date: Date.now()
            });
        }
    }
    
    checkAchievements(gameData) {
        // Проверка достижений
        if (this.achievementSystem && gameData) {
            this.achievementSystem.updateCondition('kill_count', gameData.kills || 0);
            this.achievementSystem.updateCondition('survival_time', gameData.survivalTime || 0);
            this.achievementSystem.updateCondition('level', gameData.level || 1);
            this.achievementSystem.updateCondition('coins_collected', gameData.coins || 0);
            
            this.achievementSystem.checkAchievements();
        }
    }
    
    applySettings(settings) {
        // Применение настроек
        if (this.game) {
            // Настройки звука
            this.game.soundEnabled = settings.soundEnabled || false;
            
            // Настройки частиц
            this.game.particlesEnabled = settings.particlesEnabled !== false;
            
            // Настройки FPS
            this.game.showFPS = settings.showFPS || false;
        }
    }
    
    restart() {
        console.log('🔄 Перезапуск игры...');
        
        // Остановка игры
        this.stop();
        
        // Очистка данных
        if (this.game) {
            this.game.reset();
        }
        
        // Перезапуск
        setTimeout(() => {
            this.start();
        }, 100);
    }
    
    toggleFullscreen() {
        // Переключение полноэкранного режима
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    toggleDebug() {
        // Переключение режима отладки
        if (this.game) {
            this.game.debugMode = !this.game.debugMode;
            console.log('🐛 Режим отладки:', this.game.debugMode ? 'включен' : 'выключен');
        }
    }
    
    showError(message) {
        // Показ ошибки
        console.error('❌', message);
        
        if (this.uiManager) {
            this.uiManager.showError(message);
        } else {
            alert(message);
        }
    }
    
    // Публичные методы
    getGame() {
        return this.game;
    }
    
    getUIManager() {
        return this.uiManager;
    }
    
    getSaveSystem() {
        return this.saveSystem;
    }
    
    getGlobalUpgradeSystem() {
        return this.globalUpgradeSystem;
    }
    
    getLocationSystem() {
        return this.locationSystem;
    }
    
    getAchievementSystem() {
        return this.achievementSystem;
    }
    
    getLeaderboardSystem() {
        return this.leaderboardSystem;
    }
    
    isInitialized() {
        return this.initialized;
    }
    
    isRunning() {
        return this.running;
    }
    
    // Очистка
    destroy() {
        console.log('🗑️ Очистка игры...');
        
        // Остановка игры
        this.stop();
        
        // Сохранение данных
        this.saveGameData();
        
        // Уничтожение систем
        if (this.game) {
            this.game.destroy();
        }
        
        if (this.uiManager) {
            this.uiManager.destroy();
        }
        
        if (this.saveSystem) {
            this.saveSystem.destroy();
        }
        
        if (this.globalUpgradeSystem) {
            this.globalUpgradeSystem.destroy();
        }
        
        if (this.locationSystem) {
            this.locationSystem.destroy();
        }
        
        if (this.achievementSystem) {
            this.achievementSystem.destroy();
        }
        
        if (this.leaderboardSystem) {
            this.leaderboardSystem.destroy();
        }
        
        // Очистка ссылок
        this.game = null;
        this.uiManager = null;
        this.saveSystem = null;
        this.globalUpgradeSystem = null;
        this.locationSystem = null;
        this.achievementSystem = null;
        this.leaderboardSystem = null;
        
        this.initialized = false;
        this.running = false;
        
        console.log('✅ Игра очищена');
    }
}

// Глобальный экземпляр игры
let gameInstance = null;

// Функция для запуска игры
export function startGame() {
    if (gameInstance) {
        console.warn('⚠️ Игра уже запущена');
        return gameInstance;
    }
    
    gameInstance = new BrowserSurvivalGame();
    return gameInstance;
}

// Функция для остановки игры
export function stopGame() {
    if (gameInstance) {
        gameInstance.destroy();
        gameInstance = null;
    }
}

// Функция для получения экземпляра игры
export function getGame() {
    return gameInstance;
}

// Автозапуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Страница загружена, запуск игры...');
    startGame();
});

// Очистка при выгрузке страницы
window.addEventListener('unload', () => {
    stopGame();
});
