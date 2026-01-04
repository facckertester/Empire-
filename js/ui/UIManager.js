// UI Manager - управление пользовательским интерфейсом
export class UIManager {
    constructor() {
        // Элементы UI
        this.elements = {};
        
        // Состояние UI
        this.currentScreen = 'mainMenu';
        this.isPaused = false;
        
        // Данные для отображения
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            level: 1,
            experience: 0,
            experienceToNext: 10,
            kills: 0,
            survivalTime: 0,
            coins: 0
        };
        
        // Данные персонажей
        this.characters = [];
        this.selectedCharacter = null;
        
        // Данные улучшений
        this.upgrades = [];
        this.playerCoins = 0;
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.loadCharacters();
        this.loadUpgrades();
        this.hideAllScreens();
        this.showScreen('mainMenu');
    }
    
    cacheElements() {
        // Основные элементы
        this.elements.mainMenu = document.getElementById('mainMenu');
        this.elements.characterMenu = document.getElementById('characterMenu');
        this.elements.upgradesMenu = document.getElementById('upgradesMenu');
        this.elements.gameHUD = document.getElementById('gameHUD');
        this.elements.pauseMenu = document.getElementById('pauseMenu');
        this.elements.levelUpScreen = document.getElementById('levelUpScreen');
        this.elements.gameOverScreen = document.getElementById('gameOverScreen');
        
        // HUD элементы
        this.elements.healthBar = document.getElementById('healthBar');
        this.elements.healthFill = document.getElementById('healthFill');
        this.elements.healthText = document.getElementById('healthText');
        this.elements.experienceBar = document.getElementById('experienceBar');
        this.elements.experienceFill = document.getElementById('experienceFill');
        this.elements.experienceText = document.getElementById('experienceText');
        this.elements.timer = document.getElementById('timer');
        this.elements.kills = document.getElementById('kills');
        this.elements.weaponSlots = document.getElementById('weaponSlots');
        this.elements.artifacts = document.getElementById('artifacts');
        
        // Кнопки
        this.elements.startButton = document.getElementById('startButton');
        this.elements.charactersButton = document.getElementById('charactersButton');
        this.elements.upgradesButton = document.getElementById('upgradesButton');
        this.elements.achievementsButton = document.getElementById('achievementsButton');
        this.elements.settingsButton = document.getElementById('settingsButton');
        
        this.elements.backFromCharacters = document.getElementById('backFromCharacters');
        this.elements.backFromUpgrades = document.getElementById('backFromUpgrades');
        
        this.elements.resumeButton = document.getElementById('resumeButton');
        this.elements.restartButton = document.getElementById('restartButton');
        this.elements.mainMenuButton = document.getElementById('mainMenuButton');
        
        this.elements.coinsAmount = document.getElementById('coinsAmount');
        this.elements.characterGrid = document.getElementById('characterGrid');
        this.elements.upgradeGrid = document.getElementById('upgradeGrid');
        this.elements.upgradeChoices = document.getElementById('upgradeChoices');
        this.elements.finalStats = document.getElementById('finalStats');
    }
    
    setupEventListeners() {
        // Главные кнопки
        this.elements.startButton?.addEventListener('click', () => this.onStartGame());
        this.elements.charactersButton?.addEventListener('click', () => this.onCharactersMenu());
        this.elements.upgradesButton?.addEventListener('click', () => this.onUpgradesMenu());
        this.elements.achievementsButton?.addEventListener('click', () => this.onAchievements());
        this.elements.settingsButton?.addEventListener('click', () => this.onSettings());
        
        // Кнопки возврата
        this.elements.backFromCharacters?.addEventListener('click', () => this.onBackToMainMenu());
        this.elements.backFromUpgrades?.addEventListener('click', () => this.onBackToMainMenu());
        
        // Кнопки паузы
        this.elements.resumeButton?.addEventListener('click', () => this.onResumeGame());
        this.elements.restartButton?.addEventListener('click', () => this.onRestartGame());
        this.elements.mainMenuButton?.addEventListener('click', () => this.onMainMenu());
        
        // События игры
        document.addEventListener('updateHUD', (e) => this.updateHUD(e.detail));
        document.addEventListener('showLevelUp', (e) => this.showLevelUp(e.detail));
        document.addEventListener('showGameOver', (e) => this.showGameOver(e.detail));
        
        // Клавиатура
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    loadCharacters() {
        // Загрузка данных персонажей
        this.characters = [
            {
                id: 'survivor',
                name: 'Выживший',
                health: 100,
                speed: 5,
                damage: 10,
                ability: 'Нет',
                startWeapon: 'Магический посох',
                unlocked: true,
                icon: '🧑'
            },
            {
                id: 'archer',
                name: 'Стрелок',
                health: 90,
                speed: 5.5,
                damage: 12,
                ability: '+20% радиус атаки',
                startWeapon: 'Лук',
                unlocked: false,
                icon: '🏹'
            },
            {
                id: 'hunter',
                name: 'Охотник',
                health: 95,
                speed: 6,
                damage: 15,
                ability: '+15% скорость атаки',
                startWeapon: 'Арбалет',
                unlocked: false,
                icon: '🎯'
            },
            {
                id: 'mage',
                name: 'Маг',
                health: 80,
                speed: 5,
                damage: 20,
                ability: '-10% кулдаун оружия',
                startWeapon: 'Огненный шар',
                unlocked: false,
                icon: '🧙'
            },
            {
                id: 'knight',
                name: 'Рыцарь',
                health: 120,
                speed: 4,
                damage: 20,
                ability: '+20% максимальное здоровье',
                startWeapon: 'Меч',
                unlocked: false,
                icon: '⚔️'
            },
            {
                id: 'scout',
                name: 'Разведчик',
                health: 85,
                speed: 7,
                damage: 8,
                ability: '+25% скорость движения',
                startWeapon: 'Метательные звезды',
                unlocked: false,
                icon: '🏃'
            },
            {
                id: 'healer',
                name: 'Целитель',
                health: 110,
                speed: 4.5,
                damage: 15,
                ability: '+1 HP/сек регенерация',
                startWeapon: 'Исцеляющий кристалл',
                unlocked: false,
                icon: '💚'
            },
            {
                id: 'sniper',
                name: 'Снайпер',
                health: 85,
                speed: 4.5,
                damage: 50,
                ability: '+40% радиус атаки',
                startWeapon: 'Снайперская винтовка',
                unlocked: false,
                icon: '🔫'
            },
            {
                id: 'engineer',
                name: 'Инженер',
                health: 100,
                speed: 4,
                damage: 15,
                ability: '+1 дополнительное оружие',
                startWeapon: 'Турель',
                unlocked: false,
                icon: '🔧'
            },
            {
                id: 'cyborg',
                name: 'Киборг',
                health: 140,
                speed: 4.5,
                damage: 28,
                ability: '+20% урона',
                startWeapon: 'Лазерная пушка',
                unlocked: false,
                icon: '🤖'
            },
            {
                id: 'mutant',
                name: 'Мутант',
                health: 130,
                speed: 5.5,
                damage: 12,
                ability: '+30% скорость атаки',
                startWeapon: 'Ядовитые когти',
                unlocked: false,
                icon: '🧬'
            },
            {
                id: 'shaman',
                name: 'Шаман',
                health: 75,
                speed: 5,
                damage: 25,
                ability: '-25% кулдаун оружия',
                startWeapon: 'Тотем молний',
                unlocked: false,
                icon: '🔮'
            },
            {
                id: 'ghost',
                name: 'Призрак',
                health: 60,
                speed: 8,
                damage: 22,
                ability: '15% шанс уклонения',
                startWeapon: 'Призрачные клинки',
                unlocked: false,
                icon: '👻'
            },
            {
                id: 'tank',
                name: 'Танк',
                health: 200,
                speed: 3,
                damage: 40,
                ability: 'Блокирует 20% урона',
                startWeapon: 'Щит и молот',
                unlocked: false,
                icon: '🛡️'
            },
            {
                id: 'assassin',
                name: 'Ассасин',
                health: 70,
                speed: 9,
                damage: 18,
                ability: '+50% критический урон',
                startWeapon: 'Кинжалы',
                unlocked: false,
                icon: '🗡️'
            },
            {
                id: 'necromancer',
                name: 'Некромант',
                health: 90,
                speed: 4.5,
                damage: 35,
                ability: 'Воскрешение 5 врагов союзниками',
                startWeapon: 'Кость смерти',
                unlocked: false,
                icon: '💀'
            },
            {
                id: 'dragon',
                name: 'Дракон',
                health: 180,
                speed: 6,
                damage: 15,
                ability: '+30% урон огнем',
                startWeapon: 'Огненное дыхание',
                unlocked: false,
                icon: '🐉'
            },
            {
                id: 'god',
                name: 'Бог',
                health: 150,
                speed: 7,
                damage: 70,
                ability: '+25% ко всем характеристикам',
                startWeapon: 'Божественный молот',
                unlocked: false,
                icon: '✨'
            }
        ];
        
        // Установка выбранного персонажа
        this.selectedCharacter = this.characters.find(c => c.id === 'survivor');
    }
    
    loadUpgrades() {
        // Загрузка данных улучшений
        this.upgrades = [
            {
                id: 'health',
                name: 'Здоровье',
                description: '+2 HP к максимальному здоровью',
                level: 0,
                maxLevel: 100,
                cost: 5,
                icon: '❤️'
            },
            {
                id: 'speed',
                name: 'Скорость',
                description: '+0.5% скорость движения',
                level: 0,
                maxLevel: 100,
                cost: 4,
                icon: '👟'
            },
            {
                id: 'damage',
                name: 'Урон',
                description: '+1% урон',
                level: 0,
                maxLevel: 100,
                cost: 6,
                icon: '⚡'
            },
            {
                id: 'attackSpeed',
                name: 'Скорость атаки',
                description: '+0.8% скорость атаки',
                level: 0,
                maxLevel: 100,
                cost: 5,
                icon: '🏃'
            },
            {
                id: 'experienceMagnet',
                name: 'Магнит опыта',
                description: '+1% радиус притяжения опыта',
                level: 0,
                maxLevel: 100,
                cost: 3,
                icon: '🧲'
            },
            {
                id: 'startingHealth',
                name: 'Доп. здоровье',
                description: '+1 HP при старте',
                level: 0,
                maxLevel: 100,
                cost: 4,
                icon: '💊'
            },
            {
                id: 'criticalChance',
                name: 'Крит. шанс',
                description: '+0.3% шанс критического удара',
                level: 0,
                maxLevel: 100,
                cost: 7,
                icon: '💥'
            },
            {
                id: 'dodge',
                name: 'Уклонение',
                description: '+0.2% шанс уклонения',
                level: 0,
                maxLevel: 100,
                cost: 5,
                icon: '🛡️'
            }
        ];
    }
    
    // Управление экранами
    hideAllScreens() {
        Object.values(this.elements).forEach(element => {
            if (element && element.classList) {
                element.classList.add('hidden');
            }
        });
    }
    
    showScreen(screenName) {
        this.hideAllScreens();
        this.currentScreen = screenName;
        
        switch (screenName) {
            case 'mainMenu':
                this.elements.mainMenu?.classList.remove('hidden');
                break;
            case 'characterMenu':
                this.renderCharacterMenu();
                this.elements.characterMenu?.classList.remove('hidden');
                break;
            case 'upgradesMenu':
                this.renderUpgradesMenu();
                this.elements.upgradesMenu?.classList.remove('hidden');
                break;
            case 'game':
                this.elements.gameHUD?.classList.remove('hidden');
                break;
            case 'pause':
                this.elements.pauseMenu?.classList.remove('hidden');
                break;
            case 'levelUp':
                this.elements.levelUpScreen?.classList.remove('hidden');
                break;
            case 'gameOver':
                this.elements.gameOverScreen?.classList.remove('hidden');
                break;
        }
    }
    
    // Рендеринг меню персонажей
    renderCharacterMenu() {
        if (!this.elements.characterGrid) return;
        
        this.elements.characterGrid.innerHTML = '';
        
        this.characters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';
            
            if (!character.unlocked) {
                card.classList.add('locked');
            }
            
            if (this.selectedCharacter?.id === character.id) {
                card.classList.add('selected');
            }
            
            card.innerHTML = `
                <div class="character-icon">${character.icon}</div>
                <div class="character-name">${character.name}</div>
                <div class="character-stats">
                    HP: ${character.health} | Скорость: ${character.speed} | Урон: ${character.damage}
                </div>
                <div class="character-ability">${character.ability}</div>
                <div class="character-weapon">Стартовое оружие: ${character.startWeapon}</div>
            `;
            
            card.addEventListener('click', () => this.onCharacterSelect(character));
            this.elements.characterGrid.appendChild(card);
        });
    }
    
    // Рендеринг меню улучшений
    renderUpgradesMenu() {
        if (!this.elements.upgradeGrid) return;
        
        this.elements.upgradeGrid.innerHTML = '';
        this.elements.coinsAmount.textContent = this.playerCoins;
        
        this.upgrades.forEach(upgrade => {
            const item = document.createElement('div');
            item.className = 'upgrade-item';
            
            const canUpgrade = this.canUpgrade(upgrade);
            const cost = this.getUpgradeCost(upgrade);
            
            item.innerHTML = `
                <div class="upgrade-name">${upgrade.icon} ${upgrade.name}</div>
                <div class="upgrade-level">Уровень: ${upgrade.level}/${upgrade.maxLevel}</div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-cost">${cost} монет</div>
            `;
            
            if (!canUpgrade) {
                item.style.opacity = '0.5';
                item.style.cursor = 'not-allowed';
            } else {
                item.addEventListener('click', () => this.onUpgradeSelect(upgrade));
            }
            
            this.elements.upgradeGrid.appendChild(item);
        });
    }
    
    canUpgrade(upgrade) {
        return upgrade.level < upgrade.maxLevel && this.playerCoins >= this.getUpgradeCost(upgrade);
    }
    
    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.cost * Math.pow(1.12, upgrade.level));
    }
    
    // Обновление HUD
    updateHUD(stats) {
        this.playerStats = { ...this.playerStats, ...stats };
        
        // Здоровье
        if (this.elements.healthFill) {
            const healthPercent = (stats.health / stats.maxHealth) * 100;
            this.elements.healthFill.style.width = `${healthPercent}%`;
        }
        
        if (this.elements.healthText) {
            this.elements.healthText.textContent = `${Math.floor(stats.health)}/${stats.maxHealth}`;
        }
        
        // Опыт
        if (this.elements.experienceFill) {
            const expPercent = (stats.experience / stats.experienceToNext) * 100;
            this.elements.experienceFill.style.width = `${expPercent}%`;
        }
        
        if (this.elements.experienceText) {
            this.elements.experienceText.textContent = `Уровень ${stats.level}`;
        }
        
        // Таймер
        if (this.elements.timer) {
            const minutes = Math.floor(stats.survivalTime / 60);
            const seconds = Math.floor(stats.survivalTime % 60);
            this.elements.timer.textContent = `Время: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Убийства
        if (this.elements.kills) {
            this.elements.kills.textContent = `Убийства: ${stats.kills}`;
        }
        
        // Слоты оружия
        this.renderWeaponSlots();
        
        // Артефакты
        this.renderArtifacts();
    }
    
    renderWeaponSlots() {
        if (!this.elements.weaponSlots) return;
        
        this.elements.weaponSlots.innerHTML = '';
        
        for (let i = 0; i < 6; i++) {
            const slot = document.createElement('div');
            slot.className = 'weapon-slot';
            
            if (i === 0) {
                slot.classList.add('active');
            }
            
            slot.innerHTML = `
                <div class="weapon-icon">🔫</div>
                <div class="level">1</div>
            `;
            
            this.elements.weaponSlots.appendChild(slot);
        }
    }
    
    renderArtifacts() {
        if (!this.elements.artifacts) return;
        
        this.elements.artifacts.innerHTML = '';
        
        // Временно - будут добавлены реальные артефакты
        for (let i = 0; i < 3; i++) {
            const artifact = document.createElement('div');
            artifact.className = 'artifact';
            artifact.innerHTML = '💎';
            this.elements.artifacts.appendChild(artifact);
        }
    }
    
    // Экран повышения уровня
    showLevelUp(upgrades) {
        if (!this.elements.upgradeChoices) return;
        
        this.elements.upgradeChoices.innerHTML = '';
        
        upgrades.forEach(upgrade => {
            const choice = document.createElement('div');
            choice.className = 'upgrade-choice';
            
            choice.innerHTML = `
                <h3>${upgrade.icon} ${upgrade.name}</h3>
                <p>${upgrade.description}</p>
            `;
            
            choice.addEventListener('click', () => this.onUpgradeChoice(upgrade));
            this.elements.upgradeChoices.appendChild(choice);
        });
        
        this.showScreen('levelUp');
    }
    
    // Экран окончания игры
    showGameOver(stats) {
        if (!this.elements.finalStats) return;
        
        this.elements.finalStats.innerHTML = `
            <div class="stat-item">Уровень: ${stats.level}</div>
            <div class="stat-item">Убийства: ${stats.kills}</div>
            <div class="stat-item">Время выживания: ${this.formatTime(stats.survivalTime)}</div>
            <div class="stat-item">Монеты: +${Math.floor(stats.survivalTime / 10)}</div>
        `;
        
        this.showScreen('gameOver');
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Обработчики событий
    onStartGame() {
        if (this.selectedCharacter) {
            this.showScreen('game');
            this.dispatchGameEvent('gameStart', { character: this.selectedCharacter });
        }
    }
    
    onCharactersMenu() {
        this.showScreen('characterMenu');
    }
    
    onUpgradesMenu() {
        this.showScreen('upgradesMenu');
    }
    
    onAchievements() {
        // Будет реализовано
        console.log('Достижения');
    }
    
    onSettings() {
        // Будет реализовано
        console.log('Настройки');
    }
    
    onBackToMainMenu() {
        this.showScreen('mainMenu');
    }
    
    onCharacterSelect(character) {
        if (character.unlocked) {
            this.selectedCharacter = character;
            this.renderCharacterMenu();
        }
    }
    
    onUpgradeSelect(upgrade) {
        if (this.canUpgrade(upgrade)) {
            const cost = this.getUpgradeCost(upgrade);
            this.playerCoins -= cost;
            upgrade.level++;
            
            this.renderUpgradesMenu();
            this.dispatchGameEvent('upgradePurchased', { upgrade, cost });
        }
    }
    
    onUpgradeChoice(upgrade) {
        this.dispatchGameEvent('upgradeSelected', upgrade);
        this.showScreen('game');
    }
    
    onResumeGame() {
        this.showScreen('game');
        this.dispatchGameEvent('gameResume');
    }
    
    onRestartGame() {
        this.showScreen('game');
        this.dispatchGameEvent('gameRestart');
    }
    
    onMainMenu() {
        this.showScreen('mainMenu');
        this.dispatchGameEvent('gameMainMenu');
    }
    
    onKeyDown(e) {
        if (e.key === 'Escape') {
            if (this.currentScreen === 'game') {
                this.showScreen('pause');
                this.dispatchGameEvent('gamePause');
            } else if (this.currentScreen === 'pause') {
                this.showScreen('game');
                this.dispatchGameEvent('gameResume');
            }
        }
    }
    
    // Вспомогательные методы
    dispatchGameEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
    
    // Публичные методы
    setPlayerCoins(coins) {
        this.playerCoins = coins;
        if (this.elements.coinsAmount) {
            this.elements.coinsAmount.textContent = coins;
        }
    }
    
    unlockCharacter(characterId) {
        const character = this.characters.find(c => c.id === characterId);
        if (character) {
            character.unlocked = true;
            this.renderCharacterMenu();
        }
    }
    
    getCurrentScreen() {
        return this.currentScreen;
    }
    
    isGameActive() {
        return this.currentScreen === 'game';
    }
    
    // Очистка
    destroy() {
        // Удаление всех обработчиков событий
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.removeEventListener('click', () => {});
            }
        });
        
        document.removeEventListener('updateHUD', () => {});
        document.removeEventListener('showLevelUp', () => {});
        document.removeEventListener('showGameOver', () => {});
        document.removeEventListener('keydown', () => {});
    }
}
