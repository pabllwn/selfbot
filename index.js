const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); 
});

client.on("messageCreate", message => {
    if (message.author.id !== '1226279773534425169') return;
    if (flag) return;

    const channel = client.channels.cache.get('1037831299592880209'); // chat ROB
    const channel1 = client.channels.cache.get('1037831299592880209'); // chat FIN TATl3b

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        const number = command.match(/\d+e\d+/) || command.match(/all/);
        if (number && (parseFloat(number[0]) >= 2e9 || number[0] === 'all')) {
            flag = true;

            const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500; // تأخير عشوائي بين 0.5 و 1.5 ثانية

            setTimeout(() => {
                // إرسال الأوامر بالترتيب باستخدام سلاسل الـ .then
                channel.send('!rob 1226279773534425169')
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
                        return channel1.send('!work').then(() => {
                            console.log('تم إرسال أمر !dep all الثالث');
                        });
                    });
            }, randomDelay);
        }
    }
});

client.login(mySecret).catch(console.error);
