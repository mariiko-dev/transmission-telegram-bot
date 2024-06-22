const { transmission } = require('../transmission');
const startCommand = require('./start');

const addUrlOrMagnet = (bot, msg, match, lastMessageId) => {
    const url = match[0];
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

    if (url.startsWith('magnet:') || url.startsWith('http')) {
        transmission.addUrl(url, (err, result) => {
            if (err) {
                bot.sendMessage(chatId, `Ошибка добавления торрента: ${err.message}`);
            } else {
                const torrentName = result.name;
                bot.sendMessage(chatId, `Торрент добавлен: ${torrentName}`)
                    .then(sentMsg => {
                        lastMessageId[chatId] = sentMsg.message_id;
                        bot.deleteMessage(chatId, msg.message_id).catch(err => console.log(`Failed to delete message: ${err}`));
                        setTimeout(() => {
                            bot.deleteMessage(chatId, sentMsg.message_id).catch(err => console.log(`Failed to delete message: ${err}`));
                            startCommand.showMainMenu(bot, { chat: { id: chatId }, from: { username: userId } }, lastMessageId);
                        }, 3000);
                    });
            }
        });
    } else {
        bot.sendMessage(chatId, `Неверная ссылка. Пожалуйста, предоставьте действительную magnet-ссылку или URL.`);
    }
};

const handleAddTorrent = (bot, msg, lastMessageId) => {
    const chatId = msg.chat.id;

    if (lastMessageId[chatId]) {
        bot.deleteMessage(chatId, lastMessageId[chatId]).catch(err => console.log(`Failed to delete message: ${err}`));
    }

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Назад", callback_data: 'back_to_main' }]
            ]
        }
    };

    bot.sendMessage(chatId, "Отправьте в чат магнит-ссылку.", options)
        .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
};

module.exports = {
    addUrlOrMagnet,
    handleAddTorrent
};
