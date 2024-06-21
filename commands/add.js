const fs = require('fs');
const path = require('path');

const addUrlOrMagnet = (bot, msg, match, transmission) => {
    const url = match[1];
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    if (url.startsWith('magnet:') || url.startsWith('http')) {
        transmission.addUrl(url, (err, result) => {
            if (err) {
                bot.sendMessage(chatId, `Ошибка добавления торрента: ${err.message}`);
            } else {
                bot.sendMessage(chatId, `Торрент добавлен! ID: ${result.id}`);
            }
        });
    } else {
        bot.sendMessage(chatId, `Неверная ссылка. Пожалуйста, предоставьте действительный magnet-ссылку или URL.`);
    }
};

const handleDocument = (bot, msg, transmission) => {
    const fileId = msg.document.file_id;
    const chatId = msg.chat.id;
    const userId = msg.from.username;

    const whitelistedUsers = process.env.WHITELISTED_USERS.split(',');

    if (!whitelistedUsers.includes(userId)) {
        bot.sendMessage(chatId, "Извините, вы не имеете доступа к этому боту.");
        return;
    }

    bot.getFileLink(fileId).then((fileLink) => {
        const filePath = path.join(__dirname, '..', 'downloads', msg.document.file_name);
        const fileStream = fs.createWriteStream(filePath);

        bot.downloadFile(fileId, filePath).then(() => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    bot.sendMessage(chatId, `Ошибка чтения файла: ${err.message}`);
                } else {
                    transmission.addBase64(data.toString('base64'), { filename: msg.document.file_name }, (err, result) => {
                        if (err) {
                            bot.sendMessage(chatId, `Ошибка добавления торрента: ${err.message}`);
                        } else {
                            bot.sendMessage(chatId, `Торрент добавлен! ID: ${result.id}`);
                        }
                    });
                }
                fs.unlinkSync(filePath);
            });
        }).catch((err) => {
            bot.sendMessage(chatId, `Ошибка загрузки файла: ${err.message}`);
        });
    });
};

module.exports = addUrlOrMagnet;
module.exports.handleDocument = handleDocument;
