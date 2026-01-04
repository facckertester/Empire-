// Система глобальных улучшений (100 уровней)
export class GlobalUpgradeSystem {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        
        // Улучшения
        this.upgrades = {
            // Базовые характеристики
            health: {
                name: 'Здоровье',
                description: '+2 HP к максимальному здоровью',
                level: 0,
                maxLevel: 100,
                baseCost: 5,
                costMultiplier: 1.12,
                effect: (level) => level * 2
            },
            speed: {
                name: 'Скорость',
                description: '+0.5% скорость движения',
                level: 0,
                maxLevel: 100,
                baseCost: 4,
                costMultiplier: 1.12,
                effect: (level) => level * 0.5
            },
            damage: {
                name: 'Урон',
                description: '+1% урон',
                level: 0,
                maxLevel: 100,
                baseCost: 6,
                costMultiplier: 1.12,
                effect: (level) => level * 1
            },
            attackSpeed: {
                name: 'Скорость атаки',
                description: '+0.8% скорость атаки',
                level: 0,
                maxLevel: 100,
                baseCost: 5,
                costMultiplier: 1.12,
                effect: (level) => level * 0.8
            },
            experienceMagnet: {
                name: 'Магнит опыта',
                description: '+1% радиус притяжения опыта',
                level: 0,
                maxLevel: 100,
                baseCost: 3,
                costMultiplier: 1.12,
                effect: (level) => level * 1
            },
            startingHealth: {
                name: 'Доп. здоровье',
                description: '+1 HP при старте',
                level: 0,
                maxLevel: 100,
                baseCost: 4,
                costMultiplier: 1.12,
                effect: (level) => level * 1
            },
            criticalChance: {
                name: 'Крит. шанс',
                description: '+0.3% шанс критического удара',
                level: 0,
                maxLevel: 100,
                baseCost: 7,
                costMultiplier: 1.12,
                effect: (level) => level * 0.3
            },
            dodge: {
                name: 'Уклонение',
                description: '+0.2% шанс уклонения',
                level: 0,
                maxLevel: 100,
                baseCost: 5,
                costMultiplier: 1.12,
                effect: (level) => level * 0.2
            },
            // Продвинутые характеристики
            weaponSlots: {
                name: 'Слоты оружия',
                description: 'Дополнительный слот оружия',
                level: 0,
                maxLevel: 5,
                baseCost: 50,
                costMultiplier: 2,
                effect: (level) => level
            },
            artifactSlots: {
                name: 'Слоты артефактов',
                description: 'Дополнительный слот артефактов',
                level: 0,
                maxLevel: 2,
                baseCost: 30,
                costMultiplier: 2,
                effect: (level) => level
            },
            luck: {
                name: 'Удача',
                description: '+1% шанс редких находок',
                level: 0,
                maxLevel: 50,
                baseCost: 8,
                costMultiplier: 1.15,
                effect: (level) => level * 1
            },
            coinMultiplier: {
                name: 'Множитель монет',
                description: '+1% монет за убийство',
                level: 0,
                maxLevel: 50,
                baseCost: 10,
                costMultiplier: 1.15,
                effect: (level) => level * 1
            },
            // Специальные улучшения
            reviveChance: {
                name: 'Шанс воскрешения',
                description: '+1% шанс воскрешения при смерти',
                level: 0,
                maxLevel: 20,
                baseCost: 15,
                costMultiplier: 1.2,
                effect: (level) => level * 1
            },
            bossDamage: {
                name: 'Урон боссам',
                description: '+2% урон боссам',
                level: 0,
                maxLevel: 50,
                baseCost: 8,
                costMultiplier: 1.15,
                effect: (level) => level * 2
            },
            eliteDamage: {
                name: 'Урон элитам',
                description: '+1.5% урон элитным врагам',
                level: 0,
                maxLevel: 50,
                baseCost: 6,
                costMultiplier: 1.15,
                effect: (level) => level * 1.5
            },
            // Ресурсы
            startingCoins: {
                name: 'Стартовые монеты',
                description: '+10 монет при старте',
                level: 0,
                maxLevel: 100,
                baseCost: 2,
                costMultiplier: 1.1,
                effect: (level) => level * 10
            },
            experienceBonus: {
                name: 'Бонус опыта',
                description: '+1% дополнительный опыт',
                level: 0,
                maxLevel: 50,
                baseCost: 12,
                costMultiplier: 1.15,
                effect: (level) => level * 1
            },
            // Защита
            armor: {
                name: 'Броня',
                description: '+0.5% снижение урона',
                level: 0,
                maxLevel: 50,
                baseCost: 8,
                costMultiplier: 1.15,
                effect: (level) => level * 0.5
            },
            regeneration: {
                name: 'Регенерация',
                description: '+0.2 HP/сек регенерация',
                level: 0,
                maxLevel: 50,
                baseCost: 10,
                costMultiplier: 1.15,
                effect: (level) => level * 0.2
            },
            // Скорость
            acceleration: {
                name: 'Ускорение',
                description: '+0.3% ускорение движения',
                level: 0,
                maxLevel: 50,
                baseCost: 6,
                costMultiplier: 1.15,
                effect: (level) => level * 0.3
            },
            // Специальные
            magnetRange: {
                name: 'Радиус магнита',
                description: '+2% радиус всех магнитов',
                level: 0,
                maxLevel: 50,
                baseCost: 7,
                costMultiplier: 1.15,
                effect: (level) => level * 2
            },
            cooldownReduction: {
                name: 'Снижение кулдаунов',
                description: '+0.5% снижение всех кулдаунов',
                level: 0,
                maxLevel: 50,
                baseCost: 9,
                costMultiplier: 1.15,
                effect: (level) => level * 0.5
            },
            // Эксклюзивные улучшения
            autoCollect: {
                name: 'Автосбор',
                description: '+1% радиус автосбора',
                level: 0,
                maxLevel: 30,
                baseCost: 15,
                costMultiplier: 1.2,
                effect: (level) => level * 1
            },
            weaponDamage: {
                name: 'Урон оружия',
                description: '+1% урон всех оружий',
                level: 0,
                maxLevel: 50,
                baseCost: 8,
                costMultiplier: 1.15,
                effect: (level) => level * 1
            },
            weaponSpeed: {
                name: 'Скорость снарядов',
                description: '+1% скорость всех снарядов',
                level: 0,
                maxLevel: 50,
                baseCost: 8,
                costMultiplier: 1.15,
                effect: (level) => level * 1
            },
            // Ультимативные улучшения
            allStats: {
                name: 'Все характеристики',
                description: '+0.5% ко всем характеристикам',
                level: 0,
                maxLevel: 30,
                baseCost: 20,
                costMultiplier: 1.25,
                effect: (level) => level * 0.5
            },
            survivalBonus: {
                name: 'Бонус выживания',
                description: '+1% бонус к выживанию',
                level: 0,
                maxLevel: 20,
                baseCost: 25,
                costMultiplier: 1.3,
                effect: (level) => level * 1
            }
        };
        
