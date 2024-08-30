const { Client } = require('discord.js-selfbot-v13');
const keepAlive = require('./keep_alive');
const mySecret = process.env['TOKEN'];
const client = new Client();

let targetId = '';
let active = false;
let userCompleted = false; // متغير لتعقب إكمال المستخدم للعملية

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
    // تحديد الشخص المستهدف باستخدام الأمر &id
    if (message.content.startsWith('&id ')) {
        targetId = message.content.split(' ')[1];
        message.react('✅');
    }

    // بدء العملية إذا تم تحديد الشخص المستهدف واستخدام الأمر &start
    if (message.content === '&start' && message.author.id === targetId) {
        if (userCompleted) {
            message.channel.send('العملية لهذا المستخدم مكتملة بالفعل. استخدم &reset لإعادة التفعيل.');
            return;
        }
        active = true;
        message.react('🚀');
        await executeCommands(message.channel); // تمرير القناة التي بدأ فيها الأمر
    }

    // إيقاف العملية
    if (message.content === '&stop' && message.author.id === targetId) {
        active = false;
        message.react('🛑');
    }

    // إعادة تعيين العملية لتكون قابلة للتنفيذ مرة أخرى
    if (message.content === '&reset') {
        userCompleted = false;
        message.react('🔄');
        message.channel.send('تمت إعادة تعيين العملية. يمكنك الآن استخدام &start لبدء من جديد.');
    }

    // التحقق مما إذا كان الشخص المستهدف قد أرسل رسالة، وإيقاف التنفيذ إذا تم ذلك
    if (message.author.id === targetId && active) {
        message.channel.send('تمت العملية بالفعل لهذا المستخدم.');
        active = false;
    }
});

async function executeCommands(startChannel) {
    const channel = client.channels.cache.get('1123064802361753632');
    const channel1 = client.channels.cache.get('1123064802361753632');
    const rob = client.channels.cache.get('1123064802361753632');

    async function sendMessage(channel, content, delay) {
        return new Promise(resolve => {
            if (!active) return resolve();
            setTimeout(async () => {
                await channel.send(content);
                console.log(`Sent ${content}`);
                resolve();
            }, delay);
        });
    }

    while (active) {
        await sendMessage(channel, `!rob ${targetId}`, 0);
        await sendMessage(channel1, '!dep all', 2000);
        await sendMessage(channel1, '!buy K', 2500);
        await sendMessage(channel1, '!with 2e6', 1500);
        await sendMessage(channel1, 'waaa tzz', 1000);
        await sendMessage(channel1, '!dep all', 1000);
        await sendMessage(rob, '!dep all', 2000);

        active = false;
        userCompleted = true;
        startChannel.send('تمت العملية بنجاح! يمكنك إعادة تشغيل العملية باستخدام &reset.');
    }
}

keepAlive();
client.login(mySecret).catch(console.error);
