function Balloon(x_, y_, len_) {

  if (typeof ferry === 'undefined') {
    console.error('ferry undefined')
    return;
  }

  var ferryPos = ferry.body.GetWorldCenter();
  x_ = Math.randInt(ferryPos.x - ferry.width / 2, ferryPos.x + ferry.width / 2);
  var ox = (x_ - (ferryPos.x - ferry.width / 2)) / ferry.width * 100;
  var oy = ferryPos.y - ferry.height / 2;

  for (var i = 0; i < BALLOON_ANCHOR_POSITIONS.length; i++) {
    if (BALLOON_ANCHOR_POSITIONS[i].minPosX <= ox && ox < BALLOON_ANCHOR_POSITIONS[i].maxPosX) {
      y_ = oy + Math.randInt(BALLOON_ANCHOR_POSITIONS[i].minPosY, BALLOON_ANCHOR_POSITIONS[i].maxPosY) * 0.01 * ferry.height;
      break;
    }
  }

  if (typeof len_ === 'undefined') {
    if (Math.random() >= 0.95)
      len_ = maxStringLen + Math.randInt(150, 300);
    else
      len_ = y_ - oy + Math.randInt(minStringLen, maxStringLen);
  }

  this.len = len_ * scale;
  this.rad = Math.randInt(minRadius, maxRadius) * scale;
  this.overlap = 0.85;
  this.balloonColor = BALLOON_COLORS[Math.randInt(0, BALLOON_COLORS.length-1)];

  // balloon body
  this.body = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(x_, y_ - this.len * 0.85));

  var shape = new box2d.b2CircleShape();
  shape.m_radius = this.rad * this.overlap;

  var fd = new box2d.b2FixtureDef();
  fd.shape = shape;
  fd.friction = 0;
  fd.restitution = 0;
  fd.density = 0.08;
  this.body.CreateFixture(fd);

  // anchor attached to ferry
  this.anchor = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(x_, y_));

  var rjd = new box2d.b2RevoluteJointDef();
  rjd.Initialize(ferry.body, this.anchor, this.anchor.GetWorldCenter());
  rjd.enableMotor = false;
  world.CreateJoint(rjd);

  // balloon string
  this.string = new ChainString(this.body, this.anchor, this.len);

  // lift up the ferry little bit whenever a balloon is created
  ferry.applyForce(new box2d.b2Vec2(0, -27000000 * scale));
}

Balloon.prototype.killBody = function() {
  this.string.killBody();
  world.DestroyJoint(this.dj);
  world.DestroyBody(this.body);
}

Balloon.prototype.applyForce = function(force) {
  var pos = this.body.GetWorldCenter();
  this.body.ApplyForce(force, pos);
}

Balloon.prototype.draw = function() {

  this.string.draw();

  var posAnchor = this.anchor.GetWorldCenter();
  var pos = this.body.GetWorldCenter();
  this.x = parseInt((pos.x).toFixed(4));
  this.y = parseInt((pos.y).toFixed(4));

  var dx = this.x - posAnchor.x;
  var dy = this.y - posAnchor.y;
  var d = Math.sqrt(dx * dx + dy * dy);
  var a = Math.acos(dx / d);

  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(Math.PI / 2 - a);
  ctx.beginPath();
  ctx.ellipse(0, -this.rad * 1.25, this.rad, this.rad * 1.25, 0, 0, Math.PI * 2);
  ctx.fillStyle = this.balloonColor;
  ctx.fill();
  ctx.restore();
}