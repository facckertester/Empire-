// Система достижений
export class AchievementSystem {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        
        // Достижения
        this.achievements = {
            // Базовые достижения (20)
            firstKill: {
                id: 'firstKill',
                name: 'Первый урон',
                description: 'Убить первого врага',
                icon: '⚔️',
                category: 'basic',
                points: 10,
                unlocked: false,
                progress: 0,
                maxProgress: 1,
                condition: 'kill_count >= 1'
            },
            survivor5min: {
                id: 'survivor5min',
                name: 'Выживший',
                description: 'Прожить 5 минут',
                icon: '⏱️',
                category: 'basic',
                points: 25,
                unlocked: false,
                progress: 0,
                maxProgress: 300,
                condition: 'survival_time >= 300'
            },
            level10: {
                id: 'level10',
                name: 'Новичок',
                description: 'Достичь 10 уровня',
                icon: '⭐',
                category: 'basic',
                points: 20,
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                condition: 'level >= 10'
            },
            weaponMaster: {
                id: 'weaponMaster',
                name: 'Мастер оружия',
                description: 'Улучшить оружие до 8 уровня',
                icon: '⚔️',
                category: 'basic',
                points: 30,
                unlocked: false,
                progress: 0,
                maxProgress: 8,
                condition: 'weapon_level >= 8'
            },
            collector: {
                id: 'collector',
                name: 'Коллекционер',
                description: 'Собрать 100 опыта',
                icon: '💎',
                category: 'basic',
                points: 15,
                unlocked: false,
                progress: 0,
                maxProgress: 100,
                condition: 'experience_collected >= 100'
            },
            artifactHunter: {
                id: 'artifactHunter',
                name: 'Охотник за артефактами',
                description: 'Собрать 5 артефактов',
                icon: '🏺️',
                category: 'basic',
                points: 25,
                unlocked: false,
                progress: 0,
                maxProgress: 5,
                condition: 'artifacts_collected >= 5'
            },
            speedDemon: {
                id: 'speedDemon',
                name: 'Демон скорости',
                description: 'Прожить 10 минут',
                icon: '🏃',
                category: 'basic',
                points: 50,
                unlocked: false,
                progress: 0,
                maxProgress: 600,
                condition: 'survival_time >= 600'
            },
            slayer: {
                id: 'slayer',
                name: 'Истребитель',
                description: 'Убить 100 врагов',
                icon: '💀',
                category: 'basic',
                points: 35,
                unlocked: false,
                progress: 0,
                maxProgress: 100,
                condition: 'kill_count >= 100'
            },
            rich: {
                id: 'rich',
                name: 'Богатый',
                description: 'Собрать 1000 монет',
                icon: '💰',
                category: 'basic',
                points: 40,
                unlocked: false,
                progress: 0,
                maxProgress: 1000,
                condition: 'coins_collected >= 1000'
            },
            explorer: {
                id: 'explorer',
                name: 'Исследователь',
                description: 'Разблокировать 3 локации',
                icon: '🗺️',
                category: 'basic',
                points: 30,
                unlocked: false,
                progress: 0,
                maxProgress: 3,
                condition: 'locations_unlocked >= 3'
            },
            characterMaster: {
                id: 'characterMaster',
                name: 'Мастер персонажей',
                description: 'Разблокировать 5 персонажей',
                icon: '👥',
                category: 'basic',
                points: 35,
                unlocked: false,
                progress: 0,
                maxProgress: 5,
                condition: 'characters_unlocked >= 5'
            },
            weaponCollector: {
                id: 'weaponCollector',
                name: 'Коллекционер оружия',
                description: 'Разблокировать 10 видов оружия',
                icon: '🗡️',
                category: 'basic',
                points: 30,
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                condition: 'weapons_unlocked >= 10'
            },
            perfectionist: {
                id: 'perfectionist',
                name: 'Перфекционист',
                description: 'Получить все улучшения уровня 1',
                icon: '✨',
                category: 'basic',
                points: 20,
                unlocked: false,
                progress: 0,
                maxProgress: 8,
                condition: 'upgrades_level1 >= 8'
            },
            lucky: {
                id: 'lucky',
                name: 'Счастливчик',
                description: 'Найти легендарный артефакт',
                icon: '🍀',
                category: 'basic',
                points: 50,
                unlocked: false,
                progress: 0,
                maxProgress: 1,
                condition: 'legendary_artifact_found'
            },
            veteran: {
                id: 'veteran',
                name: 'Ветеран',
                description: 'Сыграть 10 игр',
                icon: '🎖',
                category: 'basic',
                points: 25,
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                condition: 'games_played >= 10'
            },
            scholar: {
                id: 'scholar',
                name: 'Ученый',
                description: 'Прокачить 10 глобальных улучшений',
                icon: '📚',
                category: 'basic',
                points: 30,
                unlocked: false,
                progress: 0,
                maxProgress: 10,
                condition: 'global_upgrades >= 10'
            },
            survivor20min: {
                id: 'survivor20min',
                name: 'Долгожитель',
                description: 'Прожить 20 минут',
                icon: '⏱️',
                category: 'basic',
                points: 75,
                unlocked: false,
                progress: 0,
                maxProgress: 1200,
                condition: 'survival_time >= 1200'
            },
            destroyer: {
                id: 'destroyer',
                name: 'Разрушитель',
                description: 'Убить 500 врагов',
                icon: '💥',
                category: 'basic',
                points: 60,
                unlocked: false,
                progress: 0,
                maxProgress: 500,
                condition: 'kill_count >= 500'
            },
            champion: {
                id: 'champion',
                name: 'Чемпион',
                description: 'Достичь 20 уровня',
                icon: '👑',
                category: 'basic',
                points: 50,
                unlocked: false,
                progress: 0,
                maxProgress: 20,
                condition: 'level >= 20'
            },
            legend: {
                id: 'legend',
                name: 'Легенда',
                description: 'Прожить 30 минут',
                icon: '🏆',
                category: 'basic',
                points: 100,
                unlocked: false,
                progress: 0,
                maxProgress: 1800,
                condition: 'survival_time >= 1800'
            }
        };
        
