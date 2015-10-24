/**
 * Created by rohan on 21/10/15.
 */
var HelpLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
    },
    init: function () {
        var winsize = cc.director.getWinSize();

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();


        var centerposBG = cc.p(winsize.width / 2, winsize.height / 2 - 100);
        var spritebg = new cc.Sprite(res.help_bg);
        spritebg.setPosition(centerposBG);
        this.addChild(spritebg);

        var backButton = new ccui.Button();
        backButton.setTouchEnabled(true);
        backButton.setPosition(cc.p(winsize.width -50,20))
        backButton.loadTextureNormal(res.back_big)
        backButton.addTouchEventListener(this.backButtonPressed,this)
        this.addChild(backButton);

    },
    backButtonPressed:function(){
        cc.director.runScene(new MenuScene());
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    cc.director.runScene(new MenuScene());
                }
            }
        }, this);
    }
});

var HelpScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HelpLayer();
        layer.init();
        this.addChild(layer);
    }
});