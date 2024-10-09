const { Client, MessageEmbed } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();

// متغيرات البيئة
const mySecret = process.env['TOKEN'];
const client = new Client();
const targetRoleId = '1037824518011494490'; // معرف الرتبة المستهدفة
const responseMessage = 'KATL3B PES ?? DOZ NWSS333KKK TZZZ';
const privateMessage = 'SMA7 LIYA AW9 MSG BZFF';

// مجموعة لتخزين معرفات المستخدمين الذين تم الرد عليهم
const respondedUsers = new Set();

// إعداد keep alive
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

function keepAlive() {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

keepAlive();

// عند تسجيل الدخول بنجاح
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  // التحقق من إذا كان المرسل يحمل الرتبة المحددة ولا يكون المستخدم هو البوت نفسه
  if (message.member.roles.cache.has(targetRoleId) && message.author.id !== client.user.id) {
    // التحقق من إذا كان قد تم الرد على المستخدم من قبل
    if (!respondedUsers.has(message.author.id)) {
      try {
        // إنشاء Embed أكثر احترافية
        const embed = new MessageEmbed()
          .setTitle(' ⚠️')
          .setDescription(responseMessage)
          .setColor('#ff0000')
          .setFooter('ZAP ZAP  ')
          .setTimestamp();

        // الرد على الرسالة في نفس القناة باستخدام إمبيد
        await message.channel.send({ embeds: [embed] });
        console.log(`Responded to ${message.author.tag} with an embed message`);

        // إرسال رسالة خاصة للمستخدم
        await message.author.send(privateMessage);
        console.log(`Sent private message to ${message.author.tag}`);

        // إضافة المستخدم إلى المجموعة لمنع الرد عليه مجددًا
        respondedUsers.add(message.author.id);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      console.log(`Already responded to ${message.author.tag}, skipping.`);
    }
  }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
