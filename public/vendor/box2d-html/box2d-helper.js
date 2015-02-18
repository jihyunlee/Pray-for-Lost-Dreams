////////////////////////////////////////////////////////////////////////////////
// Name:    box2d-helper.js
// Author:  Jihyun Lee
// Created: 08-23-2014
////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// Math Methods
// -----------------------------------------------------------------------------

Math.map = function(value, iStart, iStop, oStart, oStop) {
  return oStart + (oStop - oStart) * ((value - iStart) / (iStop - iStart));
}

Math.distance = function(x1,y1,x2,y2) {
  return Math.sqrt((x1 -= x2) * x1 + (y1 -= y2) * y1);
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

Math.randRange = function(from, to) {
  return Math.round(from + Math.random()*(from, to));
};

// -----------------------------------------------------------------------------
// Scale Methods
// -----------------------------------------------------------------------------

var scaleFactor;

var scaleToWorld = function(a,b) {
  if (a instanceof box2d.b2Vec2) {
    var newv = new box2d.b2Vec2();
    newv.x = (a.x)/scaleFactor;
    newv.y = (a.y)/scaleFactor;
    return newv;
  } else if ("undefined"!=typeof b) {
    var newv = new box2d.b2Vec2();
    newv.x = (a)/scaleFactor;
    newv.y = (b)/scaleFactor;
    return newv;
  } else {
    return a/scaleFactor;
  }
}

var scaleToPixels = function(a,b) {
  if (a instanceof box2d.b2Vec2) {
    var newv = new box2d.b2Vec2();
    newv.x = a.x*scaleFactor;
    newv.y = a.y*scaleFactor;
    return newv;
  } else if ("undefined"!=typeof b) {
    var newv = new box2d.b2Vec2();
    newv.x = a*scaleFactor;
    newv.y = b*scaleFactor;
    return newv;
  } else {
    return a*scaleFactor;
  }
}

// -----------------------------------------------------------------------------
// Create Methods
// -----------------------------------------------------------------------------

var createWorld = function() {
	var worldAABB = new box2d.b2AABB();
	worldAABB.lowerBound.SetXY(-this.bounds, -this.bounds);
	worldAABB.upperBound.SetXY(this.bounds, this.bounds);
	var gravity = new box2d.b2Vec2(0,10);
	var doSleep = true;

  scaleFactor = 10;

	return new box2d.b2World(gravity, doSleep);
}

var createBody = function(world, type, position, fixedRotation) {
	var bd = new box2d.b2BodyDef();
  bd.type = type;
  bd.position.SetXY(position.x, position.y);
  // bd.fixedRotation = fixedRotation;
  return world.CreateBody(bd);
}

var createFixture = function(body, shape, friction, restitution, density) {
	var fd = new box2d.b2FixtureDef();
	fd.shape = shape;
	fd.friction = friction;
	fd.restitution = restitution;
  fd.density = density;
  return body.CreateFixture(fd);
}

var createCircleShape = function(radius) {
  var shape = new box2d.b2CircleShape();
  shape.m_radius = radius;
  return shape;
}

var createPolygonShape = function(width, height) {
	var shape = new box2d.b2PolygonShape();
  shape.SetAsBox(width/2, height/2);
  return shape;
}

var createChainShape = function(vertices) {
  var shape = new box2d.b2ChainShape();
  shape.CreateChain(vertices, vertices.length);
  return shape;
}

var createDistanceJoint = function(world, bodyA, bodyB, frequencyHz, dampingRatio, len) {
  var djd = new box2d.b2DistanceJointDef();
  djd.bodyA = bodyA;
  djd.bodyB = bodyB;
  var posA = bodyA.GetWorldCenter();
  var posB = bodyB.GetWorldCenter();
  if(typeof len === 'undefined')
    djd.length = Math.distance(posA.x, posA.y, posB.x, posB.y);
  else 
    djd.length = len;
  djd.frequencyHz = frequencyHz;
  djd.dampingRatio = dampingRatio;
  return world.CreateJoint(djd);
}

var createRevoluteJoint = function(world, bodyA, bodyB, enableMotor, motorSpeed, maxMotorTorque) {
  var rjd = new box2d.b2RevoluteJointDef();
  rjd.Initialize(bodyA, bodyB, bodyB.GetWorldCenter());
  rjd.motorSpeed = Math.PI*2; // how fast
  rjd.maxMotorTorque = 10;    // how powerful
  rjd.enableMotor = false;    // is it on?
  return world.CreateJoint(rjd);
}

// -----------------------------------------------------------------------------
// Draw Methods
// -----------------------------------------------------------------------------

var debugDraw = function(canvas, scale, world, offset) {

	var context = canvas.getContext('2d');
  // context.fillStyle = '#DDD';
  // context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw joints
	for(var j=world.m_jointList; j; j=j.m_next) {
    context.lineWidth = 0.25;
    context.strokeStyle = '#00F';
    drawJoint(context, scale, world, j, offset);
  }

	// Draw body shapes
	for(var b=world.m_bodyList; b; b=b.m_next) {
		for(var f = b.GetFixtureList(); f!=null; f=f.GetNext()) {  
      context.lineWidth = 0.5;
			context.strokeStyle = '#F00';
      drawShape(context, scale, world, b, f, offset);
    }
  }
}

var drawJoint = function(context, scale, world, joint, offset) {
	context.save();
  context.scale(scale,scale);
  context.lineWidth /= scale;

  var b1 = joint.m_bodyA;
  var b2 = joint.m_bodyB;
  var x1 = b1.GetPosition();
  var x2 = b2.GetPosition();
  var p1 = joint.GetAnchorA();
  var p2 = joint.GetAnchorB();    

  context.beginPath();
  switch (joint.m_type) {
    case box2d.b2Joint.e_distanceJoint:
      context.moveTo(p1.x-offset, p1.y);
      context.lineTo(p2.x-offset, p2.y);
      break;
    default: {
      if (b1 == world.m_groundBody) {
        context.moveTo(p1.x, p1.y);
        context.lineTo(x2.x, x2.y);
      }
      else if (b2 == world.m_groundBody) {
        context.moveTo(p1.x, p1.y);
        context.lineTo(x1.x, x1.y);
      }
      else {
        context.moveTo(x1.x-offset, x1.y);
        context.lineTo(p1.x-offset, p1.y);
        context.lineTo(x2.x-offset, x2.y);
        context.lineTo(p2.x-offset, p2.y);
      }
    } break;
  }
  context.closePath();
  context.stroke();
  context.restore();
}

var drawShape = function(context, scale, world, body, fixture, offset) {

  context.save();
  context.scale(scale,scale);

  var bPos = body.GetPosition();
  context.translate(bPos.x-offset, bPos.y);
  context.rotate(body.GetAngleRadians());
  
  context.beginPath();
  context.lineWidth /= scale;

	var shape = fixture.m_shape;
  switch(shape.m_type) {
    case box2d.b2ShapeType.e_circleShape: {
      var r = shape.m_radius;
      var segments = 16.0;
      var theta = 0.0;
      var dtheta = 2.0 * Math.PI / segments;

      context.moveTo(r, 0);
      for (var i = 0; i < segments; i++) {
        context.lineTo(r + r * Math.cos(theta), r * Math.sin(theta));
        theta += dtheta;
      }
      context.lineTo(r, 0);
    } break;

    case box2d.b2ShapeType.e_polygonShape:
    case box2d.b2ShapeType.e_chainShape: {

      var vertices = shape.m_vertices;
      var vertexCount = shape.m_count;
      if (!vertexCount) return;

      context.moveTo(vertices[0].x, vertices[0].y);
      for (var i = 0; i < vertexCount; i++)
        context.lineTo(vertices[i].x, vertices[i].y);
    } break;
  }

  context.closePath();
  context.stroke();
  context.restore();
}