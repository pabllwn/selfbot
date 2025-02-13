const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

let executed = false; // علم لتحديد إذا تم تنفيذ الأمر مرة واحدة
const defaultNumber = "10e12"; // الرقم الافتراضي الذي يمكن تغييره بسهولة

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1291074783353634887') return; // التأكد أن المرسل هو المستخدم المحدد
    if (executed) return; // التحقق من عدم تنفيذ الأمر مسبقًا

    const channel = client.channels.cache.get('1328057993085976659'); // chat ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // chat FIN TATl3b  

    // إزالة الفراغات والشرطات من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // التأكد من أن الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        const numberMatch = command.match(/^\!with (\d+e\d+|\d{13,}|all)$/); // قبول الصيغة العلمية، الأرقام ذات 13 خانة فأكثر، أو "all"

        if (numberMatch || command === "!with") {
            const inputNumber = numberMatch ? numberMatch[1] : defaultNumber; // استخدام الرقم من الرسالة أو الرقم الافتراضي
            const parsedNumber = inputNumber.includes('e') ? Number(inputNumber) : Number(inputNumber); // تحويل الصيغة العلمية إلى رقم

            executed = true; // تعيين العلم لمنع إعادة تنفيذ الأمر

            // التحقق إذا كان الرقم >= الرقم الافتراضي أو إذا كانت القيمة "all"
            if (parsedNumber >= Number(defaultNumber) || inputNumber === "all") {
                channel.send('!rob 1291074783353634887')
                    .then(() => {
                        console.log('تم إرسال أمر rob');
                        return channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy(); // إيقاف البوت بعد التنفيذ
                        console.log('تم إيقاف البوت.');
                    });
            } else {
                // إذا كان الرقم أقل من الرقم الافتراضي
                channel.send(`!with ${parsedNumber}`)
                    .then(() => {
                        console.log(`تم إرسال أمر !with ${parsedNumber}`);
                        return channel1.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all الأول');
                        return channel1.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال أمر !dep all الثاني');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy(); // إيقاف البوت بعد التنفيذ
                        console.log('تم إيقاف البوت.');
                    });
            }
        } else {
            console.log('الأمر غير صحيح: يجب إدخال رقم بصيغة علمية، رقم كامل من 13 خانة فأكثر، أو كلمة "all".');
        }
    }
});

client.login(mySecret).catch(console.error);
