module.exports = (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    bot.sendMessage(chatId, "Привет! Я бот для управления Transmission. Вот доступные команды:\n" +
        "/add <url или magnet-ссылка> - добавить торрент\n" +
        "Просто отправьте файл торрента, чтобы добавить его.\n" +
        "/list - список текущих торрент-загрузок\n" +
        "/remove <id> - удалить торрент по ID");
};
