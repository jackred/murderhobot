//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';

const config = require('../config.json');
const { createMessageValidate, getKeyByValue } = require('./Utility');

async function requestMj(user, react) {
  if (react.emoji.name === config.emoji.validate) {
    const fnTxt = (nb) => {
      let res = '';
      switch (nb) {
        case 1: {
          res = `${user.tag} want to talk with you`;
          break;
        }
        case 2: {
          res = `${user.tag} can now talk to you`;
          break;
        }
      }
      console.log(res);
      return res;
    };
    const fn = async () => {
      await react.message.guild.member(user).roles.add(config.talkMJRoleID);
    };
    const channel = react.message.guild.channels.resolve(config.mjChannelID);
    await createMessageValidate(channel, fnTxt, fn, [
      react.message.guild.ownerID,
    ]);
  } else {
    console.log('ignore emoji');
  }
  return true;
}

function getEmojiNumber(msg) {
  return config.emoji.players[msg.reactions.cache.size - 1];
}

async function createChannelOnePlayer(user, react) {
  if (react.emoji.name === config.emoji.validate) {
    const guild = react.message.guild;
    const channel = guild.channels.cache.find((c) => {
      return c.name.startsWith(user.tag.replace('#', '').toLowerCase());
    });
    if (channel === undefined) {
      await guild.channels.create(user.tag + ' channel', {
        parent: react.message.channel.parentID,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
            id: user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
        ],
      });
    } else {
      await channel.send(
        `Vous avez déjà un channel de discussion personnel ici ${user}`
      );
    }
  }
  const msg = await react.message.channel.messages.fetch(
    config.messages.create
  );
  await msg.react(getEmojiNumber(msg));
  return true;
}

async function createChannelDiscussion(user, react) {
  console.log('createChannelDiscussion');
}

async function reactToAdd(react, user) {
  if (user.bot) {
    return;
  }
  let reactBool = false;
  const id = getKeyByValue(config.messages, react.message.id);
  switch (id) {
    case 'mj': {
      reactBool = await requestMj(user, react);
      break;
    }
    case 'play': {
      reactBool = await createChannelOnePlayer(user, react);
      break;
    }
    case 'create': {
      reactBool = await createChannelDiscussion(user, react);
      break;
    }
    default: {
      console.log('Reaction added to a non special messages');
    }
  }
  if (reactBool) {
    await react.remove();
    await react.message.react(react.emoji);
  }
}

module.exports = {
  reactToAdd,
};
