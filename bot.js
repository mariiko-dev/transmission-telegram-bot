require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { transmission } = require('./transmission');
const startCommand = require('./commands/start');
const addCommand = require('./commands/add');
const listCommand = require('./commands/list');
const removeCommand = require('./commands/remove');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => startCommand(bot, msg));
bot.onText(/\/add (.+)/, (msg, match) => addCommand(bot, msg, match, transmission));
bot.onText(/\/list/, (msg) => listCommand(bot, msg, transmission));
bot.onText(/\/remove (\d+)/, (msg, match) => removeCommand(bot, msg, match, transmission));
bot.on('document', (msg) => addCommand.handleDocument(bot, msg, transmission));
