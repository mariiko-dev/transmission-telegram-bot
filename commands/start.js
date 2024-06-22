module.exports.showMainMenu = (bot, msg, lastMessageId) => {
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Добавить торрент", callback_data: 'add' }],
                [{ text: "Список торрентов", callback_data: 'list' }]
            ]
        }
    };

    if (lastMessageId[chatId]) {
        bot.deleteMessage(chatId, lastMessageId[chatId]).catch(err => console.log(`Failed to delete message: ${err}`));
    }

    bot.sendMessage(chatId, `Привет! Что вы хотите сделать?`, options)
        .then(sentMsg => lastMessageId[chatId] = sentMsg.message_id);
};
