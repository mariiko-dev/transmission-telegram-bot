const transmission = require('../config/transmission');

module.exports = {
    addTorrent: (torrentUrl) => {
        return new Promise((resolve, reject) => {
            transmission.addUrl(torrentUrl, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    listTorrents: () => {
        return new Promise((resolve, reject) => {
            transmission.get((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.torrents);
                }
            });
        });
    }
};
