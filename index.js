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
            return message.reply(` layn3el w l2a9a7ib w wlmala3ib w lmaja3ib li katsara w tatjara f charayin w l3ro9 dyal lfchlo9 lmkhno9 lmch9o9 lmro9 dyal tbon lmghbon lm3fon li ydel ydreb chifon w silisyon dyal lmtbn lmzghben lm97ben lm3fen lmklmn dyal omahat myat mok ya klb malizya ya trikt lkhera w zna w trami m7sna w sbabet mkhelta w l97ab memghta ya trikt ma9ala wadal mn t97bin w tl3bin w hzan rjlin lkhmis w tnin yatrikt lft lm7for w zab lm3bor w hzan l9lwa mn lor ya trikt l97ab w j3ab w sef 3nd lbab ytrikt l7sira w tbzira w lbota sghira ya trikt l97ob w l3ob w doran f drob w hzan zbob w srwal mt9ob wzek 3amer 7bob ya trikt l3bid w l7wa f l3id ya trik lkar ghadi w l7wa badi dserti aweld l97ba lay7re9 l7ayawan lmanawi li khseb lbwayda li kwnat janin dayl l3ro9 dyal twasel w lmfasel w lbzazel d l97bat mok l97ba
○ghan dreb 3do rbk ya wld l9hba 7ta tabon mok i wi li kay breakdanci. Achno gelti ya wld l9hba yl3n 3do rbayb rbk ya zamel baki kat kefet 3la minecraft sir ndreb 3do rbk b minecraft shovel n3we9 zamel bok. 3awd achno gelti ya wld l9hba ya zamel ya wjah zebi ya nif l7ashara ghan 7wi tababin tabon mok yl3n mok ya zombie d zeb ya ROBLOX character choof terma, shut the 9wd up ya zamel yl3n 3do rbk ya wld l9hba daba nwekel 3do rbk lml7a o zit o ramla yl3n 3do rbk ya ras l9lwa lisriya lwalid dyalek fash 7wa mok kan wakel loz khaser darliha anal ta wlat katmcha sideways ya zamel ya lhayawan lmanawi haytek kolha 3adab ta wahd makaybghik atb9a dima hmar w retarded bhalek bhal your step dad ya zmimlat anji ndreb lik trmtak ki shi kora dyal tennis ghadi nchtet zamel bok tatchof lah kibred fl7rira,kadwi bhal l9hba ya zaml ya normie li chareb 10 dhs dlmahya ya weld l9hba layn3el steve d tbon d mamat hitler d khaltek, yalbyda , andrbek ankhli 3nik 360² ya shrik lkhanz lah yn3l tbon d jdatek lmyta ya weld l9hba,Anched l97ba dmok n3l9ha mn bzazlha taytchrgo yawld chta7a achof fya azbi tanjbed l3do rbha jdatk mn l9bor on7wiha , ydek fzebi aweld chikha trax o bak lmiloudi
asket ya wjah zab ${mentionedUser}`);
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
