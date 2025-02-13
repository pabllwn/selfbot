const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1291074783353634887') return;

    const channel = client.channels.cache.get('1328057993085976659'); // chat ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // chat FIN TATl3b  

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    if (command.startsWith('!with')) {
        const number = command.match(/\d+/) || command.match(/all/);

        if (number) {
            if (number[0] === 'all') {
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
                        client.destroy(); // إيقاف البوت بعد الانتهاء
                        console.log('تم إيقاف البوت.');
                    });
            } else {
                channel.send(`!with ${number[0]}`)
                    .then(() => {
                        console.log(`تم إرسال أمر !with ${number[0]}`);
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
                        client.destroy(); // إيقاف البوت بعد الانتهاء
                        console.log('تم إيقاف البوت.');
                    });
            }
        }
    }
});

client.login(mySecret).catch(console.error);
