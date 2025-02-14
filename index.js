const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

let executed = false; 
const defaultNumber = "10e12"; // الحد الأدنى المسموح
const targetIds = ['1291074783353634887', '1329835932878245939']; // إضافة اثنين من المعرفات المستهدفة

client.on("ready", () => {
    console.log(`Your account name: ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (executed) return; // منع التكرار

    // إذا لم يكن المستخدم أحد المعرفات المستهدفة، لا يتم الرد
    if (!targetIds.includes(message.author.id)) return;

    const channel = client.channels.cache.get('1328057993085976659'); // ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // FIN  

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // إذا كان الأمر هو !with
    if (command.startsWith('!with')) {
        // التحقق من الرقم أو "all"
        const numberMatch = command.match(/^\!with (\d+e\d+|all)$/); // يقبل فقط صيغة الأسس أو all

        if (numberMatch) {
            const input = numberMatch[1];
            
            // إذا كان الرقم هو "all"، يتم إرسال !dep all مباشرة
            if (input === 'all') {
                executed = true;
                channel.send('!rob ' + message.author.id)  // إرسال !rob مع معرف المرسل
                    .then(() => {
                        console.log('تم إرسال الأمر !rob');
                        return channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال الأمر !dep all');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy(); // إيقاف البوت
                        console.log('تم إيقاف البوت.');
                    });
                return;
            }

            // إذا كان الرقم أكبر من أو يساوي 5e12
            const parsedNumber = parseFloat(input); // تحويل الرقم من صيغة الأسس إلى قيمة عددية
            const minNumber = parseFloat(defaultNumber); // تحويل الحد الأدنى للرقم

            executed = true;

            if (parsedNumber >= minNumber) {
                channel.send(`!rob ${message.author.id}`)  // إرسال !rob مع معرف المرسل
                    .then(() => {
                        console.log(`تم إرسال الأمر !rob ${message.author.id}`);
                        return channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال الأمر !dep all');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy(); // إيقاف البوت
                        console.log('تم إيقاف البوت.');
                    });
            } else {
                console.log(`⚠️ الرقم المدخل (${input}) أقل من الحد المسموح به (${defaultNumber}).`);
            }
        } else {
            console.log('صيغة الرقم غير صحيحة. استخدم صيغة مثل 5e12 أو all.');
        }
    }
});

client.login(mySecret).catch(console.error);
