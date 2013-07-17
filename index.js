var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity(){
  return this;
}

Entity.prototype.addTo = function(game, fn){
  this.game = game || {};

  if (!this.game.entities){
    this.game.entities = [];
  }

  this.game.entities.push(this);
  this.game.findEntity = this.findEntity;
  this.initializeListeners();

  if (fn){
    fn(this);
  }

  return this;
};

Entity.prototype.initializeListeners = function(){
  var self = this;

  this.game.on('update', function(interval){
    self.emit('update', interval)
  });
  
  this.game.on('draw', function(context){
    self.emit('draw', context);
  });
};

Entity.prototype.remove = function(){
  this.removeAllListeners('update');
  this.removeAllListeners('draw');

  this.findEntity(this, function(inEntities, index){
    if (inEntities){
      this.game.entities.splice(index, 1);
    }
  })
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
      callback(true, i);
    }
  }
};