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

function createCollectorValidate(msg, fn, users, n = 1) {
  const filter = (reaction, user) =>
    reaction.emoji.name === config.emoji.validate && users.includes(user.id);
  const collector = msg.createReactionCollector(filter, { max: n + 1 });
  collector.on('collect', () => {
    executeFunction(fn, [collector], msg.guild);
  });
  collector.on('end', () => console.log('end'));
}

async function createMessageValidate(channel, fnTxt, fnCol, users, n = 1) {
  const msg = await channel.send(fnTxt(0));
  await msg.react(config.emoji.validate);
  let i = 1;
  const fn = async () => {
    await fnCol(i);
    await msg.edit(fnTxt(i));
    await msg.reactions.resolve(config.emoji.validate).remove();
    if (i <= n) {
      await msg.react(config.emoji.validate);
    }
    i++;
  };
  createCollectorValidate(msg, fn, users, n);
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
