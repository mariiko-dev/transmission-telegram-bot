module.exports = (bot, msg, match, transmission) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;
    const torrentId = parseInt(match[1]);

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    transmission.remove(torrentId, true, (err) => {
        if (err) {
            bot.sendMessage(chatId, `Ошибка удаления торрента: ${err.message}`);
        } else {
            bot.sendMessage(chatId, `Торрент с ID ${torrentId} удален.`);
        }
    });
};
