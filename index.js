'use strict';

let fs = require('fs');
let config = {
  plugins: [
    require('sk-nirvana'),
    require('sk-sparkpost-webhook'),
    require('skellington-welcome')({
      type: 'post',
      title: 'Welcome to the SparkPost Community!',
      text: fs.readFileSync('./welcome.md')
    }),
    require('./lib/docs.js')
  ]
};

if (process.env.MONGOLAB_URI) {
  config.storage = require('botkit-storage-mongo')({mongoUri: process.env.MONGOLAB_URI});
}

require('skellington')(config);
