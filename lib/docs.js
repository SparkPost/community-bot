'use strict';
let fuzzy = require('fuzzy');

let baseURL = 'https://developers.sparkpost.com/api/#/reference/'
  , availableDocs = [
      'inbound-domains',
      'metrics',
      'message-events',
      'recipient-lists',
      'relay-webhooks',
      'sending-domains',
      'smtp-api',
      'subaccounts',
      'substitutions-reference',
      'suppression-list',
      'templates',
      'tracking-domains',
      'transmissions',
      'webhooks'
  ];

function getHelpText(botName) {
  let helpText = '';
  availableDocs.forEach((doc) => {
    helpText += '`@' + botName + ' docs ' + doc + '`\n'
  });
  return helpText;
}

module.exports = {
  init: function(controller, bot) {
    controller.hears('^docs (.*)', 'direct_message,direct_mention', (bot, message) => {
      let target = message.match[1];
      let fuzzyResults = fuzzy.filter(target, availableDocs);

      if (fuzzyResults.length == 0) {
        bot.reply(message, "I can't help you with `" + target + "`, but if you feed me one of these I'll hook you up: " + availableDocs.join(', '));
        return;
      } else if (fuzzyResults.length > 1) {
        // sort the results by descending score
        fuzzyResults.sort(function (a, b) {
          if (a.score < b.score) {
            return 1;
          }
          if (a.score > b.score) {
            return -1;
          }
          return 0;
        });

        // matching scores means we cannot choose one result
        if (fuzzyResults[0].score == fuzzyResults[1].score) {
          let possibleResults = [];
          for (let r of fuzzyResults) {
            if (r.score == fuzzyResults[0].score) {
              possibleResults.push(r.original);
            }
          }
          bot.reply(message, "Possible docs matches: " + possibleResults.join(', '));
          return;
        }
      }

      bot.api.chat.postMessage({
        channel: message.channel,
        text: baseURL + fuzzyResults[0].string,
        unfurl_links: false,
        as_user: true
      });
    });
  },
  help: {
    command: 'docs',
    text: (helpConfig) => {
      return 'Type the following to get links to documentation:\n' +
        getHelpText(helpConfig.botName);
    }
  }
};
