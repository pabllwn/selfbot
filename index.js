const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`); 
});

client.on("messageCreate", message => {
    if (message.author.id !== '827994592980893756') return;
    if (flag) return;

    const channel = client.channels.cache.get('1037831289585291264'); // chat ROB
    const channel1 = client.channels.cache.get('1037831299592880209'); // chat FIN TATl3b

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        // استخراج الرقم بعد "!with"
        const number = command.match(/\d+e\d+/) || command.match(/all/);
        if (number && (parseFloat(number[0]) >= 350e15 || number[0] === 'all')) {
            flag = true;

            // إرسال الأوامر بالترتيب باستخدام سلاسل الـ .then
            channel.send('!rob 827994592980893756')
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
                    return channel1.send('!rr all').then(() => {
                        console.log('تم إرسال أمر !dep all الثالث');
                    });
                })
                .then(() => {
                    // تأخير ثم إنهاء البرنامج
                    setTimeout(() => {
                        console.log('سيتم إيقاف السكريبت الآن.');
                        process.exit();
                    }, 4500);  // تأخير 4.5 ثانية لضمان إرسال الأوامر
                })
                .catch(console.error);
        }
    }
});

client.login(mySecret).catch(console.error);
