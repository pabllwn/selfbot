const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

// متغيرات للتحكم
const targetRoleId = '1037824518011494490'; // معرف الرتبة المستهدفة
const responseMessage = 'KATL3B PES ?? DOZ NWSS333KKK TZZZ';

// عند تسجيل الدخول بنجاح
client.on("ready", () => {
    console.log(Logged in as ${client.user.tag});
});

client.on("messageCreate", async message => {
    // التحقق من إذا كان المرسل يحمل الرتبة المحددة
    if (message.member.roles.cache.has(targetRoleId)) {
        try {
            // الرد على الرسالة في نفس القناة
            await message.channel.send(${message.author}, ${responseMessage});
            console.log(Responded to ${message.author.tag});
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
