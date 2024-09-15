const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", async message => {
    // Check if the message mentions the bot
    if (message.mentions.has(client.user)) {
        try {
            // React with the custom emoji <a:11pm_huh:1037868024914522212>
            await message.react('<a:11pm_huh:1037868024914522212>');
            console.log('Reacted with the custom emoji!');
        } catch (error) {
            console.error('Failed to react:', error);
        }
    }
});

client.login(mySecret).catch(console.error);
