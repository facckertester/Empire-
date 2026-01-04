// Класс частицы
export class Particle {
    constructor() {
        // Базовые характеристики
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 2;
        
        // Визуальные характеристики
        this.color = '#FFFFFF';
        this.alpha = 1;
        this.lifetime = 2;
        this.age = 0;
        
        // Физические характеристики
        this.gravity = 0;
        this.friction = 0.98;
        this.bounce = 0;
        
        // Поведение
        this.fadeOut = true;
        this.shrink = true;
        this.rotation = 0;
        this.rotationSpeed = 0;
        
        // Тип частицы
        this.type = 'default';
        
        // Флаги
        this.active = true;
        this.alive = true;
        
        // Уникальный ID
        this.id = Date.now() + Math.random();
    }
    
    init(x, y, vx, vy, color, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.lifetime = lifetime;
        
        this.reset();
    }
    
    reset() {
        this.age = 0;
        this.active = true;
        this.alive = true;
        this.alpha = 1;
        this.radius = this.baseRadius || 2;
        this.rotation = 0;
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
        
        // Обновление физики
        this.updatePhysics(deltaTime);
        
        // Обновление визуальных эффектов
        this.updateVisuals(deltaTime);
        
        // Обновление вращения
        this.rotation += this.rotationSpeed * deltaTime;
        
        // Проверка границ
        this.checkBounds();
    }
    
    updatePhysics(deltaTime) {
        // Применение гравитации
        this.vy += this.gravity * deltaTime * 60;
        
        // Применение трения
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Обновление позиции
        this.x += this.vx * deltaTime * 60;
        this.y += this.vy * deltaTime * 60;
    }
    
    updateVisuals(deltaTime) {
        // Затухание прозрачности
        if (this.fadeOut) {
            const lifeProgress = this.age / this.lifetime;
            this.alpha = Math.max(0, 1 - lifeProgress);
        }
        
        // Уменьшение размера
        if (this.shrink) {
            const lifeProgress = this.age / this.lifetime;
            this.radius = (this.baseRadius || 2) * Math.max(0.1, 1 - lifeProgress);
        }
    }
    
    checkBounds() {
        // Отскок от границ
        if (this.bounce > 0) {
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.vx = -this.vx * this.bounce;
            }
            if (this.x + this.radius > 1920) {
                this.x = 1920 - this.radius;
                this.vx = -this.vx * this.bounce;
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius;
                this.vy = -this.vy * this.bounce;
            }
            if (this.y + this.radius > 1080) {
                this.y = 1080 - this.radius;
                this.vy = -this.vy * this.bounce;
            }
        } else {
            // Удаление при выходе за границы
            if (this.x < -50 || this.x > 1970 || this.y < -50 || this.y > 1130) {
                this.alive = false;
            }
        }
    }
    
    // Получение цвета с учетом прозрачности
    getColor() {
        if (this.alpha >= 1) {
            return this.color;
        }
        
        // Преобразование hex в rgba
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    }
    
    // Статические методы для создания различных типов частиц
    
    // Взрыв
    static createExplosion(x, y, color, count = 20) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                radius: Math.random() * 3 + 1,
                lifetime: Math.random() * 0.5 + 0.5,
                gravity: 0.1,
                friction: 0.95,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // След от снаряда
    static createTrail(x, y, color, count = 5) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2;
            
            particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                radius: Math.random() * 2 + 1,
                lifetime: Math.random() * 0.3 + 0.2,
                gravity: 0,
                friction: 0.9,
                fadeOut: true,
                shrink: false
            });
        }
        
        return particles;
    }
    
    // Сбор опыта
    static createCollect(x, y, color) {
        const particles = [];
        
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const speed = Math.random() * 3 + 1;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                radius: Math.random() * 2 + 1,
                lifetime: Math.random() * 0.5 + 0.5,
                gravity: 0,
                friction: 0.95,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // Лечение
    static createHeal(x, y) {
        const particles = [];
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = Math.random() * 2 + 1;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2, // Вверх
                color: '#00BCD4',
                radius: Math.random() * 3 + 2,
                lifetime: Math.random() * 1 + 0.5,
                gravity: -0.05, // Анти-гравитация
                friction: 0.98,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // Огонь
    static createFire(x, y, count = 15) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            
            particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 2 - 1,
                color: `hsl(${Math.random() * 60}, 100%, 50%)`, // От красного до желтого
                radius: Math.random() * 4 + 2,
                lifetime: Math.random() * 1 + 0.5,
                gravity: -0.1, // Анти-гравитация
                friction: 0.95,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // Лед
    static createIce(x, y, count = 12) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 4 + 2;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#03A9F4',
                radius: Math.random() * 3 + 1,
                lifetime: Math.random() * 0.8 + 0.4,
                gravity: 0.2,
                friction: 0.9,
                fadeOut: true,
                shrink: false,
                bounce: 0.3
            });
        }
        
        return particles;
    }
    
    // Электричество
    static createLightning(x, y, targetX, targetY) {
        const particles = [];
        const segments = 10;
        
        for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            const px = x + (targetX - x) * progress + (Math.random() - 0.5) * 20;
            const py = y + (targetY - y) * progress + (Math.random() - 0.5) * 20;
            
            particles.push({
                x: px,
                y: py,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: '#FFEB3B',
                radius: Math.random() * 2 + 1,
                lifetime: 0.2,
                gravity: 0,
                friction: 0.8,
                fadeOut: true,
                shrink: false
            });
        }
        
        return particles;
    }
    
    // Кровь
    static createBlood(x, y, count = 8) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#F44336',
                radius: Math.random() * 3 + 1,
                lifetime: Math.random() * 2 + 1,
                gravity: 0.3,
                friction: 0.9,
                fadeOut: true,
                shrink: false,
                bounce: 0.2
            });
        }
        
        return particles;
    }
    
    // Яд
    static createPoison(x, y, count = 6) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 2 + 0.5;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: '#4CAF50',
                radius: Math.random() * 2 + 1,
                lifetime: Math.random() * 1.5 + 0.5,
                gravity: 0.05,
                friction: 0.95,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // Магия
    static createMagic(x, y, color, count = 10) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 1;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                radius: Math.random() * 2 + 1,
                lifetime: Math.random() * 1 + 0.5,
                gravity: 0,
                friction: 0.92,
                fadeOut: true,
                shrink: true,
                rotationSpeed: Math.random() * 10 - 5
            });
        }
        
        return particles;
    }
    
    // Дым
    static createSmoke(x, y, count = 5) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 1,
                vy: -Math.random() * 2 - 1,
                color: '#757575',
                radius: Math.random() * 5 + 3,
                lifetime: Math.random() * 2 + 1,
                gravity: -0.02,
                friction: 0.98,
                fadeOut: true,
                shrink: true
            });
        }
        
        return particles;
    }
    
    // Геттеры
    isAlive() {
        return this.alive;
    }
    
    isActive() {
        return this.active;
    }
    
    // Очистка объекта перед возвратом в пул
    cleanup() {
        this.reset();
        this.color = '#FFFFFF';
        this.lifetime = 2;
        this.gravity = 0;
        this.friction = 0.98;
        this.bounce = 0;
        this.fadeOut = true;
        this.shrink = true;
        this.rotationSpeed = 0;
    }
}
