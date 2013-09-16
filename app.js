App = Ember.Application.create({});
var SIN = Math.sin(Math.PI / 3);
//App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.ApplicationAdapter = DS.RESTAdapter.extend({
    host:'http://localhost/HexMapTool/rest/index.php'
});

//App.MapAdapter = DS.RESTAdapter.extend({
//    host:'http://localhost/HexMapTool/rejst/index.php'
//});
App.Router.map(function(){
    this.resource('maps', function(){
        this.route('new');
        this.resource('map',{path:":map_id"});
    });
    this.resource('about');
});

App.MapsRoute = Ember.Route.extend({
//        model: function() {
//            return this.store.find('map');
//    }
});
App.MapsIndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('map');
    }
});
App.MapsNewRoute = Ember.Route.extend({
//    model: function() {
//        return this.store.createRecord('map',{mapUrl:"http://davidrodal.com/Battle/js/nta.png"});
//    }
});
App.draw = Ember.Mixin.create({
  draw: function(x, y, color, gridcolor){
    var A, B, C;
    A = this.get('a') - 0;
    B = this.get('b') - 0;
    C = this.get('c') - 0;
    var canvas = document.getElementById('tutorial');
      if(!canvas){
          return;
      }
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
      if(!canvas){
          return;
      }
    if(canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 3000, 3000);
    }
  }
});
App.Map = DS.Model.extend({
    mapUrl:DS.attr('string'),
    numX: DS.attr('string'),
    numY: DS.attr('string'),
    x:DS.attr('string'),
    y:DS.attr('string'),
    a:DS.attr('string'),
    b:DS.attr('string'),
    c:DS.attr('string'),
    perfect:DS.attr('string')

});
App.Map.FIXTURES = [
    {
        id:1,
        mapUrl: "http://davidrodal.com/Battle/js/MartianIV.png",
        numX: 10,
        numY: 12,
        x:0,
        y:0,
        hexSize:30,
        a:20,
        b:16,
        c:30,
        perfect:false

    },
    {
        id:2,
        mapUrl:"http://davidrodal.com/Battle/js/MCW.png",
        numX: 13,
        numY: 20,
        x:7,
        y:20,
        hexSize:32,
        a:16,
        b:10,
        c:32,
        perfect:false
    }];
var maps = {maps:[
    {
        map:{
            id:1,
            a:3
        }
    },
    {
        map:{
            id:2,
            a:3
        }
    }

]};
App.MapsNewController = Ember.ObjectController.extend(App.draw, {
    init:function(){
    },
    actions: {
        save:function(){
            var model = this.store.createRecord('map',{mapUrl:"http://davidrodal.com/Battle/js/nta.png"});
            model.save().then(function(){
                this.transitionToRoute('map',model.get('id'));
            }.bind(this)
            );
        }
    }
});
App.MapController = Ember.ObjectController.extend(App.draw, {
  disabled:"false",
  hexSize: null,
  imageUrl: "http://davidrodal.com/Battle/js/MartianIV.png",
  myA: null,
    init:function(){
    },
  actions: {
      save:function(){
          this.get('model').save().then(this.transitionToRoute('maps'));
      },
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
    this.set("c", hexside);
    this.set("a", hexside / 2);
    this.set("b", hexside * SIN);

      this.set('perfect',true);
//    this.setProperties({c:hexside,a:hexside/2,b:hexside*SIN});
  }.observes('hexSize'),
  doSomething: function(){
//      this.get('model').save();
      this.set('perfect',false);

      Ember.run.once(this,'justOneTime');
  }.observes('c', 'a', 'b', 'numX', 'numY')
  ,justOneTime:function(){
        this.doDraw(this.get('numX'), this.get('numY'));
    }
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
App.MapsView = Ember.View.extend({
    init:function(){
        this._super();
    },
    didInsertElement:function(){}
});
App.MapView = Ember.View.extend({
  click: function(e){
    var offset = this.$().offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    alert("X: " + x + " Y: " + y);
  },
  didInsertElement: function(){
      alert("did");
//    this.set('controller.hexSize', 33);
//        C = this.get('hexSize') - 0;
//        A = C/2;
//        B = SIN * C;
      this.get('controller').changeLeft();
      this.get('controller').changeTop();
      var controller = this.get('controller');
//      controller.addObserver('hexSize',controller.doSomethingElse.bind(controller));
    this.get('controller').doDraw(this.get('controller.numX'),this.get('controller.numY'));
  }
});