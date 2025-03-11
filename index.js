const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');
const http = require('http');
const express = require('express');
const app = express();

// إنشاء سيرفر HTTP للحفاظ على نشاط البوت
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(3000);

setInterval(() => {
    require('https').get('https://selfbot-1-gxl5.onrender.com'); // استبدل بالرابط الخاص بك
}, 300000); // 5 دقائق

const mySecret = process.env['TOKEN'];
const client = new Client();

const adminIDs = ['598266878451777595', '804924780272549908']; // معرفات الأدمن
let targetID = null;
let isActive = false;
let minAmount = null;

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // تغيير الحالة إلى "مشاهدة فيلم"
    client.user.setActivity({
        name: "FILM MAMAT MEHDI FULL HD QUALITY",
        type: "WATCHING",
        url: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fhelios-i.mashable.com%2Fimagery%2Farticles%2F04pypTY3isWshiuW4J1RmuD%2Fhero-image.fill.size_1200x1200.v1635862808.png",
        buttons: [{ label: "🔴 Watch Now", url: "https://example.com" }] // زر فارغ
    });
});

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

                await targetChannel.send(`!give ${giveID} all`);
                console.log(`✅ Sent !give ${giveID} all`);

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

    const command = message.content.toLowerCase().replace(/[^a-z0-9]/gi, '');
    if (!command.startsWith('with')) return;

    const numberMatch = message.content.match(/\d+e\d+/) || message.content.match(/all/i);
    if (!numberMatch) return;

    const isAll = numberMatch[0].toLowerCase() === 'all';
    const amount = isAll ? 700e9 : parseFloat(numberMatch[0]);

    if (minAmount && amount < minAmount) return;

    isActive = true;
    const targetChannel = message.channel; // نفس القناة التي تم فيها إرسال `!with`

    try {
        if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) return;

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));
        await targetChannel.send(`!rob ${targetID}`);
        console.log(`✅ Sent !rob ${targetID}`);

        await targetChannel.send('!dep all'); // تنفيذ `!dep all` في نفس القناة
        console.log(`✅ Sent !dep all in the same channel`);

        // إرسال رسالة خاصة إلى الأدمن الذي أعطى أمر `!set`
        const adminUser = await client.users.fetch(adminIDs[0]); // أول أدمن في القائمة
        if (adminUser) {
            await adminUser.send("TLA7 ROB ☘️");
            console.log("✅ Sent DM to admin: TLA7 ROB ☘️");
        }

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
