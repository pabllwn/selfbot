const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
const http = require('http');
const express = require('express');
const app = express();

// إنشاء سيرفر HTTP بسيط
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(3000);

// إرسال طلب كل 5 دقائق للحفاظ على النشاط
setInterval(() => {
    require('https').get('https://selfbot-or3a.onrender.com'); // استبدل برابط البوت الخاص بك
}, 300000); // 5 دقائق

// إعدادات البوت
const mySecret = process.env['TOKEN'];
const client = new Client();

const adminIDs = ['598266878451777595', '804924780272549908']; // Add more IDs here
let targetID = null; 
let isActive = false; 
let minAmount = 600e9; // القيمة الافتراضية للحد الأدنى

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// إعادة تشغيل البوت تلقائيًا عند حدوث خطأ غير متوقع
process.on('uncaughtException', (err) => {
    console.error('❌ Unexpected Error:', err);
    restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', promise, 'Reason:', reason);
    restartBot();
});

// دالة إعادة التشغيل
function restartBot() {
    console.log("🔄 Restarting bot...");
    exec("node your-script.js", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Restart Error: ${error.message}`);
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log("✅ Restarted successfully!");
    });
}

// استقبال الأوامر من الأدمن فقط في الخاص
client.on("messageCreate", async (message) => {
    if (!adminIDs.includes(message.author.id) || message.channel.type !== 'DM') return;

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!set") {
        if (isActive) {
            return message.reply("❌ You must type `!stop` first to end the current process.");
        }
        if (args.length < 2) {
            return message.reply("⚠️ Enter user ID: `!set <id>`");
        }
        targetID = args[1];
        isActive = false;
        message.reply(`✅ Target set: ${targetID}`);
    }

    if (command === "!stop") {
        targetID = null;
        isActive = false;
        message.reply("✅ Process stopped, you can set a new target.");
    }

    if (command === "!pr") {
        if (args.length < 2 || isNaN(args[1])) {
            return message.reply("⚠️ Enter a valid number: `!pr <amount>`");
        }
        minAmount = parseFloat(args[1]);
        message.reply(`✅ Minimum amount set to: ${minAmount}`);
    }

    if (command === "!help") {
        return message.reply(`
**📌 Available Commands:**
- \`!set <id>\` → Set target user.
- \`!stop\` → Stop the current process.
- \`!pr <amount>\` → Set the minimum amount for !with.
- \`!give <id> all\` → Give all to the specified user.
- \`!help\` → Show this help message.
        `);
    }

    // تنفيذ أمر !give <id> all
    if (command === "!give" && args[2]?.toLowerCase() === "all") {
        if (args.length < 3) {
            return message.reply("⚠️ Enter the correct format: `!give <id> all`");
        }

        const giveID = args[1];
        const targetChannel = await client.channels.fetch(channelRobID); // Use channelRobID here

        if (!targetChannel) {
            return message.reply("❌ Target channel not found.");
        }

        message.reply(`⏳ The process will begin in 10 seconds...`);

        // Start the process after 10 seconds
        setTimeout(async () => {
            try {
                // Step 1: Send !with all in the channel
                await targetChannel.send("!with all");
                console.log("Sent !with all");

                // Step 2: Wait 50 milliseconds
                await new Promise(resolve => setTimeout(resolve, 250));

                // Step 3: Send !give <id> all
                await targetChannel.send(`!give ${giveID} all`);
                console.log(`Sent !give ${giveID} all`);

                await targetChannel.send(`!give ${giveID} all`);
                console.log(`Sent !give ${giveID} all`);
                
                // Step 4: Wait 2 seconds
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Step 5: Send !dep all
                await targetChannel.send("!dep all");
                console.log("Sent !dep all");

                message.reply("✅ The process has been successfully completed!");
            } catch (error) {
                console.error("❌ An error occurred during the execution:", error);
            }
        }, 10000);
    }
});

// إعادة الاتصال تلقائيًا عند فقدان الاتصال
setInterval(() => {
    if (!client.ws.ping || client.ws.ping > 30000) {
        console.log("⚠️ Bot disconnected! Restarting...");
        client.destroy();
        client.login(mySecret);
    }
}, 60000);

client.login(mySecret).catch(console.error);
