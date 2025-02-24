const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

let flag = false;

// معرفات المستهدفين
const targetIDs = ['835129694369873951', '832457945315934208', '']; // استبدلها بمعرفات الأشخاص المستهدفين

// معرفات القنوات
const channelRobID = '1328057993085976659'; // قناة rob
const channelOtherID = '1328057861590220841'; // قناة الأخرى

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    // التحقق من أن الكاتب ضمن المستهدفين
    if (!targetIDs.includes(message.author.id)) return;
    if (flag) return; // منع التكرار أثناء التنفيذ

    // التأكد من أن الرسالة تتضمن الأمر المطلوب "!with"
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');
    if (!command.startsWith('!with')) return;

    // استخراج الرقم أو "all" من الأمر
    const numberMatch = command.match(/\d+e\d+/) || command.match(/all/);
    if (!numberMatch) return;
    
    const isAll = numberMatch[0] === 'all';
    const isAboveLimit = !isAll && parseFloat(numberMatch[0]) >= 200e9; // تعديل الشرط كما هو مطلوب

    if (!(isAll || isAboveLimit)) return;

    flag = true; // تفعيل الفلاج لمنع التكرار أثناء التنفيذ

    // تحديد القناة التي سيتم إرسال أمر rob فيها
    // إذا كانت الرسالة جاءت من قناة rob، نستخدم القناة الأخرى
    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;
    const targetChannel = client.channels.cache.get(targetChannelID);
    const channelRob = client.channels.cache.get(channelRobID);
    const channelOther = client.channels.cache.get(channelOtherID);

    try {
        // تأخير عشوائي بسيط
        const randomDelay = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        await new Promise(resolve => setTimeout(resolve, randomDelay));

        // إرسال أمر rob في القناة المحددة
        await targetChannel.send(`!rob ${message.author.id}`);
        console.log(`تم إرسال أمر !rob في القناة ${targetChannelID}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isAll) {
            // إرسال أوامر dep في القناة rob إذا كان "all"
            await channelRob.send('!dep all');
            console.log('تم إرسال أمر !dep all في قناة rob');
        } else {
            // إرسال الأوامر بالتتابع إذا لم يكن "all"
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
    } finally {
        // إعادة تعيين flag بعد فترة معينة للسماح بالتكرار لاحقًا
        setTimeout(() => {
            flag = false;
            console.log('تم إعادة ضبط الفلاج.');
        }, 10000); // يمكن تعديل المدة كما تريد
    }
});

client.login(mySecret).catch(console.error);
