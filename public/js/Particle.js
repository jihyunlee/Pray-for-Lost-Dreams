function Particle(x_, y_, distance) {

  this.body = createBody(world, box2d.b2BodyType.b2_dynamicBody, new box2d.b2Vec2(x_, y_));
}

Particle.prototype.killBody = function() {
  world.DestroyBody(this.body);
}

Particle.prototype.draw = function() {
  if(!debug) return;

  var pos = this.body.GetWorldCenter();
  this.x = (pos.x).toFixed(4);
  this.y = (pos.y).toFixed(4);

  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.beginPath();
  ctx.ellipse(0, 0, 3, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#01FFFF';
  ctx.fill();
  ctx.restore();
}