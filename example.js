var Game = require('crtrdg-gameloop')
var Keyboard = require('crtrdg-keyboard')
var inherits = require('inherits')
var Entity = require('./index')

var game = new Game({
  width: '800',
  height: '400'
})

game.on('start', function () {
  game.findEntity(player, function (exists, entities, i) {
    console.log(exists, entities, i)
  })
  console.log(player.exists)
})

game.on('update', function (interval) {})

game.on('draw', function (c) {
  c.fillStyle = '#de2a2e'
  c.fillRect(0, 0, game.width, game.height)
  if (player.exists) player.draw(c)
})

var keyboard = new Keyboard(game)

keyboard.on('keydown', function (key) {
  if (key === 'D') {
    player.remove()
    game.findEntity(player, function (exists, entities, i) {
      console.log(exists, entities, i)
    })
  }
})

inherits(Player, Entity)

function Player (options) {
  Entity.call(this, game)

  this.position = {
    x: options.position.x,
    y: options.position.y
  }

  this.size = {
    x: options.size.x,
    y: options.size.y
  }

  this.velocity = {
    x: 0,
    y: 0
  }

  this.friction = 0.9
  this.speed = 5
  this.color = options.color
}

Player.prototype.draw = function (context) {
  context.fillStyle = this.color
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
}

Player.prototype.move = function () {
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

Player.prototype.input = function (keyboard) {
  if ('<left>' in keyboard.keysDown) {
    this.velocity.x = -this.speed
  }

  if ('<right>' in keyboard.keysDown) {
    this.velocity.x = this.speed
  }

  if ('<up>' in keyboard.keysDown) {
    this.velocity.y = -this.speed
  }

  if ('<down>' in keyboard.keysDown) {
    this.velocity.y = this.speed
  }
}

var player = new Player({
  game: game,
  position: { x: 10, y: 10 },
  size: { x: 10, y: 10 },
  color: '#fff'
})

player.on('update', function (interval) {
  this.input(keyboard)
  this.move()
  this.velocity.x = 0
  this.velocity.y = 0
})

game.start()
