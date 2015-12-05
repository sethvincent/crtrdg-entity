var EventEmitter = require('eventemitter2').EventEmitter2
var inherits = require('inherits')

module.exports = Entity
inherits(Entity, EventEmitter)

function Entity (game) {
  if (!(this instanceof Entity)) return new Entity(game)
  EventEmitter.call(this, game)
  if (game) this.addTo(game)
}

Entity.prototype.addTo = function (game) {
  this.game = game || {}

  if (!this.game.layers) this.game.layers = [0]
  if (this.layer) {
    this.insertInOrder(this.game.layers, this.layer)
  }

  if (!this.game.entities) this.game.entities = []

  this.game.entities.push(this)
  this.game.findEntity = this.findEntity
  this.initializeListeners()
  this.exists = true

  return this
}

Entity.prototype.insertInOrder = function (array, value) {
  for (var i = 0; i < array.length; i++) {
    if (value === array[i]) {
      return
    } else if (value < array[i]) {
      array.splice(i, 0, value)
      return
    }
  }
  array.push(value)
}

Entity.prototype.initializeListeners = function () {
  var self = this

  this.findEntity(this, function (exists, entities, index) {
    if (exists) {
      self.game.on('update', function (interval) {
        self.emit('update', interval)
      })

      self.game.on('draw-layer', function (layer, context) {
        if (layer === (self.layer || 0)) {
          self.emit('draw', context)
        }
      })
    }
  })
}

Entity.prototype.remove = function () {
  this.removeAllListeners('update')
  this.removeAllListeners('draw')

  this.findEntity(this, function (exists, entities, index) {
    if (exists) entities.splice(index, 1)
  })

  this.exists = false
}

Entity.prototype.findEntity = function (entity, callback) {
  var exists = false
  var entities
  if (this.game) entities = this.game.entities
  else entities = this.entities
  var index

  if (entities) {
    for (var i = 0; i < entities.length; i++) {
      if (entities[i] === entity) {
        exists = true
        index = i
      }
    }
  }

  callback(exists, entities, index)
}
