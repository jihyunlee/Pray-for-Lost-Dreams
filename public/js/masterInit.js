var scale = 1.0;
var screenWidth = 1920;
var screenHeight = 1080;
/*
if (window.innerWidth != screenWidth || window.innerHeight != screenHeight) {
  if ((screenWidth / screenHeight) > (window.innerWidth / window.innerHeight))
    scale = window.innerWidth / screenWidth;
  else
    scale = window.innerHeight / screenHeight;

  screenWidth *= scale;
  screenHeight *= scale;

  scaleGui();
}
*/
function scaleGui() {
  var fontSize, pxIndex, top, topIndex,
    left, leftIndex, right, rightIndex,
    width, widthIndex;

  // .link
  left = $('.link').css('left');
  leftIndex = left.indexOf('%');
  left = left.substring(0, leftIndex);
  $('.link').css('left', screenWidth * left * 0.01 + 'px');

  // #link-title
  fontSize = $('#link-title').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#link-title').css('fontSize', Math.floor(fontSize * scale));
  top = $('#link-title').css('top');
  topIndex = top.indexOf('%');
  top = top.substring(0, topIndex);
  $('#link-title').css('top', screenHeight * top * 0.01 + 'px');

  // #link-url
  fontSize = $('#link-url').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#link-url').css('fontSize', Math.floor(fontSize * scale));
  top = $('#link-url').css('top');
  topIndex = top.indexOf('%');
  top = top.substring(0, topIndex);
  $('#link-url').css('top', screenHeight * top * 0.01 + 'px');

  // #side-bar
  top = $('#side-bar').css('top');
  topIndex = top.indexOf('%');
  top = top.substring(0, topIndex);
  $('#side-bar').css('top', screenHeight * top * 0.01 + 'px');
  width = $('#side-bar').css('width');
  widthIndex = width.indexOf('%');
  width = width.substring(0, widthIndex);
  $('#side-bar').css('width', screenWidth * width * 0.01 + 'px');
  right = $('#side-bar').css('right');
  $('#side-bar').css('right', '');
  rightIndex = right.indexOf('%');
  right = right.substring(0, rightIndex);
  $('#side-bar').css('left', (screenWidth - screenWidth * right * 0.01 - screenWidth * width * 0.01) + 'px');
  console.log('right', right, 'left', $('#side-bar').css('left'), 'width', width);

  // #project-title
  fontSize = $('#project-title').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#project-title').css('fontSize', Math.floor(fontSize * scale));

  // #follow-twitter
  fontSize = $('#follow-twitter').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#follow-twitter').css('fontSize', Math.floor(fontSize * scale));

  // #people
  fontSize = $('#people').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#people').css('fontSize', Math.floor(fontSize * scale));

  // #prayers-made
  fontSize = $('#prayers-made').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('#prayers-made').css('fontSize', Math.floor(fontSize * scale));

  // li.tweet
  fontSize = $('li.tweet').css('fontSize');
  pxIndex = fontSize.indexOf('px');
  fontSize = fontSize.substring(0, pxIndex);
  $('li.tweet').css('fontSize', Math.floor(fontSize * scale));
}

// box2d
var world = createWorld();
var timestamp = 1 / 60;

var canvas, ctx;
var seabed, leftWall, rightWall;
var ferry, leftChain, rightChain, leftDistanceJoint, rightDistanceJoint;
var balloons = new Array();
var lastCreated = new Date().getTime();
var ferryInitTop = screenHeight * 0.0555;

var debug = false;

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.display = debug ? 'block' : 'none';
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function render() {

  ctx.clearRect(0, 0, screenWidth, screenHeight);

  world.Step(timestamp, 10, 10);
  world.ClearForces();

  ferry.draw();
  if (debug) {
    seabed.draw();
    leftWall.draw();
    rightWall.draw();
    leftChain.draw();
    rightChain.draw();
  }

  var pos = ferry.body.GetWorldCenter();

  balloons.forEach(function(b, i) {
    // buoyant force
    // F(b) = (displaced fluid density) * (gravity acceleration) * (displaced volume)
    b.applyForce(new box2d.b2Vec2(0, -10 * b.rad * b.rad));
    b.draw();
  });

  if (debug) stats.update();

  requestAnimFrame(render);
}

function masterInit() {

  $('#master').css('display', 'block');

  canvas = document.getElementById('canvas');
  canvas.width = screenWidth;
  canvas.height = screenHeight;
  ctx = canvas.getContext('2d');

  var bottom = $('#bottom');
  bottom.css('width', screenWidth);
  bottom.css('height', screenHeight);

  var top = $('#top');
  top.css('width', screenWidth);
  top.css('height', screenHeight);

  var ferryOffsetX = screenWidth * 0.15;
  var ferryOffsetY = screenHeight * 0.99;
  var ferryWidth = screenWidth * 0.625;
  var ferryHeight = screenHeight * 0.32;

  var seabedHeight = screenHeight * 0.01;
  seabed = new Bound(screenWidth / 2, ferryOffsetY + seabedHeight / 2, screenWidth, seabedHeight);
  ferry = new Ferry(ferryOffsetX + ferryWidth / 2, ferryOffsetY - ferryHeight / 2, ferryWidth, ferryHeight);

  var leftWallWidth = ferryOffsetX * 0.5;
  leftWall = new Bound(leftWallWidth / 2, screenHeight / 2, leftWallWidth, screenHeight);
  var rightWallWidth = (screenWidth - (ferryOffsetX + ferryWidth)) * 0.7;
  rightWall = new Bound(screenWidth - rightWallWidth / 2, screenHeight / 2, rightWallWidth, screenHeight);

  // anchors on the seabed in order to prevent from ferry 
  var ferryPos = ferry.body.GetPosition();

  var leftAnchor = createBody(world, box2d.b2BodyType.b2_staticBody, new box2d.b2Vec2(leftWallWidth, ferryOffsetY));
  var leftBottom = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(ferryPos.x - ferry.width / 2, ferryPos.y + ferry.height / 2));
  var rjdLeft = new box2d.b2RevoluteJointDef();
  rjdLeft.Initialize(ferry.body, leftBottom, leftBottom.GetWorldCenter());
  rjdLeft.enableMotor = false;
  var rjLeft = world.CreateJoint(rjdLeft);

  var rightAnchor = createBody(world, box2d.b2BodyType.b2_staticBody, new box2d.b2Vec2(screenWidth - rightWallWidth, ferryOffsetY));
  var rightBottom = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(ferryPos.x + ferry.width / 2, ferryPos.y + ferry.height / 2));
  var rjdRight = new box2d.b2RevoluteJointDef();
  rjdRight.Initialize(ferry.body, rightBottom, rightBottom.GetWorldCenter());
  rjdRight.enableMotor = false;
  var rjRight = world.CreateJoint(rjdRight);

  leftChain = new ChainString(leftBottom, leftAnchor, 150, 10);
  rightChain = new ChainString(rightBottom, rightAnchor, 150, 10);

  $(document).keydown(function(e) {
    e.preventDefault();
    var keyCode = String.fromCharCode(e.keyCode);
    if (keyCode == 'D' || keyCode == 'd') {
      debug = !debug;
      if (debug) stats.domElement.style.display = 'block';
      else stats.domElement.style.display = 'none';
    } else if (keyCode == 'A' || keyCode == 'a')
      onTweet('test');
  });

  render();
}