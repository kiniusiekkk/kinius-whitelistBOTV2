const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "zdanewlki",
  desc: "Wyświetlanie zdanych egzaminów",
  run: async ({ client, message }) => {
    const ogolnietoBazaDanych = 'baza.json';
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
    } catch (error) {
      console.error('Błąd odczytu pliku:', error);
      data = {};
    }
    const zdaneEmbed = new MessageEmbed()
      .setColor(0xff7300)
      .setFooter('Whitelist System');
    
    let counter = 1;
    for (const [oznaczonyZlomek, userData] of Object.entries(data)) {
      if (userData.zdane === 'Tak') {
        const ZlomekID = userData.id_discord || 'Brak ID';
        zdaneEmbed.addField(`Zdany egzamin ${counter}`, `> **${oznaczonyZlomek} \`(${ZlomekID})\`**`);
        counter++;
      }
    }
    if (counter === 1) {
      zdaneEmbed.setDescription('\`Brak zdanych egzaminów.\`');
    }
    let sentMessage = await message.channel.send(zdaneEmbed);
    setInterval(async () => {
      try {
        const updatedData = JSON.parse(fs.readFileSync(ogolnietoBazaDanych));
        let updatedEmbed = new MessageEmbed()
          .setColor(0xff7300)
          .setFooter('Whitelist System');
        
        let counter = 1;
        for (const [oznaczonyZlomek, userData] of Object.entries(updatedData)) {
          if (userData.zdane === 'Tak') {
            const ZlomekID = userData.id_discord || 'Brak ID';
            updatedEmbed.addField(`Zdany egzamin ${counter}`, `> **${oznaczonyZlomek} \`(${ZlomekID})\`**`);
            counter++;
          }
        }
        if (counter === 1) {
          updatedEmbed.setDescription('\`Brak zdanych egzaminów.\`');
        }
        await sentMessage.edit(updatedEmbed);
      } catch (error) {
        console.error('Błąd odczytu pliku:', error);
      }
    }, 10000); // 60000ms = 1 minuta
  },
};
