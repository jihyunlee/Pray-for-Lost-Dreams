/**
  role:
  */
var MASTER = 0;
var WISHER = 1;

var role;
if (window.location.pathname == '/master')
  role = MASTER;
else if(window.location.pathname == '/')
  role = WISHER;

/**
  websocket
  */
var ws;
var isReconnected = false;

function connect() {
  ws = window.ws = new WebSocket(document.location.origin.replace('http', 'ws'));
  ws.onopen = open;
  ws.onmessage = message;
  ws.onerror = error;
  ws.onclose = close;
}

function open(e) {
  console.log('open');
  if (isReconnected) return;

  if (window.location.pathname == '/master' && role == MASTER)
    masterInit();
  else if (role == WISHER)
    wisherInit();
}

function message(e) {
  if (role != MASTER) return;

  var data = JSON.parse(e.data);
  if (data.hasOwnProperty('event')) {
    if (data.event == 'init') {
      if (!data.hasOwnProperty('count') || !data.hasOwnProperty('tweets')) {
        console.error('count or tweets not found');
        return;
      }
      if (isReconnected) return;
      onInit(data.count, data.tweets);
    } else if (data.event == 'tweet') {
      if (!data.hasOwnProperty('text')) {
        console.error('text not found');
        return;
      }
      onTweet(data.text);
    } else {
      console.error('event not found')
    }
  } else {
    console.error('no event included in the message');
  }
}

function error(e) {
  console.error('onerror', e);
}

function close(e) {
  reconnect();
}

function reconnect() {
  console.log('reconnect');
  isReconnected = true;
  setTimeout(connect, 1000);
}

function onInit(count, tweets) {
  var num = count > 3 ? 3 : count;
  var i = 0;
  for (var i = 0; i < num; i++) {
    var b = new Balloon();
    balloons.push(b);
    $('#people').html(balloons.length);
    $('#tweet' + parseInt(num - i)).html(tweets[i]);
  }

  var numBalloonsMore = tweets.length - 1;
  if (numBalloonsMore > 0)
    addBalloons(num, tweets);
}

function addBalloons(i, tweets) {
  var timerId = setInterval(function() {
    onTweet(tweets[i++]);
    if (i >= tweets.length)
      clearInterval(timerId);
  }, 5000);
}

function onTweet(text) {
  balloons.push(new Balloon());
  $('#people').html(balloons.length);
  $('#tweet3').html($('#tweet2').text());
  $('#tweet2').html($('#tweet1').text());
  $('#tweet1').html(text);
}

connect();