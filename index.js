const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// معرف القناة المستهدفة
const watchedChannel = '1322901860754919474'; // ضع معرف القناة هنا

// كائن لتخزين ارتباط الرسائل
const messageMap = {};

// عند تشغيل البوت
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// التعامل مع الرسائل
client.on("messageCreate", async (message) => {
    // تجاهل الرسائل من البوت نفسه
    if (message.author.id === client.user.id) return;

    // التحقق من القناة المحددة
    if (message.channel.id === watchedChannel) {
        let sentMessage;

        // إذا كانت الرسالة تحتوي على منشن لك
        if (message.mentions.has(client.user)) {
            const mentionedUser = message.author; // الشخص الذي عمل منشن
            const messageContent = message.content.replace(`<@${client.user.id}>`, `<@${mentionedUser.id}>`); // استبدال المنشن بعكسه

            // إعادة كتابة الرسالة مع عكس المنشن
            sentMessage = await message.channel.send(messageContent).catch(console.error);
        } else {
            // إعادة كتابة الرسالة كما هي
            sentMessage = await message.channel.send(message.content).catch(console.error);
        }

        // تخزين معرف الرسالة الأصلية ومعرف الرسالة التي أرسلها البوت
        if (sentMessage) {
            messageMap[message.id] = sentMessage.id;
        }
    }
});

// التعامل مع حذف الرسائل
client.on("messageDelete", (message) => {
    // التحقق إذا كانت الرسالة المحذوفة موجودة في الرسائل المخزنة
    if (messageMap[message.id]) {
        const botMessageId = messageMap[message.id]; // الحصول على معرف الرسالة التي أرسلها البوت

        // محاولة حذف رسالة البوت المرتبطة
        message.channel.messages.fetch(botMessageId).then((botMessage) => {
            botMessage.delete().catch(console.error);
        }).catch(console.error);

        // إزالة الرسالة من الكائن
        delete messageMap[message.id];
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
