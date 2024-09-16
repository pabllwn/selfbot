const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", message => {
    if (message.author.id !== '1276715636717781012') return;
    if (flag) return;

    const channel = client.channels.cache.get('1276715636717781012'); // chat ROB
    const channel1 = client.channels.cache.get('1276715636717781012'); // chat FIN TATl3b
    const rob = client.channels.cache.get('1276715636717781012'); // CHAT FIN trobi

    // Remove whitespace and dashes then check command
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // Check if the command starts with "!with"
    if (command.startsWith('!with')) {
        // Extract the number after "!with"
        const number = command.match(/\d+e\d+/) || command.match(/all/);
        if (number && (parseFloat(number[0]) >= 180e15 || number[0] === 'all')) {
            flag = true;

            // Execute commands
            channel.send('!rob 1276715636717781012').then(() => console.log('Sent !rob command'));
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !bal command'));
            }, 2000);
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !buy command'));
            }, 1500);
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !with 500 command'));
            }, 1000);
            setTimeout(() => {
            // Stop the script after executing commands
            setTimeout(() => {
                console.log('Script will now stop.');
                process.exit();  // Stop the script
            }, 2000);  // Delay to ensure all commands are sent
        }
    }
});

client.login(mySecret).catch(console.error);
