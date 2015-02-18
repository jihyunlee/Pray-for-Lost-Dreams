var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ server: server }),
  port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.get('/master', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var Twit = require('twit'),
  T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }),
  statuses_count = 0,
  tweets = new Array();

var regexp = new RegExp('#([^\\s]*)', 'g');
function trimText(text) {
  return text.replace(regexp, '').replace(/\s+$/, "");
}

T.get('users/show', {
  user_id: process.env.USER_ID,
  screen_name: process.env.SCREEN_NAME
}, function(err, data, response) {

  if (err) {
    console.error('Error! -- failed to fetch users/show');
    return;
  }
  if (!data.hasOwnProperty('statuses_count')) {
    console.error('statuses_count not found');
    return;
  }

  statuses_count = data.statuses_count;
  var count = statuses_count;
  if (statuses_count > 200) {
    count = 200;
  }

  T.get('statuses/user_timeline', {
    count: count
  }, function(err, data, response) {

    if (err) {
      console.error('Error! -- failed to get statuses/user_timeline');
      return callback(err);
    }

    for (var i in data) {
      if (data[i].hasOwnProperty('text')) {
        tweets.push(trimText(data[i].text));
      }
    }
    tweets.reverse();

    server.listen(port, function() {
      console.log('listening on port', port);
    });
  });
});

T.stream('user').on('tweet', function(data) {

  if (!data.hasOwnProperty('text')) {
    console.error('tweet stream no text');
    return;
  }

  for (var i = 0, len = wss.clients.length; i < len; i++) {
    wss.clients[i].send(JSON.stringify({
      event: 'tweet',
      text: trimText(data.text)
    }));
  }
});

wss.on('connection', function(ws) {

  ws.send(JSON.stringify({
    event: 'init',
    count: statuses_count,
    tweets: tweets
  }));

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var data = JSON.parse(message);
    if (!data.hasOwnProperty('event')) {
      console.log('no event')
      return;
    }

    if (data.hasOwnProperty('tweet')) {
      // Dumbo Art Festival #DAF14
      // Strata + Hadoop World #StrataHadoop
      var text = data.tweet + " #ferrydisaster #sewol #StrataHadoop";
      console.log('someone tweets', text);
      T.post('statuses/update', {
        status: text
      }, function(err, data, response) {});
    }
  });
});