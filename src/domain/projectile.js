/**
 * Created by rohan on 22/10/15.
 */
var Projectile = cc.Class.extend({
    sprite:null,
    points:1,
    width:0,
    height:0,
    removed:false,
    stampId:-1,


    ctor:function(){
        // Custom initialization
    },
    ctor:function(id,filename,points){
        this.points = points;
        this.stampId = id;
        // Custom initialization
        this.sprite = new cc.Sprite(filename)
        this.sprite.retain()
        this.width = this.sprite.getContentSize().width;
        this.height = this.sprite.getContentSize().height;
    },
    getStampId:function(){
        return this.stampId;
    },
    getPoints: function(){
        return this.points;
    },
    setPosition:function(x,y){
        this.sprite.setPosition(x,y)
    },
    getPosition:function(){
        return this.sprite.getPosition()
    },
    getContentSize:function(){
        return this.sprite.getContentSize()
    },
    getSprite:function(){
        return this.sprite
    },
    getBoundingBox:function(){
        //var w = this.width, h = this.height;
        //var x = this.sprite.getPosition().x, y =this.sprite.getPosition().y;
        //var rect = cc.rect(x, y, w, h);
        //return rect;
        return this.sprite.getBoundingBox();
    },
    removeFromParent:function(){
        this.sprite.removeFromParent()
        this.removed = true;
        this.sprite.release()
    },
    isRemoved:function(){
        return this.removed;
    }
});