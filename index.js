const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

let executed = false; 
const defaultNumber = "10e12"; // الرقم الافتراضي

client.on("ready", () => {
    console.log(`your name acc ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1329835932878245939') return; 
    if (executed) return; 

    const channel = client.channels.cache.get('1328057993085976659'); // ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // FIN  

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    if (command.startsWith('!with')) {
        const numberMatch = command.match(/^\!with (\d+e\d+)$/); // يقبل فقط صيغة الأسس

        if (numberMatch) {
            const inputNumber = numberMatch[1];  
            const parsedNumber = parseFloat(inputNumber); // تحويل الرقم من صيغة الأسس إلى قيمة عددية

            executed = true; 

            // إرسال الأمر !rob مباشرة
            channel.send('!rob 1329835932878245939')
                .then(() => {
                    console.log('تم إرسال الأمر !rob');

                    // تنفيذ الأوامر التالية بناءً على الرقم
                    if (parsedNumber >= parseFloat(defaultNumber)) {
                        return channel.send('!dep all');
                    } else {
                        return channel.send(`!with ${parsedNumber}`)
                            .then(() => channel1.send('!dep all'));
                    }
                })
                .then(() => {
                    console.log('تم تنفيذ الأوامر.');
                })
                .catch(console.error)
                .finally(() => {
                    client.destroy(); // إيقاف البوت
                    console.log('تم إيقاف البوت.');
                });
        } else {
            console.log('صيغة الرقم غير صحيحة. استخدم صيغة مثل 5e12.');
        }
    }
});

client.login(mySecret).catch(console.error);
