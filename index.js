
const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();

// متغيرات البيئة
const mySecret = process.env['TOKEN'];
const client = new Client();
const targetRoleId = '1037824518011494490'; // معرف الرتبة المستهدفة
const responseMessage = 'KATL3B PES ?? DOZ NWSS333KKK TZZZ';

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
    // التحقق من إذا كان المرسل يحمل الرتبة المحددة
    if (message.member.roles.cache.has(targetRoleId)) {
        try {
            // الرد على الرسالة في نفس القناة
            await message.channel.send(`${message.author}, ${responseMessage}`);
            console.log(`Responded to ${message.author.tag}`);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error); 
