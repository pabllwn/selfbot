const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN']; 
const client = new Client();

let flag = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`); 
});

client.on("messageCreate", message => {
    // تأكد من أن الرسالة من المستخدم المحدد
    if (message.author.id !== '758076857353502740') return;
    if (flag) return;

    const channel = client.channels.cache.get('1276724488750370847'); // chat ROB
    const channel1 = client.channels.cache.get('1276724488750370847'); // chat FIN TATl3b
    const rob = client.channels.cache.get('1276724488750370847'); // CHAT FIN trobi

    // إزالة الفراغات والشرطات ثم التحقق من الأمر
    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');

    // تحقق إذا كان الأمر يبدأ بـ "!with"
    if (command.startsWith('!with')) {
        // استخراج الرقم بعد "!with"
        const number = command.match(/\d+e\d+/);
        if (number && parseFloat(number[0]) >= 6e15) {
            flag = true;

            // تنفيذ الأوامر
            channel.send('!rob 758076857353502740').then(() => console.log('Sent !rob command'));
            setTimeout(() => {
                channel1.send('<@758076857353502740> chrggg azbi chrggg hhhh').then(() => console.log('Sent !bal command'));
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

            // إيقاف السكربت بعد تنفيذ الأوامر
            setTimeout(() => {
                console.log('Script will now stop.');
                process.exit();  // إيقاف السكربت
            }, 11000);  // تأخير الوقت للتأكد من إرسال جميع الأوامر
        }
    }
});

client.login(mySecret).catch(console.error);
