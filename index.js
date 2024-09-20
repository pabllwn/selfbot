const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const mySecret = process.env['TOKEN'];
const client = new Client();
let targetUserID = '804924780272549908';
let targetCommand = '!with all';
let isScriptRunning = true;
let targetChannels = [];
const controlChannelID = '804926311297712151';

app.get('/', (req, res) => { res.send('Bot is alive!'); });

function keepAlive() {
  app.listen(3000, () => { console.log('Server is running on port 3000'); });
}

keepAlive();

client.on("ready", () => { console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); });

client.on("messageCreate", message => {
  if (message.channel.id !== controlChannelID) return;

  if (message.content === '!startScript') {
    isScriptRunning = true;
    message.reply('تم تشغيل السكربت.');
  }

  if (message.content === '!stopScript') {
    isScriptRunning = false;
    message.reply('تم إيقاف السكربت مؤقتًا.');
  }

  if (message.content.startsWith('!setTargetID')) {
    const newID = message.content.split(' ')[1];
    if (!newID) {
      message.reply('يرجى تحديد ID صالح.');
    } else {
      targetUserID = newID;
      message.reply(`تم تغيير ID المستهدف إلى: ${newID}`);
    }
  }

  if (message.content.startsWith('!setTargetChannels')) {
    const newChannels = message.content.split(' ').slice(1);
    if (newChannels.length === 0) {
      message.reply('يرجى تحديد معرفات القنوات.');
    } else {
      targetChannels = newChannels;
      message.reply(`تم تعيين القنوات المستهدفة إلى: ${newChannels.join(', ')}`);
    }
  }

  if (message.content.startsWith('!addChannel')) {
    const newChannel = message.content.split(' ')[1];
    if (!newChannel) {
      message.reply('يرجى تحديد معرف صالح للقناة.');
    } else {
      targetChannels.push(newChannel);
      message.reply(`تمت إضافة القناة المستهدفة: ${newChannel}`);
    }
  }

  if (message.content.startsWith('!removeChannel')) {
    const removeChannel = message.content.split(' ')[1];
    if (!removeChannel) {
      message.reply('يرجى تحديد معرف صالح للقناة.');
    } else {
      targetChannels = targetChannels.filter(channelID => channelID !== removeChannel);
      message.reply(`تمت إزالة القناة المستهدفة: ${removeChannel}`);
    }
  }
});

client.on("messageCreate", message => {
  if (!isScriptRunning) return;
  if (message.author.id !== targetUserID) return;
  if (message.content !== targetCommand) return;

  targetChannels.forEach(channelID => {
    const channel = client.channels.cache.get(channelID);
    if (channel) {
      channel.send(`استجابة للكلمة المستهدفة من ${message.author.tag}: ${message.content}`);
    } else {
      console.log(`القناة بمعرف ${channelID} غير موجودة أو لا يمكنك الوصول إليها`);
    }
  });
});

client.login(mySecret);
