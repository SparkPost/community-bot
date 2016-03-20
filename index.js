require('skellington')({
  storage: require('botkit-storage-mongo')({mongoUri: process.env.MONGOLAB_URI}),
  plugins: [
    require('sk-nirvana'),
    require('sk-sparkpost-webhook')
  ]
});
