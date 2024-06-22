const removeCommand = require('./remove');

function getStatusText(status) {
    switch (status) {
        case 0: return 'Остановлен';
        case 1: return 'Ожидание проверки';
        case 2: return 'Проверка';
        case 3: return 'Ожидание загрузки';
        case 4: return 'Загрузка';
        case 5: return 'Ожидание раздачи';
        case 6: return 'Раздача';
        case 7: return 'Изолирован';
        default: return 'Неизвестный статус';
    }
}

const handleListTorrents = (bot, msg, transmission, lastMessageId) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    if (lastMessageId[chatId]) {
        bot.deleteMessage(chatId, lastMessageId[chatId]).catch(err => console.log(`Failed to delete message: ${err}`));
    }

    transmission.get((err, result) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка получения списка: ${err.message}`);
        } else {
            if (result.torrents.length === 0) {
                const options = {
                    reply_markup: {
                        inline_keyboard: [[{ text: "Назад", callback_data: 'back_to_main' }]]
                    }
                };
                bot.sendMessage(chatId, "Текущие торренты не найдены.", options)
                    .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
                return;
            }

            let keyboard = result.torrents.map((torrent) => {
                return [{ text: torrent.name, callback_data: `info_${torrent.id}` }];
            });

            keyboard.push([{ text: "Назад", callback_data: 'back_to_main' }]);

            const options = {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            };

            bot.sendMessage(chatId, "Текущие торренты:", options)
                .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
        }
    });
};

const handleTorrentInfo = (bot, msg, transmission, torrentId, lastMessageId) => {
    const chatId = msg.chat.id;

    if (lastMessageId[chatId]) {
        bot.deleteMessage(chatId, lastMessageId[chatId]).catch(err => console.log(`Failed to delete message: ${err}`));
    }

    transmission.get(parseInt(torrentId), (err, result) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка получения информации о торренте: ${err.message}`);
        } else {
            const torrent = result.torrents.find(t => t.id === parseInt(torrentId));
            if (!torrent) {
                bot.sendMessage(chatId, `Торрент не найден`);
                return;
            }

            const statusText = getStatusText(torrent.status);
            const message = `Название: ${torrent.name}\nСтатус: ${statusText}\nПрогресс: ${torrent.percentDone * 100}%`;

            let controlButtons = [];
            if (torrent.status === 4 || torrent.status === 6) {
                controlButtons.push({ text: "Пауза", callback_data: `pause_${torrent.id}` });
            } else {
                controlButtons.push({ text: "Старт", callback_data: `start_${torrent.id}` });
            }

            controlButtons.push({ text: "Удалить", callback_data: `confirm_remove_${torrent.id}` });
            controlButtons.push({ text: "Назад", callback_data: 'list' });

            const options = {
                reply_markup: {
                    inline_keyboard: [controlButtons]
                }
            };

            bot.sendMessage(chatId, message, options)
                .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
        }
    });
};

module.exports.handleTorrentInfo = handleTorrentInfo;
module.exports.handleListTorrents = handleListTorrents;