        // Статистика
        this.stats = {
            unlocked: 0,
            totalPoints: 0,
            categoryProgress: {
                basic: 0,
                combat: 0,
                collection: 0,
                secret: 0
            }
        };
        
        // Текущие условия
        this.currentConditions = {
            kill_count: 0,
            survival_time: 0,
            level: 1,
            experience_collected: 0,
            artifacts_collected: 0,
            coins_collected: 0,
            locations_unlocked: 1,
            characters_unlocked: 1,
            weapons_unlocked: 5,
            bosses_killed: 0,
            elite_kills: 0,
            special_kills: 0,
            weapons_unlocked: 5,
            global_upgrades: 0,
            total_coins: 0,
            total_experience: 0,
            total_kills: 0,
            total_playtime: 0,
            longest_survival: 0,
            games_played: 0,
            legendary_artifacts: 0,
            epic_artifacts: 0,
            rare_artifacts: 0,
            critical_hits: 0,
            dodges: 0,
            damage_dealt: 0,
            combo_10x: false,
            boss_defeated: false,
            waves_survived: 0,
            boss_waves: 0,
            perfect_run_15min: false,
            level_15_5min: false,
            chaos_realm_survived: false,
            all_achievements: false,
            secret_discovered: false,
            secret2_discovered: false,
            all_secrets_discovered: false,
            chaos_realm_1hour: false,
            survival_2hours: false,
            survival_5hours: false,
            no_damage_5min: false,
            multi_kill_5: false,
            weapon_kills: {},
            upgrades_level1: 0,
            level_50: false,
            level_100: false,
            level_200: false,
            creator_mode: false
        };
        
