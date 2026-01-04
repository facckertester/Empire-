// Класс орба опыта
export class ExperienceOrb {
    constructor() {
        // Базовые характеристики
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 8;
        
        // Характеристики опыта
        this.value = 1;
        this.type = 'normal';
        
        // Поведение
        this.magnetRadius = 50;
        this.collectRadius = 20;
        this.magnetStrength = 15;
        this.floatAmplitude = 2;
        this.floatFrequency = 2;
        this.floatOffset = Math.random() * Math.PI * 2;
        
        // Визуальные эффекты
        this.glowRadius = 16;
        this.pulseFrequency = 3;
        this.pulseAmplitude = 0.3;
        
        // Таймеры
        this.age = 0;
        this.lifetime = 30; // 30 секунд до исчезновения
        this.fadeTime = 5; // Начать затухание за 5 секунд до исчезновения
        
        // Флаги
        this.active = true;
        this.alive = true;
        this.collected = false;
        this.magnetized = false;
        
        // Цвета в зависимости от ценности
        this.colors = {
            normal: '#2196F3',
            rare: '#9C27B0',
            epic: '#FF9800',
            legendary: '#FFD700'
        };
        
        this.color = this.colors.normal;
        
        // Уникальный ID
        this.id = Date.now() + Math.random();
    }
    
    init(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        
        this.loadExperienceData(value);
        this.reset();
    }
    
    loadExperienceData(value) {
        // Определение типа и характеристик в зависимости от ценности
        if (value >= 10) {
            this.type = 'legendary';
            this.radius = 12;
            this.glowRadius = 24;
            this.color = this.colors.legendary;
            this.magnetRadius = 80;
            this.collectRadius = 30;
        } else if (value >= 5) {
            this.type = 'epic';
            this.radius = 10;
            this.glowRadius = 20;
            this.color = this.colors.epic;
            this.magnetRadius = 65;
            this.collectRadius = 25;
        } else if (value >= 3) {
            this.type = 'rare';
            this.radius = 9;
            this.glowRadius = 18;
            this.color = this.colors.rare;
            this.magnetRadius = 60;
            this.collectRadius = 22;
        } else {
            this.type = 'normal';
            this.radius = 8;
            this.glowRadius = 16;
            this.color = this.colors.normal;
            this.magnetRadius = 50;
            this.collectRadius = 20;
        }
    }
    
    reset() {
        this.age = 0;
        this.active = true;
        this.alive = true;
        this.collected = false;
        this.magnetized = false;
        this.vx = 0;
        this.vy = 0;
        
        // Случайное смещение для эффекта парения
        this.floatOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        if (!this.active || !this.alive) return;
        
        // Обновление возраста
        this.age += deltaTime;
        
        // Проверка времени жизни
        if (this.age >= this.lifetime) {
            this.alive = false;
            return;
        }
        
        // Обновление движения
        this.updateMovement(deltaTime);
        
        // Проверка границ
        this.checkBounds();
    }
    
    updateMovement(deltaTime) {
        // Эффект парения
        const floatY = Math.sin(this.age * this.floatFrequency + this.floatOffset) * this.floatAmplitude;
        
        // Применение парения к позиции
        const targetY = this.y + floatY * deltaTime * 60;
        
        // Плавное движение к целевой Y
        this.vy += (targetY - this.y) * 0.1;
        
        // Затухание скорости
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        // Обновление позиции
        this.x += this.vx * deltaTime * 60;
        this.y += this.vy * deltaTime * 60;
    }
    
    checkBounds() {
        // Проверка выхода за границы мира
        if (this.x < -50 || this.x > 1970 || this.y < -50 || this.y > 1130) {
            this.alive = false;
        }
    }
    
    magnetize(targetX, targetY, targetMagnetRadius) {
        if (this.collected || this.magnetized) return;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Проверка радиуса притяжения
        const effectiveMagnetRadius = this.magnetRadius + targetMagnetRadius;
        if (distance <= effectiveMagnetRadius && distance > 0) {
            this.magnetized = true;
            
            // Сила притяжения зависит от расстояния
            const strength = this.magnetStrength * (1 - distance / effectiveMagnetRadius);
            
            // Применение силы к скорости
            this.vx += (dx / distance) * strength * deltaTime * 60;
            this.vy += (dy / distance) * strength * deltaTime * 60;
            
            // Проверка радиуса сбора
            if (distance <= this.collectRadius) {
                this.collect();
            }
        }
    }
    
    collect() {
        if (this.collected) return;
        
        this.collected = true;
        this.alive = false;
        
        // Создание эффекта сбора
        this.createCollectEffect();
        
        // Возвращение значения опыта
        return this.value;
    }
    
    createCollectEffect() {
        // Создание частиц при сборе
        // Будет реализовано в EntityManager
    }
    
    // Объединение с другими орбами опыта
    merge(otherOrb) {
        if (this.collected || otherOrb.collected) return;
        
        const dx = otherOrb.x - this.x;
        const dy = otherOrb.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Объединение если орбы близко
        if (distance < this.radius + otherOrb.radius) {
            this.value += otherOrb.value;
            this.loadExperienceData(this.value);
            
            // Удаление другого орба
            otherOrb.alive = false;
            
            // Эффект объединения
            this.createMergeEffect();
        }
    }
    
    createMergeEffect() {
        // Создание эффекта объединения
        // Будет реализовано в EntityManager
    }
    
    // Получение прозрачности для затухания
    getAlpha() {
        if (this.age < this.lifetime - this.fadeTime) {
            return 1;
        }
        
        const fadeProgress = (this.age - (this.lifetime - this.fadeTime)) / this.fadeTime;
        return Math.max(0, 1 - fadeProgress);
    }
    
    // Получение размера для пульсации
    getScale() {
        const pulse = Math.sin(this.age * this.pulseFrequency) * this.pulseAmplitude;
        return 1 + pulse;
    }
    
    // Получение цвета с учетом прозрачности
    getColor() {
        const alpha = this.getAlpha();
        const color = this.color;
        
        // Преобразование hex в rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Получение цвета свечения
    getGlowColor() {
        const alpha = this.getAlpha() * 0.5;
        const color = this.color;
        
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Статические методы для создания орбов
    static createFromEnemy(enemy) {
        const baseValue = enemy.experienceValue;
        const variance = Math.random() * 0.5 + 0.75; // 75-125% от базового значения
        const value = Math.floor(baseValue * variance);
        
        return {
            x: enemy.x,
            y: enemy.y,
            value: Math.max(1, value)
        };
    }
    
    static createMultiplier(baseValue, multiplier) {
        return Math.floor(baseValue * multiplier);
    }
    
    // Геттеры
    isAlive() {
        return this.alive;
    }
    
    isActive() {
        return this.active;
    }
    
    isCollected() {
        return this.collected;
    }
    
    isMagnetized() {
        return this.magnetized;
    }
    
    // Очистка объекта перед возвратом в пул
    cleanup() {
        this.reset();
        this.value = 1;
        this.type = 'normal';
        this.color = this.colors.normal;
        this.radius = 8;
        this.glowRadius = 16;
    }
}
