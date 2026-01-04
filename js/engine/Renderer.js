// Система рендеринга
export class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.camera = { x: 0, y: 0 };
        
        // Настройки рендеринга
        this.particlesEnabled = true;
        this.showGrid = false;
        this.showColliders = false;
        
        // Цвета
        this.colors = {
            background: '#0a0a0a',
            grid: '#1a1a1a',
            player: '#4CAF50',
            enemy: '#f44336',
            projectile: '#FFC107',
            experience: '#2196F3',
            artifact: '#9C27B0'
        };
    }
    
    render(entityManager, gameTime) {
        // Очистка canvas
        this.clear();
        
        // Сохранение состояния контекста
        this.ctx.save();
        
        // Применение камеры
        this.applyCamera();
        
        // Отрисовка сетки (если включена)
        if (this.showGrid) {
            this.renderGrid();
        }
        
        // Отрисовка игровых объектов
        this.renderEntities(entityManager);
        
        // Отрисовка частиц
        if (this.particlesEnabled) {
            this.renderParticles(entityManager);
        }
        
        // Отрисовка коллайдеров (если включены)
        if (this.showColliders) {
            this.renderColliders(entityManager);
        }
        
        // Восстановление состояния контекста
        this.ctx.restore();
    }
    
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    applyCamera() {
        this.ctx.translate(-this.camera.x, -this.camera.y);
    }
    
    renderGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        
        const gridSize = 64;
        
        // Вертикальные линии
        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Горизонтальные линии
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    renderEntities(entityManager) {
        // Отрисовка опыта (внизу)
        entityManager.experienceOrbs.forEach(orb => this.renderExperienceOrb(orb));
        
        // Отрисовка артефактов
        entityManager.artifacts.forEach(artifact => this.renderArtifact(artifact));
        
        // Отрисовка снарядов
        entityManager.projectiles.forEach(projectile => this.renderProjectile(projectile));
        
        // Отрисовка врагов
        entityManager.enemies.forEach(enemy => this.renderEnemy(enemy));
        
        // Отрисовка игрока
        if (entityManager.player) {
            this.renderPlayer(entityManager.player);
        }
    }
    
    renderPlayer(player) {
        this.ctx.save();
        
        // Позиция игрока
        this.ctx.translate(player.x, player.y);
        
        // Тело игрока
        this.ctx.fillStyle = this.getPlayerColor(player.characterType);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Оружие
        if (player.weapons && player.weapons.length > 0) {
            this.renderPlayerWeapons(player);
        }
        
        // Здоровье
        this.renderHealthBar(player);
        
        // Эффекты
        this.renderPlayerEffects(player);
        
        this.ctx.restore();
    }
    
    getPlayerColor(characterType) {
        const colors = {
            survivor: '#4CAF50',
            archer: '#8BC34A',
            hunter: '#CDDC39',
            mage: '#FF9800',
            knight: '#795548',
            scout: '#607D8B',
            healer: '#00BCD4',
            sniper: '#3F51B5',
            engineer: '#FF5722',
            cyborg: '#9E9E9E',
            mutant: '#4CAF50',
            shaman: '#9C27B0',
            ghost: '#E91E63',
            tank: '#795548',
            assassin: '#212121',
            necromancer: '#673AB7',
            dragon: '#FF5722',
            god: '#FFD700'
        };
        
        return colors[characterType] || colors.survivor;
    }
    
    renderPlayerWeapons(player) {
        player.weapons.forEach((weapon, index) => {
            if (weapon.level > 0) {
                this.ctx.save();
                
                // Позиция оружия вокруг игрока
                const angle = (index / player.weapons.length) * Math.PI * 2 + this.gameTime * 0.5;
                const distance = 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                this.ctx.translate(x, y);
                
                // Иконка оружия
                this.ctx.fillStyle = this.getWeaponColor(weapon.type);
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Уровень оружия
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(weapon.level.toString(), 0, 3);
                
                this.ctx.restore();
            }
        });
    }
    
    getWeaponColor(weaponType) {
        const colors = {
            staff: '#FF9800',
            bow: '#8BC34A',
            crossbow: '#CDDC39',
            fireball: '#FF5722',
            sword: '#795548',
            knife: '#212121',
            pistol: '#607D8B',
            club: '#795548'
        };
        
        return colors[weaponType] || '#FFC107';
    }
    
    renderHealthBar(entity) {
        if (entity.health < entity.maxHealth) {
            const barWidth = 40;
            const barHeight = 4;
            const barY = -entity.radius - 10;
            
            // Фон
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
            
            // Здоровье
            const healthPercent = entity.health / entity.maxHealth;
            this.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#f44336';
            this.ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
        }
    }
    
    renderPlayerEffects(player) {
        // Эффект регенерации
        if (player.regeneration > 0) {
            this.ctx.strokeStyle = '#00BCD4';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, player.radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Эффект неуязвимости
        if (player.invincible) {
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, player.radius + 8, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    renderEnemy(enemy) {
        this.ctx.save();
        
        // Позиция врага
        this.ctx.translate(enemy.x, enemy.y);
        
        // Тело врага
        this.ctx.fillStyle = this.getEnemyColor(enemy.type);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Особые эффекты для разных типов врагов
        this.renderEnemyEffects(enemy);
        
        // Здоровье
        this.renderHealthBar(enemy);
        
        this.ctx.restore();
    }
    
    getEnemyColor(enemyType) {
        const colors = {
            zombie: '#757575',
            skeleton: '#FAFAFA',
            wolf: '#795548',
            vampire: '#E91E63',
            ghost: '#E1BEE7',
            demon: '#D32F2F',
            elemental: '#2196F3',
            robot: '#607D8B'
        };
        
        return colors[enemyType] || '#f44336';
    }
    
    renderEnemyEffects(enemy) {
        // Эффект замедления
        if (enemy.slowed) {
            this.ctx.strokeStyle = '#03A9F4';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, enemy.radius + 3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Эффект отравления
        if (enemy.poisoned) {
            this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    renderProjectile(projectile) {
        this.ctx.save();
        
        // Позиция снаряда
        this.ctx.translate(projectile.x, projectile.y);
        
        // Снаряд
        this.ctx.fillStyle = this.getProjectileColor(projectile.type);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // След снаряда
        if (projectile.trail) {
            this.ctx.strokeStyle = this.getProjectileColor(projectile.type);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(-projectile.vx * 0.1, -projectile.vy * 0.1);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    getProjectileColor(projectileType) {
        const colors = {
            magic: '#FF9800',
            arrow: '#8BC34A',
            bolt: '#FFC107',
            fireball: '#FF5722',
            ice: '#03A9F4',
            lightning: '#FFEB3B',
            shadow: '#9E9E9E',
            laser: '#F44336'
        };
        
        return colors[projectileType] || '#FFC107';
    }
    
    renderExperienceOrb(orb) {
        this.ctx.save();
        
        // Позиция орба
        this.ctx.translate(orb.x, orb.y);
        
        // Свечение
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, orb.radius * 2);
        gradient.addColorStop(0, 'rgba(33, 150, 243, 0.8)');
        gradient.addColorStop(1, 'rgba(33, 150, 243, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, orb.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Основной орб
        this.ctx.fillStyle = this.colors.experience;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, orb.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Пульсация
        const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 1;
        this.ctx.scale(pulse, pulse);
        this.ctx.strokeStyle = 'rgba(33, 150, 243, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, orb.radius + 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    renderArtifact(artifact) {
        this.ctx.save();
        
        // Позиция артефакта
        this.ctx.translate(artifact.x, artifact.y);
        
        // Вращение
        this.ctx.rotate(Date.now() * 0.001);
        
        // Свечение
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, artifact.radius * 3);
        gradient.addColorStop(0, 'rgba(156, 39, 176, 0.8)');
        gradient.addColorStop(1, 'rgba(156, 39, 176, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, artifact.radius * 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Основной артефакт
        this.ctx.fillStyle = this.colors.artifact;
        this.ctx.beginPath();
        
        // Форма в зависимости от редкости
        if (artifact.rarity === 'legendary') {
            // Звезда для легендарных
            this.drawStar(0, 0, artifact.radius, 5);
        } else if (artifact.rarity === 'epic') {
            // Ромб для эпических
            this.ctx.moveTo(0, -artifact.radius);
            this.ctx.lineTo(artifact.radius, 0);
            this.ctx.lineTo(0, artifact.radius);
            this.ctx.lineTo(-artifact.radius, 0);
        } else {
            // Круг для обычных и редких
            this.ctx.arc(0, 0, artifact.radius, 0, Math.PI * 2);
        }
        
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawStar(cx, cy, radius, points) {
        const angle = Math.PI / points;
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const x = cx + Math.cos(i * angle - Math.PI / 2) * r;
            const y = cy + Math.sin(i * angle - Math.PI / 2) * r;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
    }
    
    renderParticles(entityManager) {
        entityManager.particles.forEach(particle => {
            this.ctx.save();
            
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderColliders(entityManager) {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 1;
        
        // Коллайдеры врагов
        entityManager.enemies.forEach(enemy => {
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Коллайдеры снарядов
        entityManager.projectiles.forEach(projectile => {
            this.ctx.beginPath();
            this.ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        // Коллайдер игрока
        if (entityManager.player) {
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(entityManager.player.x, entityManager.player.y, entityManager.player.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    updateCamera(targetX, targetY) {
        // Плавное следование камеры за целью
        const smoothing = 0.1;
        this.camera.x += (targetX - this.width / 2 - this.camera.x) * smoothing;
        this.camera.y += (targetY - this.height / 2 - this.camera.y) * smoothing;
        
        // Ограничение камеры границами мира
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.width - this.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, this.height - this.height));
    }
    
    setCamera(x, y) {
        this.camera.x = x;
        this.camera.y = y;
    }
    
    // Методы для настройки рендеринга
    toggleGrid() {
        this.showGrid = !this.showGrid;
    }
    
    toggleColliders() {
        this.showColliders = !this.showColliders;
    }
    
    toggleParticles() {
        this.particlesEnabled = !this.particlesEnabled;
    }
}
