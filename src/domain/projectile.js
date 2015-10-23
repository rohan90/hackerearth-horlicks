/**
 * Created by rohan on 22/10/15.
 */
var Projectile = cc.Class.extend({
    sprite:null,
    points:1,
    width:0,
    height:0,
    removed:false,


    ctor:function(){
        // Custom initialization
    },
    ctor:function(filename,points){
        this.points = points;
        // Custom initialization
        this.sprite = new cc.Sprite(filename)
        this.sprite.retain()
        this.width = this.sprite.getContentSize().width;
        this.height = this.sprite.getContentSize().height;
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
        //var _p = this.sprite.convertToWorldSpace(this.sprite.getPosition());
        var w = this.width, h = this.height;
        var x = this.sprite.getPosition().x, y =this.sprite.getPosition().y;
        var rect = cc.rect(x, y, w, h);
//        var rect = cc.Rect(cc.p(x, y), cc.p(w, h));
        //rect.drawRect(cc.p(_p.x, _p.y), cc.p(w, h));
        //rect.drawRect(cc.p(x, y), cc.p(w, h));
        return rect;
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