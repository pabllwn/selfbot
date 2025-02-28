const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

const adminID = '819176095492341770'; // الشخص الذي يتحكم في الأوامر
let targetID = null; // المستخدم المستهدف
let isActive = false; // لمنع التكرار بعد التنفيذ

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

// استقبال الأوامر من الأدمن فقط في الخاص
client.on("messageCreate", async (message) => {
    if (message.author.id !== adminID || message.channel.type !== 'DM') return;

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!set") {
        if (isActive) {
            return message.reply("❌ يجب كتابة `!stop` أولًا لإنهاء العملية الحالية.");
        }
        if (args.length < 2) {
            return message.reply("⚠️ يجب إدخال ID المستخدم: `!set <id>`");
        }
        targetID = args[1];
        isActive = false;
        message.reply(`✅ تم تحديد المستهدف: ${targetID}`);
    }

    if (command === "!stop") {
        targetID = null;
        isActive = false;
        message.reply("✅ تم إيقاف العملية، يمكنك تعيين مستهدف جديد.");
    }
});

// تنفيذ الأوامر عند تلقي رسالة من المستهدف
client.on("messageCreate", async (message) => {
    if (!targetID || message.author.id !== targetID || isActive) return;

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');
    if (!command.startsWith('!with')) return;

    const numberMatch = command.match(/\d+e\d+/) || command.match(/all/);
    if (!numberMatch) return;

    const isAll = numberMatch[0] === 'all';
    const amount = isAll ? 700e9 : parseFloat(numberMatch[0]);

    if (amount < 600e9) return;

    isActive = true;

    // اختيار القناة المعاكسة
    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;

    try {
        // جلب القناة باستخدام fetch
        const targetChannel = await client.channels.fetch(targetChannelID);
        if (!targetChannel) {
            console.error(`❌ القناة ${targetChannelID} غير موجودة.`);
            return;
        }

        // التحقق من صلاحيات الكتابة
        if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) {
            console.error(`❌ لا يملك البوت صلاحية الكتابة في القناة ${targetChannelID}.`);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));
        await client.users.cache.get(adminID)?.send(`✅ تم تنفيذ !rob ضد ${targetID}`);

        await targetChannel.send(`!rob ${targetID}`);
        console.log(`✅ تم إرسال !rob ${targetID} في القناة ${targetChannelID}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isAll) {
            await targetChannel.send('!dep all');
            console.log('✅ تم إرسال !dep all');
        } else {
            await targetChannel.send('!dep All');
            console.log('✅ تم إرسال !dep All');

            await new Promise(resolve => setTimeout(resolve, 2000));
            await targetChannel.send('!dep all');
            console.log('✅ تم إرسال !dep all مرة أخرى');

            await new Promise(resolve => setTimeout(resolve, 1500));
            await targetChannel.send('!buy k');
            console.log('✅ تم إرسال !buy k');

            await new Promise(resolve => setTimeout(resolve, 1000));
            await targetChannel.send('!dep all');
            console.log('✅ تم إرسال !dep all للمرة الأخيرة');
        }
    } catch (error) {
        console.error('❌ حدث خطأ أثناء التنفيذ:', error);
    }
});

client.login(mySecret).catch(console.error);
