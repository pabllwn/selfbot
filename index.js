const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1204050958494076989') return; // التأكد من المستخدم المصرح له
    if (flag) return; // منع التكرار أثناء التنفيذ

    const channel = client.channels.cache.get('1339298478182105088'); // chat ROB
    const channel1 = client.channels.cache.get('1328057861590220841'); // chat FIN TATl3b

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        const number = command.match(/\d+e\d+/) || command.match(/all/); // استخراج الرقم أو "all"

        if (number) {
            const isAll = number[0] === 'all'; // التحقق إذا كان "all"
            const isAboveLimit = !isAll && parseFloat(number[0]) >= 30e21; // التحقق إذا كان الرقم أكبر من 600e15

            if (isAll || isAboveLimit) {
                flag = true;

                // إضافة تأخير عشوائي بين 0.5 و 1.5 ثانية
                const randomDelay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;

                setTimeout(() => {
                    // إرسال الأمر !rob دائمًا إذا تطابق الشرط
                    channel.send('!rob 1204050958494076989')
                        .then(() => {
                            console.log('تم إرسال أمر !rob');
                            return new Promise(resolve => setTimeout(resolve, 1000)); // الانتظار 1 ثانية
                        })
                        .then(() => {
                            if (isAll) {
                                // إذا كان "all"، تنفيذ أوامر "all"
                                return channel.send('!dep all').then(() => {
                                    console.log('تم إرسال أمر !dep all');
                                });
                            } else {
                                // إذا كان الرقم أكبر من 600e15
                                return channel.send(`!dep All`) // تعديل هنا
                                    .then(() => {
                                        console.log('تم إرسال أمر !dep All');
                                        return new Promise(resolve => setTimeout(resolve, 2000)); // الانتظار 2 ثانية
                                    })
                                    .then(() => {
                                        return channel1.send('!dep all').then(() => {
                                            console.log('تم إرسال أمر !dep all الأول');
                                        });
                                    })
                                    .then(() => new Promise(resolve => setTimeout(resolve, 1500))) // الانتظار 1.5 ثانية
                                    .then(() => {
                                        return channel1.send('!buy k').then(() => {
                                            console.log('تم إرسال أمر !buy k');
                                        });
                                    })
                                    .then(() => new Promise(resolve => setTimeout(resolve, 1000))) // الانتظار 1 ثانية
                                    .then(() => {
                                        return channel1.send('!with 5e6').then(() => {
                                            console.log('تم إرسال أمر !with 5e6');
                                        });
                                    });
                            }
                        })
                        .catch(console.error);
                }, randomDelay);
            }
        }
    }
});

client.login(mySecret).catch(console.error);
