const { Client, MessageEmbed } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();

// متغيرات البيئة
const mySecret = process.env['TOKEN'];
const client = new Client();
const targetRoleId = '1037824518011494490'; // معرف الرتبة المستهدفة
const responseMessage = 'KATL3B PES ?? DOZ NWSS333KKK TZZZ';
const privateMessage = 'SMA7 LIYA AW9 MSG BZFF';
const myUserId = '804924780272549908'; // ضع معرف مستخدمك هنا

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
  // التحقق من إذا كان المرسل يحمل الرتبة المحددة ولا يكون المستخدم المحدد هو أنت
  if (message.member.roles.cache.has(targetRoleId) && message.author.id !== myUserId) {
    try {
      // الرد على الرسالة في نفس القناة باستخدام إمبيد
      const embed = new MessageEmbed()
        .setTitle('تنبيه')
        .setDescription(responseMessage)
        .setColor('#ff0000');

      await message.channel.send({ embeds: [embed] });
      console.log(`Responded to ${message.author.tag} with an embed message`);

      // إرسال رسالة خاصة للمستخدم
      await message.author.send(privateMessage);
      console.log(`Sent private message to ${message.author.tag}`);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error); 
