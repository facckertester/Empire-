// Основной файл игры
import { Game } from './engine/Game.js';
import { UIManager } from './ui/UIManager.js';
import { SaveSystem } from './systems/SaveSystem.js';

// Глобальные переменные
let game = null;
let uiManager = null;
let saveSystem = null;

// Инициализация игры
async function init() {
    try {
        // Инициализация системы сохранений
        saveSystem = new SaveSystem();
        await saveSystem.init();
        
        // Инициализация UI менеджера
        uiManager = new UIManager();
        uiManager.init();
        
        // Инициализация игры
        game = new Game();
        await game.init();
        
        // Запуск игрового цикла
        game.start();
        
        console.log('Игра успешно инициализирована');
    } catch (error) {
        console.error('Ошибка при инициализации игры:', error);
    }
}

// Запуск игры после загрузки DOM
document.addEventListener('DOMContentLoaded', init);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (game) {
        game.onResize();
    }
});

// Предотвращение контекстного меню на canvas
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
});

// Экспорт для отладки
window.gameDebug = {
    game,
    uiManager,
    saveSystem
};
