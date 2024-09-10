
const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", message => {
   
    const channel = client.channels.cache.get('1037831289585291264'); // chat ROB
    const channel1 = client.channels.cache.get('1047751275665698867'); // chat FIN TATl3b
    const rob = client.channels.cache.get('1037831299592880209'); //  CHAT FIN trobi

    if (flag) return;


    if (message.content.toLowerCase().replace(/\s+/g, '').startsWith('!withall') &&
        (message.author.id === "598266878451777595")) {
        flag = true;

        
        channel.send('!rob 598266878451777595').then(() => console.log('Sent !rob command'));
        setTimeout(() => {
            channel1.send('!bal').then(() => console.log('Sent !bal command'));
        }, 500);
        setTimeout(() => {
            channel1.send('!buy K').then(() => console.log('Sent !buy command'));
        }, 700);
        setTimeout(() => {
            channel1.send('!dep all').then(() => console.log('Sent !with 500 command'));
        }, 800);
        setTimeout(() => {
            channel1.send('!with 10e6').then(() => console.log('Sent !cf 100 command'));
        }, 900);
        setTimeout(() => {
            channel1.send('!dep all').then(() => console.log('Sent !dep all command'));
        }, 200);
        setTimeout(() => {
            rob.send('!dep all').then(() => console.log('Sent !dep all command  for rob'));
        }, 500); 
    }
}); 
client.login(mySecret).catch(console.error); 
                                                             
