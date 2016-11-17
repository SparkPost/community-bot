'use strict';

let fs = require('fs');
let config = {
  slackToken: process.env.SLACK_API_TOKEN,
  plugins: [
    require('sk-nirvana'),
    require('sk-sparkpost-webhook'),
    require('skellington-welcome')({
      type: 'post',
      title: 'Welcome to the SparkPost Community!',
      text: fs.readFileSync('./welcome.md')
    }),
    require('./lib/docs.js'),
    require('./lib/five.js'),
    require('./lib/dm-catchall')
  ]
};

if (process.env.MONGOLAB_URI) {
  config.storage = require('botkit-storage-mongo')({mongoUri: process.env.MONGOLAB_URI});
}

require('skellington')(config);
