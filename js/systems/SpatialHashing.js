// Система Spatial Hashing для оптимизации детекции коллизий
export class SpatialHashing {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        
        // Количество ячеек
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        
        // Создание сетки
        this.grid = new Array(this.cols * this.rows);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
        
        // Массив для хранения всех объектов
        this.objects = [];
        
        // Статистика
        this.stats = {
            totalObjects: 0,
            totalChecks: 0,
            skippedChecks: 0,
            averageObjectsPerCell: 0
        };
    }
    
    // Преобразование мировых координат в координаты ячейки
    worldToCell(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        // Проверка границ
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            return -1;
        }
        
        return row * this.cols + col;
    }
    
    // Получение ячеек, которые занимает объект
    getObjectCells(object) {
        const cells = [];
        
        // Вычисление границ объекта
        const left = object.x - object.radius;
        const right = object.x + object.radius;
        const top = object.y - object.radius;
        const bottom = object.y + object.radius;
        
        // Преобразование границ в координаты ячеек
        const leftCol = Math.floor(left / this.cellSize);
        const rightCol = Math.floor(right / this.cellSize);
        const topRow = Math.floor(top / this.cellSize);
        const bottomRow = Math.floor(bottom / this.cellSize);
        
        // Добавление всех ячеек, которые занимает объект
        for (let row = topRow; row <= bottomRow; row++) {
            for (let col = leftCol; col <= rightCol; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    cells.push(row * this.cols + col);
                }
            }
        }
        
        return cells;
    }
    
    // Добавление объекта в сетку
    add(object) {
        if (!object || !object.active) return;
        
        // Удаление объекта из старых ячеек (если он уже был в сетке)
        this.remove(object);
        
        // Добавление объекта в массив всех объектов
        if (!this.objects.includes(object)) {
            this.objects.push(object);
        }
        
        // Получение ячеек объекта
        const cells = this.getObjectCells(object);
        
        // Добавление объекта в каждую ячейку
        cells.forEach(cellIndex => {
            if (cellIndex >= 0 && cellIndex < this.grid.length) {
                this.grid[cellIndex].push(object);
            }
        });
        
        // Сохранение ячеек в объекте для быстрого удаления
        object.cells = cells;
        
        this.stats.totalObjects++;
    }
    
    // Удаление объекта из сетки
    remove(object) {
        if (!object || !object.cells) return;
        
        // Удаление объекта из ячеек
        object.cells.forEach(cellIndex => {
            if (cellIndex >= 0 && cellIndex < this.grid.length) {
                const cell = this.grid[cellIndex];
                const index = cell.indexOf(object);
                if (index > -1) {
                    cell.splice(index, 1);
                }
            }
        });
        
        // Очистка ячеек объекта
        object.cells = null;
        
        // Удаление из массива всех объектов
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
        
        this.stats.totalObjects--;
    }
    
    // Полная очистка сетки
    clear() {
        // Очистка всех ячеек
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i].length = 0;
        }
        
        // Очистка массива объектов
        this.objects.length = 0;
        
        // Сброс статистики
        this.stats.totalObjects = 0;
        this.stats.totalChecks = 0;
        this.stats.skippedChecks = 0;
    }
    
    // Получение объектов в указанной ячейке
    getCellObjects(x, y) {
        const cellIndex = this.worldToCell(x, y);
        if (cellIndex < 0) return [];
        
        return this.grid[cellIndex];
    }
    
    // Получение объектов в радиусе от точки
    getObjectsInRadius(x, y, radius) {
        const objects = new Set();
        
        // Вычисление ячеек в радиусе
        const leftCol = Math.floor((x - radius) / this.cellSize);
        const rightCol = Math.floor((x + radius) / this.cellSize);
        const topRow = Math.floor((y - radius) / this.cellSize);
        const bottomRow = Math.floor((y + radius) / this.cellSize);
        
        // Проверка ячеек
        for (let row = topRow; row <= bottomRow; row++) {
            for (let col = leftCol; col <= rightCol; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    const cellIndex = row * this.cols + col;
                    const cellObjects = this.grid[cellIndex];
                    
                    // Добавление объектов из ячейки
                    cellObjects.forEach(obj => {
                        // Проверка расстояния
                        const dx = obj.x - x;
                        const dy = obj.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance <= radius + obj.radius) {
                            objects.add(obj);
                        }
                    });
                }
            }
        }
        
        return Array.from(objects);
    }
    
    // Получение потенциальных коллизий для объекта
    getPotentialCollisions(object) {
        if (!object || !object.cells) return [];
        
        const collisions = new Set();
        
        // Проверка всех ячеек объекта
        object.cells.forEach(cellIndex => {
            if (cellIndex >= 0 && cellIndex < this.grid.length) {
                const cellObjects = this.grid[cellIndex];
                
                // Добавление объектов из ячейки
                cellObjects.forEach(obj => {
                    if (obj !== object && obj.active) {
                        collisions.add(obj);
                    }
                });
            }
        });
        
        return Array.from(collisions);
    }
    
    // Проверка коллизии между двумя объектами
    checkCollision(obj1, obj2) {
        if (!obj1 || !obj2 || !obj1.active || !obj2.active) return false;
        
        this.stats.totalChecks++;
        
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < obj1.radius + obj2.radius;
    }
    
    // Получение всех пар коллайдирующих объектов
    getAllCollisions() {
        const collisions = [];
        const checked = new Set();
        
        // Проверка всех объектов
        this.objects.forEach(obj1 => {
            if (!obj1.active) return;
            
            // Получение потенциальных коллизий
            const potentials = this.getPotentialCollisions(obj1);
            
            potentials.forEach(obj2 => {
                if (!obj2.active) return;
                
                // Создание уникального ключа для пары
                const key = obj1.id < obj2.id ? `${obj1.id}-${obj2.id}` : `${obj2.id}-${obj1.id}`;
                
                // Проверка, не проверяли ли мы эту пару ранее
                if (checked.has(key)) {
                    this.stats.skippedChecks++;
                    return;
                }
                
                checked.add(key);
                
                // Проверка коллизии
                if (this.checkCollision(obj1, obj2)) {
                    collisions.push([obj1, obj2]);
                }
            });
        });
        
        return collisions;
    }
    
    // Райкастинг (проверка пересечения луча с объектами)
    raycast(startX, startY, endX, endY, radius = 0) {
        const hits = [];
        
        // Вычисление направления и длины луча
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / length;
        const dirY = dy / length;
        
        // Шаг луча
        const stepSize = this.cellSize / 4;
        const steps = Math.ceil(length / stepSize);
        
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * length;
            const x = startX + dirX * t;
            const y = startY + dirY * t;
            
            // Получение объектов в текущей точке
            const objects = this.getObjectsInRadius(x, y, radius);
            
            objects.forEach(obj => {
                if (!hits.includes(obj)) {
                    hits.push(obj);
                }
            });
        }
        
        return hits;
    }
    
    // Обновление статистики
    updateStats() {
        let totalCellObjects = 0;
        let occupiedCells = 0;
        
        for (let i = 0; i < this.grid.length; i++) {
            const cellSize = this.grid[i].length;
            if (cellSize > 0) {
                occupiedCells++;
                totalCellObjects += cellSize;
            }
        }
        
        this.stats.averageObjectsPerCell = occupiedCells > 0 ? totalCellObjects / occupiedCells : 0;
    }
    
    // Получение статистики
    getStats() {
        this.updateStats();
        
        return {
            ...this.stats,
            gridSize: `${this.cols}x${this.rows}`,
            totalCells: this.grid.length,
            occupiedCells: this.grid.filter(cell => cell.length > 0).length,
            averageObjectsPerCell: this.stats.averageObjectsPerCell,
            efficiency: this.stats.totalChecks > 0 ? 
                this.stats.skippedChecks / this.stats.totalChecks : 0
        };
    }
    
    // Визуализация сетки (для отладки)
    render(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Рисование вертикальных линий
        for (let col = 0; col <= this.cols; col++) {
            const x = col * this.cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        // Рисование горизонтальных линий
        for (let row = 0; row <= this.rows; row++) {
            const y = row * this.cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        
        // Подсветка занятых ячеек
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i].length > 0) {
                const col = i % this.cols;
                const row = Math.floor(i / this.cols);
                ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
            }
        }
        
        ctx.restore();
    }
    
    // Оптимизация размера ячеек на основе статистики
    optimizeCellSize() {
        const stats = this.getStats();
        
        // Если в среднем слишком много объектов в ячейке, уменьшаем размер ячейки
        if (stats.averageObjectsPerCell > 10) {
            const newSize = Math.max(this.cellSize * 0.8, 16);
            this.resizeCellSize(newSize);
        }
        // Если слишком мало объектов в ячейке, увеличиваем размер ячейки
        else if (stats.averageObjectsPerCell < 2 && this.cellSize < 128) {
            const newSize = Math.min(this.cellSize * 1.2, 128);
            this.resizeCellSize(newSize);
        }
    }
    
    // Изменение размера ячейки
    resizeCellSize(newCellSize) {
        if (newCellSize === this.cellSize) return;
        
        // Сохранение текущих объектов
        const currentObjects = [...this.objects];
        
        // Пересоздание сетки с новым размером ячейки
        this.cellSize = newCellSize;
        this.cols = Math.ceil(this.width / newCellSize);
        this.rows = Math.ceil(this.height / newCellSize);
        
        this.grid = new Array(this.cols * this.rows);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
        
        // Повторное добавление объектов
        currentObjects.forEach(obj => {
            if (obj.active) {
                this.add(obj);
            }
        });
    }
}