        // Общий уровень улучшений
        this.totalLevel = 0;
        
        // Загрузка сохраненных данных
        this.loadUpgrades();
    }
    
    loadUpgrades() {
        const savedData = this.saveSystem.getUpgrades();
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                if (this.upgrades[key]) {
                    this.upgrades[key].level = savedData[key];
                }
            });
        }
        
        this.calculateTotalLevel();
    }
    
    saveUpgrades() {
        const upgradeData = {};
        Object.keys(this.upgrades).forEach(key => {
            upgradeData[key] = this.upgrades[key].level;
        });
        
        this.saveSystem.updateUpgrades(upgradeData);
    }
    
    calculateTotalLevel() {
        this.totalLevel = Object.values(this.upgrades)
            .reduce((sum, upgrade) => sum + upgrade.level, 0);
    }
    
    // Получение стоимости улучшения
    getUpgradeCost(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return Infinity;
        
        if (upgrade.level >= upgrade.maxLevel) return Infinity;
        
        return Math.floor(upgrade.baseCost * 
            Math.pow(upgrade.costMultiplier, upgrade.level));
    }
    
    // Покупка улучшения
    purchaseUpgrade(upgradeKey, coins) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return false;
        
        const cost = this.getUpgradeCost(upgradeKey);
        if (cost > coins || upgrade.level >= upgrade.maxLevel) {
            return false;
        }
        
        upgrade.level++;
        this.calculateTotalLevel();
        this.saveUpgrades();
        
        return {
            success: true,
            cost: cost,
            newLevel: upgrade.level,
            effect: upgrade.effect(upgrade.level)
        };
    }
    
    // Получение бонусов от улучшений
    getUpgradeBonuses() {
        const bonuses = {};
        
        Object.keys(this.upgrades).forEach(key => {
            const upgrade = this.upgrades[key];
            if (upgrade.level > 0) {
                bonuses[key] = upgrade.effect(upgrade.level);
            }
        });
        
        return bonuses;
    }
    
    // Применение бонусов к игроку
    applyUpgradesToPlayer(player) {
        const bonuses = this.getUpgradeBonuses();
        
        // Базовые характеристики
        if (bonuses.health) {
            player.maxHealth += bonuses.health;
            player.health += bonuses.health;
        }
        
        if (bonuses.speed) {
            player.speed *= (1 + bonuses.speed / 100);
            player.baseSpeed *= (1 + bonuses.speed / 100);
        }
        
        if (bonuses.damage) {
            player.damage *= (1 + bonuses.damage / 100);
            player.baseDamage *= (1 + bonuses.damage / 100);
        }
        
        if (bonuses.attackSpeed) {
            // Применяется в WeaponSystem
        }
        
        if (bonuses.experienceMagnet) {
            player.experienceMagnetRadius *= (1 + bonuses.experienceMagnet / 100);
        }
        
        if (bonuses.startingHealth) {
            player.health += bonuses.startingHealth;
        }
        
        if (bonuses.criticalChance) {
            player.criticalChance += bonuses.criticalChance / 100;
        }
        
        if (bonuses.dodge) {
            player.dodgeChance += bonuses.dodge / 100;
        }
        
        // Слоты
        if (bonuses.weaponSlots) {
            player.maxWeaponSlots = 6 + bonuses.weaponSlots;
        }
        
        if (bonuses.artifactSlots) {
            player.maxArtifacts = 5 + bonuses.artifactSlots;
        }
        
        // Регенерация
        if (bonuses.regeneration) {
            player.regeneration += bonuses.regeneration;
        }
        
        // Броня
        if (bonuses.armor) {
            player.armor = bonuses.armor / 100;
        }
        
        // Ускорение
        if (bonuses.acceleration) {
            player.acceleration = bonuses.acceleration / 100;
        }
        
        return bonuses;
    }
    
    // Получение информации об улучшении
    getUpgradeInfo(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        if (!upgrade) return null;
        
        return {
            key: upgradeKey,
            name: upgrade.name,
            description: upgrade.description,
            level: upgrade.level,
            maxLevel: upgrade.maxLevel,
            currentEffect: upgrade.level > 0 ? upgrade.effect(upgrade.level) : 0,
            nextEffect: upgrade.level < upgrade.maxLevel ? upgrade.effect(upgrade.level + 1) : 0,
            cost: this.getUpgradeCost(upgradeKey),
            canUpgrade: upgrade.level < upgrade.maxLevel
        };
    }
    
    // Получение всех улучшений
    getAllUpgrades() {
        const upgrades = [];
        
        Object.keys(this.upgrades).forEach(key => {
            upgrades.push(this.getUpgradeInfo(key));
        });
        
        return upgrades;
    }
    
    // Получение доступных улучшений
    getAvailableUpgrades(coins) {
        return this.getAllUpgrades().filter(upgrade => 
            upgrade.canUpgrade && upgrade.cost <= coins
        );
    }
    
    // Получение улучшений по категориям
    getUpgradesByCategory(category) {
        const categories = {
            basic: ['health', 'speed', 'damage', 'attackSpeed', 'experienceMagnet', 'startingHealth'],
            advanced: ['criticalChance', 'dodge', 'weaponSlots', 'artifactSlots', 'luck', 'coinMultiplier'],
            special: ['reviveChance', 'bossDamage', 'eliteDamage', 'startingCoins', 'experienceBonus'],
            defense: ['armor', 'regeneration'],
            mobility: ['acceleration', 'magnetRange', 'cooldownReduction'],
            combat: ['autoCollect', 'weaponDamage', 'weaponSpeed'],
            ultimate: ['allStats', 'survivalBonus']
        };
        
        if (!categories[category]) return [];
        
        return categories[category].map(key => this.getUpgradeInfo(key));
    }
    
    // Сброс улучшений (для отладки)
    resetUpgrades() {
        Object.keys(this.upgrades).forEach(key => {
            this.upgrades[key].level = 0;
        });
        
        this.calculateTotalLevel();
        this.saveUpgrades();
    }
    
    // Получение статистики
    getStats() {
        const stats = {
            totalLevel: this.totalLevel,
            totalUpgrades: Object.keys(this.upgrades).length,
            maxedUpgrades: Object.values(this.upgrades).filter(u => u.level >= u.maxLevel).length,
            totalCost: Object.values(this.upgrades).reduce((sum, u) => sum + this.getUpgradeCost(Object.keys(this.upgrades).find(key => this.upgrades[key] === u)), 0)
        };
        
        return stats;
    }
    
    // Проверка доступности улучшений
    isUpgradeAvailable(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        return upgrade && upgrade.level < upgrade.maxLevel;
    }
    
    // Получение рекомендуемых улучшений
    getRecommendedUpgrades() {
        const available = this.getAvailableUpgrades(Infinity);
        
        // Сортировка по эффективности/стоимости
        return available.sort((a, b) => {
            const efficiencyA = a.nextEffect / a.cost;
            const efficiencyB = b.nextEffect / b.cost;
            return efficiencyB - efficiencyA;
        }).slice(0, 5);
    }
    
    // Очистка
    destroy() {
        this.saveSystem = null;
        this.upgrades = null;
    }
}
