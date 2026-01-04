// Система обработки ввода
export class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.mouse = { x: 0, y: 0, left: false, right: false };
        this.events = {};
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Клавиатура
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Мышь
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Тач для мобильных устройств
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // Предотвращение прокрутки страницы при игре
        window.addEventListener('wheel', (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    onKeyDown(event) {
        const key = event.code;
        this.keys[key] = true;
        
        // Обработка специальных клавиш
        switch (key) {
            case 'Escape':
                this.emit('pause');
                break;
            case 'KeyR':
                this.emit('restart');
                break;
            case 'Space':
                this.emit('action');
                break;
            case 'Tab':
                event.preventDefault();
                this.emit('toggleMap');
                break;
            case 'KeyM':
                this.emit('toggleSound');
                break;
        }
        
        // Числовые клавиши для выбора оружия
        if (key >= 'Digit1' && key <= 'Digit6') {
            const slot = parseInt(key.replace('Digit', ''));
            this.emit('selectWeapon', slot);
        }
    }
    
    onKeyUp(event) {
        const key = event.code;
        this.keys[key] = false;
    }
    
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.mouse.x = (event.clientX - rect.left) * scaleX;
        this.mouse.y = (event.clientY - rect.top) * scaleY;
    }
    
    onMouseDown(event) {
        if (event.button === 0) {
            this.mouse.left = true;
            this.emit('mouseDown', { x: this.mouse.x, y: this.mouse.y });
        } else if (event.button === 2) {
            this.mouse.right = true;
            this.emit('mouseRightDown', { x: this.mouse.x, y: this.mouse.y });
        }
    }
    
    onMouseUp(event) {
        if (event.button === 0) {
            this.mouse.left = false;
            this.emit('mouseUp', { x: this.mouse.x, y: this.mouse.y });
        } else if (event.button === 2) {
            this.mouse.right = false;
            this.emit('mouseRightUp', { x: this.mouse.x, y: this.mouse.y });
        }
    }
    
    onTouchStart(event) {
        event.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        for (let touch of event.touches) {
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            
            this.emit('touchStart', { x, y, id: touch.identifier });
        }
    }
    
    onTouchMove(event) {
        event.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        for (let touch of event.touches) {
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            
            this.emit('touchMove', { x, y, id: touch.identifier });
        }
    }
    
    onTouchEnd(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            this.emit('touchEnd', { id: touch.identifier });
        }
    }
    
    // Получение состояния ввода
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
    
    getMovementVector() {
        let dx = 0;
        let dy = 0;
        
        // WASD и стрелки
        if (this.keys['KeyW'] || this.keys['ArrowUp']) dy = -1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) dy = 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx = -1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) dx = 1;
        
        // Нормализация вектора движения
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }
        
        return { x: dx, y: dy };
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    getDirectionToMouse(fromX, fromY) {
        const dx = this.mouse.x - fromX;
        const dy = this.mouse.y - fromY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) {
            return { x: 0, y: 0, distance: 0 };
        }
        
        return {
            x: dx / distance,
            y: dy / distance,
            distance: distance
        };
    }
    
    isMousePressed() {
        return this.mouse.left;
    }
    
    isRightMousePressed() {
        return this.mouse.right;
    }
    
    // Система событий
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(callback);
            if (index > -1) {
                this.events[event].splice(index, 1);
            }
        }
    }
    
    emit(event, data = {}) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    update() {
        // Обработка постоянных событий (например, удержание клавиш)
        if (this.isMousePressed()) {
            this.emit('mouseHold', this.getMousePosition());
        }
        
        if (this.isRightMousePressed()) {
            this.emit('mouseRightHold', this.getMousePosition());
        }
        
        const movement = this.getMovementVector();
        if (movement.x !== 0 || movement.y !== 0) {
            this.emit('move', movement);
        }
    }
    
    // Вспомогательные методы
    getAngle(fromX, fromY, toX, toY) {
        return Math.atan2(toY - fromY, toX - fromX);
    }
    
    getDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Сброс состояния ввода
    reset() {
        this.keys = {};
        this.mouse.left = false;
        this.mouse.right = false;
    }
    
    // Уничтожение обработчика ввода
    destroy() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        this.canvas.removeEventListener('touchend', this.onTouchEnd);
    }
}
