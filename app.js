//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';

const Discord = require('discord.js');
const config = require('./config.json');
const { executeFunction } = require('./src/Utility');
const { reactToAdd } = require('./src/React');

const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('ready', () => {
  console.log('Starting!');
  client.user.setActivity('Murdering!');
  const chan = client.channels.resolve(config.rulesChannelID);
  chan.messages.fetchPinned().then((msgs) =>
    msgs.forEach(async (msg) => {
      await msg.reactions.removeAll();
      await msg.react(config.emoji.validate);
    })
  );
});

client.on('message', (msg) => {
  if (msg.author.bot) {
    return;
  }
  console.log(msg.content);
});

client.on('messageReactionAdd', (react, user) =>
  executeFunction(reactToAdd, [react, user], react.message.guild)
);

client
  .login(config.token)
  .then(() => console.log("We're in!"))
  .catch((err) => console.log(err));
