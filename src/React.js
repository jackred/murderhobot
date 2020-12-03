//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';

const config = require('../config.json');
const { createMessageValidate } = require('./Utility');

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
  console.log(
    'createChannelOnePlayer',
    react.emoji.name,
    react.emoji.identifier
  );
}

async function createChannelDiscussion(user, react) {
  console.log('createChannelDiscussion');
}

async function reactToAdd(react, user) {
  if (user.bot) {
    return;
  }
  switch (config.messages[react.message.id]) {
    case '': {
      await react.remove();
      await react.message.react(react.emoji);
    }
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
    }
  }
}

module.exports = {
  reactToAdd,
};
