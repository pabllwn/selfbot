const { Client } = require('discord.js-selfbot-v13'); const mySecret = process.env['TOKEN']; const client = new Client({ checkUpdate: false });

const targetIDs = ['1329835932878245939', '1291074783353634887']; // استبدل ID1 و ID2 بالأيدي المستهدفة

const chat1 = '1339298478182105088'; const chat2 = '1328057993085976659'; const chat3 = '1328057861590220841';

const requiredNumber = "20e12";

let executed = false; // علم لمنع التنفيذ المتكرر

client.on("ready", () => { console.log(تم تسجيل الدخول باسم ${client.user.tag}); });

client.on("messageCreate", message => { if (executed) return; // إذا تم التنفيذ مسبقًا، تجاهل

// التحقق من أن المرسل أحد الأيدي المستهدفة
if (!targetIDs.includes(message.author.id)) return;

// إزالة الفراغات وتحويل الأمر إلى حروف صغيرة
const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

// التأكد من أن الأمر يبدأ بـ "!with"
if (command.startsWith('!with')) {
    const numberMatch = command.match(/^!with\s*(\d+e\d+|\d{13,}|all)$/); // التحقق من الرقم أو "all"

    if (numberMatch) {
        const inputNumber = numberMatch[1];
        const parsedNumber = inputNumber === 'all' ? Number.MAX_SAFE_INTEGER : (inputNumber.includes('e') ? Number(inputNumber) : parseInt(inputNumber, 10));

        if (parsedNumber >= Number(requiredNumber)) {
            executed = true; // منع التنفيذ مرة أخرى

            // تحديد الشات للرد بـ !rob
            const robChannel = message.channel.id === chat1 ? chat2 : chat1;

            // إرسال الأوامر
            client.channels.cache.get(robChannel).send(`!rob ${message.author.id}`)
                .then(() => {
                    console.log(`تم إرسال أمر !rob إلى الشات ${robChannel}`);
                    return client.channels.cache.get(chat1).send('!dep all');
                })
                .then(() => {
                    console.log('تم إرسال أمر !dep all الأول في الشات 1');
                    return new Promise(resolve => setTimeout(resolve, 1000)); // انتظار 1 ثانية
                })
                .then(() => {
                    return client.channels.cache.get(chat2).send('!dep all');
                })
                .then(() => {
                    console.log('تم إرسال أمر !dep all الثاني في الشات 2');
                    return new Promise(resolve => setTimeout(resolve, 2000)); // انتظار 2 ثانية
                })
                .then(() => {
                    return client.channels.cache.get(chat3).send('!dep all');
                })
                .then(() => {
                    console.log('تم إرسال أمر !dep all الثالث في الشات 3');
                    client.destroy(); // إيقاف البوت
                    console.log('تم إيقاف البوت.');
                })
                .catch(console.error);
        } else {
            console.log(`الرقم أقل من ${requiredNumber}. تم تجاهل الأمر.`);
        }
    } else {
        console.log('الأمر غير صحيح: يجب إدخال رقم بصيغة صحيحة أو "all".');
    }
}

});

client.login(mySecret).catch(console.error);

