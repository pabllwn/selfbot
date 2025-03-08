const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
const http = require('http');
const express = require('express');
const app = express();

// إنشاء سيرفر HTTP بسيط للحفاظ على النشاط
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(3000);

setInterval(() => {
    require('https').get('https://node-a5cj.onrender.com'); // استبدل برابط البوت الخاص بك
}, 300000); // 5 دقائق

// تعريف المتغيرات
const mySecret = process.env['TOKEN'];
const client = new Client();

const adminIDs = ['598266878451777595', '804924780272549908']; // معرفات الأدمن
let targetID = null; // أي دي المستخدم المستهدف
let isActive = false; // لمنع تنفيذ أوامر متعددة في نفس الوقت
let minAmount = null; // الحد الأدنى للمبلغ

const channelRobID = '1328057993085976659'; // أي دي القناة الأولى
const channelOtherID = '1328057861590220841'; // أي دي القناة الثانية

// حدث عند اتصال البوت
client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// إعادة تشغيل البوت في حالة حدوث أخطاء غير متوقعة
process.on('uncaughtException', (err) => {
    console.error('❌ Unexpected error occurred:', err);
    restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled promise rejection:', promise, 'Reason:', reason);
    restartBot();
});

// وظيفة إعادة تشغيل البوت
function restartBot() {
    console.log("🔄 Restarting the bot...");
    exec("pm2 restart discord-bot", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error while restarting: ${error.message}`);
            return;
        }
        console.log(`✅ Restarted successfully!`);
    });
}

// التعامل مع الأوامر من الأدمن فقط
client.on("messageCreate", async (message) => {
    if (!adminIDs.includes(message.author.id) || message.channel.type !== 'DM') return;

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!set") {
        if (isActive) {
            return message.reply("❌ You must type `!stop` first to finish the current process.");
        }
        if (args.length < 2) {
            return message.reply("⚠️ You need to provide the user ID: `!set <id>`");
        }
        targetID = args[1];
        isActive = false;
        message.reply(`✅ Target user set to: ${targetID}`);
    }

    if (command === "!stop") {
        targetID = null;
        isActive = false;
        message.reply("✅ Process stopped, you can set a new target.");
    }

    if (command === "!pr") {
        if (args.length < 2 || isNaN(args[1])) {
            return message.reply("⚠️ You must provide the amount correctly: `!pr <amount>`");
        }
        minAmount = parseFloat(args[1]);
        message.reply(`✅ Minimum amount set to: ${minAmount}`);
    }

    if (command === "!give") {
        if (args.length < 3 || args[2].toLowerCase() !== 'all') {
            return message.reply("⚠️ Correct format: `!give <id> all`");
        }

        const giveID = args[1];

        try {
            const targetChannel = await client.channels.fetch(channelRobID);
            if (!targetChannel) {
                console.error(`❌ Channel ${channelRobID} not found.`);
                return;
            }

            if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) {
                console.error(`❌ The bot doesn't have permission to send messages in channel ${channelRobID}.`);
                return;
            }

            message.reply(`⏳ Executing !give ${giveID} all in 10 seconds...`);

            setTimeout(async () => {
                await targetChannel.send("!with all");
                console.log("✅ Sent !with all");

                await new Promise(resolve => setTimeout(resolve, 1000));
                await targetChannel.send(`!give ${giveID} all`);
                console.log(`✅ Sent !give ${giveID} all`);

                await new Promise(resolve => setTimeout(resolve, 2000));
                await targetChannel.send(`!give ${giveID} all`);
                console.log(`✅ Sent !give ${giveID} all again`);

                message.reply(`✅ Successfully executed !give ${giveID} all`);
            }, 10000);

        } catch (error) {
            console.error('❌ Error executing !give command:', error);
            message.reply("❌ Error occurred while executing the command.");
        }
    }

    if (command === "!help") {
        return message.reply(`
**📌 Available commands:**
- \`!set <id>\` → Set the target user ID.
- \`!stop\` → Stop the current process.
- \`!pr <amount>\` → Set the minimum amount for !with.
- \`!give <id> all\` → Execute the sequence: !with all → !give <id> all → !give <id> all.
- \`!help\` → Show this message.
        `);
    }
});

// التعامل مع الأوامر من المستخدم المستهدف فقط
client.on("messageCreate", async (message) => {
    if (!targetID || isActive) return;
    if (message.author.id !== targetID) return;

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');
    if (!command.startsWith('!with')) return;

    const numberMatch = command.match(/\d+e\d+/) || command.match(/all/);
    if (!numberMatch) return;

    const isAll = numberMatch[0] === 'all';
    const amount = isAll ? 700e9 : parseFloat(numberMatch[0]);

    if (minAmount && amount < minAmount) return;

    isActive = true;

    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;

    try {
        const targetChannel = await client.channels.fetch(targetChannelID);
        if (!targetChannel) return;

        if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) return;

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));
        await targetChannel.send(`!rob ${targetID}`);
        console.log(`✅ Sent !rob ${targetID}`);

        await new Promise(resolve => setTimeout(resolve, 300));
        await targetChannel.send('!dep all');

        targetID = null;
        console.log(`✅ Target ID reset.`);

    } catch (error) {
        console.error('❌ Error during execution:', error);
    } finally {
        isActive = false;
    }
});

// تسجيل الدخول باستخدام التوكن
client.login(mySecret).catch(console.error);
