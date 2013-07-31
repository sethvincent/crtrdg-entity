var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var aabb = require('aabb-2d');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity(){
  return this;
}

Entity.prototype.addTo = function(game){
  this.game = game || {};

  if (!this.game.entities){
    this.game.entities = [];
  }

  this.game.entities.push(this);
  this.game.findEntity = this.findEntity;
  this.initializeListeners();
  this.setBoundingBox();

  this.on('update', function(interval){
    this.setBoundingBox();
  });

  this.exists = true;

  return this;
};

Entity.prototype.initializeListeners = function(){
  var self = this;
  
  this.findEntity(this, function(exists, entities, index){
    if (exists){
      self.game.on('update', function(interval){
        self.emit('update', interval)
      });

      self.game.on('draw', function(context){
        self.emit('draw', context);
      });
    }
  });
};

Entity.prototype.remove = function(){
  this.exists = false;
  
  this.removeAllListeners('update');
  this.removeAllListeners('draw');

  this.findEntity(this, function(exists, entities, index){
    if (exists){
      entities.splice(index, 1);
    }
  });
};

Entity.prototype.findEntity = function(entity, callback){
  var entities;

  if (this.game === undefined){
    entities = this.entities;
  } else {
    entities = this.game.entities;
  }

  for (var i=0; i<entities.length; i++){
    if (entities[i] === entity) {
      callback(true, entities, i);
    }
  }
};

Entity.prototype.touches = function(entity){
  if (entity.exists){
    return this.boundingBox.intersects(entity.boundingBox);
  }
  else {
    return false;
  }
}

Entity.prototype.setBoundingBox = function(){
  this.boundingBox = aabb([this.position.x, this.position.y], [this.size.x, this.size.y]);  
};
