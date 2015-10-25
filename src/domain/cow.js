/**
 * Created by rohan on 20/10/15.
 */
var Cow = cc.Class.extend({
    sprite: null,
    points: 1,
    width: 0,
    height: 0,
    removed: false,
    health: 1,
    projectiles: [],
    stampId: -1,
    cowType:null,

    ctor: function () {
        // Custom initialization
    },
    ctor: function (id, cowType,filename, points, size) {
        this.points = points;
        this.stampId = id;
        this.size = size;
        this.cowType = cowType;
        // Custom initialization
        this.sprite = new cc.Sprite(filename)
        this.sprite.attr({
            scale: size,
        })
        if (size > 1)
            this.health = size * points;
        else this.health = size;
        this.points = size * points;
        //if(points <0)
        if (cowType == g_CowTypes.BABY)
            this.health = 1; //for baby
        else if(cowType == g_CowTypes.HORLICKS)
            this.health =1;
        if(this.health > 2.5) //TODO for ease of play, should be removed?
            this.health = 2
        this.sprite.retain()
        this.width = this.sprite.getContentSize().width;
        this.height = this.sprite.getContentSize().height;
        this.projectiles=[]
    },
    getCowType:function(){
        return this.cowType;
    },
    getCowSize: function () {
        return this.size
    },
    getStampId: function () {
        return this.stampId;
    },
    getPoints: function () {
        return this.points;
    },
    setPosition: function (x, y) {
        this.sprite.setPosition(x, y)
    },
    getPosition: function () {
        return this.sprite.getPosition()
    },
    getContentSize: function () {
        return this.sprite.getContentSize()
    },
    getSprite: function () {
        return this.sprite
    },
    getBoundingBox: function () {
        //var w = this.width, h = this.height;
        //var x = this.sprite.getPosition().x, y =this.sprite.getPosition().y;
        //var rect = cc.rect(x, y, w, h);
        //return rect;
        return this.sprite.getBoundingBox();
    },
    removeFromParent: function () {
        this.sprite.removeFromParent()
        this.removed = true;
        this.sprite.release()

    },
    isRemoved: function () {
        return this.removed;
    },
    isCowCaptured: function () {
        if (this.health < 1) {
            return true;
        }
        else {
            return false;
        }
    },
    cowHit: function (hit, index) {
        if (this.projectiles.indexOf(index) > -1) {
            return false;
        } else {
            this.projectiles.push(index)
            this.health -= hit;
        }

    },
    cowHitByTouch: function (hit, index) {
        //if (this.projectiles.indexOf(index) > -1) {
        //    return false;
        //} else {
        //    this.projectiles.push(index)
            this.health -= hit;
        //}

    }
});