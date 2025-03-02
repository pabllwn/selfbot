const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');

const mySecret = process.env['TOKEN'];
const client = new Client({
    keepAlive: true, // تمكين keepAlive
});

const adminIDs = ['598266878451777595', '804924780272549908'];
let targetID = null;
let isActive = false;
let minAmount = null;

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

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

    if (command === "!help") {
        return message.reply(`
**📌 Available commands:**
- \`!set <id>\` → Set the target user ID.
- \`!stop\` → Stop the current process.
- \`!pr <amount>\` → Set the minimum amount for !with.
- \`!give <id> all\` → Send all to the specified user.
- \`!help\` → Show this message.
        `);
    }
});

client.on("messageCreate", async (message) => {
    if (!targetID || message.author.id !== targetID || isActive) return;

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
        if (!targetChannel) {
            console.error(`❌ Channel ${targetChannelID} not found.`);
            return;
        }

        if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) {
            console.error(`❌ The bot doesn't have permission to send messages in channel ${targetChannelID}.`);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));
        await client.users.cache.get(adminIDs[0])?.send(`✅ !rob executed against ${targetID}`);

        await targetChannel.send(`!rob ${targetID}`);
        console.log(`✅ Sent !rob ${targetID} in channel ${targetChannelID}`);

        await new Promise(resolve => setTimeout(resolve, 300));

        if (isAll) {
            await targetChannel.send('!dep all');
            console.log('✅ Sent !dep all');
        } else {
            await targetChannel.send('!dep All');
            console.log('✅ Sent !dep All');

            await new Promise(resolve => setTimeout(resolve, 2000));
            await targetChannel.send('!dep all');
            console.log('✅ Sent !dep all again');
        }

        targetID = null;
        console.log(`✅ Target ID ${targetID} reset after rob execution.`);
        
        await client.users.cache.get(adminIDs[0])?.send(`✅ !rob executed successfully against ${message.author.tag}`);
    } catch (error) {
        console.error('❌ Error during execution:', error);
    } finally {
        isActive = false;
    }
});

setInterval(() => {
    if (!client.ws.ping || client.ws.ping > 30000) {
        console.log("⚠️ The bot is not connected! Reconnecting...");
        client.destroy();
        client.login(mySecret);
    }
}, 60000);

client.login(mySecret).catch(console.error);
