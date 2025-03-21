# Кастомный логгер JavaScript для Windows

### Описание

Кастомная функция для записи логов с поддержкой уровней логирования, ротации файлов, пользовательским форматом даты, именем файла и разделителями. Логгер может работать как в синхронном, так и в асинхронном режиме.

---

### Параметры функции `customLog`

| Параметр | Значение по умолчанию | Описание                                                                                                                                         |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`      | (обязательный)               | Сообщение для логирования.                                                                                                        |
| `level`        | `'INFO'`                               | Уровень логирования (`INFO`, `ERROR`, `DEBUG`).                                                                                  |
| `isAsync`      | `false`                                | Указывает, нужно ли использовать асинхронный режим. Если `true`, возвращается `Promise`. |

---

### Возвращаемое значение

- В **синхронном режиме** функция ничего не возвращает.
- В **асинхронном режиме** функция возвращает `Promise`.

---

### Конфигурация

Параметры логгера хранятся в конфигурационном файле `logConfig.json`. Если файл отсутствует, он будет создан автоматически с настройками по умолчанию.

#### Расположение конфигурационного файла

```javascript
const CONFIG_PATH = './logConfig.json';
```

#### Пример конфигурации (`logConfig.json`)

```json
{
    "logDir": "C:\\local\\logs\\",
    "logFileName": "custom_log.txt",
    "maxFileSize": 1048576,
    "dateFormat": "yyyy-MM-dd HH:mm:ss"
}
```

##### Параметры конфигурации

| Параметр | Значение по умолчанию | Описание                                                                                                                                                          |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logDir`       | `"C:\\local\\logs\\"`                  | Директория для хранения логов.                                                                                                                  |
| `logFileName`  | `"custom_log.txt"`                     | Имя файла лога.                                                                                                                                               |
| `maxFileSize`  | `1048576`                              | Максимальный размер файла лога в байтах (по умолчанию 1 МБ).                                                               |
| `dateFormat`   | `"yyyy-MM-dd HH:mm:ss"`                | Формат даты для записи в лог. Поддерживается любой формат, совместимый с библиотекой `date-fns`. |

---

### Особенности работы

1. **Создание директории**:

   - Если указанная директория (`logDir`) не существует, она создается автоматически.
2. **Ротация логов**:

   - Если размер файла превышает `maxFileSize`, текущий файл переименовывается (с добавлением временной метки), и создается новый файл для записи.
3. **Форматирование сообщений**:

   - Каждая запись в лог имеет формат:
     `[дата] [уровень] текст\n`
     После каждой записи добавляется разделитель из 80 дефисов (`--------------------------------------------------------------------------------`).
4. **Формат даты**:

   - Формат даты задается через параметр `dateFormat` в конфигурационном файле.
   - Используется библиотека `date-fns` для форматирования даты.

---

### Примеры использования

Пример модульного подключения и использования

```javascript
import { customLog } from './customLog.mjs';

// Синхронное логирование
customLog('Это синхронное информационное сообщение 1234', 'INFO');

(async () => {
  // Асинхронное логирование
  await customLog('Это асинхронное сообщение об ошибке 5678', 'ERROR', true);
})();

```

#### Пример синхронного вызова

```javascript
(() => {
    // Синхронное логирование
    customLog('Синхронное логирование с пользовательским форматом даты', 'INFO');
})();
```

#### Пример асинхронного вызова

```javascript
(async () => {
    // Асинхронное логирование
    await customLog('Асинхронное логирование с пользовательским форматом даты', 'INFO', true);  
})();
```

---

### Пример содержимого лог-файла

```markdown
[2024-12-30 22:06:41] [INFO] Синхронное логирование с пользовательским форматом даты
--------------------------------------------------------------------------------
[2024-12-30 22:06:41] [INFO] Асинхронное логирование с пользовательским форматом даты
--------------------------------------------------------------------------------
```

---

### Зависимости

Для работы с кастомными форматами даты и времени требуется библиотека `date-fns`. Убедитесь, что она установлена в вашем проекте.

#### Установка зависимостей

```bash
npm install date-fns
```

#### Пример `package.json`

```json
{
  "dependencies": {
    "date-fns": "^4.1.0"
  }
}
```

---

### Преимущества

1. **Гибкость**:

   - Вы можете легко изменить настройки логгера, отредактировав файл `logConfig.json`.
2. **Автоматизация**:

   - Если файл конфигурации отсутствует, он создается автоматически с настройками по умолчанию.
3. **Поддержка синхронного и асинхронного режимов**:

   - Вы можете выбирать режим работы в зависимости от задачи.
4. **Ротация логов**:

   - Автоматическая ротация файлов при достижении максимального размера.
5. **Модульность**:

   - Код разделен на независимые функции, что делает его легче поддерживать и повторно использовать.
