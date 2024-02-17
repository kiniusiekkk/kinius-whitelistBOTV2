const Discord = require('discord.js');

module.exports = {
  name: 'pytam',
  desc: 'Pytanie',
  run: async ({ client, message }) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      const embed = new Discord.MessageEmbed()
        .setTitle('OKIENKO OTWARTE')
        .setDescription('__**Zapraszamy do zdawania WL, wymagamy:**__\n> **Historii Postaci**\n> **Znajomość regulaminu**\n> **Znajomość Pojęć RP**\n> **Kreatywność**\n> **Link do Steama oraz HEX**\n> **Mutacja lub 15+**')
        .setColor(0xff7300)
        .setFooter('Administrator: ' + message.author.tag);
      message.channel.send('@everyone', embed);
    } else {
      message.channel.send('Przepraszam, nie masz uprawnień do wykonywania tej komendy.');
    }
  },
};
