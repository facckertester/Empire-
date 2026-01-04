// Система улучшений в игре
export class UpgradeSystem {
    constructor() {
        // Доступные улучшения
        this.availableUpgrades = [];
        
        // История выбранных улучшений
        this.upgradeHistory = [];
        
        // Уровень игрока
        this.playerLevel = 1;
        
        // Количество вариантов для выбора
        this.choiceCount = 3;
        
        // Веса для разных типов улучшений
        this.weights = {
            weapon: 0.4,
            stat: 0.4,
            special: 0.2
        };
        
        // Инициализация улучшений
        this.initializeUpgrades();
    }
    
    initializeUpgrades() {
        // Оружейные улучшения
        this.weaponUpgrades = [
            {
                id: 'new_weapon_staff',
                name: 'Магический посох',
                type: 'weapon',
                description: 'Добавляет магический посох',
                icon: '🔮',
                weight: 1,
                condition: (player) => player.weapons.length < player.maxWeaponSlots
            },
            {
                id: 'new_weapon_bow',
                name: 'Лук',
                type: 'weapon',
                description: 'Добавляет лук',
                icon: '🏹',
                weight: 1,
                condition: (player) => player.weapons.length < player.maxWeaponSlots
            },
            {
                id: 'new_weapon_sword',
                name: 'Меч',
                type: 'weapon',
                description: 'Добавляет меч',
                icon: '⚔️',
                weight: 1,
                condition: (player) => player.weapons.length < player.maxWeaponSlots
            },
            {
                id: 'upgrade_weapon',
                name: 'Улучшить оружие',
                type: 'weapon',
                description: 'Улучшает случайное оружие',
                icon: '⬆️',
                weight: 2,
                condition: (player) => player.weapons.some(w => w.level < 8)
            }
        ];
        
        // Статистические улучшения
        this.statUpgrades = [
            {
                id: 'health',
                name: 'Здоровье',
                type: 'stat',
                description: '+10% максимальное здоровье',
                icon: '❤️',
                weight: 1,
                effect: (player) => {
                    player.maxHealth *= 1.1;
                    player.health *= 1.1;
                }
            },
            {
                id: 'speed',
                name: 'Скорость',
                type: 'stat',
                description: '+10% скорость движения',
                icon: '👟',
                weight: 1,
                effect: (player) => {
                    player.speed *= 1.1;
                    player.baseSpeed *= 1.1;
                }
            },
            {
                id: 'damage',
                name: 'Урон',
                type: 'stat',
                description: '+10% урон',
                icon: '⚡',
                weight: 1,
                effect: (player) => {
                    player.damage *= 1.1;
                    player.baseDamage *= 1.1;
                }
            },
            {
                id: 'attack_speed',
                name: 'Скорость атаки',
                type: 'stat',
                description: '+10% скорость атаки',
                icon: '🏃',
                weight: 1,
                effect: (player) => {
                    // Уменьшение кулдауна оружия
                }
            },
            {
                id: 'experience_magnet',
                name: 'Магнит опыта',
                type: 'stat',
                description: '+10% радиус притяжения опыта',
                icon: '🧲',
                weight: 1,
                effect: (player) => {
                    player.experienceMagnetRadius *= 1.1;
                }
            },
            {
                id: 'regeneration',
                name: 'Регенерация',
                type: 'stat',
                description: '+1 HP/сек регенерация',
                icon: '💚',
                weight: 0.5,
                effect: (player) => {
                    player.regeneration += 1;
                }
            },
            {
                id: 'critical_chance',
                name: 'Крит. шанс',
                type: 'stat',
                description: '+5% шанс критического удара',
                icon: '💥',
                weight: 0.5,
                effect: (player) => {
                    player.criticalChance += 0.05;
                }
            },
            {
                id: 'dodge',
                name: 'Уклонение',
                type: 'stat',
                description: '+5% шанс уклонения',
                icon: '🛡️',
                weight: 0.5,
                effect: (player) => {
                    player.dodgeChance += 0.05;
                }
            }
        ];
        
        // Специальные улучшения
        this.specialUpgrades = [
            {
                id: 'full_heal',
                name: 'Полное лечение',
                type: 'special',
                description: 'Восстанавливает здоровье до 100%',
                icon: '💊',
                weight: 0.5,
                effect: (player) => {
                    player.health = player.maxHealth;
                }
            },
            {
                id: 'invincibility',
                name: 'Неуязвимость',
                type: 'special',
                description: 'Неуязвимость на 5 секунд',
                icon: '✨',
                weight: 0.3,
                effect: (player) => {
                    player.addEffect('invincible', 5);
                }
            },
            {
                id: 'double_experience',
                name: 'Двойной опыт',
                type: 'special',
                description: 'x2 опыт на 30 секунд',
                icon: '⭐',
                weight: 0.3,
                effect: (player) => {
                    player.addEffect('doubleExperience', 30);
                }
            },
            {
                id: 'time_slow',
                name: 'Замедление времени',
                type: 'special',
                description: 'Замедляет время на 10 секунд',
                icon: '⏰',
                weight: 0.2,
                effect: (player) => {
                    // Глобальное замедление времени
                }
            },
            {
                id: 'clear_screen',
                name: 'Очистка экрана',
                type: 'special',
                description: 'Уничтожает всех врагов на экране',
                icon: '💥',
                weight: 0.1,
                effect: (player) => {
                    // Уничтожение врагов
                }
            },
            {
                id: 'extra_weapon_slot',
                name: 'Дополнительный слот',
                type: 'special',
                description: 'Добавляет дополнительный слот оружия',
                icon: '📦',
                weight: 0.2,
                condition: (player) => player.weaponSlots < player.maxWeaponSlots,
                effect: (player) => {
                    player.weaponSlots++;
                }
            }
        ];
    }
    
