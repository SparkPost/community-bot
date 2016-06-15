'use strict';
let fuzzy = require('fuzzy');
let _ = require('lodash');

let baseURL = 'https://developers.sparkpost.com/api/';
let availableDocs = [
  'account',
  'bounce-domains',
  'inbound-domains',
  'ip-pools',
  'metrics',
  'message-events',
  'recipient-lists',
  'relay-webhooks',
  'sending-domains',
  'sending-ips',
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
    helpText += '`@' + botName + ' docs ' + doc + '`\n';
  });
  return helpText;
}

function descendingScore(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}

function getPath(doc) {
  return `${baseURL}${doc}`;
}

module.exports = {
  init: function(controller) {
    controller.hears('^docs (.*)', 'direct_message,direct_mention', (bot, message) => {
      let target = message.match[1];
      let path = '';

      // check for an exact match before doing fuzzy matching
      if (_.includes(availableDocs, target)) {
        path = getPath(target);
      } else {
        let fuzzyResults = fuzzy.filter(target, availableDocs);

        if (fuzzyResults.length === 0) {
          bot.reply(message, 'I can\'t help you with `' + target + '`, but if you feed me one of these I\'ll hook you up: ' + availableDocs.join(', '));
          return;
        } else if (fuzzyResults.length > 1) {
          // sort the results by descending score
          fuzzyResults.sort(descendingScore);

          // matching scores means we cannot choose one result
          if (fuzzyResults[0].score === fuzzyResults[1].score) {
            let possibleResults = fuzzyResults.filter(function(r) {
              return r.score === fuzzyResults[0].score;
            }).map(function(r) {
              return r.original;
            });

            bot.reply(message, 'Possible `docs` matches: ' + possibleResults.join(', '));
            return;
          }
        }

        path = getPath(fuzzyResults[0].string);
      }

      /* eslint-disable camelcase */
      bot.api.chat.postMessage({
        channel: message.channel,
        text: path,
        unfurl_links: false,
        as_user: true
      });

      /* eslint-enable camelcase */
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
