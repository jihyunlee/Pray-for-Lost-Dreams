$('#start').click(function() {
  $('#page-title').swipeleft();
});

$('#pray').click(function() {
  if ($(this).hasClass('active'))
    $('#page-wish').swipeleft();
});

function validateTweet() {
  var text = $('#tweet-text').val();
  if ((/^\s*$/.test(text) == false) && (!$('#form').children('.counter').hasClass('exceeded')))
    return true;
  return false;
}

$('#tweet-text').charCount({});
$('#tweet-text').bind('input propertychange', function() {
  if (validateTweet())
    $('#pray').addClass('active');
  else
    $('#pray').removeClass('active');
});
$('#tweet-text').keyup(function(e) {
  if (e.which == 13 && validateTweet()) {
    $('#pray').click();
  }
});

$('#twitter-wishballoon').click(function() {
  window.top.location.href = 'https://twitter.com/wishballoons';
});

$(document).on('swipeleft', '[data-role="page"]', function(event) {
  if (event.handled !== true) {

    if ($(this).attr('id') == 'page-wish') {
      if (!validateTweet()) return false;

      ws.send(JSON.stringify({
        event: 'tweet',
        tweet: $('#tweet-text').val()
      }));
    }

    var nextpage = $(this).next('[data-role="page"]');

    console.log('nextpage', nextpage);
    if (nextpage.length > 0) {
      $.mobile.changePage(nextpage, {
        transition: 'slide',
        reverse: false
      }, true, true);
      nextpage.css('display', 'inline-block');
    }
    event.handled = true;
  }
  return false;
});