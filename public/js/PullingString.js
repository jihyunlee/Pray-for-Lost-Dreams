function PullingString(object, objectPos, anchorPos) {

  this.anchor = createBody(world, box2d.b2BodyType.b2_staticBody, anchorPos);
  this.object = createBody(world, box2d.b2BodyType.b2_dynamicBody, objectPos);

  var rjd = new box2d.b2RevoluteJointDef();
  rjd.Initialize(object.body, this.object, this.object.GetWorldCenter());
  rjd.enableMotor = false;
  world.CreateJoint(rjd);

  var djd = new box2d.b2DistanceJointDef();
  djd.bodyA = this.object;
  djd.bodyB = this.anchor;
  djd.length = box2d.b2DistanceVV(objectPos, anchorPos);
  djd.frequencyHz = 0;
  djd.dampingRatio = 1;
  this.dj = world.CreateJoint(djd);
}

PullingString.prototype.getLength = function() {
  return this.dj.GetLength();
}

PullingString.prototype.setLength = function(length) {
  this.dj.SetLength(length);
}

PullingString.prototype.draw = function() {
  if(!debug) return;

  var anchorPos = this.anchor.GetWorldCenter();
  var objectPos = this.object.GetWorldCenter();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(objectPos.x, objectPos.y, 10, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(anchorPos.x, anchorPos.y, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FF00FF';
  ctx.fill();
  ctx.restore();
}