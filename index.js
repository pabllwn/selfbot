const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); 
});

client.on("messageCreate", message => {
    if (message.author.id !== '804924780272549908') return;
    if (flag) return;

    const channel = client.channels.cache.get('1276712128505446493'); // chat ROB
    const channel1 = client.channels.cache.get('1276712128505446493'); // chat FIN TATl3b

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!cf')) {
        // استخراج الرقم بعد "!with"
        const number = command.match(/\d+e\d+/) || command.match(/all/);
        if (number && (parseFloat(number[0]) >= 199e15 || number[0] === 'all')) {
            flag = true;

            // إضافة تأخير عشوائي بين 0.5 و 1.5 ثانية
            const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;  // تأخير عشوائي بين 0.5 و 1.5 ثانية

            setTimeout(() => {
                // إرسال الأوامر بالترتيب باستخدام سلاسل الـ .then
                channel.send('!dep all')
                    .then(() => {
                        console.log('تم إرسال أمر !rob');
                        return new Promise(resolve => setTimeout(resolve, 2000));  // الانتظار 2 ثانية
                    })
                    .then(() => {
                        return channel1.send('!dep all').then(() => {
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
                    })
                    .then(() => {
                        // تأخير ثم إنهاء البرنامج
                        setTimeout(() => {
                            console.log('سيتم إيقاف السكريبت الآن.');
                            // تأخير 4.5 ثانية لضمان إرسال الأوامر
                    })
                    .catch(console.error);
            }, randomDelay);  // التأخير العشوائي
        }
    }
});

client.login(mySecret).catch(console.error);
