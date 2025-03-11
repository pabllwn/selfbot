const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
const http = require('http');
const express = require('express');
const app = express();

// إنشاء سيرفر HTTP للحفاظ على النشاط
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(3000);

setInterval(() => {
    require('https').get('https://selfbot-1-gxl5.onrender.com'); // استبدل بالرابط الخاص بك
}, 300000);

// تعريف المتغيرات
const mySecret = process.env['TOKEN'];
const client = new Client();

const adminIDs = ['598266878451777595', '804924780272549908'];
let targetID = null;
let isActive = false;
let minAmount = null;
let setByUser = null; // الشخص الذي كتب !set

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';
const channelThirdID = '1339298478182105088';

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

process.on('uncaughtException', (err) => {
    console.error(`❌ Unexpected error: ${err}`);
    restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`❌ Unhandled rejection: ${promise}, Reason: ${reason}`);
    restartBot();
});

function restartBot() {
    console.log("🔄 Restarting the bot...");
    exec("pm2 restart discord-bot", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Restart error: ${error.message}`);
            return;
        }
        console.log("✅ Restarted successfully!");
    });
}

// التعامل مع الأوامر من الأدمن
client.on("messageCreate", async (message) => {
    if (!adminIDs.includes(message.author.id) || message.channel.type !== 'DM') return;

    const args = message.content.split(" ");
    const command = args[0].toLowerCase();

    if (command === "!set") {
        if (isActive) {
            return message.reply("❌ You must type !stop first.");
        }
        if (args.length < 2) {
            return message.reply("⚠️ Provide a user ID: !set <id>");
        }
        targetID = args[1];
        setByUser = message.author.id;
        isActive = false;
        message.reply(`✅ Target user set to: ${targetID}`);
    }

    if (command === "!stop") {
        targetID = null;
        isActive = false;
        message.reply("✅ Process stopped.");
    }

    if (command === "!pr") {
        if (args.length < 2 || isNaN(args[1])) {
            return message.reply("⚠️ Provide a valid amount: !pr <amount>");
        }
        minAmount = parseFloat(args[1]);
        message.reply(`✅ Minimum amount set to: ${minAmount}`);
    }

    if (command === "!give") {
        if (args.length < 3 || args[2].toLowerCase() !== 'all') {
            return message.reply("⚠️ Correct format: !give <id> all");
        }

        const giveID = args[1];

        try {
            const targetChannel = await client.channels.fetch(channelRobID);
            if (!targetChannel || !targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) return;

            message.reply(`⏳ Executing !give ${giveID} all in 10 seconds...`);

            setTimeout(async () => {
                await targetChannel.send("!with all");
                await new Promise(resolve => setTimeout(resolve, 1000));
                await targetChannel.send(`!give ${giveID} all`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                await targetChannel.send(`!give ${giveID} all`);

                if (setByUser) {
                    const adminUser = await client.users.fetch(setByUser);
                    adminUser.send(`✅ Successfully executed !give ${giveID} all`);
                }

            }, 10000);

        } catch (error) {
            console.error('❌ Error executing !give:', error);
            message.reply("❌ Error occurred.");
        }
    }

    if (command === "!st") {
        if (args.length < 2) {
            return message.reply("⚠️ Provide a status: !st <status>");
        }
        const status = args.slice(1).join(" ");
        client.user.setActivity(status, { type: 'PLAYING' });
        message.reply(`✅ Status set to: ${status}`);
    }

    if (command === "!help") {
        return message.reply(`
📌 Available commands:

!set <id> → Set the target user.

!stop → Stop the process.

!pr <amount> → Set minimum withdrawal.

!give <id> all → Executes withdrawal and giving sequence.

!st <status> → Set bot status.

!help → Show this message.
`);
    }
});

// التعامل مع أوامر المستخدم المستهدف
client.on("messageCreate", async (message) => {
    if (!targetID || isActive || message.author.id !== targetID) return;

    // التعرف على أمر !with واستخراج القيمة
    const withCommand = message.content.match(/^!with\s+(\d+(\.\d+)?(e\d+)?$/i);
    const isWithAll = message.content.toLowerCase() === '!with all';

    if (!withCommand && !isWithAll) return; // إذا لم يكن الأمر !with أو !with all، يتم الخروج

    let amount = null;
    if (withCommand) {
        amount = parseFloat(withCommand[1]); // استخراج القيمة من الأمر
    }

    // إذا كان الأمر !with all، يتم تنفيذ الإجراء مباشرة
    // إذا كان الأمر !with <قيمة>، يتم التحقق من أن القيمة تساوي أو تزيد عن minAmount
    if (withCommand && minAmount && amount < minAmount) return;

    isActive = true;

    const validChannels = [
        '1328058088221053119', '1339298478182105088',
        '1341198094397607956', '1328057861590220841', '1328057993085976659'
    ];

    if (!validChannels.includes(message.channel.id)) return;

    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;

    try {
        const targetChannel = await client.channels.fetch(targetChannelID);
        if (!targetChannel || !targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) return;

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));
        await targetChannel.send(`!rob ${targetID}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await targetChannel.send('!dep all');

        targetID = null;

        if (setByUser) {
            const adminUser = await client.users.fetch(setByUser);
            adminUser.send(`✅ Successfully robbed ${message.author.username}`);
        }

    } catch (error) {
        console.error('❌ Execution error:', error);
    } finally {
        isActive = false;
    }
});

// تسجيل الدخول
client.login(mySecret).catch(console.error);
