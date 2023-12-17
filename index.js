const fs = require('fs').promises;
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { PresidentsModel } = require("./database");
const { CronJob } = require('cron');
const dotenv = require("dotenv");
dotenv.config();


const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  }
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

const sendDailyMessage = async () => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const eventosData = await fs.readFile('eventos.json', 'utf8');
    const parsedEventsData = JSON.parse(eventosData);

    const currentDateKey = `${month}-${day}`;
    const eventsForToday = parsedEventsData[currentDateKey];

    if (eventsForToday && eventsForToday.length > 0) {
      const events = eventsForToday.join('\n');
      const myChannelId = '120363204550105594@newsletter';
      if (myChannelId) {
        const msg = `*HOJE NA HISTÓRIA*\n\n📅 Acontecimento em *${day}/${month}*\n\n${events}\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
        await client.sendMessage(myChannelId, msg);
        console.log(`Mensagem de eventos hist do dia enviada ${day}/${month}`);
      } else {
        console.log('Channels are not supported in your country');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

const sendHolidayMessage = async () => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const holidayData = await fs.readFile('holidayBr.json', 'utf8');
    const parsedHolidayData = JSON.parse(holidayData);

    const currentDateKey = `${month}-${day}`;
    const holidayForToday = parsedHolidayData[currentDateKey];

    if (holidayForToday && holidayForToday.births && holidayForToday.births.length > 0) {
      const holidays = holidayForToday.births.map(holiday => `• ${holiday.name}`).join('\n');
      const myChannelId = '120363204550105594@newsletter';

      if (myChannelId) {
        const msg = `*🎊 | Data comemorativa do dia 🇧🇷* \n\n*${day}/${month}*\n\n${holidays}\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
        await client.sendMessage(myChannelId, msg);
        console.log(`Mensagem de feriados do dia enviada ${day}/${month}`);
      } else {
        console.log('Channels are not supported in your country');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

const sendPhraseMessage = async () => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const phraseData = await fs.readFile('frases.json', 'utf8');
    const parsedPhraseData = JSON.parse(phraseData);

    const currentDateKey = `${month}-${day}`;
    const phraseForToday = parsedPhraseData[currentDateKey];

    if (phraseForToday && phraseForToday.quote && phraseForToday.author) {
      const quote = phraseForToday.quote;
      const author = phraseForToday.author;
      const myChannelId = '120363204550105594@newsletter';

      if (myChannelId) {
        const msg = `*🌟 | Frase Inspiradora do Dia* \n\n*${day}/${month}*\n\n${quote}\n\n_${author}_\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
        await client.sendMessage(myChannelId, msg);
        console.log(`Mensagem com frase inspiradora do dia enviada ${day}/${month}`);
      } else {
        console.log('Channels are not supported in your country');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

const sendCuriosityMessage = async () => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    const curiosityData = await fs.readFile('curiosidade.json', 'utf8');
    const parsedCuriosityData = JSON.parse(curiosityData);

    const currentDateKey = `${month}-${day}`;
    const curiosityForToday = parsedCuriosityData[currentDateKey];

    if (curiosityForToday && curiosityForToday.texto) {
      const curiosityText = curiosityForToday.texto;
      const myChannelId = '120363204550105594@newsletter';

      if (myChannelId) {
        const msg = `*Curiosidades Históricas 📜*\n\n${curiosityText}\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
        await client.sendMessage(myChannelId, msg);
        console.log(`Mensagem de curiosidade do dia enviada ${day}/${month}`);
      } else {
        console.log('Channels are not supported in your country');
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
};


const sendPresidentMessage = async () => {
  try {
    const myChannelId = '120363204550105594@newsletter';

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    console.log('Checking count of PresidentsModel documents...');
    const count = await PresidentsModel.countDocuments({});
    console.log('Count:', count);

    if (count === 0) {
      console.log('No presidents found, attempting to create a new one...');

      const presidentesFile = await fs.readFile('presidentes.json', 'utf8');
      const presidentes = JSON.parse(presidentesFile);
      const presidente = presidentes['1'];
      const id_new = 1;
      await PresidentsModel.create({ id: id_new, date: currentDate });

      console.log('President data:', presidente);

      const URL = presidente.foto;
      const caption = `*${presidente.titulo}*\n\n*Nome:* ${presidente.nome}\n*Informação:* ${presidente.posicao}° ${presidente.titulo}\n*Partido:* ${presidente.partido}\n*Ano de mandato:* ${presidente.ano_de_mandato}\n*Vice-Presidente:* ${presidente.vice_presidente}\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
      console.log(caption)
      console.log('Sending message with president information...');
      var media = await MessageMedia.fromUrl(URL);
      await client.sendMessage('120363204550105594@newsletter', media, { caption: caption });

      console.log('Message sent with president information.');
    } else {
      console.log('Existing presidents found, checking for updates...');
      const ultimoPresidente = await PresidentsModel.findOne({}, {}, { sort: { _id: -1 } });
      const ultimoId = ultimoPresidente.id;
      const dataEnvio = new Date(ultimoPresidente.date);

      const todayStr = today.toISOString().split('T')[0];

      if (ultimoPresidente.date !== todayStr) {

        const proximoId = ultimoId + 1;
        const presidentesFile = await fs.readFile('presidentes.json', 'utf8');
        const presidentes = JSON.parse(presidentesFile);
        const proximoPresidente = presidentes[proximoId.toString()];

        if (proximoPresidente) {
          await PresidentsModel.updateOne(
            { date: ultimoPresidente.date },
            { $set: { date: todayStr }, $inc: { id: 1 } }
          );

          const presidente = proximoPresidente;
          const URL = presidente.foto;
          const caption = `*${presidente.titulo}*\n\n*Nome:* ${presidente.nome}\n*Informação:* ${presidente.posicao}° ${presidente.titulo}\n*Partido:* ${presidente.partido}\n*Ano de mandato:* ${presidente.ano_de_mandato}\n*Vice-Presidente:* ${presidente.vice_presidente}\n\n\`\`\`⭐️ Inscreva-se no nosso canal\`\`\``;
          const media = await MessageMedia.fromUrl(URL);
          await client.sendMessage(myChannelId, media, { caption: caption });

          console.log(`Mensagem com informações do próximo presidente enviada.`);
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
};


client.on('ready', () => {
  console.log('Client is ready!');
  const EventsJob = new CronJob('30 08 * * *', sendDailyMessage);
  EventsJob.start();
  const HolidayJob = new CronJob('00 11 * * *', sendHolidayMessage);
  HolidayJob.start();
  const PhraseJob = new CronJob('00 14 * * *', sendPhraseMessage);
  PhraseJob.start();
  const CurisotyJob = new CronJob('00 18 * * *', sendCuriosityMessage);
  CurisotyJob.start();
  const PresidentsJob = new CronJob('59 23 * * *', sendPresidentMessage);
  PresidentsJob.start();
});

client.initialize();