    reset() {
        this.upgradeHistory = [];
        this.playerLevel = 1;
        this.availableUpgrades = [];
    }
    
    update(deltaTime) {
        // Обновление системы (если нужно)
    }
    
    getRandomUpgrades(count = 3) {
        const upgrades = [];
        const player = this.getCurrentPlayer();
        
        if (!player) return upgrades;
        
        // Получение всех доступных улучшений
        const availableUpgrades = this.getAvailableUpgrades(player);
        
        // Выбор случайных улучшений с учетом весов
        for (let i = 0; i < Math.min(count, availableUpgrades.length); i++) {
            const upgrade = this.selectWeightedUpgrade(availableUpgrades, upgrades);
            if (upgrade) {
                upgrades.push(upgrade);
            }
        }
        
        return upgrades;
    }
    
    getAvailableUpgrades(player) {
        const upgrades = [];
        
        // Добавление оружейных улучшений
        this.weaponUpgrades.forEach(upgrade => {
            if (!upgrade.condition || upgrade.condition(player)) {
                upgrades.push({ ...upgrade, category: 'weapon' });
            }
        });
        
        // Добавление статистических улучшений
        this.statUpgrades.forEach(upgrade => {
            upgrades.push({ ...upgrade, category: 'stat' });
        });
        
        // Добавление специальных улучшений
        this.specialUpgrades.forEach(upgrade => {
            if (!upgrade.condition || upgrade.condition(player)) {
                upgrades.push({ ...upgrade, category: 'special' });
            }
        });
        
        return upgrades;
    }
    
    selectWeightedUpgrade(availableUpgrades, excludeList = []) {
        // Фильтрация исключенных улучшений
        const filtered = availableUpgrades.filter(upgrade => 
            !excludeList.some(excluded => excluded.id === upgrade.id)
        );
        
        if (filtered.length === 0) return null;
        
        // Расчет общего веса
        const totalWeight = filtered.reduce((sum, upgrade) => sum + upgrade.weight, 0);
        
        // Случайный выбор с учетом весов
        let random = Math.random() * totalWeight;
        
        for (const upgrade of filtered) {
            random -= upgrade.weight;
            if (random <= 0) {
                return upgrade;
            }
        }
        
        return filtered[filtered.length - 1];
    }
    
    applyUpgrade(upgrade, player = null) {
        const targetPlayer = player || this.getCurrentPlayer();
        
        if (!targetPlayer) return false;
        
        // Применение улучшения
        switch (upgrade.category) {
            case 'weapon':
                return this.applyWeaponUpgrade(upgrade, targetPlayer);
            case 'stat':
                return this.applyStatUpgrade(upgrade, targetPlayer);
            case 'special':
                return this.applySpecialUpgrade(upgrade, targetPlayer);
            default:
                return false;
        }
    }
    
    applyWeaponUpgrade(upgrade, player) {
        switch (upgrade.id) {
            case 'new_weapon_staff':
                return player.addWeapon('staff');
            case 'new_weapon_bow':
                return player.addWeapon('bow');
            case 'new_weapon_sword':
                return player.addWeapon('sword');
            case 'upgrade_weapon':
                // Улучшение случайного оружия
                const availableWeapons = player.weapons.filter(w => w.level < 8);
                if (availableWeapons.length > 0) {
                    const weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
                    return player.upgradeWeapon(weapon.type);
                }
                return false;
            default:
                return false;
        }
    }
    
