const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Конфигурация логгера
let loggerConfig = null;
const CONFIG_PATH = './logConfig.json';

/**
 * Загружает конфигурацию логгера. Если конфигурация отсутствует, создает файл с настройками по умолчанию.
 */
function loadConfig() {
    if (loggerConfig) return loggerConfig;

    const defaultConfig = {
        logDir: "C:\\local\\logs\\",
        logFileName: "custom_log.txt",
        maxFileSize: 1048576,
        dateFormat: "yyyy-MM-dd HH:mm:ss" // Пользовательский формат даты
    };

    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4), 'utf-8');
        console.log(`Файл конфигурации создан: ${CONFIG_PATH}`);
    }

    const configData = fs.readFileSync(CONFIG_PATH, 'utf-8');
    loggerConfig = JSON.parse(configData);
    return loggerConfig;
}

/**
 * Форматирует текущую дату в строку на основе формата из конфигурации.
 * @param {string} dateFormat Формат даты.
 * @returns {string} Отформатированная строка даты.
 */
function formatDate(dateFormat) {
    const now = new Date();
    return format(now, dateFormat);
}

/**
 * Общая логика записи логов (синхронная).
 *
 * @param {string} message Сообщение для логирования.
 * @param {string} level Уровень логирования (INFO, ERROR, DEBUG).
 */
function logSync(message, level) {
    const config = loadConfig();
    const logPath = path.resolve(config.logDir);
    const logFile = path.join(logPath, config.logFileName);

    // Создаем директорию, если она отсутствует
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
    }

    // Форматирование сообщения
    const formattedMessage = `[${formatDate(config.dateFormat)}] [${level}] ${message}\n`;
    const separator = '-'.repeat(80) + '\n';

    // Проверяем размер файла и выполняем ротацию, если превышен лимит
    if (fs.existsSync(logFile) && fs.statSync(logFile).size > config.maxFileSize) {
        const backupFile = path.join(
            logPath,
            `${path.parse(config.logFileName).name}_${new Date().toISOString().replace(/:/g, '-')}.txt`
        );
        fs.renameSync(logFile, backupFile);
    }

    // Запись в лог
    fs.appendFileSync(logFile, formattedMessage + separator);
}

/**
 * Общая логика записи логов (асинхронная).
 *
 * @param {string} message Сообщение для логирования.
 * @param {string} level Уровень логирования (INFO, ERROR, DEBUG).
 * @returns {Promise<void>}
 */
async function logAsync(message, level) {
    const config = loadConfig();
    const logPath = path.resolve(config.logDir);
    const logFile = path.join(logPath, config.logFileName);

    // Создаем директорию, если она отсутствует
    if (!fs.existsSync(logPath)) {
        await fs.promises.mkdir(logPath, { recursive: true });
    }

    // Форматирование сообщения
    const formattedMessage = `[${formatDate(config.dateFormat)}] [${level}] ${message}\n`;
    const separator = '-'.repeat(80) + '\n';

    // Проверяем размер файла и выполняем ротацию, если превышен лимит
    try {
        const stats = await fs.promises.stat(logFile).catch(() => null);
        if (stats && stats.size > config.maxFileSize) {
            const backupFile = path.join(
                logPath,
                `${path.parse(config.logFileName).name}_${new Date().toISOString().replace(/:/g, '-')}.txt`
            );
            await fs.promises.rename(logFile, backupFile);
        }
    } catch (error) {
        console.error(`Ошибка ротации логов: ${error.message}`);
    }

    // Запись в лог
    await fs.promises.appendFile(logFile, formattedMessage + separator);
}

/**
 * Основная функция логгера. Определяет вызов в синхронном или асинхронном режиме.
 *
 * @param {string} message Сообщение для логирования.
 * @param {string} level Уровень логирования (INFO, ERROR, DEBUG).
 * @param {boolean} isAsync Указывает, нужно ли использовать асинхронный режим.
 * @returns {void | Promise<void>}
 */
function customLog(message, level = 'INFO', isAsync = false) {
    if (isAsync) {
        return logAsync(message, level);
    } else {
        logSync(message, level);
    }
}

// Пример использования в синхронном режиме
(() => {
    // Синхронное логирование
    customLog('Синхронное логирование с пользовательским форматом даты', 'INFO');
})();

// Пример использования в асинхронном режиме
(async () => {
    // Асинхронное логирование
    await customLog('Асинхронное логирование с пользовательским форматом даты', 'INFO', true);    
})();
