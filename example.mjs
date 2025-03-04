import { customLog } from './customLog.mjs';

// Синхронное логирование
customLog('Это синхронное информационное сообщение 1234', 'INFO');

(async () => {
  // Асинхронное логирование
  await customLog('Это асинхронное сообщение об ошибке 5678', 'ERROR', true);
})();
