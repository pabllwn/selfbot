const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

let isActive = false; // يسمح بتنفيذ الأمر مرة واحدة فقط
const targetIDs = ['832457945315934208', '758788092256714793']; // معرفات المستهدفين
const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (!targetIDs.includes(message.author.id)) return;
    if (isActive) return; // إذا تم تنفيذ الأمر سابقًا، لا يستجيب لأي شخص آخر

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');
    if (!command.startsWith('!with')) return;

    const numberMatch = command.match(/\d+e\d+/) || command.match(/all/);
    if (!numberMatch) return;
    
    const isAll = numberMatch[0] === 'all';
    const isAboveLimit = !isAll && parseFloat(numberMatch[0]) >= 600e9;
    if (!(isAll || isAboveLimit)) return;

    isActive = true; // يمنع أي تنفيذ آخر بعد هذه النقطة

    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;
    const targetChannel = client.channels.cache.get(targetChannelID);
    const channelRob = client.channels.cache.get(channelRobID);
    const channelOther = client.channels.cache.get(channelOtherID);

    try {
        const randomDelay = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        await targetChannel.send(`!rob ${message.author.id}`);
        console.log(`تم إرسال أمر !rob في القناة ${targetChannelID}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isAll) {
            await channelRob.send('!dep all');
            console.log('تم إرسال أمر !dep all في قناة rob');
        } else {
            await channelRob.send('!dep All');
            console.log('تم إرسال أمر !dep All في قناة rob');
            await new Promise(resolve => setTimeout(resolve, 2000));

            await channelOther.send('!dep all');
            console.log('تم إرسال أمر !dep all في قناة الأخرى');
            await new Promise(resolve => setTimeout(resolve, 1500));

            await channelOther.send('!buy k');
            console.log('تم إرسال أمر !buy k في قناة الأخرى');
            await new Promise(resolve => setTimeout(resolve, 1000));

            await channelOther.send('!dep all');
            console.log('تم إرسال أمر !dep all في قناة الأخرى');
        }
    } catch (error) {
        console.error('حدث خطأ أثناء التنفيذ:', error);
    }
});

// أمر يدوي لإعادة تشغيل البوت
client.on("messageCreate", (message) => {
    if (message.content.toLowerCase() === "!reset") {
        isActive = false; // إعادة ضبط البوت
        console.log("تم إعادة تفعيل البوت، يمكنه الآن استقبال الأوامر مرة أخرى.");
        message.reply("✅ تم إعادة ضبط النظام، يمكنك الآن إرسال الأمر مرة أخرى.");
    }
});

client.login(mySecret).catch(console.error);
