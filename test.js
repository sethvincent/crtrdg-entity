var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var inherits = require('inherits');
var Entity = require('./index');

var game = new Game({
  canvasId: 'game',
  width: '800',
  height: '400',
  backgroundColor: '#ff1f1f'
});

game.on('update', function(interval){
  console.log(player.exists);
});

var keyboard = new Keyboard(game);

inherits(Player, Entity);

function Player(options){
  this.position = { 
    x: options.position.x, 
    y: options.position.y 
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.velocity = {
    x: 0,
    y: 0
  };
  
  this.friction = 0.9;
  this.speed = 5;
  this.color = options.color;
}

Player.prototype.move = function(){
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

Player.prototype.input = function(keyboard){
  if ('A' in keyboard.keysDown){
    this.velocity.x = -this.speed;
  }

  if ('D' in keyboard.keysDown){
    this.velocity.x = this.speed;
  }

  if ('W' in keyboard.keysDown){
    this.velocity.y = -this.speed;
  }

  if ('S' in keyboard.keysDown){
    this.velocity.y = this.speed;
  }
};

var player = new Player({
  position: { x: 10, y: 10 },
  size: { x: 10, y: 10 },
  color: '#fff'
});

player.addTo(game);

console.log(player)

player.on('update', function(interval){
  this.input(keyboard);
  this.move();
  this.velocity.x = 0;
  this.velocity.y = 0;

  if(player.touches(box)){
    box.remove();
    console.log('oh, they touched.');
  }
});

player.on('draw', function(context){
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
});

inherits(Box, Entity);

function Box(options){
  this.position = { 
    x: options.position.x, 
    y: options.position.y 
  };

  this.size = {
    x: options.size.x,
    y: options.size.y
  };

  this.color = options.color
}

var box = new Box({
  position: { x: 100, y: 100 },
  size: { x: 10, y: 10 },
  color: '#fff'
});

box.on('draw', function(context){
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
});

box.addTo(game);

console.log(box);