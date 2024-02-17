const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "niezdal",
  desc: "Niezaliczenie egzaminu",
  run: async ({ client, message }) => {
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Podaj oznaczenie użytkownika i STEAMHEX: `!niezdal @WZMIANKA HEX`');
      message.channel.send(embed);
      return;
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Nie oznaczono użytkownika!');
      message.channel.send(embed);
      return;
    }

    const oznaczonyZlomek = mentionedUser.tag;
    const ZlomekID = mentionedUser.id;
    const steamHex = args[1]; 
    if(!steamHex) return message.reply('Nie można wykonać komendy bo nie ma HEXA')
    const ogolnietoBazaDanych = 'baza.json';

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }
    
    const currentDate = new Date().toISOString(); 
    if (!data[oznaczonyZlomek]) {
      data[oznaczonyZlomek] = { zdane: 'Nie', id_discord: ZlomekID, kto_zdawal: message.author.id, date: currentDate, steamHex: steamHex };
    } else {
      if (data[oznaczonyZlomek].zdane === 'Tak') {
        const embed = new MessageEmbed()
          .setColor('#ff0000')
          .setDescription(`${oznaczonyZlomek} ma już zdane.`);
        message.channel.send(embed);
        return;
      }
      data[oznaczonyZlomek].steamHex = steamHex;
    }

    fs.writeFile(ogolnietoBazaDanych, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Błąd zapisu do pliku:', err);
        return;
      }
      console.log(`Zapisano dane użytkownika ${oznaczonyZlomek}`);
    });
    const examiner = data[oznaczonyZlomek]?.kto_zdawal || 'Brak informacji';
    const examDate = data[oznaczonyZlomek]?.date || 'Brak informacji';
    const embed = new MessageEmbed()
    .setColor(0xff7300)
    .setAuthor(`${oznaczonyZlomek} nie zdał egzaminu WL!`)
    .setDescription(`\n> **Kto zdawał: \`${examiner}\`**\n> **Kiedy zdawał: \`${examDate}\`**\n> **Otrzymał range WL: \`${data[oznaczonyZlomek]?.zdane === 'Tak' ? 'Tak' : 'Nie'}\`**\n> **Czy zdał egzamin: \`${data[oznaczonyZlomek]?.zdane === 'Tak' ? 'Tak' : 'Nie'}\`**\n> **Steam HEX: \`${data[oznaczonyZlomek].steamHex}\`**\n> **Discord ID: \`${mentionedUser.id}\`**`);
    message.channel.send(embed);
  },
};
