# 📦 Transmission Bot Telegram

Этот проект создан для быстрой и удобной загрузки видеофайлов через торренты. Он предоставляет Telegram-бота, который взаимодействует с Transmission для управления загрузками и с Jellyfin для организации и потоковой передачи медиафайлов. Бот поддерживает добавление торрентов через URL, magnet-ссылки или файлы, и включает белый список авторизованных пользователей для обеспечения безопасности.

## 🌟 Функции

- 🧲 **Transmission:** Управление загрузками торрентов.
- 🤖 **Telegram Бот:** Взаимодействие с Transmission для добавления, списка и удаления торрентов.
- 🎬 **Jellyfin:** Медиа-сервер для организации и потоковой передачи медиафайлов.
- 🔐 **Белый список:** Только авторизованные пользователи Telegram могут взаимодействовать с ботом.
- ⏸ **Автопауза:** Автоматическая пауза торрентов после завершения загрузки и уведомление пользователя.

## 📋 Предварительные требования

- 🐳 Docker
- 🐙 Docker Compose

## 🚀 Начало работы

### 📂 Клонирование репозитория

```bash
git clone https://github.com/mariiko-dev/transmission_jellyfine_bot.git
cd transmission_jellyfine_bot
```

### 🔧 Переменные окружения

```plaintext
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TRANSMISSION_USERNAME=your_transmission_username
TRANSMISSION_PASSWORD=your_transmission_password
WHITELISTED_USERS=user1,user2
```


### 📂 Структура каталогов

```csharp
telegram-transmission-bot/
├── .env
├── bot.js
├── transmission.js
├── commands/
│   ├── start.js
│   ├── add.js
│   ├── list.js
│   └── remove.js
├── downloads/
├── Dockerfile
└── docker-compose.yml
```


### 🐋 Конфигурация Docker Compose
 docker-compose.yml:

```yaml
services:
  transmission:
    image: linuxserver/transmission
    container_name: transmission
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - TRANSMISSION_WEB_UI=combustion
      - USER=${TRANSMISSION_USERNAME}
      - PASS=${TRANSMISSION_PASSWORD}
    volumes:
      - ./config/transmission:/config
      - ./media:/downloads
    ports:
      - "9091:9091"
      - "51413:51413"
      - "51413:51413/udp"
    restart: unless-stopped

  telegram-bot:
    build: .
    container_name: telegram-bot
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TRANSMISSION_HOST=transmission
      - TRANSMISSION_PORT=9091
      - TRANSMISSION_USERNAME=${TRANSMISSION_USERNAME}
      - TRANSMISSION_PASSWORD=${TRANSMISSION_PASSWORD}
      - WHITELISTED_USERS=${WHITELISTED_USERS}
    depends_on:
      - transmission
    restart: unless-stopped

volumes:
  config:
  media:
```
### 🐋 Конфигурация Docker Compose с Jellyfin
 docker-compose.yml:

```yaml
services:
  transmission:
    image: linuxserver/transmission
    container_name: transmission
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - TRANSMISSION_WEB_UI=combustion
      - USER=${TRANSMISSION_USERNAME}
      - PASS=${TRANSMISSION_PASSWORD}
    volumes:
      - ./config/transmission:/config
      - ./media:/downloads
    ports:
      - "9091:9091"
      - "51413:51413"
      - "51413:51413/udp"
    restart: unless-stopped

  telegram-bot:
    build: .
    container_name: telegram-bot
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TRANSMISSION_HOST=transmission
      - TRANSMISSION_PORT=9091
      - TRANSMISSION_USERNAME=${TRANSMISSION_USERNAME}
      - TRANSMISSION_PASSWORD=${TRANSMISSION_PASSWORD}
      - WHITELISTED_USERS=${WHITELISTED_USERS}
    depends_on:
      - transmission
    restart: unless-stopped

  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    ports:
      - "8096:8096"
      - "8920:8920"
    volumes:
      - ./config/jellyfin:/config
      - ./media:/media
    restart: unless-stopped

volumes:
  config:
  media:
```


### 🚀 Запуск контейнеров
Запустите следующие команды для сборки и запуска Docker-контейнеров:

```bash
docker compose up --build -d
```

### 🛠 Использование бота

Бот использует интуитивно понятные кнопки для взаимодействия. После запуска бота в Telegram отправьте команду /start, чтобы начать работу. Вам будут доступны следующие функции:

Добавить торрент: Нажмите кнопку, чтобы добавить новый торрент через URL или magnet-ссылку.
Список торрентов: Нажмите кнопку, чтобы увидеть текущие загрузки торрентов.
Назад: Возвращает в главное меню.

### 📱 Уведомления и автопауза

Когда загрузка торрента завершена, бот автоматически приостанавливает торрент и отправляет уведомление пользователю с кнопкой "Отлично!". Нажатие на кнопку удаляет уведомление и возвращает пользователя в главное меню.

### 📝 Лицензия

Этот проект лицензирован под лицензией MIT. См. файл LICENSE для получения подробной информации.

### 👥 Вклад

Если вы хотите внести вклад в этот проект, пожалуйста, форкните репозиторий и используйте ветку для разработки новых функций. Пулл-реквесты приветствуются.

### 🐞 Проблемы

Если вы столкнулись с какими-либо проблемами, пожалуйста, создайте новый issue в разделе GitHub Issues.
