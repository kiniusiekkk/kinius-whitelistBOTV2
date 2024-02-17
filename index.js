const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./komendy/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./komendy/${file}`);
    client.commands.set(command.name, command);
}
const prefix = "!"
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).run({ client, message, args });
    } catch (error) {
        console.error(error);
        message.reply('Wystąpił problem!');
    }
});
client.on('ready', ()=> {
  console.log('Działam bezpiecznie ;]')
  client.user.setActivity('Kinius robi cos na GH', {type:'LISTENING'}) //zostaw to bo to moje XDD
})
client.login("ZMIEN TOKEN") // wpisz se swoj token
