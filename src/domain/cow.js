/**
 * Created by rohan on 20/10/15.
 */
var Cow = cc.Sprite.extend({
    points:1,

    ctor:function(){
        this._super();
        // Custom initialization
    },
    ctor:function(filename,points){
        this._super(filename);
        // Custom initialization
        this.points = points;
    },
    getPoints: function(){
        return this.points;
    }
});