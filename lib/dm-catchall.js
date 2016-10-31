'use strict';

const _ = require('lodash');
const userMap = {};
const supportLink = 'https://support.sparkpost.com/customer/portal/emails/new';
let defaultChannelName = 'community-support';
let responses = [];

/**
 * Listens to any unheard DMs to the bot and responds. This keeps users from DMing the bot expecting a human response
 */
module.exports = {
  init: (controller, bot) => {

    getHelpChannel(bot, (channel) => {
      responses = [
        `Bleep bloop! I'm a bot, try ${channel} for organisms with a pulse. If you have a service issue, please contact support at ${supportLink}.`,
        `Sorry, Dave. I can't do that. Check out ${channel} for general Q+A and please contact Support at ${supportLink} if you have a service issue.`,
        `Howdy! I'd love to help you, but I am just a bot. You can type \`help\` to see what I can help you with or you can try your luck with a human in ${channel}.`
      ];
    });

    controller.hears('.*', 'direct_message', messageReply);
  }
};

/**
 * Reply after X seconds or Y messages, whichever comes first
 */
function messageReply(bot, message) {
  const user = message.user;
  const debounceThreshold = 1 * 60 * 1000; // 1 minute
  const messageThreshold = 5;

  if (!userMap[user]) {
    userMap[user] = {
      reply: _.debounce(replyToUser, debounceThreshold, {leading: false, trailing: true}),
      count: 0
    };
  }
  userMap[user].count++;

  if (userMap[user].count >= messageThreshold) {
    // if receive a lot of messages, then reply immediately
    userMap[user].reply.flush();
  } else {
    // otherwise use debounced reply
    userMap[user].reply(bot, message);
  }
}

/**
 * Replies to a user and cleans up reply
 * @param bot
 * @param message
 */
function replyToUser(bot, message) {
  bot.reply(message, _.sample(responses));
  delete userMap[message.user];
}

/**
 * Finds the default help channel and calls the passed callback with that as a param, defaults to the defaultChannelName.
 * @param bot
 * @param cb
 */
function getHelpChannel(bot, cb) {
  bot.api.channels.list({}, (err, res) => {
    const defaultChannel = `#${defaultChannelName}`;

    if (err) {
      return cb(defaultChannel);
    }

    let channel = _.find(res.channels, {name: defaultChannelName});

    if (channel) {
      return cb(`<#${channel.id}>`);
    }
    cb(defaultChannel);
  });
}
