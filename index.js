require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const telegramController = require('./controllers/telegramController');

const app = express();
app.use(bodyParser.json());

const token = process.env.TELEGRAM_BOT_TOKEN;

app.post(`/bot${token}`, telegramController.handleUpdate);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
