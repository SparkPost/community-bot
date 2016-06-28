'use strict';

let _ = require('lodash');
let fives = [
  'http://i.imgur.com/9k8zawD.gif',
  'https://i.imgur.com/JAcf19d.gif',
  'https://i.imgur.com/qtEGdxW.gif',
  'https://i.imgur.com/lsWuMlK.gif',
  'https://i.imgur.com/3woDyHD.gif',
  'https://i.imgur.com/AEn6Cls.gif',
  'https://i.imgur.com/mNRuaq5.gif',
  'https://i.imgur.com/D4igByU.gif',
  'http://i.imgur.com/8frudra.gif',
  'https://i.imgur.com/Jf3vNg9.gif',
  'https://i.imgur.com/KV3WBcl.gif',
  'https://i.imgur.com/8IaCPgP.gif',
  'https://i.imgur.com/MCzuzKL.gif',
  'https://i.imgur.com/L0w28kt.gif',
  'https://i.imgur.com/MPxdrat.gif',
  'https://i.imgur.com/v6G0oy7.gif',
  'https://i.imgur.com/MIOcYHC.gif'
];

module.exports = {
  init: (controller) => {
    controller.hears('^((hi(gh)?\\s)?five)|(\\^5)', 'direct_message,direct_mention', (bot, message) => {
      bot.reply(message, _.sample(fives));
    });
  },
  help: {
    command: 'high five',
    text: (helpConfig) => {
      return `Type \`@${helpConfig.botName} high five\` and I'll hit you up`;
    }
  }
};
