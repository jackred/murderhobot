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
    console.log(channel.name);
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

module.exports = {
  executeFunction,
  sendError,
};
