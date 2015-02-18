function Bound(x_, y_, w_, h_) {

  this.width = w_;
  this.height = h_;
  this.body = createBody(world, box2d.b2BodyType.b2_staticBody, new box2d.b2Vec2(x_, y_));

  createFixture(
    this.body,
    createPolygonShape(this.width, this.height),
    1, // friction
    0.2, // restitution
    1); // density
}

Bound.prototype.draw = function() {
  if (!debug) return;

  ctx.save();
  var pos = this.body.GetWorldCenter();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(this.body.GetAngleRadians());
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  ctx.restore();
}