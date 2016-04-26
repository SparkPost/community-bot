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
          unfurl_links: false,
          as_user: true
        });
      } else {
        bot.reply(message, "I can't help you with `" + target + "`, but if you feed me one of these I'll hook you up: " + availableDocs.join(', '));
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
