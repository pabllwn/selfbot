const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// List of target user IDs
const targetUsers = [
    '804924780272549908', // User 1
    '839275337832464384', // User 2
    '574540758707732490'  // User 3
];

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", async message => {
    // Check if the message author is one of the target users
    if (targetUsers.includes(message.author.id)) {
        try {
            // React with the custom emoji <a:11pm_huh:1037868024914522212>
            await message.react('<:danger:1258766666926395493>');
            console.log(`Reacted to message from ${message.author.tag}`);
        } catch (error) {
            console.error('Failed to react:', error);
        }
    }
});

client.login(mySecret).catch(console.error);
             
