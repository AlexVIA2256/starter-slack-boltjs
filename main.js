const mineflayer = require('mineflayer');
const { Telegraf } = require('telegraf');
const {TGtok, Port, IP, GlavBOT} = require ('./config.json');
const clickmenu = require ('./ClickMenu/ClickMenu');
const diggingUtils = require('./Digging');

let dig = false;

// Создание бота Telegram
const telegramBot = new Telegraf(TGtok);

// Функция для подключения к серверу Minecraft
const connectToMinecraft = async (ctx, username) => {
  if (!username) {
    ctx.reply('Пожалуйста, укажите ник для подключения к серверу Minecraft.');
    return;
  }
  
  try {
    const bot = mineflayer.createBot({
      host: IP,
      port: Port,
      username: username
    });

    bot.on('message', (message) => {
      if (bot.username!== GlavBOT) return;
      console.log(message.toAnsi());
      ctx.reply(`${message}`);
    });

    bot.on('spawn', () => {
      clickmenu(bot);
      if (!dig) {
        diggingUtils.setIsDigging(true);
        diggingUtils.dig(bot);
        ctx.reply("Начал копать!");
        dig = true;
      }
    });

    ctx.reply(`Бот с ником ${username} успешно подключен к серверу Minecraft.`);
  } catch (error) {
    console.error('Ошибка при подключении к серверу Minecraft:', error);
    ctx.reply('Произошла ошибка при подключении к серверу Minecraft.', error);
  }
};

// Обработка сообщений от Telegram
telegramBot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/зайти')) {
    dig = false;
    const username = ctx.message.text.split(' ')[1]; // Получаем ник из сообщения
    await connectToMinecraft(ctx, username);
  }
});

// Запуск бота Telegram
telegramBot.launch();