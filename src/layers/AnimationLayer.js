/**
 * Created by rohan on 20/10/15.
 */
var AnimationLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();

        var size = cc.winSize;

        //create the hero sprite
        var playa = new cc.Sprite(res.cow1);
        playa.attr({x: 80, y: 5});

        //create the move action
        var actionTo = new cc.MoveTo(3, cc.p(300, 5));
        playa.runAction(new cc.Sequence(actionTo));
        this.addChild(playa);
    }
});