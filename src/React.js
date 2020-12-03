//-*- Mode: js2; js2-basic-offset: 2;  tab-width: 2; -*-
//author: JackRed <jackred@tuta.io>

'use strict';

const config = require('../config.json');

async function requestMj(user, react) {
  console.log('requestMj');
}

async function createChannelOnePlayer(user, react) {
  console.log('createChannelOnePlayer');
}

async function createChannelDiscussion(user, react) {
  console.log('createChannelDiscussion');
}

async function reactToAdd(react, user) {
  if (user.bot) {
    return;
  }
  switch (config.messages[react.message.id]) {
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
