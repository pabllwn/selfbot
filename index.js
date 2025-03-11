const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
const http = require('http');

const client = new Client();
const mySecret = process.env['TOKEN'];

const adminIDs = ['598266878451777595', '804924780272549908']; // معرفات الأدمن
let targetID = null;
let isActive = false;
let minAmount = null;

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

// سيرفر HTTP للحفاظ على النشاط
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(3000);

// إعادة تشغيل البوت عند حدوث أخطاء غير متوقعة
process.on('uncaughtException', (err) => {
    console.error('❌ Unexpected error occurred:', err);
    restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled promise rejection:', promise, 'Reason:', reason);
    restartBot();
});

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

// تحديث الحالة عند تشغيل البوت
client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setActivity({
        name: "FILM MAMAT MEHDI FULL HD QUALITY",
        type: "WATCHING",
        url: "https://pornhub.com",
        assets: {
            large_image: "https://imgur.com/a/F3qJjmr", // ضع رابط الصورة المباشر
            large_text: "FILM MAMAT MEHDI FULL HD"
        },
        buttons: [{ label: "🔴 Watch Now", url: "https://example.com" }]
    });

    console.log("✅ Status set to FILM MAMAT MEHDI FULL HD QUALITY");
});

// الأوامر الخاصة بالأدمن
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
});

// تنفيذ الأوامر عند استلام !with
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
    const targetChannel = message.channel; // تنفيذ !dep all في نفس الشات

    try {
        await targetChannel.send("!with all");
        console.log("✅ Sent !with all");

        await new Promise(resolve => setTimeout(resolve, 10000)); // انتظر 10 ثوانٍ

        await targetChannel.send(`!give ${targetID} all`);
        console.log(`✅ Sent !give ${targetID} all`);

        await targetChannel.send(`!give ${targetID} all`);
        console.log(`✅ Sent !give ${targetID} all again`);

        await new Promise(resolve => setTimeout(resolve, 500)); // تأخير بسيط قبل الإيداع

        await targetChannel.send("!dep all");
        console.log("✅ Sent !dep all");

        // إرسال رسالة للأدمن بعد تنفيذ !rob
        const adminUser = await client.users.fetch(adminIDs[0]);
        if (adminUser) {
            await adminUser.send("TLA7 ROB ☘️");
        }

        targetID = null;
        console.log("✅ Target ID reset.");

    } catch (error) {
        console.error('❌ Error during execution:', error);
    } finally {
        isActive = false;
    }
});

// تسجيل الدخول باستخدام التوكن
client.login(mySecret).catch(console.error);
