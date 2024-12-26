const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// قائمة المستخدمين المستهدفين
const targetUsers = [
    '765978295795187734', 
    '768194527608438805',
    '1226198370683715624',
    '803949691288027198',
    '1312405318218813592', 
    '412902064952180736',
];

// إيموجي للتفاعل
const reactionEmoji = '<:11pm_mute:1037861993333391360>';

// تخزين السجل الزمني
const userMessageLog = {};

// عند تشغيل البوت
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// التعامل مع الرسائل
client.on("messageCreate", async message => {
    try {
        // تجاهل الرسائل من البوت نفسه
        if (message.author.id === client.user.id) return;

        // أمر التفاعل مع المستخدم
        if (message.content.startsWith('seb hada')) {
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                return message.reply('tagih liya.');
            }

            // التحقق من الوقت الفاصل بين الاستخدامات
            const lastRequestTime = userMessageLog[message.author.id];
            const currentTime = Date.now();

            if (lastRequestTime && currentTime - lastRequestTime < 10 * 60 * 1000) {
                return message.reply('SKT CHWIYA ASAHBI');
            }

            // تحديث السجل الزمني والرد
            userMessageLog[message.author.id] = currentTime;
            return message.reply(`layn3el w l2a9a7ib w wlmala3ib w lmaja3ib li katsara w tatjara f charayin w l3ro9 dyal lfchlo9 lmkhno9 lmch9o9 lmro9 dyal tbon lmghbon lm3fon li ydel ydreb chifon w silisyon dyal lmtbn lmzghben lm97ben lm3fen lmklmn dyal omahat myat mok ya klb malizya ya trikt lkhera w zna w trami m7sna w sbabet mkhelta w l97ab memghta w l3bid w doran f drob ya ${mentionedUser}`);
        }

        // التحقق من رسائل المستخدمين المستهدفين والتفاعل معهم
        const authorInVoiceChannel = isUserInSameVoiceChannel(message.author.id);
        if (targetUsers.includes(message.author.id) || authorInVoiceChannel) {
            await message.react(reactionEmoji);
            console.log(`Reacted to message from ${message.author.tag}`);
        }
    } catch (error) {
        console.error('Failed to process message:', error);
    }
});

// وظيفة التحقق إذا كان المستخدم في نفس الغرفة الصوتية
function isUserInSameVoiceChannel(userId) {
    const guilds = client.guilds.cache;
    for (const [guildId, guild] of guilds) {
        const me = guild.members.cache.get(client.user.id); // البوت
        const user = guild.members.cache.get(userId); // المستخدم الهدف
        if (me && user && me.voice.channelId && me.voice.channelId === user.voice.channelId) {
            return true;
        }
    }
    return false;
}

// تسجيل الدخول
client.login(mySecret).catch(console.error);
