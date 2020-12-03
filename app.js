const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Murdering!');
});

client.on('message', (msg) => {
  if (msg.author.bot) {
    return;
  }
  console.log(msg.content);
});

client.on('messageReactionAdd', reactToAdd);

function reactToAdd(react, user) {
  console.log(react.emoji.name, user.tag);
}

client
  .login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
