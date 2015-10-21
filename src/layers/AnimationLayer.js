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

        //TODO
        /*var winsize = cc.winSize;
        var backButton = new ccui.Button();
        backButton.setTouchEnabled(true);
        backButton.setPosition(cc.p(winsize.width/2, winsize.height/2))
        backButton.loadTextureNormal(res.back_big)
        backButton.addClickEventListener(this.backButtonPressed, this)
        backButton.addTouchEventListener(this.backButtonPressed, this)
        this.addChild(backButton);*/

    },
    backButtonPressed: function () {
        cc.director.runScene(new MenuScene());
    },

});