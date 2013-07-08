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

  for (var i=0; i<this.game.entities.length; i++){
    if (this.game.entities[i] === this) {
      this.game.entities.splice(i, 1);
    }
  }
};