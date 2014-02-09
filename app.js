App = Ember.Application.create({});
var SIN = Math.sin(Math.PI / 3);
//App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.ApplicationAdapter = DS.RESTAdapter.extend({
//  host: 'http://localhost/HexMapTool/rest/index.php'
    host: window.location.origin+window.location.pathname+"rest/index.php"
});

//App.MapAdapter = DS.RESTAdapter.extend({
//    host:'http://localhost/HexMapTool/rejst/index.php'
//});
App.Router.map(function () {
    this.resource('maps', function () {
        this.route('new');
        this.resource('map', {path: ":map_id"}, function () {
            this.route('edit');
            this.route('hexes');
        });
    });
    this.resource('about');
});

App.MapsRoute = Ember.Route.extend({
        model: function() {
            return this.store.find('map');
    }
});
App.MapsIndexRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('map');
    }
});
//App.MapRoute = Ember.Route.extend({
//    model: function (param) {
//        debugger;
//        return this.store.find('map',param.map_id);
//    }
//});
App.MapIndexRoute = Ember.Route.extend({
    model: function (param) {
        return this.modelFor('map');
    }
});
App.MapEditRoute = Ember.Route.extend({
    model: function (param) {
        return this.modelFor('map');
    }
});
App.MapHexesRoute = Ember.Route.extend({
  model: function (param) {
    return this.modelFor('map');
  }
});
App.MapsNewRoute = Ember.Route.extend({
//    model: function() {
//        return this.store.createRecord('map',{mapUrl:"http://davidrodal.com/Battle/js/nta.png"});
//    }
});
App.hexpart = Ember.Mixin.create({
  x:false,
  y:false,
  refHexpartX:false,
  refHexpartY:false,
  hexpartType:false,
  name:false,
  prefix:false,

  hexpartInit:function(name){
// Hexpart(name)
    if ( Hexpart.arguments.length == 1 )
    {
      this.name = Hexpart.arguments[0];
      this.calculateHexpart();
    }

// Hexpart(x,y)
    if ( Hexpart.arguments.length == 2 )
    {
      this.x = Hexpart.arguments[0];
      this.y = Hexpart.arguments[1];

      this.calculateHexpartType();
      this.calculateHexpartName();
    }
  },

  setXY:function(x, y)
  {
    this.set('x', x);
    this.set('y',y);

    this.calculateHexpartType();
//    this.calculateHexpartName();
  },

  setXYwithNameAndType:function( hexagonName, hexpartType )
  {
    var hexagon = new Hexagon(hexagonName);

    this.x = hexagon.getX();
    this.y = hexagon.getY();

    switch ( hexpartType ) {

      case HEXAGON_CENTER:

        break;

      case BOTTOM_HEXSIDE:

        this.y = this.y + 2;
        break;

      case LOWER_LEFT_HEXSIDE:

        this.x = this.x - 1;
        this.y = this.y + 1;
        break;

      case UPPER_LEFT_HEXSIDE:

        this.x = this.x - 1;
        this.y = this.y - 1;
        break;
    }
  },

  setName:function( hexpartName )
  {
    this.name = hexpartName;

    this.calculateHexpart();
  },

  calculateHexpartType:function() {

    // center = 1, lower = 2, lower left = 3, upper left = 4
    this.set('hexpartType', 0);

    // 8 cases
    switch ( this.get('x') % 4 ) {
      case 0:
        switch ( this.get('y') % 4 ) {
          case 0:
            this.set('hexpartType', 1);
            break;
          case 2:
            this.set('hexpartType', 2);
            break;
        }
        break;

      case 1:
        switch ( this.get('y') % 4 ) {
          case 1:
            this.set('hexpartType', 4);
            break;
          case 3:
            this.set('hexpartType', 3);
            break;
        }
        break;

      case 2:
        switch ( this.get('y') % 4 ) {
          case 0:
            this.set('hexpartType', 2);
            break;
          case 2:
            this.set('hexpartType', 1);
            break;
        }
        break;

      case 3:
        switch ( this.get('y') % 4 ) {
          case 1:
            this.set('hexpartType', 3);
            break;
          case 3:
            this.set('hexpartType', 4);
            break;
        }
        break;

      default:
        this.set('hexpartType', 0);
    }
  },

  calculateHexpartName:function() {

    var name;

    // center = 1, lower = 2, lower left = 3, upper left = 4

    switch ( this.hexpartType ) {

      case 1:
        this.refHexpartX = this.x;
        this.refHexpartY = this.y;
        this.prefix = "hexpart:";
        break;

      case 2:
        this.refHexpartX = this.x;
        this.refHexpartY = this.y - 2;
        this.prefix = "hexpart_";
        break;

      case 3:
        this.refHexpartX = this.x + 1;
        this.refHexpartY = this.y - 1;
        this.prefix = "hexpart\\";
        break;

      case 4:
        this.refHexpartX = this.x + 1;
        this.refHexpartY = this.y + 1;
        this.prefix = "hexpart/";
        break;
    }

    if ( this.hexpartType > 0 ) {

      var refHexagon = new Hexagon();

      refHexagon.setXY(this.refHexpartX, this.refHexpartY);
      this.name = this.prefix + refHexagon.getName();

    } else {

      this.hexpartName = "null";
    }
  },

  calculateHexpart:function()
  {
    // center = :, lower = _, lower left = \\, upper left = /
    //    since \ is a javascript escape char, need to check for \\

    var hexagon = new Hexagon();
    hexagon.setNumber(this.name.substr(8,4));

    var hexpartTypeLetter = this.name.charAt(7);

    this.refHexpartX = hexagon.getX();
    this.refHexpartY = hexagon.getY();

    switch ( hexpartTypeLetter ) {

      case ':':

        this.hexpartType = 1;
        this.x = this.refHexpartX;
        this.y = this.refHexpartY;
        break;

      case '_':

        this.hexpartType = 2;
        this.x = this.refHexpartX;
        this.y = this.refHexpartY + 2;
        break;

      case '\\':

        this.hexpartType = 3;
        this.x = this.refHexpartX - 1;
        this.y = this.refHexpartY + 1;
        break;

      case '/':

        this.hexpartType = 4;
        this.x = this.refHexpartX - 1;
        this.y = this.refHexpartY - 1;
        break;

      default:

        this.hexpartType = 1;
        this.x = this.refHexpartX;
        this.y = this.refHexpartY;
        break;
    }
  },

  equals:function(hexpart)
  {
    var isEqual;
    isEqual = false;

    if ( this.x == hexpart.getX() && this.y == hexpart.getY() )
    {
      isEqual = true;
    }

    return isEqual;
  },

  getName:function()
  {
    return this.name;
  },

  getX:function()
  {
    return this.x;
  },

  getY:function() {

    return this.y;
  },

  getHexpartType:function()
  {
    return this.get('hexpartType');
  },

  getHexpartTypeName:function() {

    var hexpartTypeName = new Array("", "center", "lower", "lowerLeft", "lowerRight");

    return hexpartTypeName[this.hexpartType];
  }
});
App.hexPick = Ember.Mixin.create({

  originX:false,
  originY:false,
  topHeight:false,
  bottomHeight:false,
  hexsideWidth:false,
  centerWidth:false,
  hexagonWidth:false,
  hexagonHeight:false,
  halfHexagonHeight:false,
  halfHexagonWidth:false,
  oneFourthHexagonHeight:false,
  leftMapEdge:false,

  // pixel info from screen
  mapGridX:false,
  mapGridY: false,
  distanceFromLeftEdgeOfHexagon:false,
  distanceFromTopEdgeOfHexagon:false,
  column:false,
  row:false,
  number: false,

  // hexagon and it's hexpart
  hexagon:false,
  hexpart:false,

  myInit:function(mapData)
  {
    var b = mapData.get('b');
    var a = mapData.get('a')
    var c =  mapData.get('c');

    var xOff = (a + c) * 2 - (c/2 + a);
    this.set('originX', xOff - mapData.get('x') );
    this.set('originY', 3 * b -  mapData.get('y'));
    this.set('topHeight', mapData.get('b'));
    this.set('bottomHeight', mapData.get('b'));
    this.set('hexsideWidth', mapData.get('a'));
    this.set('centerWidth', mapData.get('c'));

    this.set('hexagonHeight', this.get('topHeight') + this.get('bottomHeight'));
    this.set('hexagonWidth', this.get('hexsideWidth') + this.get('centerWidth'));
    this.set('halfHexagonHeight', this.get('hexagonHeight') / 2);
    this.set('halfHexagonWidth', this.get('hexagonWidth') / 2);
    this.set('oneFourthHexagonHeight', this.get('hexagonHeight') / 4);
    this.set('leftMapEdge', -(this.get('hexsideWidth') + (this.get('centerWidth') / 2)));

//    this.hexagon = new Hexagon();
    this.hexpart = App.hexpart;
  },

  setPixels:function(pixelX, pixelY)
  {

    this.calculateHexpartFromPixels(pixelX, pixelY);
    this.calculateHexagonFromPixels();
    this.calculateHexagonNumber();
  },

  setHexagonXY:function(x, y)
  {

    this.set('hexagonX',x);
    this.set('hexagonY', y);
  },

  setHexpartXY:function(x, y)
  {
    this.mapGridX = (this.halfHexagonWidth * x) - this.originX;
    this.mapGridY = (this.oneFourthHexagonHeight * y) - this.originY;
    this.setXY(x, y);
  },

  calculateHexpartFromPixels:function(pixelX, pixelY)
  {

      var hexpartX, hexpartY;

    // adjust for hexagonGrid origin
    this.set('mapGridX', pixelX + this.get('originX'));
    this.set('mapGridY', pixelY + this.get('originY'));

    this.set('column', Math.floor((this.get('mapGridX') - this.get('leftMapEdge')) / this.get('hexagonWidth')));
    this.set('distanceFromLeftEdgeOfHexagon', (this.get('mapGridX') - this.get('leftMapEdge')) - (this.get('column') * this.get('hexagonWidth')));

    if (this.get('distanceFromLeftEdgeOfHexagon') < this.get('hexsideWidth')) {

      //  it's a / or \ hexside
      hexpartX = (2 * this.get('column')) - 1;
      this.set('row', Math.floor(this.get('mapGridY') / this.get('halfHexagonHeight')));
      hexpartY = (2 * this.get('row')) + 1;
      this.set('distanceFromTopEdgeOfHexagon', this.get('mapGridY') - (this.get('row') * this.get('topHeight')));
    }
    else
    {

      // it's a center or lower hexside
      hexpartX = 2 * (this.get('column'));
      this.set('mapGridY', this.get('mapGridY') + this.get('oneFourthHexagonHeight'));
      this.set('row', Math.floor(this.get('mapGridY') / this.get('halfHexagonHeight')));
      hexpartY = (2 * this.get('row'));
      this.set('distanceFromTopEdgeOfHexagon', this.get('mapGridY') - (this.get('row') * this.get('topHeight')));
    }
    this.setXY(hexpartX, hexpartY);
  },

  calculateHexagonNumber: function()
  {
    var x, y;
    var $minX = 4;
    var $minY = 8;
    var $evenColumnShiftDown = true;
    x = ( (this.get('hexagonX') -$minX ) / 2 ) + 1;

    if($evenColumnShiftDown == true)
    {
      y = Math.floor(((this.get('hexagonY') - $minY) / 4) + 1);
    } else {
      y = Math.floor(((this.get('hexagonY') - $minY + 2) / 4) + 1);
    }
    this.set('number', x * 100 + y);
  },
  calculateHexagonFromPixels:function()
  {

        var hexpartX, hexpartY, hexpartType;

    hexpartX = this.get('x');
    hexpartY = this.get('y');
    hexpartType = this.getHexpartType();
    switch (hexpartType)
    {
      case 1:
        this.setHexagonXY(hexpartX, hexpartY);
        break;

      case 2:
        if (this.distanceFromTopEdgeOfHexagon < this.oneFourthHexagonHeight) {
          this.setHexagonXY(hexpartX, hexpartY - 2);
        }
        else
        {
          this.setHexagonXY(hexpartX, hexpartY - 2);
//          this.setHexagonXY(hexpartX, hexpartY + 2);
        }
        break;

      case 3:
        // check the tangent of the hexside line with tangent of the mappoint
        //
        // the hexside line tangent is opposite / adjacent = this.hexsideWidth / this.topHeight
        // the mappoint tangent is opposite / adjacent =  this.distanceFromLeftEdgeOfHexagon / this.distanceFromTopEdgeOfHexagon
        //
        // is mappoint tangent <  line tangent ?
        // (this.distanceFromLeftEdgeOfHexagon / this.distanceFromTopEdgeOfHexagon) < (this.hexsideWidth / this.topHeight)
        //
        // multiply both sides by this.topHeight
        // (this.distanceFromLeftEdgeOfHexagon / this.distanceFromTopEdgeOfHexagon) * this.topHeight  < (this.hexsideWidth )
        //
        // multiply both sides by this.distanceFromTopEdgeOfHexagon
        // (this.distanceFromLeftEdgeOfHexagon * this.topHeight ) < (this.distanceFromTopEdgeOfHexagon * this.hexsideWidth)
        //

        if (this.distanceFromLeftEdgeOfHexagon * this.topHeight < this.distanceFromTopEdgeOfHexagon * this.hexsideWidth) {
          //  ______
          //  |\ |  |
          //  | \|  |
          //  |* |\ |
          //  |__|_\|
          //
//          this.setHexagonXY(hexpartX - 1, hexpartY + 1);
          this.setHexagonXY(hexpartX + 1, hexpartY - 1);
        }
        else
        {
          //  ______
          //  |\ |  |
          //  | \|* |
          //  |  |\ |
          //  |__|_\|
          //
          this.setHexagonXY(hexpartX + 1, hexpartY - 1);
        }
        break;

      case 4:
        // check the tangent of the hexside line with tangent of the mappoint
        //
        // see above
        //

        if (this.distanceFromLeftEdgeOfHexagon * this.topHeight < this.distanceFromTopEdgeOfHexagon * this.hexsideWidth) {
          //  ______
          //  |  | /|
          //  |* |/ |
          //  | /|  |
          //  |/_|_ |
          //
//          this.setHexagonXY(hexpartX - 1, hexpartY - 1);
          this.setHexagonXY(hexpartX + 1, hexpartY + 1);
        }
        else
        {
          //  ______
          //  |  | /|
          //  |  |/ |
          //  | /|* |
          //  |/_|_ |
          //
          this.setHexagonXY(hexpartX + 1, hexpartY + 1);
        }
        break;
    }
  },

  getHexpart:function()
  {
    return this.hexpart;
  },

  getHexagon:function()
  {
    return this.hexagon;
  },

  getPixelX:function()
  {
    return this.get('mapGridX');
  },

  getPixelY:function()
  {
    return this.get('mapGridY');
  }
});
App.draw = Ember.Mixin.create({
    draw: function (x, y, color, gridcolor) {
        var A, B, C;
        A = this.get('a') - 0;
        B = this.get('b') - 0;
        C = this.get('c') - 0;

        var canvas = document.getElementById('tutorial');
        if (!canvas) {
            return;
        }
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.strokeStyle = "#ff0000";
            y *= B * 2;
            if (x & 1) {
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
    doDraw: function (maxX, maxY) {

        this.clear();
        var x, y;
        for (x = 0; x < maxX; x++) {
            for (y = 0; y < maxY; y++) {
                this.draw(x, y, "#ffffff");
            }
        }
    },
    clear: function () {
        var canvas = document.getElementById('tutorial');
        if (!canvas) {
            return;
        }
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
});
App.Map = DS.Model.extend({
    mapUrl: DS.attr('string'),
    myAttr: DS.attr('string'),
    mapWidth: DS.attr('string'),
    mapHeight: DS.attr('number'),
    numX: DS.attr('number'),
    numY: DS.attr('number'),
    x: DS.attr('number'),
    y: DS.attr('number'),
    a: DS.attr('number'),
    b: DS.attr('number'),
    c: DS.attr('number'),
    hexSize: DS.attr('number'),
    perfectHexes: DS.attr('boolean'),
    hexes: DS.attr('string')

});

App.Map.FIXTURES = [
    {
        id: 1,
        mapUrl: "http://davidrodal.com/Battle/js/MartianIV.png",
        numX: 10,
        numY: 12,
        x: 0,
        y: 0,
        hexSize: 30,
        a: 20,
        b: 16,
        c: 30,
        perfect: false

    },
    {
        id: 2,
        mapUrl: "http://davidrodal.com/Battle/js/MCW.png",
        numX: 13,
        numY: 20,
        x: 7,
        y: 20,
        hexSize: 32,
        a: 16,
        b: 10,
        c: 32,
        perfect: false
    }
];
var maps = {maps: [
    {
        map: {
            id: 1,
            a: 3
        }
    },
    {
        map: {
            id: 2,
            a: 3
        }
    }

]};
App.MapsNewController = Ember.ObjectController.extend(App.draw, {
    init: function () {
    },
    actions: {
        save: function () {
            var that = this;
            var model = this.store.createRecord('map', {mapWidth:"width:auto",mapUrl: "http://davidrodal.com/Battle/js/MCW.png"});
            model.save().then(function (pr) {
                console.log("save model");
              this.transitionToRoute('map', model.get('id'));
            }.bind(this)
            );
        }
    }
});
App.MapIndexController = Ember.ObjectController.extend(App.draw,
    {needs: 'map',
      originY:function(){
        var b = this.get('b');
        return b * 3 - this.get('y');
      }.property('b','y'),
      originX: function(){
        var a = this.get('a');
        var c = this.get('c');
        var xOff = (a + c) * 2 - (c/2 + a);
        return xOff - this.get('x');
      }.property('a','c','y')
    }

);
App.MapHexesController = Ember.ObjectController.extend(App.draw, App.hexPick,App.hexpart,
  {needs: 'map',

    hexData:Ember.A(),
    showData:true,
    actions:{
      save:function(){
        var model = this.get('model');
        var hexData = this.get('hexData');
        var str = JSON.stringify(hexData);
        model.set('hexes', str);
        var id = model.get('id');
        model.save().then(function(){
        });
        this.transitionToRoute('map',id);
      },
      kill:function(){
        this.set('hexData',Ember.A());
      }
    },
  colors: [ "Town","Trail", "River", "Swamp", "Forest","Mountain","Road", "Sunkenroad","Redoubt", "Wadi", "ReinforceZoneA","ReinforceZoneB","ReinforceZoneC", "Blocked","BlocksNonRoad","SpecialHexA","SpecialHexB","SpecialHexC"],
    selectedColor:"Town"
//    selectedLabel:function(){
//      var col = this.get('selectedColor');
//      var color = "black";
//      switch(col){
//        case 'Town':
//          color = 'black';
//          break;
//        case "River":
//          color = 'blue';
//          break;
//        case "Forest":
//          color = "green";
//          break;
//        case "Mountain":
//          color = "brown";
//          break;
//        case "rOad":
//          color = "red";
//          break;
//      }
//      return "<span style='color:"+color+"'>"+col.replace(/[a-z]/g,'')+"</span>";
//    }.property('selectedColor')
  }

);
App.MapEditController = Ember.ObjectController.extend(App.draw,
    {
        needs: 'map',
        checked:false,
        checkIt:function(){
        }.observes('checked'),
        imageWidth: null,
        imageHeight: null,
        imageC: function () {
            $(".mapImage").error(function(){
            }).load(function(){
                });
            $('.mapImage').load({me:this},function(data){
                var height = $(this).height();
                var width = $(this).width();
                data.data.me.set('imageHeight', height);
                data.data.me.set('imageWidth', width);
            });
        }.observes('mapUrl'),

        actions: {
            save: function () {
//                this.set('mapWidth',this.get('imageWidth'));
//                this.set('mapHeight',this.get('imageHeight'));
                this.get('model').save().then(this.transitionToRoute('map'));

            },
            decHexSize: function () {
                this.set('blahblah',3);
                this.set('hexSize', this.get('hexSize') - 1);
            },
            incHexSize: function () {
                this.set('hexSize', this.get('hexSize') - 0 + 1);
            },
            decX: function () {
                this.set('x', this.get('x') - 1);
            },
            incX: function () {
                this.set('x', this.get('x') - 0 + 1);
            },
            decY: function () {
                this.set('y', this.get('y') - 1);
            },
            incY: function () {
                this.set('y', this.get('y') - 0 + 1);
            }

        },
        sizeChanged: function () {
//      this.get('model').save();
            this.set('perfect', false);
            Ember.run.once(this, 'justOneTime');
        }.observes('imageWidth','imageHeight'),
        justOneTime: function () {
//            this.doDraw(this.get('numX'), this.get('numY'));
        }
    }
);

App.MapController = Ember.ObjectController.extend(App.draw, {
//    perfectHexes:false,
//    checkIt:function(){
//        alert("hee");
//    }.observes('perfectHexes'),
    disabled: "false",
    imageWidth: 3,
    imageHeight: 4,
    myA: null,
    init: function () {
    },

    changeLeft: function () {
        $('canvas').css("left", this.get('x') + "px");
    }.observes("x"),
    changeTop: function () {
        $('canvas').css("top", this.get('y') + "px");
    }.observes("y"),
    doSomethingElse: function () {
        if(!this.get('perfectHexes')){
            return;
        }
        var hexside = this.get('hexSize');
        this.set("c", hexside);
        this.set("a", hexside / 2);
        this.set("b", hexside * SIN);

        this.set('perfect', true);
    }.observes('hexSize'),
    calcPerfect:function(){
        if(this.get('perfectHexes')){
            var c = this.get('c');
            this.set('hexSize',0);
            this.set('hexSize',c);
        }
    }.observes('perfectHexes'),
    doSomething: function () {

        Ember.run.once(this, 'justOneTime');
    }.observes('c', 'a', 'b', 'numX', 'numY'),
    justOneTime: function () {
        this.doDraw(this.get('numX'), this.get('numY'));
    }
});
App.MapsView = Ember.View.extend({
});
App.MapView = Ember.View.extend({
});

App.ImageView = Ember.View.extend({
    templateName: "ImageView",
    myControllerBinding: 'controller.controllers.map',
    didInsertElement: function () {
        var that = this;
        $(".mapImage").load(function () {
            var imgWidth = $("img").width();
            var imgHeight = $("img").height();
            $("canvas").attr({width: imgWidth, height: imgHeight});
            that.get('myController').changeLeft();
            that.get('myController').changeTop();
            that.get('myController').doDraw(that.get('myController.numX'), that.get('myController.numY'));
        });

        this.get('myController').changeLeft();
        this.get('myController').changeTop();
        this.get('myController').doDraw(this.get('myController.numX'), this.get('myController.numY'));
    }
});

App.ClickableImageView = App.ImageView.extend({
    click: function (e) {
        var offset = this.$().offset();
        var border = this.$(".tutWrapper").css('border-width');
        border = border.replace(/px/, "");
        var x = e.pageX - offset.left - border;
        var y = e.pageY - offset.top - border;
      this.get('controller').myInit(this.get('controller.model'));
      this.get('controller').setPixels(x, y);

      var x = this.get('controller.x');
      var y = this.get('controller.y');
      var myCon = this.get('controller');
      myCon.setHexpartXY(x, y);

      var px = myCon.getPixelX()+3 +"px";
      var py = myCon.getPixelY()+"px";
      var hexpartType = myCon.getHexpartType();
      var hexNumber = myCon.get('number');
      var name = hexNumber+"x"+hexpartType;
      var myObj = myCon.get('hexData').findBy('name',name);
      var curColor = this.get('controller.selectedColor');

      if(myObj){
        var curTerrain = myObj.type.findBy('name',curColor);
        if(curTerrain){
          myObj.get('type').removeObject(curTerrain);
//          if(!myObj.get('type')){
//            myCon.get('hexData').removeObject(myObj);
//          }
        }else{
          var newTerrain = App.TerrainType.create({name:curColor});
          myObj.get('type').pushObject(newTerrain);
        }
//        myCon.get('hexData').removeObject(myObj);

      }else{

        var newTerrainType = App.TerrainType.create({name:curColor});
        var type = Ember.A();
        type.pushObject(newTerrainType);
        var newTerrain = App.Terrain.create({type:type,name:name,number:hexNumber,x:px, y:py,hexpartType:hexpartType})

//        var type = this.get('controller.selectedColor').replace(/[a-z]/g,'');
//      myCon.get('hexData').pushObject({type:type,name:name,number:hexNumber,x:px, y:py, style:'top:'+py+';left:'+px,hexpartType:hexpartType});
        myCon.get('hexData').pushObject(newTerrain);
      }
//      $("#terrainWrapper").append("<div class='terrain' style='top:"+py+";left:"+px+";'>L</div>")


    },
    templateName: "ImageView",
    didInsertElement: function () {
        this._super();
      var str = this.get('controller.model.hexes');
      var arr = JSON.parse(str);
      var hexes = Ember.A();
      if(arr){
      for(var i = 0;i < arr.length;i++){
        var ter = App.Terrain.create(arr[i]);
        hexes.pushObject(ter);
      }
      }
      this.set('controller.hexData',hexes);
    }
});
App.TerrainType = Ember.Object.extend({
  name:null,
  display:null
});




App.Terrain = Ember.Object.extend({
  init:function(){
    this._super();
    var a = Ember.A();
    var type=this.get('type');
    for(var i = 0;i< type.length;i++)
    {
      a.pushObject(App.TerrainType.create(type[i]));
    }
    this.set('type',a);
  },
  type:Ember.A(),
  name:null,
  number:null,
  label:function(){
    console.log('TERRAINLABEL ');
    var len = this.get('type.length');

    var col = this.get('type');
    var ret = "";
    for(var i = 0;i < col.length;i++){
    var color = "black";
      var c;
      c = col[i].get('name');
      var disp = "X";
    switch(c){
      case 'Blocked':
        color = 'RED';
        disp = "B"
        break;
      case 'Town':
        color = 'black';
        disp = "T"
        break;
      case "River":
        color = 'blue';
        disp = "R"
        break;
      case "Forest":
        color = "green";
        disp = "F"
        break;
      case "Swamp":
        color = "green";
        disp = "S"
        break;
      case "Mountain":
        color = "brown";
        disp = "M";
        break;
      case "Road":
        color = "red";
        disp = "O";
        break;
      case "Sunkenroad":
        color = "purple";
        disp = "O";
        break;
      case "Trail":
        color = "brown";
        disp = "O";
        break;
      case "Redoubt":
        color = "purple";
        disp = "B";
        break;
      case "SpecialHexA":
        color = "green";
        disp = "A";
        break;
      case "SpecialHexB":
        color = "green";
        disp = "B";
        break;
      case "SpecialHexC":
        color = "green";
        disp = "C";
        break;
      case "Wadi":
        color = "black";
        disp = "W";
        break;
      case "ReinforceZoneA":
        color = "black";
        disp = "A";
        break;
      case "ReinforceZoneB":
        color = "black";
        disp = "B";
        break;
      case "BlocksNonRoad":
        color = "blue";
        disp = "B";
        break;
      case "ReinforceZoneC":
        color = "black";
        disp = "C";
        break;
    }

  ret +=  "<span style='color:"+color+"'>"+disp+"</span>";
    }
    return ret;
  }.property('type.@each'),
  code:function(){
    var col = this.get('type');
    var ret = "";
    for(var i = 0;i < col.length;i++){
      var color = "black";
      var c;
      c = col[i].get('name');
      if(c == "SpecialHexA"){
        ret += "$specialHexA[] = "+this.get('number')+";<br>";
      }else  if(c == "SpecialHexB"){
        ret += "$specialHexB[] = "+this.get('number')+";<br>";
      }else  if(c == "SpecialHexC"){
        ret += "$specialHexC[] = "+this.get('number')+";<br>";
      }else  if(c == "ReinforceZoneA"){
        ret += "$this->terrain->addReinforceZone("+this.get('number')+",'A');<br>";
      }else       if(c == "ReinforceZoneB"){
        ret += "$this->terrain->addReinforceZone("+this.get('number')+",'B');<br>";
      }else       if(c == "ReinforceZoneC"){
        ret += "$this->terrain->addReinforceZone("+this.get('number')+",'C');<br>";
      }else{
        ret += "$this->terrain->addTerrain("+this.get('number')+" ,"+this.get('hexpartType')+" , \""+ c.toLowerCase()+"\");<br>";
      }
        }
    return ret;
  }.property('type.@each'),
  x:null,
  y:null,
  style:function(){
    return 'top:'+this.get('y')+';left:'+this.get('x');
  }.property('x','y'),
  hexpartType:null
});
App.MapEditView = Ember.View.extend({
    didInsertElement: function () {
    }

});

































