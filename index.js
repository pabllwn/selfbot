const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

// List of target user IDs
const targetUsers = [
    '765978295795187734', // User 1
    '768194527608438805', // User 2
    '1226198370683715624',
    '803949691288027198',
    '1312405318218813592',// User 3
    '412902064952180736',
];

// Emoji to react with
const reactionEmoji = '<:keres:1090368386673946666>';

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", async message => {
    try {
        // Check if the message author is one of the target users
        const authorInVoiceChannel = isUserInSameVoiceChannel(message.author.id);
        if (targetUsers.includes(message.author.id) || authorInVoiceChannel) {
            // React with the custom emoji
            await message.react(reactionEmoji);
            console.log(`Reacted to message from ${message.author.tag}`);
        }
    } catch (error) {
        console.error('Failed to react:', error);
    }
});

// Function to check if a user is in the same voice channel
function isUserInSameVoiceChannel(userId) {
    const guilds = client.guilds.cache;
    for (const [guildId, guild] of guilds) {
        const me = guild.members.cache.get(client.user.id); // Bot's member object
        const user = guild.members.cache.get(userId); // Target user's member object
        if (me && user && me.voice.channelId && me.voice.channelId === user.voice.channelId) {
            return true;
        }
    }
    return false;
}

client.login(mySecret).catch(console.error);