    applyStatUpgrade(upgrade, player) {
        if (upgrade.effect) {
            upgrade.effect(player);
            return true;
        }
        return false;
    }
    
    applySpecialUpgrade(upgrade, player) {
        if (upgrade.effect) {
            upgrade.effect(player);
            return true;
        }
        return false;
    }
    
    getCurrentPlayer() {
        // Получение текущего игрока из EntityManager
        // Будет реализовано при интеграции с Game
        return null; // Временно
    }
    
    // Получение улучшений по типу
    getUpgradesByType(type) {
        switch (type) {
            case 'weapon':
                return this.weaponUpgrades;
            case 'stat':
                return this.statUpgrades;
            case 'special':
                return this.specialUpgrades;
            default:
                return [];
        }
    }
    
    // Получение улучшения по ID
    getUpgradeById(id) {
        const allUpgrades = [
            ...this.weaponUpgrades,
            ...this.statUpgrades,
            ...this.specialUpgrades
        ];
        
        return allUpgrades.find(upgrade => upgrade.id === id);
    }
    
    // Проверка доступности улучшения
    isUpgradeAvailable(upgrade, player = null) {
        const targetPlayer = player || this.getCurrentPlayer();
        
        if (!targetPlayer) return false;
        
        // Проверка условия
        if (upgrade.condition && !upgrade.condition(targetPlayer)) {
            return false;
        }
        
        // Проверка на уже выбранные улучшения
        const alreadySelected = this.upgradeHistory.some(h => h.id === upgrade.id);
        
        // Некоторые улучшения можно выбирать несколько раз
        const repeatable = ['health', 'speed', 'damage', 'attack_speed', 'experience_magnet'];
        
        return !alreadySelected || repeatable.includes(upgrade.id);
    }
    
    // Получение истории улучшений
    getUpgradeHistory() {
        return [...this.upgradeHistory];
    }
    
    // Очистка истории улучшений
    clearHistory() {
        this.upgradeHistory = [];
    }
    
    // Установка весов для типов улучшений
    setWeights(weights) {
        this.weights = { ...this.weights, ...weights };
        
        // Нормализация весов
        const total = Object.values(this.weights).reduce((sum, weight) => sum + weight, 0);
        Object.keys(this.weights).forEach(key => {
            this.weights[key] /= total;
        });
    }
    
    // Получение статистики
    getStats() {
        return {
            totalUpgrades: this.upgradeHistory.length,
            weaponUpgrades: this.upgradeHistory.filter(u => u.category === 'weapon').length,
            statUpgrades: this.upgradeHistory.filter(u => u.category === 'stat').length,
            specialUpgrades: this.upgradeHistory.filter(u => u.category === 'special').length,
            playerLevel: this.playerLevel,
            availableUpgrades: this.getAvailableUpgrades(this.getCurrentPlayer()).length
        };
    }
    
    // Сохранение и загрузка улучшений
    save() {
        return {
            upgradeHistory: this.upgradeHistory,
            playerLevel: this.playerLevel,
            weights: this.weights
        };
    }
    
    load(data) {
        if (data.upgradeHistory) {
            this.upgradeHistory = data.upgradeHistory;
        }
        if (data.playerLevel) {
            this.playerLevel = data.playerLevel;
        }
        if (data.weights) {
            this.weights = { ...this.weights, ...data.weights };
        }
    }
    
    // Создание кастомных улучшений
    createCustomUpgrade(upgrade) {
        const customUpgrade = {
            id: upgrade.id || `custom_${Date.now()}`,
            name: upgrade.name || 'Кастомное улучшение',
            type: upgrade.type || 'special',
            description: upgrade.description || 'Описание отсутствует',
            icon: upgrade.icon || '🎁',
            weight: upgrade.weight || 1,
            category: upgrade.category || 'special',
            condition: upgrade.condition,
            effect: upgrade.effect
        };
        
        this.specialUpgrades.push(customUpgrade);
        return customUpgrade;
    }
    
    // Удаление кастомного улучшения
    removeCustomUpgrade(id) {
        const index = this.specialUpgrades.findIndex(upgrade => upgrade.id === id);
        if (index > -1) {
            this.specialUpgrades.splice(index, 1);
            return true;
        }
        return false;
    }
}
