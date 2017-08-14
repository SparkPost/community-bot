// last ditch catchall, queries algolia with search terms
const _ = require('lodash');
const stripTags = require('striptags');
const unescape = require('unescape');
const algoliaClient = require('algoliasearch')(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
const supportSiteIndex = algoliaClient.initIndex('production_site_posts_support_article');

module.exports = {
  init: (controller) => controller.hears('.*', 'direct_message', searchAndRespond),
  help: {
    command: 'search',
    text: 'I can help you search our support articles, just type a few keywords and I\'ll see what I can find :smile_cat:'
  }
};

function searchAndRespond(bot, message) {
  return supportSiteIndex.search(message.match[0])
    .then((content) => {
      let response = noResultsMessage();

      if (content.hits.length) {
        response = formatContent(content);
      }
      bot.reply(message, response);
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      bot.reply(message, 'something happened!');
    });
}

function noResultsMessage() {
  return `I couldn't find anything about that. I'm only a bot, so I do best with just a few keywords.\n\n If you still can't find what you're looking for, you can also search our support docs at https://support.sparkpost.com`;
}

function formatContent(content) {
  // take top 3 hits and format as attachments
  return {
    text: 'I found a few articles for you:',
    footer: 'hello world',
    attachments: _.map(content.hits.slice(0, 3), formatHit)
  };
}

function formatHit(hit) {
  return {
    fallback: _.get(hit, 'permalink'),
    color: '#9bcd5a',
    'author_name': _.get(hit, 'post_author.display_name'),
    title: _.get(hit, 'post_title'),
    'title_link': _.get(hit, 'permalink'),
    text: formatText(_.get(hit, 'post_excerpt', '')),
    footer: _.get(hit, 'post_date_formatted'),
    'footer_icon': ':soon:'
  };
}

function formatText(text) {
  return unescape(stripTags(text), 'all')
    .replace(/\n/g, '')
    .replace(/&#8230;/g, '…');
}
