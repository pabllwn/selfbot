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
    require('https').get('https://selfbot-1-gxl5.onrender.com'); // استبدل برابط البوت الخاص بك
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

// تعيين الحالة عند الاتصال
client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setActivity("MOT MEHDI WLD LHJJJAAALLA", { type: "WATCHING" });
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
        if (isActive) return message.reply("❌ You must type `!stop` first to finish the current process.");
        if (args.length < 2) return message.reply("⚠️ You need to provide the user ID: `!set <id>`");

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
        if (args.length < 2 || isNaN(args[1])) return message.reply("⚠️ You must provide the amount correctly: `!pr <amount>`");

        minAmount = parseFloat(args[1]);
        message.reply(`✅ Minimum amount set to: ${minAmount}`);
    }

    if (command === "!help") {
        return message.reply(`
📌 Available commands:

\`!set <id>\` → Set the target user ID.
\`!stop\` → Stop the current process.
\`!pr <amount>\` → Set the minimum amount for !with.
\`!help\` → Show this message.
        `);
    }
});

// التعامل مع الأوامر من المستخدم المستهدف فقط
client.on("messageCreate", async (message) => {
    if (!targetID || isActive) return;
    if (message.author.id !== targetID) return;

    // تنظيف الأمر من الرموز مع الإبقاء على المسافات
    const cleanedCommand = message.content.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const args = cleanedCommand.split(/\s+/);

    if (args[0] !== 'with') return; // يجب أن يكون أول كلمة هي "with"

    const numberMatch = args[1] && (args[1].match(/\d+e\d+/) || args[1] === 'all');
    if (!numberMatch) return;

    const isAll = args[1] === 'all';
    const amount = isAll ? 700e9 : parseFloat(args[1]);

    if (minAmount && amount < minAmount) return;

    isActive = true;

    try {
        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));

        await message.channel.send(`!rob ${targetID}`);
        console.log(`✅ Sent !rob ${targetID}`);

        // إرسال رسالة في الخاص بعد نجاح !rob
        await message.author.send(`✅ Successfully executed !rob ${targetID}`);

        await new Promise(resolve => setTimeout(resolve, 300));
        await message.channel.send('!dep all');

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
