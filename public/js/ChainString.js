function ChainString(object, anchor, len_, numJoints) {

  this.particles = new Array();
  this.joints = new Array();

  var posObject = object.GetWorldCenter();
  var posAnchor = anchor.GetWorldCenter();

  if (typeof numJoints === 'undefined')
    numJoints = Math.floor(len_ / BALLOON_STRING_STEM_LENGTH);

  var lenJoint = parseFloat(len_ / numJoints+1);

  for (var i = 0; i < numJoints; i++) {

    var p = new Particle(posObject.x, posObject.y + (i+1) * lenJoint, lenJoint);

    this.particles.push(p);

    if (i == 0) {
      this.addJoint(object, p.body, lenJoint);
    } else {
      var prev = this.particles[i - 1];
      this.addJoint(prev.body, p.body, lenJoint);
      if (i == numJoints - 1) {
        this.addJoint(p.body, anchor, 0.1);
      }
    }
  }
}

ChainString.prototype.addJoint = function(b1, b2, len) {
  var djd = new box2d.b2DistanceJointDef();
  djd.bodyA = b1;
  djd.bodyB = b2;
  djd.length = len;
  djd.frequencyHz = 0;
  djd.dampingRatio = 1;
  var dj = world.CreateJoint(djd);
  this.joints.push(dj);
}

ChainString.prototype.killBody = function() {
  this.joints.forEach(function(j) {
    world.DestroyJoint(j);
  });
  this.particles.forEach(function(p) {
    p.killBody();
  });
}

ChainString.prototype.applyForce = function(force) {
  this.particles.forEach(function(p) {
    p.body.ApplyForce(force, p.body.GetWorldCenter());
  });
}

ChainString.prototype.draw = function() {
  ctx.save();
  ctx.beginPath();
  this.joints.forEach(function(j, i) {
    var posA = j.GetBodyA().GetPosition();
    var posB = j.GetBodyB().GetPosition();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
  });
  if (debug) ctx.strokeStyle = '#FF0000';
  else ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = scale;
  ctx.stroke();

  if (debug) {
    this.particles.forEach(function(p) {
      p.draw();
    });
  }
  ctx.restore();
}