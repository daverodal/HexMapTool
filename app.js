App = Ember.Application.create({});
var SIN = Math.sin(Math.PI / 3);

App.draw = Ember.Mixin.create({
  draw: function(x, y, color, gridcolor){
    var A, B, C;
    A = this.get('a') - 0;
    B = this.get('b') - 0;
    C = this.get('c') - 0;
    var canvas = document.getElementById('tutorial');
    if(canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.strokeStyle = "#ff0000";
      y *= B * 2;
      if(x & 1){
        y += B;
      }
      x *= A + C;
      ctx.beginPath();
//        ctx.moveTo(x+0,y+A + C);
//        ctx.lineTo(x+0,y+A);
//        ctx.lineTo(x+B,y+0);
//        ctx.lineTo(x+B*2,y+A);
//        ctx.lineTo(x+B*2,y+A+C);
//        ctx.lineTo(x+B,y+(2*C));
//        ctx.lineTo(x+0,y+A+C);
      ctx.moveTo(x + 0, y + B);
      ctx.lineTo(x + A, y + 0);
      ctx.lineTo(x + A + C, y + 0);
      ctx.lineTo(x + A + A + C, y + B);
      ctx.lineTo(x + A + C, y + 2 * B);
      ctx.lineTo(x + A, y + (2 * B));
      ctx.lineTo(x + 0, y + B);

      ctx.stroke();

    }
  },
  doDraw: function(maxX, maxY){
    this.clear();
    var x, y;
    for(x = 0; x < maxX; x++){
      for(y = 0; y < maxY; y++){
        this.draw(x, y, "#ffffff");
      }
    }
  },
  clear: function(){
    var canvas = document.getElementById('tutorial');
    if(canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 3000, 3000);
    }
  }
});
App.Controller = Ember.ObjectController.extend(App.draw, {
  myStatus: 20,
  hexSize: null,
  numHexesX: 10,
  numHexesY: 12,
  a: null,
  b: null,
  c: null,
  imageUrl: "http://davidrodal.com/Battle/js/MartianIV.png",
  x: 0,
  y: 0,
  actions: {

    decHexSize: function(){
      this.set('hexSize', this.get('hexSize') - 1);
    },
    incHexSize: function(){
      this.set('hexSize', this.get('hexSize') - 0 + 1);
    },
    decX: function(){
      this.set('x', this.get('x') - 1);
    },
    incX: function(){
      this.set('x', this.get('x') - 0 + 1);
    },
    decY: function(){
      this.set('y', this.get('y') - 1);
    },
    incY: function(){
      this.set('y', this.get('y') - 0 + 1);
    }
  },
  changeLeft: function(){
    $('canvas').css("left", this.get('x') + "px");
  }.observes("x"),
  changeTop: function(){
    $('canvas').css("top", this.get('y') + "px");
  }.observes("y"),
  doSomethingElse: function(){
    var hexside = this.get('hexSize');
//    this.set("c", hexside);
//    this.set("a", hexside / 2);
//    this.set("b", hexside * SIN);
    this.setProperties({c:hexside,a:hexside/2,b:hexside*SIN});
  }.observes('hexSize'),
  doSomething: function(){
    this.doDraw(this.get('numHexesX'), this.get('numHexesY'));
  }.observes('c', 'a', 'b', 'numHexesX', 'numHexesY')


});
App.GawdAwfulView = Ember.View.extend({
  aBinding:"controller.a",
  templateName: 'GawdAwfulView',
  actions:{
    push:function(){
      alert('push');
    }
  }
});
App.View = Ember.View.extend({
  click: function(e){
    var offset = this.$().offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    alert("X: " + x + " Y: " + y);
  },
  templateName: 'splunge',
  didInsertElement: function(){
    this.set('controller.hexSize', 20);
//        C = this.get('hexSize') - 0;
//        A = C/2;
//        B = SIN * C;
    this.get('controller').doDraw(10, 12);
  }
});
