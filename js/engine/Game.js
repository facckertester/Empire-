// Основной игровой класс
import { Renderer } from './Renderer.js';
import { InputHandler } from './InputHandler.js';
import { EntityManager } from '../entities/EntityManager.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { UpgradeSystem } from '../systems/UpgradeSystem.js';
import { SpatialHashing } from '../systems/SpatialHashing.js';
import { ObjectPool } from '../systems/ObjectPool.js';

export class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.renderer = null;
        this.inputHandler = null;
        this.entityManager = null;
        this.collisionSystem = null;
        this.spawnSystem = null;
        this.upgradeSystem = null;
        this.spatialHashing = null;
        this.objectPool = null;
        
        // Игровые параметры
        this.width = 1920;
        this.height = 1080;
        this.scale = 1;
        this.isRunning = false;
        this.isPaused = false;
        
        // Время
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        
        // Игровые состояния
        this.gameState = 'menu'; // menu, playing, paused, gameover, levelup
        this.currentLevel = 1;
        this.experience = 0;
        this.experienceToNextLevel = 10;
        this.kills = 0;
        this.coins = 0;
        this.survivalTime = 0;
        
        // Настройки
        this.settings = {
            soundEnabled: false,
            particlesEnabled: true,
            showFPS: false
        };
    }
    
    async init() {
        // Инициализация canvas
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Настройка canvas
        this.setupCanvas();
        
        // Инициализация систем
        this.renderer = new Renderer(this.ctx, this.width, this.height);
        this.inputHandler = new InputHandler(this.canvas);
        this.spatialHashing = new SpatialHashing(this.width, this.height, 64);
        this.objectPool = new ObjectPool();
        this.entityManager = new EntityManager(this.objectPool);
        this.collisionSystem = new CollisionSystem(this.spatialHashing);
        this.spawnSystem = new SpawnSystem(this.entityManager);
        this.upgradeSystem = new UpgradeSystem();
        
        // Загрузка сохраненных данных
        this.loadGameData();
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        console.log('Игра инициализирована');
    }
    
    setupCanvas() {
        // Установка размеров canvas
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Настройка стилей
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.transformOrigin = 'top left';
        
        // Масштабирование под размер окна
        this.updateCanvasScale();
    }
    
    updateCanvasScale() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Вычисление масштаба
        const scaleX = windowWidth / this.width;
        const scaleY = windowHeight / this.height;
        this.scale = Math.min(scaleX, scaleY, 1);
        
        // Применение масштаба
        this.canvas.style.transform = `scale(${this.scale})`;
        
        // Центрирование canvas
        const scaledWidth = this.width * this.scale;
        const scaledHeight = this.height * this.scale;
        const offsetX = (windowWidth - scaledWidth) / 2;
        const offsetY = (windowHeight - scaledHeight) / 2;
        
        this.canvas.style.left = `${offsetX}px`;
        this.canvas.style.top = `${offsetY}px`;
    }
    
    setupEventListeners() {
        // События клавиатуры
        this.inputHandler.on('pause', () => this.togglePause());
        this.inputHandler.on('restart', () => this.restart());
        
        // События UI
        document.addEventListener('gameStart', () => this.startGame());
        document.addEventListener('gamePause', () => this.togglePause());
        document.addEventListener('gameResume', () => this.resume());
        document.addEventListener('gameRestart', () => this.restart());
        document.addEventListener('gameMainMenu', () => this.mainMenu());
        document.addEventListener('upgradeSelected', (e) => this.onUpgradeSelected(e.detail));
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // Вычисление delta time
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        // Обновление FPS
        this.updateFPS(currentTime);
        
        // Обновление игрового времени
        if (!this.isPaused && this.gameState === 'playing') {
            this.gameTime += this.deltaTime;
            this.survivalTime += this.deltaTime;
        }
        
        // Обновление и отрисовка
        if (!this.isPaused) {
            this.update(this.deltaTime);
        }
        this.render();
        
        // Продолжение цикла
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    updateFPS(currentTime) {
        this.frameCount++;
        if (currentTime - this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = currentTime;
        }
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Обновление систем
        this.inputHandler.update();
        this.entityManager.update(deltaTime);
        this.collisionSystem.update(deltaTime);
        this.spawnSystem.update(deltaTime, this.gameTime);
        this.upgradeSystem.update(deltaTime);
        
        // Обновление spatial hashing
        this.spatialHashing.clear();
        this.entityManager.addToSpatialHashing(this.spatialHashing);
        
        // Проверка условий повышения уровня
        this.checkLevelUp();
        
        // Обновление UI
        this.updateUI();
    }
    
    render() {
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Отрисовка игровых объектов
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            this.renderer.render(this.entityManager, this.gameTime);
        }
        
        // Отрисовка FPS
        if (this.settings.showFPS) {
            this.renderFPS();
        }
    }
    
    renderFPS() {
        this.ctx.save();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        this.ctx.restore();
    }
    
    startGame() {
        this.gameState = 'playing';
        this.resetGame();
        this.entityManager.createPlayer();
        this.spawnSystem.start();
    }
    
    resetGame() {
        // Сброс игровых параметров
        this.currentLevel = 1;
        this.experience = 0;
        this.experienceToNextLevel = 10;
        this.kills = 0;
        this.survivalTime = 0;
        this.gameTime = 0;
        
        // Очистка сущностей
        this.entityManager.clear();
        this.spawnSystem.reset();
        this.upgradeSystem.reset();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.isPaused = true;
            this.showPauseMenu();
        } else if (this.gameState === 'paused') {
            this.resume();
        }
    }
    
    resume() {
        this.gameState = 'playing';
        this.isPaused = false;
        this.hidePauseMenu();
    }
    
    restart() {
        this.resetGame();
        this.startGame();
    }
    
    mainMenu() {
        this.gameState = 'menu';
        this.isPaused = false;
        this.resetGame();
        this.showMainMenu();
    }
    
    checkLevelUp() {
        if (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.currentLevel++;
        this.experience -= this.experienceToNextLevel;
        this.experienceToNextLevel = this.currentLevel * 10;
        
        // Показать выбор улучшений
        this.gameState = 'levelup';
        this.isPaused = true;
        this.showLevelUpScreen();
    }
    
    onUpgradeSelected(upgrade) {
        this.upgradeSystem.applyUpgrade(upgrade);
        this.gameState = 'playing';
        this.isPaused = false;
        this.hideLevelUpScreen();
    }
    
    gameOver() {
        this.gameState = 'gameover';
        this.isPaused = true;
        this.saveGameData();
        this.showGameOverScreen();
    }
    
    onResize() {
        this.updateCanvasScale();
    }
    
    updateUI() {
        // Обновление HUD
        const event = new CustomEvent('updateHUD', {
            detail: {
                health: this.entityManager.player ? this.entityManager.player.health : 0,
                maxHealth: this.entityManager.player ? this.entityManager.player.maxHealth : 0,
                level: this.currentLevel,
                experience: this.experience,
                experienceToNext: this.experienceToNextLevel,
                kills: this.kills,
                survivalTime: this.survivalTime,
                coins: this.coins
            }
        });
        document.dispatchEvent(event);
    }
    
    loadGameData() {
        // Загрузка сохраненных данных из LocalStorage
        const savedData = localStorage.getItem('browserSurvivalGame');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.coins = data.coins || 0;
                this.settings = { ...this.settings, ...data.settings };
                this.upgradeSystem.loadUpgrades(data.upgrades || {});
            } catch (error) {
                console.error('Ошибка загрузки сохраненных данных:', error);
            }
        }
    }
    
    saveGameData() {
        // Сохранение данных в LocalStorage
        const data = {
            coins: this.coins,
            settings: this.settings,
            upgrades: this.upgradeSystem.getUpgrades(),
            lastPlayed: Date.now()
        };
        
        try {
            localStorage.setItem('browserSurvivalGame', JSON.stringify(data));
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    }
    
    // Методы для UI
    showMainMenu() {
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('gameHUD').classList.add('hidden');
    }
    
    hideMainMenu() {
        document.getElementById('mainMenu').classList.add('hidden');
    }
    
    showPauseMenu() {
        document.getElementById('pauseMenu').classList.remove('hidden');
    }
    
    hidePauseMenu() {
        document.getElementById('pauseMenu').classList.add('hidden');
    }
    
    showLevelUpScreen() {
        const upgrades = this.upgradeSystem.getRandomUpgrades(3);
        const event = new CustomEvent('showLevelUp', { detail: upgrades });
        document.dispatchEvent(event);
    }
    
    hideLevelUpScreen() {
        document.getElementById('levelUpScreen').classList.add('hidden');
    }
    
    showGameOverScreen() {
        const stats = {
            level: this.currentLevel,
            kills: this.kills,
            survivalTime: this.survivalTime,
            coins: this.coins
        };
        const event = new CustomEvent('showGameOver', { detail: stats });
        document.dispatchEvent(event);
    }
}
