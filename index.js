const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client();

const adminID = '804924780272549908'; // الشخص الذي يتحكم في الأوامر
let targetID = null; // المستخدم المستهدف
let isActive = false; // لمنع التكرار بعد التنفيذ

const channelRobID = '1278515775891705947';
const channelOtherID = '1278507995277561926';

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

    if (command === "!give") {
        if (args.length < 3) {
            return message.reply("⚠️ يجب إدخال ID والمبلغ: `!give <id> all`");
        }

        const giveID = args[1];
        if (args[2].toLowerCase() !== "all") return;

        const targetChannel = client.channels.cache.get(channelOtherID);
        if (!targetChannel) return message.reply("❌ القناة غير موجودة!");

        message.reply(`⏳ سيتم تنفيذ العملية خلال 10 ثواني...`);
        setTimeout(async () => {
            try {
                await targetChannel.send("!with all");
                console.log("تم إرسال !with all");

                await new Promise(resolve => setTimeout(resolve, 300));

                await targetChannel.send(`!give ${giveID} all`);
                console.log("تم إرسال !give id all");

                await new Promise(resolve => setTimeout(resolve, 300));

                await targetChannel.send(`!give ${giveID} all`);
                console.log("تم إرسال !give id all مرة ثانية");

                await new Promise(resolve => setTimeout(resolve, 500));

                await targetChannel.send("!dep all");
                console.log("تم إرسال !dep all");

                await new Promise(resolve => setTimeout(resolve, 500));

                await targetChannel.send("!dep all");
                console.log("تم إرسال !dep all مرة ثانية");

                message.reply("✅ تمت العملية بنجاح!");
            } catch (error) {
                console.error("❌ حدث خطأ أثناء التنفيذ:", error);
            }
        }, 10000);
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
    const amount = isAll ? 600e9 : parseFloat(numberMatch[0]);

    if (amount < 600e9) return;

    isActive = true;

    const targetChannel = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;
    const channelRob = client.channels.cache.get(channelRobID);
    const channelOther = client.channels.cache.get(channelOtherID);

    try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * (100 - 50) + 50));
        await client.users.cache.get(adminID)?.send(`✅ تم تنفيذ !rob ضد ${targetID}`);

        await client.channels.cache.get(targetChannel)?.send(`!rob ${targetID}`);
        console.log(`تم إرسال !rob ${targetID} في القناة ${targetChannel}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isAll) {
            await channelRob.send('!dep all');
            console.log('تم إرسال !dep all في قناة rob');
        } else {
            await channelRob.send('!dep All');
            console.log('تم إرسال !dep All في قناة rob');

            await new Promise(resolve => setTimeout(resolve, 2000));
            await channelOther.send('!dep all');
            console.log('تم إرسال !dep all في القناة الأخرى');

            await new Promise(resolve => setTimeout(resolve, 1500));
            await channelOther.send('!buy k');
            console.log('تم إرسال !buy k في القناة الأخرى');

            await new Promise(resolve => setTimeout(resolve, 1000));
            await channelOther.send('!dep all');
            console.log('تم إرسال !dep all في القناة الأخرى');
        }
    } catch (error) {
        console.error('❌ حدث خطأ أثناء التنفيذ:', error);
    }
});

client.login(mySecret).catch(console.error);
