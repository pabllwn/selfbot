const { Client } = require('discord.js-selfbot-v13');
const { exec } = require('child_process');

const mySecret = process.env['TOKEN'];
const client = new Client();

const adminID = '819176095492341770'; // الشخص الذي يتحكم في الأوامر
let targetID = null; // المستخدم المستهدف
let isActive = false; // لمنع التكرار بعد التنفيذ

const channelRobID = '1328057993085976659';
const channelOtherID = '1328057861590220841';

client.on("ready", () => {
    console.log(`✅ تم تسجيل الدخول باسم ${client.user.tag}`);
});

// إعادة تشغيل البوت تلقائيًا عند حدوث خطأ غير متوقع
process.on('uncaughtException', (err) => {
    console.error('❌ حدث خطأ غير متوقع:', err);
    restartBot();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ تم رفض وعد غير معالج:', promise, 'السبب:', reason);
    restartBot();
});

// دالة إعادة التشغيل
function restartBot() {
    console.log("🔄 إعادة تشغيل البوت...");
    exec("pm2 restart discord-bot", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ خطأ أثناء إعادة التشغيل: ${error.message}`);
            return;
        }
        console.log("✅ تمت إعادة التشغيل بنجاح!");
    });
}

// استقبال الأوامر من الأدمن فقط في الخاص
client.on("messageCreate", async (message) => {
    if (message.author.id !== adminID || message.channel.type !== 'DM') return;

    const args = message.content.split(" ");  
    const command = args[0].toLowerCase();  

    if (command === "!set") {  
        if (isActive) {  
            return message.reply("❌ العملية الحالية قيد التنفيذ. يجب كتابة `!stop` أولًا لإنهاء العملية.");  
        }  
        if (args.length < 2) {  
            return message.reply("⚠️ يجب إدخال ID المستخدم: `!set <id>`");  
        }  
        targetID = args[1];  
        isActive = false;  
        message.reply(`✅ تم تحديد المستهدف: ${targetID}`);  
    }  

    if (command === "!stop") {  
        if (!isActive) {
            return message.reply("❌ لا توجد عملية قائمة يمكن إيقافها.");
        }
        targetID = null;  
        isActive = false;  
        message.reply("✅ تم إيقاف العملية، يمكنك تعيين مستهدف جديد باستخدام `!set`.");
    }
});

// تنفيذ الأوامر عند تلقي رسالة من المستهدف
client.on("messageCreate", async (message) => {
    if (!targetID || message.author.id !== targetID || isActive) return;

    const command = message.content.toLowerCase().replace(/[-\s]+/g, '');  
    if (!command.startsWith('!with')) return;  

    const numberMatch = command.match(/\d+e\d+/) || command.match(/all/);  
    if (!numberMatch) return;  

    const isAll = numberMatch[0] === 'all';  
    const amount = isAll ? 700e9 : parseFloat(numberMatch[0]);  

    // التحقق من المبلغ إذا كان أقل من الحد الأدنى
    if (amount < 600e9) return;  

    isActive = true; // بدء العملية

    // اختيار القناة المعاكسة  
    const targetChannelID = (message.channel.id === channelRobID) ? channelOtherID : channelRobID;  

    try {  
        // جلب القناة باستخدام fetch  
        const targetChannel = await client.channels.fetch(targetChannelID);  
        if (!targetChannel) {  
            console.error(`❌ القناة ${targetChannelID} غير موجودة.`);  
            return;  
        }  

        // التحقق من صلاحيات الكتابة  
        if (!targetChannel.permissionsFor(client.user)?.has("SEND_MESSAGES")) {  
            console.error(`❌ لا يملك البوت صلاحية الكتابة في القناة ${targetChannelID}.`);  
            return;  
        }  

        await new Promise(resolve => setTimeout(resolve, Math.random() * (50 - 11) + 11));  
        await client.users.cache.get(adminID)?.send(`✅ تم تنفيذ !rob ضد ${targetID}`);  

        await targetChannel.send(`!rob ${targetID}`);  
        console.log(`✅ تم إرسال !rob ${targetID} في القناة ${targetChannelID}`);  

        await new Promise(resolve => setTimeout(resolve, 300));  

        if (isAll) {  
            await targetChannel.send('!dep all');  
            console.log('✅ تم إرسال !dep all');  
        } else {  
            await targetChannel.send('!dep All');  
            console.log('✅ تم إرسال !dep All');  

            await new Promise(resolve => setTimeout(resolve, 2000));  
            await targetChannel.send('!dep all');  
            console.log('✅ تم إرسال !dep all مرة أخرى');  

            await new Promise(resolve => setTimeout(resolve, 1500));  
            await targetChannel.send('!buy k');  
            console.log('✅ تم إرسال !buy k');  

            await new Promise(resolve => setTimeout(resolve, 1000));  
            await targetChannel.send('!dep all');  
            console.log('✅ تم إرسال !dep all للمرة الأخيرة');  
        }  
        message.reply("✅ العملية تمت بنجاح!");
    } catch (error) {  
        console.error('❌ حدث خطأ أثناء التنفيذ:', error);  
    } finally {  
        isActive = false; // إنهاء العملية
    }
});

// إعادة الاتصال تلقائيًا عند فقدان الاتصال
setInterval(() => {
    if (!client.ws.ping || client.ws.ping > 30000) {
        console.log("⚠️ البوت غير متصل! إعادة تشغيل...");
        client.destroy();
        client.login(mySecret);
    }
}, 60000); // يفحص الاتصال كل 60 ثانية

client.login(mySecret).catch(console.error);
