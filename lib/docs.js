'use strict';

//let request = require('request')
  //, config = require('config')
  //, username = config.jira.username
  //, password = config.jira.password
  //, jiraBaseUrl = 'https://' + username + ':' + password + '@jira.int.messagesystems.com/rest/api/2';

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

      if (availableDocs.indexOf(target) > -1) {
        bot.api.chat.postMessage({
          channel: message.channel,
          text: baseURL + target,
          unfurl_links: false
        });
      } else {
        bot.reply(message, '`' + target + '` is not a valid value. Please supply one of the following to the docs command: ' + availableDocs.join(', '));
      }
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
