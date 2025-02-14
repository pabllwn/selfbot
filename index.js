const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

let executed = false; 
const defaultNumber = "5e12"; // الرقم الافتراضي

client.on("ready", () => {
    console.log(`your name acc ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (message.author.id !== '1329835932878245939') return; 
    if (executed) return; 

    const channel = client.channels.cache.get('1328057993085976659'); // ROB  
    const channel1 = client.channels.cache.get('1328057861590220841'); // FIN  

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    if (command.startsWith('!with')) {
        const numberMatch = command.match(/^\!with (\d+e\d+|\d{13,}|all)$/); 

        if (numberMatch || command === "!with") {
            const inputNumber = numberMatch ? numberMatch[1] : defaultNumber;  
            const parsedNumber = inputNumber.toLowerCase() === "all" ? "all" : parseFloat(inputNumber); // هنا يتم التحويل باستخدام parseFloat

            executed = true; 

            if (parsedNumber === "all" || parsedNumber >= parseFloat(defaultNumber)) {
                channel.send('!rob 1329835932878245939')
                    .then(() => {
                        console.log(' rob');
                        return channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('!dep all');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy(); 
                        console.log('off.');
                    });
            } else {
                channel.send(`!with ${parsedNumber}`)
                    .then(() => {
                        console.log(`   !with ${parsedNumber}`);
                        return channel1.send('!dep all');
                    })
                    .then(() => {
                        console.log('done');
                        return channel1.send('!dep all');
                    })
                    .then(() => {
                        console.log('done');
                    })
                    .catch(console.error)
                    .finally(() => {
                        client.destroy();  
                        console.log('تروبا.');
                    });
            }
        } else {
            console.log('باق "all".');
        }
    }
});

client.login(mySecret).catch(console.error);
