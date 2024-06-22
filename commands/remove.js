const transmission = require('../transmission');
const listCommand = require('./list');
const startCommand = require('./start');

const handleConfirmRemove = (bot, msg, torrentId, lastMessageId) => {
    const chatId = msg.chat.id;

    transmission.get(parseInt(torrentId), (err, result) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка получения информации о торренте: ${err.message}`);
        } else {
            const torrent = result.torrents.find(t => t.id === parseInt(torrentId));
            if (!torrent) {
                bot.sendMessage(chatId, `Торрент не найден`);
                return;
            }

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Да, удалить", callback_data: `confirm_remove_${torrent.id}` }],
                        [{ text: "Нет, отмена", callback_data: `cancel_remove` }]
                    ]
                }
            };

            bot.sendMessage(chatId, `Вы действительно хотите удалить торрент "${torrent.name}"?`, options)
                .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
        }
    });
};

const handleRemoveTorrent = (bot, msg, transmission, torrentId, lastMessageId) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    transmission.get(parseInt(torrentId), (err, result) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка получения информации о торренте: ${err.message}`);
        } else {
            const torrent = result.torrents.find(t => t.id === parseInt(torrentId));
            if (!torrent) {
                bot.sendMessage(chatId, `Торрент не найден`);
                return;
            }

            transmission.remove(parseInt(torrentId), true, (err) => {
                if (err) {
                    bot.sendMessage(chatId, `Ошибка удаления торрента: ${err.message}`);
                } else {
                    if (lastMessageId[chatId]) {
                        bot.deleteMessage(chatId, lastMessageId[chatId]).catch(err => console.log(`Failed to delete message: ${err}`));
                    }

                    bot.sendMessage(chatId, `Торрент "${torrent.name}" удален.`)
                        .then(sentMsg => {
                            lastMessageId[chatId] = sentMsg.message_id;
                            setTimeout(() => {
                                bot.deleteMessage(chatId, sentMsg.message_id).catch(err => console.log(`Failed to delete message: ${err}`));
                                startCommand.showMainMenu(bot, { chat: { id: chatId }, from: { username: userId } }, lastMessageId);
                            }, 3000);
                        });
                }
            });
        }
    });
};

module.exports.handleConfirmRemove = handleConfirmRemove;
module.exports.handleRemoveTorrent = handleRemoveTorrent;
