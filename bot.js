require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { transmission, checkTorrents } = require('./transmission');
const startCommand = require('./commands/start');
const { addUrlOrMagnet, handleAddTorrent } = require('./commands/add');
const listCommand = require('./commands/list');
const removeCommand = require('./commands/remove');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let lastMessageId = {};
let userMap = {}; // Карта для отслеживания пользователей и их торрентов

console.log(`Загруженные whitelistedUsers: ${process.env.WHITELISTED_USERS}`);
console.log(`Token: ${token}`);

bot.onText(/\/start/, (msg) => startCommand.showMainMenu(bot, msg, lastMessageId));

bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const command = callbackQuery.data;
    const chatId = msg.chat.id;

    console.log(`Received callback_query with command: ${command}`);

    if (command === 'add') {
        handleAddTorrent(bot, msg, lastMessageId);
    } else if (command === 'list') {
        listCommand.handleListTorrents(bot, msg, transmission, lastMessageId);
    } else if (command.startsWith('info_')) {
        const torrentId = command.split('_')[1];
        listCommand.handleTorrentInfo(bot, msg, transmission, torrentId, lastMessageId);
    } else if (command.startsWith('pause_')) {
        const torrentId = command.split('_')[1];
        console.log(`Pausing torrent with ID: ${torrentId}`);
        transmission.stop(parseInt(torrentId), (err) => {
            if (err) {
                console.error(`Error pausing torrent with ID ${torrentId}: ${err.message}`);
                bot.sendMessage(chatId, `Ошибка при паузе торрента: ${err.message}`);
            } else {
                transmission.get(parseInt(torrentId), (err, result) => {
                    if (err) {
                        bot.sendMessage(chatId, `Ошибка получения информации о торренте: ${err.message}`);
                    } else {
                        const torrent = result.torrents.find(t => t.id === parseInt(torrentId));
                        if (!torrent) {
                            bot.sendMessage(chatId, `Торрент не найден`);
                            return;
                        }
                        bot.sendMessage(chatId, `Торрент "${torrent.name}" приостановлен.`).then(sentMsg => {
                            setTimeout(() => {
                                bot.deleteMessage(chatId, sentMsg.message_id).catch(err => console.log(`Failed to delete message: ${err}`));
                                listCommand.handleTorrentInfo(bot, { chat: { id: chatId } }, transmission, torrentId, lastMessageId);
                            }, 1000);
                        });
                    }
                });
            }
        });
    } else if (command.startsWith('start_')) {
        const torrentId = command.split('_')[1];
        console.log(`Starting torrent with ID: ${torrentId}`);
        transmission.start(parseInt(torrentId), (err) => {
            if (err) {
                console.error(`Error starting torrent with ID ${torrentId}: ${err.message}`);
                bot.sendMessage(chatId, `Ошибка при старте торрента: ${err.message}`);
            } else {
                transmission.get(parseInt(torrentId), (err, result) => {
                    if (err) {
                        bot.sendMessage(chatId, `Ошибка получения информации о торренте: ${err.message}`);
                    } else {
                        const torrent = result.torrents.find(t => t.id === parseInt(torrentId));
                        if (!torrent) {
                            bot.sendMessage(chatId, `Торрент не найден`);
                            return;
                        }
                        bot.sendMessage(chatId, `Торрент "${torrent.name}" запущен.`).then(sentMsg => {
                            setTimeout(() => {
                                bot.deleteMessage(chatId, sentMsg.message_id).catch(err => console.log(`Failed to delete message: ${err}`));
                                listCommand.handleTorrentInfo(bot, { chat: { id: chatId } }, transmission, torrentId, lastMessageId);
                            }, 1000);
                        });
                    }
                });
            }
        });
    } else if (command.startsWith('confirm_remove_')) {
        const torrentId = command.split('_')[2];
        console.log(`Confirming removal of torrent with ID: ${torrentId}`);
        removeCommand.handleRemoveTorrent(bot, msg, transmission, torrentId, lastMessageId);
    } else if (command.startsWith('completed_')) {
        const userId = msg.from.id;
        const torrentId = command.split('_')[1];
        if (lastMessageId[userId]) {
            bot.deleteMessage(userId, lastMessageId[userId]).catch(err => console.log(`Failed to delete message: ${err}`));
        }
        bot.getChat(userId).then(chat => {
            Object.values(lastMessageId).forEach(messageId => {
                bot.deleteMessage(chat.id, messageId).catch(err => console.log(`Failed to delete message: ${err}`));
            });
        }).finally(() => {
            startCommand.showMainMenu(bot, msg, lastMessageId);
        });
    } else if (command === 'cancel_remove') {
        bot.sendMessage(chatId, `Удаление торрента отменено.`);
        listCommand.handleListTorrents(bot, msg, transmission, lastMessageId);
    } else if (command === 'back_to_main') {
        bot.getChat(chatId).then(chat => {
            Object.values(lastMessageId).forEach(messageId => {
                bot.deleteMessage(chat.id, messageId).catch(err => console.log(`Failed to delete message: ${err}`));
            });
        }).finally(() => {
            startCommand.showMainMenu(bot, msg, lastMessageId);
        });
    } else if (command === 'list') {
        listCommand.handleListTorrents(bot, msg, transmission, lastMessageId);
    }
});

bot.onText(/magnet:\S+/, (msg, match) => {
    const torrentUrl = match[0];
    addUrlOrMagnet(bot, msg, [torrentUrl], lastMessageId);
    transmission.addUrl(torrentUrl, (err, result) => {
        if (result && result.id) {
            userMap[result.id] = msg.from.id; // Сохраняем ID пользователя для уведомлений
        }
    });
});

// Периодическая проверка состояния торрентов
setInterval(() => checkTorrents(bot, userMap, lastMessageId), 60000); // Проверка каждые 60 секунд

module.exports = bot;
