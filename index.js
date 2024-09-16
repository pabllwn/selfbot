const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", message => {
   
    const channel = client.channels.cache.get('1037831299592880209'); // chat ROB
    const channel1 = client.channels.cache.get('1037831272829034617'); // chat FIN TATl3b
    const rob = client.channels.cache.get('1037831289585291264'); // CHAT FIN trobi

    if (flag) return;

    // Remove spaces and dashes, then check the command
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // Check if the command starts with "!with"
    if (command.startsWith('!with')) {
        // Extract the number following "!with"
        const number = command.match(/\d+e\d+/);
        if (number && parseFloat(number[0]) >= 6e15) {
            flag = true;

            // Execute commands
            channel.send('!rob 1279031333435478027').then(() => console.log('Sent !rob command'));
            setTimeout(() => {
                channel1.send('<@1279031333435478027> chrggg azbi chrggg hhhh').then(() => console.log('Sent !bal command'));
            }, 3000);
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !buy command'));
            }, 1500);
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !with 500 command'));
            }, 1000);
            setTimeout(() => {
                channel1.send('!rr start').then(() => console.log('Sent !cf 100 command'));
            }, 9000);
            setTimeout(() => {
                channel1.send('!dep all').then(() => console.log('Sent !dep all command'));
            }, 1200);
            setTimeout(() => {
                rob.send('!lb ').then(() => console.log('Sent !dep all command for rob'));
            }, 1500); 

            // Stop the script after executing the commands
            setTimeout(() => {
                console.log('Script will now stop.');
                process.exit();  // Stops the script
            }, 11000);  // Time delay to ensure all commands are sent
        }
    }
});

client.login(mySecret).catch(console.error);