        // Загрузка сохраненных достижений
        this.loadAchievements();
    }
    
    loadAchievements() {
        const savedData = this.saveSystem.getAchievements();
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = savedData[key].unlocked;
                    this.achievements[key].progress = savedData[key].progress || 0;
                }
            });
        }
        
        this.updateStats();
    }
    
    saveAchievements() {
        const achievementData = {};
        Object.keys(this.achievements).forEach(key => {
            achievementData[key] = {
                unlocked: this.achievements[key].unlocked,
                progress: this.achievements[key].progress
            };
        });
        
        this.saveSystem.saveAchievements(achievementData);
    }
    
    updateStats() {
        this.stats.unlocked = Object.values(this.achievements).filter(a => a.unlocked).length;
        this.stats.totalPoints = Object.values(this.achievements)
            .filter(a => a.unlocked)
            .reduce((sum, a) => sum + a.points, 0);
        
        // Подсчет прогресса по категориям
        this.stats.categoryProgress = {
            basic: this.getCategoryProgress('basic'),
            combat: this.getCategoryProgress('combat'),
            collection: this.getCategoryProgress('collection'),
            secret: this.getCategoryProgress('secret')
        };
    }
    
    getCategoryProgress(category) {
        const categoryAchievements = Object.values(this.achievements)
            .filter(a => a.category === category);
        
        if (categoryAchievements.length === 0) return 0;
        
        const unlocked = categoryAchievements.filter(a => a.unlocked).length;
        return (unlocked / categoryAchievements.length) * 100;
    }
    
    // Проверка условий достижений
    checkAchievements() {
        Object.keys(this.achievements).forEach(key => {
            const achievement = this.achievements[key];
            
            if (achievement.unlocked) return;
            
            const condition = achievement.condition;
            const unlocked = this.evaluateCondition(condition);
            
            if (unlocked && !achievement.unlocked) {
                this.unlockAchievement(key);
            }
        });
    }
    
    evaluateCondition(condition) {
        // Парсинг условия
        if (condition.includes('>=')) {
            const [key, value] = condition.split('>=');
            const conditionValue = parseFloat(value);
            const currentValue = this.currentConditions[key] || 0;
            return currentValue >= conditionValue;
        } else if (condition.includes('>')) {
            const [key, value] = condition.split('>');
            const conditionValue = parseFloat(value);
            const currentValue = this.currentConditions[key] || 0;
            return currentValue > conditionValue;
        } else if (condition.includes('==')) {
            const [key, value] = condition.split('==');
            const conditionValue = value === 'true' ? true : parseFloat(value);
            const currentValue = this.currentConditions[key] || false;
            return currentValue === conditionValue;
        } else if (condition.includes('<=')) {
            const [key, value] = condition.split('<=');
            const conditionValue = parseFloat(value);
            const currentValue = this.currentConditions[key] || 0;
            return currentValue <= conditionValue;
        } else if (condition.includes('<')) {
            const [key, value] = condition.split('<');
            const conditionValue = parseFloat(value);
            const currentValue = this.currentConditions[key] || 0;
            return currentValue < conditionValue;
        }
        
        return false;
    }
    
    unlockAchievement(key) {
        const achievement = this.achievements[key];
        if (!achievement || achievement.unlocked) return;
        
        achievement.unlocked = true;
        achievement.progress = achievement.maxProgress;
        
        this.updateStats();
        this.saveAchievements();
        
        // Показ уведомления
        this.showAchievementNotification(achievement);
        
        console.log(`Достижение разблокировано: ${achievement.name}`);
    }
    
    showAchievementNotification(achievement) {
        // Создание уведомления о достижении
        const event = new CustomEvent('achievementUnlocked', {
            detail: {
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                points: achievement.points,
                category: achievement.category
            }
        });
        document.dispatchEvent(event);
    }
    
    // Обновление прогресса достижений
    updateProgress(key, value) {
        const achievement = this.achievements[key];
        if (!achievement || achievement.unlocked) return;
        
        achievement.progress = Math.min(value, achievement.maxProgress);
        
        // Проверка, если достижение разблокировано
        if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
            this.unlockAchievement(key);
        }
        
        this.saveAchievements();
    }
    
    // Установка текущих условий
    updateCondition(key, value) {
        this.currentConditions[key] = value;
        this.checkAchievements();
    }
    
    // Получение информации о достижении
    getAchievementInfo(key) {
        const achievement = this.achievements[key];
        if (!achievement) return null;
        
        return {
            ...achievement,
            progress: achievement.progress,
            progressPercent: (achievement.progress / achievement.maxProgress) * 100
        };
    }
    
    // Получение всех достижений
    getAllAchievements() {
        return Object.keys(this.achievements).map(key => this.getAchievementInfo(key));
    }
    
    // Получение достижений по категории
    getAchievementsByCategory(category) {
        return Object.values(this.achievements)
            .filter(a => a.category === category)
            .map(a => this.getAchievementInfo(Object.keys(this.achievements).find(key => this.achievements[key] === a)))
            .sort((a, b) => b.points - a.points);
    }
    
    // Получение разблокированных достижений
    getUnlockedAchievements() {
        return Object.values(this.achievements)
            .filter(a => a.unlocked)
            .map(a => this.getAchievementInfo(Object.keys(this.achievements).find(key => this.achievements[key] === a)))
            .sort((a, b) => b.points - a.points);
    }
    
    // Получение доступных достижений
    getAvailableAchievements() {
        return Object.values(this.achievements)
            .filter(a => !a.unlocked)
            .map(a => this.getAchievementInfo(Object.keys(this.achievements).find(key => this.achievements[key] === a)));
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            totalAchievements: Object.keys(this.achievements).length,
            completionRate: (this.stats.unlocked / Object.keys(this.achievements).length) * 100
        };
    }
    
    // Сброс достижений (для отладки)
    resetAchievements() {
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
            this.achievements[key].progress = 0;
        });
        
        this.updateStats();
        this.saveAchievements();
    }
    
    // Очистка
    destroy() {
        this.achievements = null;
        this.currentConditions = null;
        this.saveSystem = null;
    }
}
