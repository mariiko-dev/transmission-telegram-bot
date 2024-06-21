const fetch = require('node-fetch');
const transmissionService = require('../services/transmissionService');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId, text) {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text })
    });
}

module.exports = {
    handleUpdate: async (req, res) => {
        const message = req.body.message;
        const chatId = message.chat.id;
        const text = message.text;

        if (text === '/start') {
            await sendMessage(chatId, 'Добро пожаловать! Я ваш бот для управления Transmission.');
        } else if (text.startsWith('/add ')) {
            const torrentUrl = text.split(' ')[1];
            try {
                const result = await transmissionService.addTorrent(torrentUrl);
                await sendMessage(chatId, `Торрент добавлен: ${result.id}`);
            } catch (err) {
                await sendMessage(chatId, `Ошибка при добавлении торрента: ${err.message}`);
            }
        } else if (text === '/list') {
            try {
                const torrents = await transmissionService.listTorrents();
                const torrentList = torrents.map(t => `${t.id}: ${t.name} (${t.percentDone * 100}%)`).join('\n');
                await sendMessage(chatId, `Текущие торренты:\n${torrentList}`);
            } catch (err) {
                await sendMessage(chatId, `Ошибка при получении списка торрентов: ${err.message}`);
            }
        } else {
            await sendMessage(chatId, 'Команда не распознана.');
        }

        res.sendStatus(200);
    }
};
