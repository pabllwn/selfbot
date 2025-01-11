const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// عند تشغيل البوت
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// الاستماع إلى الرسائل
client.on("messageCreate", (message) => {
    // التحقق إذا كانت الرسالة من المستخدم المحدد وفي القناة المحددة
    if (watchedUsers.includes(message.author.id) && message.channel.id === watchedChannel) {
        // إرسال نفس الرسالة
        message.channel.send(message.content).catch(console.error);
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
