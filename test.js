var Game = require('crtrdg-gameloop');
var Entity = require('./index');
var inherits = require('inherits');

var game = new Game({
  canvasId: 'game',
  width: '800',
  height: '400',
  backgroundColor: '#ff1f1f'
});

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

  this.color = options.color
}

var player = new Player({
  position: { x: 10, y: 10 },
  size: { x: 10, y: 10 },
  color: '#fff'
}).addTo(game);

player.on('update', function(interval){
  console.log(this.position);
});

player.on('draw', function(context){
  context.fillStyle = this.color;
  context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
});