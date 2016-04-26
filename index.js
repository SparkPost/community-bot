'use strict';

let fs = require('fs');

require('skellington')({
  storage: require('botkit-storage-mongo')({mongoUri: process.env.MONGOLAB_URI}),
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
});
