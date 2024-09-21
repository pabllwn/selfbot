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
    if (command.startsWith('!with')) {
        const number = command.match(/\d+e\d+/) || command.match(/all/);

        if (number && (parseFloat(number[0]) >= 199e15 || number[0] === 'all')) {
            flag = true;

            // إضافة تأخير عشوائي بين 0.5 و 1.5 ثانية
            const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500; // تأخير عشوائي بين 0.5 و 1.5 ثانية

            setTimeout(() => {
                // If "all" is detected, send "!cf all" and "!dep all" in sequence
                if (number[0] === 'all') {
                    channel.send('!cf all')
                        .then(() => {
                            console.log('تم إرسال أمر !cf all');
                            return new Promise(resolve => setTimeout(resolve, 1000)); // الانتظار 1 ثانية
                        })
                        .then(() => {
                            return channel.send('!dep all').then(() => {
                                console.log('تم إرسال أمر !dep all');
                            });
                        })
                        .catch(console.error);
                } else {
                    // For non-"all" numbers, send "!dep all" as usual
                    channel.send(`!with ${number[0]}`)
                        .then(() => {
                            console.log(`تم إرسال أمر !with ${number[0]}`);
                            return new Promise(resolve => setTimeout(resolve, 2000)); // الانتظار 2 ثانية
                        })
                        .then(() => {
                            return channel1.send('!dep all').then(() => {
                                console.log('تم إرسال أمر !dep all الأول');
                            });
                        })
                        .then(() => new Promise(resolve => setTimeout(resolve, 1500))) // الانتظار 1.5 ثانية
                        .then(() => {
                            return channel1.send('!dep all').then(() => {
                                console.log('تم إرسال أمر !dep all الثاني');
                            });
                        })
                        .then(() => new Promise(resolve => setTimeout(resolve, 1000))) // الانتظار 1 ثانية
                        .then(() => {
                            return channel1.send('!').then(() => {
                                console.log('تم إرسال أمر !dep all الثالث');
                            });
                        })
                        .catch(console.error);
                }
            }, randomDelay);
        }
    }
});

client.login(mySecret).catch(console.error);
