const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const mySecret = process.env['TOKEN'];
const client = new Client();
let targetUserID = ''; // تبقى فارغة لتحديدها يدويًا
let targetCommand = '!with all';
let isScriptRunning = false; // السكربت متوقف بشكل افتراضي
const controlChannelID = '804926311297712151'; // شات التحكم ثابت
const responseChannelID = '1047751275665698867'; // شات الردود ثابت

app.get('/', (req, res) => { res.send('Bot is alive!'); });

function keepAlive() {
  app.listen(3000, () => { console.log('Server is running on port 3000'); });
}

keepAlive();

client.on("ready", () => { console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); });

client.on("messageCreate", message => {
  if (message.channel.id === controlChannelID) {
    if (message.content === '!start') {
      isScriptRunning = true;
      message.reply('تم تشغيل السكربت.');
    }

    if (message.content.startsWith('!id')) {
      const newID = message.content.split(' ')[1];
      if (!newID) {
        message.reply('يرجى تحديد ID صالح.');
      } else {
        targetUserID = newID;
        message.reply(`تم تغيير ID المستهدف إلى: ${newID}`);
      }
    }
  }
});

client.on("messageCreate", async message => {
  if (!isScriptRunning) return;
  if (message.channel.id !== controlChannelID) return; // تنفيذ الأوامر فقط في قناة التحكم
  if (message.author.id !== targetUserID) return;
  if (message.content !== targetCommand) return;

  // 1. إرسال الأمر !rob مع ID المستهدف بعد نصف ثانية
  setTimeout(() => {
    message.channel.send(`!rob ${targetUserID}`);
  }, 500);

  // 2. إرسال الأمر !dep all بعد نصف ثانية أخرى
  setTimeout(() => {
    message.channel.send('!dep all');
  }, 1000);

  // 3. إعلام قناة الردود بأن الأوامر قد تم تنفيذها
  const responseChannel = client.channels.cache.get(responseChannelID);
  if (responseChannel) {
    responseChannel.send('تم إرسال الأوامر بنجاح.');
  }

  // 4. إيقاف السكربت حتى يتم إرسال !start مرة أخرى
  isScriptRunning = false;
});

client.login(mySecret);
