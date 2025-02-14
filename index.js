const { Client } = require('discord.js-selfbot-v13');
const mySecret = process.env['TOKEN'];
const client = new Client({ checkUpdate: false });

const targetUsers = ['757369584050503741', '1329835932878245939']; // الأيديّات المستهدفة
const targetChannels = {
    rob: '1328057993085976659', // شات !rob
    dep1: '1328057861590220841', // الشات الأول لـ !dep all
    dep2: '1339298478182105088', // الشات الثاني لـ !dep all
};
const minAmount = 500e12; // الرقم الأدنى المقبول
let executed = false; // منع إعادة التنفيذ

client.on("ready", () => {
    console.log(`تم تسجيل الدخول باسم ${client.user.tag}`);
});

client.on("messageCreate", message => {
    if (!targetUsers.includes(message.author.id)) return; // التأكد أن المرسل من المستهدفين
    if (executed) return; // التأكد من عدم تكرار التنفيذ

    const command = message.content.toLowerCase().replace(/[-\s]+/g, ''); // تنظيف الأمر
    if (command.startsWith('!with')) {
        // التحقق من الأمر إذا كان يحتوي على "all" أو رقم علمي
        const numberMatch = command.match(/^\!with (all|\d+(\.\d+)?e\d+)$/);

        if (numberMatch) {
            const inputNumber = numberMatch[1].toLowerCase();
            
            // إذا كان الرقم "all" أو الرقم المدخل أكبر من الحد الأدنى
            if (inputNumber === 'all' || Number(inputNumber) >= minAmount) {
                executed = true; // تعيين العلم
                const robChannel = client.channels.cache.get(targetChannels.rob);
                const dep1Channel = client.channels.cache.get(targetChannels.dep1);
                const dep2Channel = client.channels.cache.get(targetChannels.dep2);

                // تنفيذ الأوامر
                robChannel.send(`!rob ${message.author.id}`)
                    .then(() => {
                        console.log(`تم إرسال !rob إلى ${message.author.id}`);
                        return dep1Channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال أول !dep all');
                        return new Promise(resolve => setTimeout(resolve, 1000)); // الانتظار ثانية واحدة
                    })
                    .then(() => {
                        return dep1Channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال ثاني !dep all');
                        return new Promise(resolve => setTimeout(resolve, 2000)); // الانتظار ثانيتين
                    })
                    .then(() => {
                        return dep2Channel.send('!dep all');
                    })
                    .then(() => {
                        console.log('تم إرسال ثالث !dep all');
                        client.destroy(); // إيقاف البوت
                        console.log('تم إيقاف البوت.');
                    })
                    .catch(console.error);
            } else {
                console.log('الرقم أقل من الحد الأدنى المحدد.');
            }
        } else {
            console.log('الأمر غير صحيح.');
        }
    }
});

client.login(mySecret).catch(console.error);
