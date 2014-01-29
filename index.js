var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

module.exports = Entity;
inherits(Entity, EventEmitter);

function Entity(){}

Entity.prototype.addTo = function(game){
  this.game = game || {};

  if (!this.game.entities) this.game.entities = [];

  console.log(this.game, this.game.entities)

  this.game.entities.push(this);
  this.game.findEntity = this.findEntity;
  this.initializeListeners();
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
  this.removeAllListeners('update');
  this.removeAllListeners('draw');

  this.findEntity(this, function(exists, entities, index){
    if (exists) entities.splice(index, 1);
  });

  this.exists = false;
};

Entity.prototype.findEntity = function(entity, callback){
  var exists = false;
  var entities;
  if (this.game) entities = this.game.entities;
  else entities = this.entities
  var index;

  if (entities){
    for (var i=0; i<entities.length; i++){
      if (entities[i] === entity) {
        exists = true;
        index = i;
      }
    }
  }

  callback(exists, entities, index);
};
