const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const mySecret = process.env['TOKEN']; 
const client = new Client();

// متغيرات للتحكم
let targetUserID = '804924780272549908';  // ID الشخص المستهدف
let targetCommand = '!with';  // الكلمة المستهدفة
let isScriptRunning = true;  // لمعرفة ما إذا كان السكربت قيد التشغيل أم متوقف
const controlChannelID = '804926311297712151'; // قناة التحكم

// 1. إضافة خاصية keep alive
app.get('/', (req, res) => {
    res.send('Bot is alive!');
});

function keepAlive() {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

keepAlive();

// 2. عند تشغيل البوت
client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); 
});

// 3. التحكم عن بعد من خلال الشات المخصص
client.on("messageCreate", message => {
    // إذا لم يكن في قناة التحكم، تجاهل الأمر
    if (message.channel.id !== controlChannelID) return;

    // التحقق إن كان المستخدم هو الأدمن أو له صلاحيات خاصة
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    // الأمر لتشغيل السكربت
    if (message.content === '!startScript') {
        isScriptRunning = true;
        message.reply('تم تشغيل السكربت.');
    }

    // الأمر لإيقاف السكربت مؤقتًا
    if (message.content === '!stopScript') {
        isScriptRunning = false;
        message.reply('تم إيقاف السكربت مؤقتًا.');
    }

    // الأمر لتغيير ID المستهدف
    if (message.content.startsWith('!setTargetID')) {
        const newID = message.content.split(' ')[1]; // أخذ ID الجديد
        if (!newID) {
            message.reply('يرجى تحديد ID صالح.');
        } else {
            targetUserID = newID;
            message.reply(`تم تغيير ID المستهدف إلى: ${newID}`);
        }
    }

    // الأمر لتغيير الكلمة المستهدفة
    if (message.content.startsWith('!setTargetCommand')) {
        const newCommand = message.content.split(' ')[1]; // أخذ الكلمة الجديدة
        if (!newCommand) {
            message.reply('يرجى تحديد كلمة جديدة.');
        } else {
            targetCommand = newCommand;
            message.reply(`تم تغيير الكلمة المستهدفة إلى: ${newCommand}`);
        }
    }
});

// 4. السكربت الرئيسي - ينفذ فقط إذا كان السكربت قيد التشغيل
client.on("messageCreate", message => {
    if (!isScriptRunning) return;  // إذا كان السكربت متوقفًا مؤقتًا، لا يتم تنفيذ أي شيء
    if (message.author.id !== targetUserID) return;

    const channel = client.channels.cache.get('1276712128505446493'); // chat ROB
    const channel1 = client.channels.cache.get('1276712128505446493'); // chat FIN TATl3b

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ targetCommand
    if (command.startsWith(targetCommand)) {
        const number = command.match(/\d+e\d+/) || command.match(/all/);
        if (number && (parseFloat(number[0]) >= 199e15 || number[0] === 'all')) {
            const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500; // تأخير عشوائي بين 0.5 و 1.5 ثانية

            setTimeout(() => {
                // إرسال الأوامر بالترتيب باستخدام سلاسل الـ .then
                channel.send('!cf all')
                    .then(() => {
                        console.log('تم إرسال أمر !cf all');
                        return new Promise(resolve => setTimeout(resolve, randomDelay)); // الانتظار التأخير العشوائي
                    })
                    .then(() => {
                        return channel.send('!dep all').then(() => {
                            console.log('تم إرسال أمر !dep all الأول');
                        });
                    })
                    .then(() => new Promise(resolve => setTimeout(resolve, 1500)))  // الانتظار 1.5 ثانية
                    .then(() => {
                        return channel1.send('!dep all').then(() => {
                            console.log('تم إرسال أمر !dep all الثاني');
                        });
                    })
                    .then(() => new Promise(resolve => setTimeout(resolve, 1000)))  // الانتظار 1 ثانية
                    .then(() => {
                        return channel1.send('!').then(() => {
                            console.log('تم إرسال أمر !dep all الثالث');
                        });
                    });
            }, randomDelay);
        }
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
