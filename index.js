const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1291074783353634887') return; // التأكد أن المرسل هو المستخدم المطلوب
    if (flag) return; // منع التكرار أثناء التنفيذ

    const channel = client.channels.cache.get('1328057993085976659'); // chat ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // chat FIN TATl3b  

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        const number = command.match(/\d+/) || command.match(/all/); // التعرف على أي رقم أو "all"

        if (number) { // التأكد من وجود رقم أو "all"
            flag = true;

            // إرسال الأوامر مباشرة دون تأخير
            if (number[0] === 'all') {
                channel.send('!rob 1291074783353634887')
                    .then(() => {
                        console.log('تم إرسال أمر rob');
                        return channel.send('!dep all'); // إرسال أمر !dep all بعد أمر rob
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all');
                    })
                    .catch(console.error)
                    .finally(() => {
                        flag = false; // إعادة تعيين العلم للسماح بتنفيذ أوامر جديدة
                    });
            } else {
                channel.send(`!with ${number[0]}`)
                    .then(() => {
                        console.log(`تم إرسال أمر !with ${number[0]}`);
                        return channel1.send('!dep all'); // إرسال أمر !dep all في القناة الأخرى
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all الأول');
                        return channel1.send('!dep all'); // إرسال أمر !dep all مرة أخرى
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all الثاني');
                    })
                    .catch(console.error)
                    .finally(() => {
                        flag = false; // إعادة تعيين العلم للسماح بتنفيذ أوامر جديدة
                    });
            }
        }
    }
});

client.login(mySecret).catch(console.error);
