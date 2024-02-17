const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "zdal",
  desc: "Zdawanie wlki",
  run: async ({ client, message }) => {
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice('!'.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === '') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription('Podaj oznaczenie użytkownika, STEAMHEX: `!zdal @WZMIANKA HEX`');
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
    const errors = parseInt(args[2]);
    const ogolnietoBazaDanych = 'baza.json';
    const ROLEID = '1203360312863105044';

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }

    if (data[oznaczonyZlomek] && data[oznaczonyZlomek].zdane === 'Tak') {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setDescription(`${oznaczonyZlomek} już ma ZDANE!`);
      message.channel.send(embed);
      return;
    }

    const currentDate = new Date().toISOString(); 
    if (!data[oznaczonyZlomek]) {
      data[oznaczonyZlomek] = { 
        zdane: 'Tak', 
        id_discord: ZlomekID, 
        date: currentDate, 
        kto_zdawal: message.author.id,
        steamHex: steamHex 
      };
    } else {
      data[oznaczonyZlomek].zdane = 'Tak';
      data[oznaczonyZlomek].date = currentDate;
      data[oznaczonyZlomek].kto_zdawal = message.author.id;
      data[oznaczonyZlomek].steamHex = steamHex; 
    }
    if (args[2] === "5") return;
    fs.writeFile(ogolnietoBazaDanych, JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Błąd zapisu do pliku:', err);
        return;
      }
      console.log(`Zapisano dane użytkownika ${oznaczonyZlomek}`);
      const member = message.guild.members.cache.get(ZlomekID);
      if (member) {
        const role = message.guild.roles.cache.get(ROLEID);
        if (role) {
          member.roles.add(role);
          console.log(`Przypisano rolę użytkownikowi ${oznaczonyZlomek}`);
        } else {
          console.error('Nie znaleziono roli o podanym ID');
        }
      } else {
        console.error('Nie znaleziono użytkownika o podanym ID');
      }
    });
    const examiner = data[oznaczonyZlomek]?.kto_zdawal || 'Brak informacji';
    const examDate = data[oznaczonyZlomek]?.date || 'Brak informacji';
    const embedZdane = new MessageEmbed()
      .setColor(0xff7300)
      .setAuthor(`${oznaczonyZlomek} zdał egzamin WL!`)
      .setDescription(`\n> **Kto zdawał: \`${examiner}\`**\n> **Kiedy zdawał: \`${examDate}\`**\n> **Otrzymał range WL: \`${data[oznaczonyZlomek]?.zdane === 'Tak' ? 'Tak' : 'Nie'}\`**\n> **Czy zdał egzamin: \`${data[oznaczonyZlomek]?.zdane === 'Tak' ? 'Tak' : 'Nie'}\`**\n> **Steam HEX: \`${data[oznaczonyZlomek].steamHex}\`**\n> **Discord ID: \`${mentionedUser.id}\`**`);
    message.channel.send(embedZdane);
  },
};
