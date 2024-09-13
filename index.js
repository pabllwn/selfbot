const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", message => {
   
    const channel = client.channels.cache.get('1037831299592880209'); // chat ROB
    const channel1 = client.channels.cache.get('1037831299592880209'); // chat FIN TATl3b
    const rob = client.channels.cache.get('1047751275665698867'); //  CHAT FIN trobi

    if (flag) return;


    if (message.content.toLowerCase().replace(/\s+/g, '').startsWith('!withall') &&
        (message.author.id === "1279031333435478027")) {
        flag = true;

        
        channel.send('!rob 1279031333435478027').then(() => console.log('Sent !rob command'));
        setTimeout(() => {
            channel1.send('!cf 100').then(() => console.log('Sent !bal command'));
        }, 2000);
        setTimeout(() => {
            channel1.send('!buy K').then(() => console.log('Sent !buy command'));
        }, 1500);
        setTimeout(() => {
            channel1.send('!dep all').then(() => console.log('Sent !with 500 command'));
        }, 1000);
        setTimeout(() => {
            channel1.send('!with 10e6').then(() => console.log('Sent !cf 100 command'));
        }, 9000);
        setTimeout(() => {
            channel1.send('!dep all').then(() => console.log('Sent !dep all command'));
        }, 1200);
        setTimeout(() => {
            rob.send('!lb ').then(() => console.log('Sent !dep all command  for rob'));
        }, 1500); 
    }
}); 
client.login(mySecret).catch(console.error); 
                                                               
