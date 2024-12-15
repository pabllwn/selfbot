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
const reactionEmoji = '<:keres:1090368386673946666>';

// تخزين عدد الاستخدامات المسموح بها والسجل الزمني
const userCredits = {};
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

        // أوامر الإدارة لتحديد عدد المرات
        if (message.content.startsWith('+forsa')) {
            if (message.author.id !== '804924780272549908') {
                return message.reply('هذا الأمر غير متاح لك.');
            }
            
            const args = message.content.split(' ');
            if (args.length < 3) {
                return message.reply('+forsa (user) (count)');
            }

            const mentionedUser = message.mentions.users.first();
            const count = parseInt(args[2], 10);
            if (!mentionedUser || isNaN(count) || count <= 0) {
                return message.reply('dir ch7al bghiti t3tih');
            }

            userCredits[mentionedUser.id] = count;
            return message.reply(`Assigned ${count} chances to ${mentionedUser.tag}`);
        }

        // أمر التفاعل مع المستخدم
        if (message.content.startsWith('seb hada')) {
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                return message.reply('tagih liya.');
            }

            // التحقق من وجود رصيد
            if (!userCredits[message.author.id] || userCredits[message.author.id] <= 0) {
                const lastRequestTime = userMessageLog[message.author.id];
                const currentTime = Date.now();

                // التحقق من إرسال الرسالة مرتين خلال 5 دقائق
                if (lastRequestTime && currentTime - lastRequestTime < 5 * 60 * 1000) {
                    return;
                }

                userMessageLog[message.author.id] = currentTime;
                return message.reply('khleessni w mre7ba (100 credits)');
            }

            // الرد وتخفيض الرصيد
            userCredits[message.author.id]--;
            return message.reply(` layn3el w l2a9a7ib w wlmala3ib w lmaja3ib li katsara w tatjara f charayin w l3ro9 dyal lfchlo9 lmkhno9 lmch9o9 lmro9 dyal tbon lmghbon lm3fon li ydel ydreb chifon w silisyon dyal lmtbn lmzghben lm97ben lm3fen lmklmn dyal omahat myat mok ya klb malizya ya trikt lkhera w zna w trami m7sna w sbabet mkhelta w l97ab memghta w l3bid w doran f drob ya ${mentionedUser}`);
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
