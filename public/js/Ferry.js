function Ferry(x_, y_, w_, h_) {

  this.width = w_;
  this.height = h_;
  this.body = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(x_, y_));

  createFixture(
    this.body, 
    createPolygonShape(this.width, this.height),
    0.9, // friction
    0.3, // restitution
    0.5); // density

  this.img = new Image();
  this.img.onload = function() {};
  this.img.src = "img/ferry.png";
}

Ferry.prototype.killBody = function() {
  world.DestroyBody(this.body);
}

Ferry.prototype.applyForce = function(force) {
  this.body.ApplyForce(force, this.body.GetWorldCenter());
}

Ferry.prototype.draw = function() {
  ctx.save();
  var pos = this.body.GetPosition();
  ctx.translate(parseInt(pos.x), parseInt(pos.y));
  ctx.rotate(this.body.GetAngleRadians());
  if (debug) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
  ctx.restore();
}