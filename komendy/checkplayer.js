const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageButton } = require('discord-buttons')
module.exports = {
  name: 'checkplayer',
  desc: 'sprawdzanie info',
  run: async ({ client, message }) => {
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
    const ogolnietoBazaDanych = 'baza.json';

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }

    const embed = new MessageEmbed()
      .setColor(0xff7300)
      .setDescription('# [Informacje o graczu](https://discord.id/)')
      .addField('Czy ma zdane:', data[oznaczonyZlomek]?.zdane === 'Tak' ? 'Tak' : 'Nie')
      .addField('Discord:', oznaczonyZlomek)
      .addField('Discord ID:', ZlomekID)
      .addField('SteamHEX', data[oznaczonyZlomek]?.steamHex || 'Nie zdawał');
    if (data[oznaczonyZlomek]?.zdane === 'Tak') {
      const examiner = data[oznaczonyZlomek]?.kto_zdawal || 'Brak informacji';
      const examDate = data[oznaczonyZlomek]?.date || 'Brak informacji';
      embed.addField('Kto zdawał:', `<@${examiner}>`);
      embed.addField('Kiedy:', examDate);
    }

    message.channel.send(embed);
  },
};
