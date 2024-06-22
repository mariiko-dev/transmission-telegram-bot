const Transmission = require('transmission');
const transmission = new Transmission({
    host: process.env.TRANSMISSION_HOST || 'localhost',
    port: process.env.TRANSMISSION_PORT || 9091,
    username: process.env.TRANSMISSION_USERNAME || '',
    password: process.env.TRANSMISSION_PASSWORD || ''
});

const checkTorrents = (bot, userMap, lastMessageId) => {
    transmission.get((err, result) => {
        if (err) {
            console.error(`Error fetching torrents: ${err.message}`);
        } else {
            result.torrents.forEach(torrent => {
                if (torrent.percentDone === 1 && torrent.status !== 0) { // Если загрузка завершена и торрент не приостановлен
                    transmission.stop(torrent.id, (err) => {
                        if (err) {
                            console.error(`Error stopping torrent ${torrent.id}: ${err.message}`);
                        } else {
                            const userId = userMap[torrent.id];
                            if (!userId) {
                                console.error(`User ID not found for torrent ID ${torrent.id}`);
                                return;
                            }
                            const options = {
                                reply_markup: {
                                    inline_keyboard: [[{ text: "Отлично!", callback_data: `completed_${torrent.id}` }]]
                                }
                            };
                            bot.sendMessage(userId, `Торрент "${torrent.name}" успешно загружен и приостановлен.`, options)
                                .then(sentMsg => lastMessageId[userId] = sentMsg.message_id);
                        }
                    });
                }
            });
        }
    });
};

module.exports = {
    transmission,
    checkTorrents
};
