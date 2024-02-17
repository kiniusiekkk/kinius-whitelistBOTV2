const fs = require('fs');
const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'pomoc',
  desc: 'Pomoc',
  run: async ({ client, message }) => {
    const embed = new MessageEmbed()
    .setColor(0xff7300)
    .setDescription(`> **!zdal @Nick** - \`Nadaj komuś Whitelist\`\n> **!niezdal @Nick** - \`Oblej komuś Whitelist\`\n> **!zdanewlki** - \`Sprawdz zdane WhiteList\`\n > **!checkplayer @Nick** - \`Sprawdz informacje o użytkowniku\`\n> **!pytam** - \`Wyślij ogłoszenie o zdawaniu WL\``)
    message.channel.send(embed)
}
}