const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// قائمة المستخدمين المستهدفين
const targetUsers = [
    '765978295795187734', // User 1
    '768194527608438805', // User 2
    '1226198370683715624',
    '803949691288027198',
    '1312405318218813592', // User 3
    '412902064952180736',
];

// إيموجي للتفاعل
const reactionEmoji = '<:keres:1090368386673946666>';

// تخزين عدد الاستخدامات المسموح بها
const userCredits = {};

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
            const args = message.content.split(' ');
            if (args.length < 3) {
                return message.reply('يرجى تحديد المستخدم وعدد المرات: +forsa (user) (count)');
            }
            
            const mentionedUser = message.mentions.users.first();
            const count = parseInt(args[2], 10);
            if (!mentionedUser || isNaN(count) || count <= 0) {
                return message.reply('صيغة الأمر خاطئة. تأكد من تحديد المستخدم وعدد المرات بشكل صحيح.');
            }

            userCredits[mentionedUser.id] = count;
            return message.reply(`تم إعطاء ${mentionedUser} ${count} فرصة/فرص.`);
        }

        // أمر التفاعل مع المستخدم
        if (message.content.startsWith('seb hada')) {
            const mentionedUser = message.mentions.users.first();
            if (!mentionedUser) {
                return message.reply('يرجى منشن المستخدم الذي تريد التفاعل معه.');
            }

            // التحقق من وجود رصيد
            if (!userCredits[message.author.id] || userCredits[message.author.id] <= 0) {
                return message.reply('khleessni w mre7ba (100 credits)');
            }

            // الرد وتخفيض الرصيد
            userCredits[message.author.id]--;
            return message.reply(`مال مك القحبة أ ${mentionedUser}`);
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
