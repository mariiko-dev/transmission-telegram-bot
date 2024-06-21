module.exports = (bot, msg, transmission) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    transmission.get((err, result) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка получения списка: ${err.message}`);
        } else {
            let message = 'Текущие торренты:\n';
            result.torrents.forEach((torrent) => {
                message += `ID: ${torrent.id}, Название: ${torrent.name}, Состояние: ${torrent.status}\n`;
            });
            bot.sendMessage(chatId, message);
        }
    });
};
