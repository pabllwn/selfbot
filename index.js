const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// معرف القناة المستهدفة
const watchedChannel = '1322901860754919474'; // ضع معرف القناة هنا

// عند تشغيل البوت
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// التعامل مع الرسائل
client.on("messageCreate", (message) => {
    // تجاهل الرسائل من البوت نفسه
    if (message.author.id === client.user.id) return;

    // التحقق من القناة المحددة
    if (message.channel.id === watchedChannel) {
        // إذا كانت الرسالة تحتوي على منشن لك
        if (message.mentions.has(client.user)) {
            const mentionedUser = message.author; // الشخص الذي عمل منشن
            const messageContent = message.content.replace(`<@${client.user.id}>`, `<@${mentionedUser.id}>`); // استبدال المنشن بعكسه

            // إعادة كتابة الرسالة مع عكس المنشن
            message.channel.send(messageContent).catch(console.error);
        } else {
            // إعادة كتابة الرسالة كما هي
            message.channel.send(message.content).catch(console.error);
        }
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
