App = Ember.Application.create({});
var SIN = Math.sin(Math.PI / 3);
//App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: 'http://localhost/HexMapTool/rest/index.php'
});

//App.MapAdapter = DS.RESTAdapter.extend({
//    host:'http://localhost/HexMapTool/rejst/index.php'
//});
App.Router.map(function () {
    this.resource('maps', function () {
        this.route('new');
        this.resource('map', {path: ":map_id"}, function () {
            this.route('edit');
        });
    });
    this.resource('about');
});

App.MapsRoute = Ember.Route.extend({
//        model: function() {
//            return this.store.find('map');
//    }
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
        debugger;
        return this.modelFor('map');
    }
});
App.MapEditRoute = Ember.Route.extend({
    model: function (param) {
        return this.modelFor('map');
    }
});
App.MapsNewRoute = Ember.Route.extend({
//    model: function() {
//        return this.store.createRecord('map',{mapUrl:"http://davidrodal.com/Battle/js/nta.png"});
//    }
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
    mapWidth: DS.attr('number'),
    mapHeight: DS.attr('number'),
    numX: DS.attr('number'),
    numY: DS.attr('number'),
    x: DS.attr('number'),
    y: DS.attr('number'),
    a: DS.attr('number'),
    b: DS.attr('number'),
    c: DS.attr('number'),
    hexSize: DS.attr('number'),
    perfectHexes: DS.attr('boolean')

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
            var model = this.store.createRecord('map', {mapUrl: "http://davidrodal.com/Battle/js/nta.png"});
            model.save().then(function () {
                this.transitionToRoute('map', model.get('id'));
            }.bind(this)
            );
        }
    }
});
App.MapIndexController = Ember.ObjectController.extend(App.draw,
    {needs: 'map'
    }
);
App.MapEditController = Ember.ObjectController.extend(App.draw,
    {
        needs: 'map',
        checked:false,
        checkIt:function(){
            alert("hi");
        }.observes('checked'),
        imageWidth: null,
        imageHeight: null,
        imageC: function () {
            $(".mapImage").error(function(){
                alert("HELP MARIO");
            }).load(function(){
                    alert("Thanks mario");
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
                this.set('mapWidth',this.get('imageWidth'));
                this.set('mapHeight',this.get('imageHeight'));
                this.get('model').save().then(this.transitionToRoute('map'));
            },
            decHexSize: function () {
                debugger;
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
        debugger;
        $('canvas').css("left", this.get('x') + "px");
    }.observes("x"),
    changeTop: function () {
        $('canvas').css("top", this.get('y') + "px");
    }.observes("y"),
    doSomethingElse: function () {
        debugger;
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
        debugger;
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
        alert("X: " + x + " Y: " + y);
    },
    templateName: "ImageView",
    didInsertElement: function () {
        this._super();
    }
});

App.MapEditView = Ember.View.extend({
    didInsertElement: function () {
    }

});