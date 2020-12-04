//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');

function buildEmbedError(error) {
  let embed = new MessageEmbed();
  embed.setTitle(`${error.name}: ${error.message}`);
  embed.setDescription(error.stack);
  embed.setColor('#FF0000');
  embed.setTimestamp();
  return embed;
}

async function sendError(error, guild) {
  try {
    console.log(error);
    let channel = guild.channels.resolve(config.logErrorChannelID);
    if (channel === undefined) {
      console.log('Log channel not found');
    } else {
      await channel.send(buildEmbedError(error, channel));
    }
  } catch (e) {
    console.log(error);
  }
}

async function executeFunction(fn, args, guild) {
  try {
    await fn(...args);
  } catch (e) {
    console.log('?');
    await sendError(e, guild);
  }
}

function createCollectorValidate(msg, fn, users) {
  const filter = (reaction, user) =>
    reaction.emoji.name === config.emoji.validate && users.includes(user.id);
  const collector = msg.createReactionCollector(filter, { time: 15000 });
  collector.on('collect', (r) => {
    executeFunction(fn, [], msg.guild);
  });
}

async function createMessageValidate(channel, fnTxt, fnCol, users) {
  const msg = await channel.send(fnTxt(1));
  await msg.react(config.emoji.validate);
  const fn = async () => {
    await fnCol();
    await msg.edit(fnTxt(2));
  };
  createCollectorValidate(msg, fn, users);
}

// https://stackoverflow.com/a/28191966/8040287
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

module.exports = {
  executeFunction,
  sendError,
  createMessageValidate,
  getKeyByValue,
};
