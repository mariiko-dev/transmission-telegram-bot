# Telegram Transmission Bot 🌐🤖

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)
![Transmission](https://img.shields.io/badge/Transmission-DC482A?style=for-the-badge&logo=transmission&logoColor=white)

## Описание 📜

Этот проект представляет собой Telegram-бота для управления Transmission, созданного с использованием Express.js и Docker. Бот позволяет добавлять торренты и просматривать список активных торрентов прямо из Telegram.

## Функционал 🚀

- **Добавление торрентов** через Telegram
- **Просмотр списка активных торрентов**
- **Веб-интерфейс Transmission**
- **Интеграция с Jellyfin**

## Установка 🛠️

### Предварительные требования

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Шаги установки

1. Клонируйте репозиторий:

    ```sh
    git clone https://github.com/mariiko-dev/jellyfin-transmission.git
    cd telegram-transmission-bot
    ```

2. Создайте файл `.env` в корне проекта и добавьте следующие переменные окружения:

    ```env
    TELEGRAM_BOT_TOKEN=your_telegram_bot_token
    TRANSMISSION_USERNAME=your_username
    TRANSMISSION_PASSWORD=your_password
    ```

3. Запустите Docker Compose:

    ```sh
    docker-compose up -d --build
    ```

## Использование 📦

- **Transmission Web UI**: [http://localhost:9091](http://localhost:9091)
- **Jellyfin Web UI**: [http://localhost:8096](http://localhost:8096)

## Контейнеры 🐳

- **transmission**: Transmission сервер для загрузки торрентов
- **telegram-bot**: Telegram-бот для управления Transmission
- **jellyfin**: Медиа-сервер Jellyfin

## Структура проекта 📂
```
telegram-transmission-bot/
├── config/
│   └── transmission.js
├── controllers/
│   └── telegramController.js
├── services/
│   └── transmissionService.js
├── index.js
├── package.json
├── Dockerfile
├── docker-compose.yml
└── .env
```

## Разработка 🧑‍💻

Для локальной разработки:

1. Установите зависимости:

    ```sh
    npm install
    ```

2. Запустите сервер:

    ```sh
    npm start
    ```

## Вклад 👐

Если у вас есть идеи или предложения по улучшению проекта, пожалуйста, создайте Issue или Pull Request. Вся помощь приветствуется!

## Лицензия 📄

Этот проект лицензирован под лицензией MIT. См. файл [LICENSE](LICENSE) для получения подробной информации.
