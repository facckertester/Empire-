// Система управления частицами
export class ParticleSystem {
    constructor(entityManager) {
        this.entityManager = entityManager;
        
        // Активные частицы
        this.particles = [];
        
        // Настройки
        this.maxParticles = 1000;
        this.particlePool = [];
        
        // Статистика
        this.stats = {
            created: 0,
            destroyed: 0,
            active: 0
        };
        
        // Инициализация
        this.init();
    }
    
    init() {
        // Предварительное создание частиц в пуле
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push(this.createParticleTemplate());
        }
    }
    
    createParticleTemplate() {
        return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 2,
            color: '#FFFFFF',
            alpha: 1,
            lifetime: 2,
            age: 0,
            active: false,
            gravity: 0,
            friction: 0.98,
            fadeOut: true,
            shrink: true,
            rotation: 0,
            rotationSpeed: 0
        };
    }
    
    // Получение частицы из пула
    getParticle() {
        const particle = this.particlePool.find(p => !p.active) || this.createParticleTemplate();
        particle.active = true;
        this.stats.created++;
        this.stats.active++;
        return particle;
    }
    
    // Возврат частицы в пул
    returnParticle(particle) {
        if (particle.active) {
            particle.active = false;
            this.stats.destroyed++;
            this.stats.active--;
        }
    }
    
    // Создание частиц разных типов
    createExplosion(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = color;
            particle.radius = Math.random() * 3 + 1;
            particle.lifetime = Math.random() * 0.5 + 0.5;
            particle.gravity = 0.1;
            particle.friction = 0.95;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    createTrail(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2;
            
            const particle = this.getParticle();
            particle.x = x + (Math.random() - 0.5) * 10;
            particle.y = y + (Math.random() - 0.5) * 10;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = color;
            particle.radius = Math.random() * 2 + 1;
            particle.lifetime = Math.random() * 0.3 + 0.2;
            particle.gravity = 0;
            particle.friction = 0.9;
            particle.fadeOut = true;
            particle.shrink = false;
            
            this.particles.push(particle);
        }
    }
    
    createCollect(x, y, color) {
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const speed = Math.random() * 3 + 1;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = color;
            particle.radius = Math.random() * 2 + 1;
            particle.lifetime = Math.random() * 0.5 + 0.5;
            particle.gravity = 0;
            particle.friction = 0.95;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    createHeal(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = Math.random() * 2 + 1;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed - 2; // Вверх
            particle.color = '#00BCD4';
            particle.radius = Math.random() * 3 + 2;
            particle.lifetime = Math.random() * 1 + 0.5;
            particle.gravity = -0.05; // Анти-гравитация
            particle.friction = 0.98;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    createFire(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            
            const particle = this.getParticle();
            particle.x = x + (Math.random() - 0.5) * 20;
            particle.y = y + (Math.random() - 0.5) * 20;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed - Math.random() * 2 - 1;
            particle.color = `hsl(${Math.random() * 60}, 100%, 50%)`; // От красного до желтого
            particle.radius = Math.random() * 4 + 2;
            particle.lifetime = Math.random() * 1 + 0.5;
            particle.gravity = -0.1; // Анти-гравитация
            particle.friction = 0.95;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    createIce(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 4 + 2;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = '#03A9F4';
            particle.radius = Math.random() * 3 + 1;
            particle.lifetime = Math.random() * 0.8 + 0.4;
            particle.gravity = 0.2;
            particle.friction = 0.9;
            particle.fadeOut = true;
            particle.shrink = false;
            particle.bounce = 0.3;
            
            this.particles.push(particle);
        }
    }
    
    createLightning(x, y, targetX, targetY) {
        const segments = 10;
        
        for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            const px = x + (targetX - x) * progress + (Math.random() - 0.5) * 20;
            const py = y + (targetY - y) * progress + (Math.random() - 0.5) * 20;
            
            const particle = this.getParticle();
            particle.x = px;
            particle.y = py;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            particle.color = '#FFEB3B';
            particle.radius = Math.random() * 2 + 1;
            particle.lifetime = 0.2;
            particle.gravity = 0;
            particle.friction = 0.8;
            particle.fadeOut = true;
            particle.shrink = false;
            
            this.particles.push(particle);
        }
    }
    
    createBlood(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = '#F44336';
            particle.radius = Math.random() * 3 + 1;
            particle.lifetime = Math.random() * 2 + 1;
            particle.gravity = 0.3;
            particle.friction = 0.9;
            particle.fadeOut = true;
            particle.shrink = false;
            particle.bounce = 0.2;
            
            this.particles.push(particle);
        }
    }
    
    createPoison(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 2 + 0.5;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = '#4CAF50';
            particle.radius = Math.random() * 2 + 1;
            particle.lifetime = Math.random() * 1.5 + 0.5;
            particle.gravity = 0.05;
            particle.friction = 0.95;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    createMagic(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 3 + 1;
            
            const particle = this.getParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.color = color;
            particle.radius = Math.random() * 2 + 1;
            particle.lifetime = Math.random() * 1 + 0.5;
            particle.gravity = 0;
            particle.friction = 0.92;
            particle.fadeOut = true;
            particle.shrink = true;
            particle.rotationSpeed = Math.random() * 10 - 5;
            
            this.particles.push(particle);
        }
    }
    
    createSmoke(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const particle = this.getParticle();
            particle.x = x + (Math.random() - 0.5) * 10;
            particle.y = y + (Math.random() - 0.5) * 10;
            particle.vx = (Math.random() - 0.5) * 1;
            particle.vy = -Math.random() * 2 - 1;
            particle.color = '#757575';
            particle.radius = Math.random() * 5 + 3;
            particle.lifetime = Math.random() * 2 + 1;
            particle.gravity = -0.02;
            particle.friction = 0.98;
            particle.fadeOut = true;
            particle.shrink = true;
            
            this.particles.push(particle);
        }
    }
    
    // Обновление частиц
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (!particle.active) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Обновление возраста
            particle.age += deltaTime;
            
            // Проверка времени жизни
            if (particle.age >= particle.lifetime) {
                this.returnParticle(particle);
                this.particles.splice(i, 1);
                continue;
            }
            
            // Обновление физики
            particle.vy += particle.gravity * deltaTime * 60;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // Обновление позиции
            particle.x += particle.vx * deltaTime * 60;
            particle.y += particle.vy * deltaTime * 60;
            
            // Обновление вращения
            particle.rotation += particle.rotationSpeed * deltaTime;
            
            // Обновление визуальных эффектов
            if (particle.fadeOut) {
                const lifeProgress = particle.age / particle.lifetime;
                particle.alpha = Math.max(0, 1 - lifeProgress);
            }
            
            if (particle.shrink) {
                const lifeProgress = particle.age / particle.lifetime;
                particle.radius = particle.radius * Math.max(0.1, 1 - lifeProgress);
            }
            
            // Отскок от границ
            if (particle.bounce > 0) {
                if (particle.x - particle.radius < 0) {
                    particle.x = particle.radius;
                    particle.vx = -particle.vx * particle.bounce;
                }
                if (particle.x + particle.radius > 1920) {
                    particle.x = 1920 - particle.radius;
                    particle.vx = -particle.vx * particle.bounce;
                }
                if (particle.y - particle.radius < 0) {
                    particle.y = particle.radius;
                    particle.vy = -particle.vy * particle.bounce;
                }
                if (particle.y + particle.radius > 1080) {
                    particle.y = 1080 - particle.radius;
                    particle.vy = -particle.vy * particle.bounce;
                }
            } else {
                // Удаление при выходе за границы
                if (particle.x < -50 || particle.x > 1970 || particle.y < -50 || particle.y > 1130) {
                    this.returnParticle(particle);
                    this.particles.splice(i, 1);
                }
            }
        }
        
        // Обновление статистики
        this.stats.active = this.particles.length;
    }
    
    // Рендеринг частиц
    render(ctx) {
        this.particles.forEach(particle => {
            if (!particle.active) return;
            
            ctx.save();
            
            // Применение прозрачности
            ctx.globalAlpha = particle.alpha;
            
            // Применение вращения
            if (particle.rotation !== 0) {
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.translate(-particle.x, -particle.y);
            }
            
            // Отрисовка частицы
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    }
    
    // Очистка всех частиц
    clear() {
        this.particles.forEach(particle => {
            this.returnParticle(particle);
        });
        this.particles = [];
        this.stats.active = 0;
    }
    
    // Получение статистики
    getStats() {
        return {
            ...this.stats,
            poolSize: this.particlePool.length,
            activeParticles: this.particles.length
        };
    }
    
    // Сброс статистики
    resetStats() {
        this.stats = {
            created: 0,
            destroyed: 0,
            active: this.particles.length
        };
    }
    
    // Уничтожение системы
    destroy() {
        this.clear();
        this.particlePool = [];
        this.entityManager = null;
    }
}
