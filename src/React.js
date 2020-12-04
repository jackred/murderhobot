//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';

const config = require('../config.json');
const { createMessageValidate, getKeyByValue } = require('./Utility');

async function requestMj(user, react) {
  if (react.emoji.name === config.emoji) {
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
}

async function createChannelOnePlayer(user, react) {
  if (react.emoji.name === config.emoji) {
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
}

async function createChannelDiscussion(user, react) {
  console.log('createChannelDiscussion');
}

async function reactToAdd(react, user) {
  if (user.bot) {
    return;
  }
  let reactBool = true;
  const id = getKeyByValue(config.messages, react.message.id);
  switch (id) {
    case 'mj': {
      await requestMj(user, react);
      break;
    }
    case 'play': {
      await createChannelOnePlayer(user, react);
      break;
    }
    case 'create': {
      await createChannelDiscussion(user, react);
      break;
    }
    default: {
      console.log('Reaction added to a non special messages');
      react = false;
    }
  }
  if (react) {
    await react.remove();
    await react.message.react(react.emoji);
  }
}

module.exports = {
  reactToAdd,
};
