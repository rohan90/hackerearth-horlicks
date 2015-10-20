/**
 * Created by rohan on 20/10/15.
 */
//menulayer
var MenuLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
    },
    init:function(){
        this._super();

        var winsize = cc.director.getWinSize();

        var centerpos = cc.p(winsize.width / 2, winsize.height / 2 + 100);
        var centerpos2 = cc.p(winsize.width / 2, winsize.height / 2 );
        var centerpos3 = cc.p(winsize.width / 2, winsize.height / 2 - 100);

        var spritebg = new cc.Sprite(res.hello_bg);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        cc.MenuItemFont.setFontSize(60);

        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.start_n), // normal state image
            new cc.Sprite(res.start_s), // select state image
            this.onPlay, this);

        var menu = new cc.Menu(menuItemPlay);
        menu.setPosition(centerpos);
        this.addChild(menu);

        var menuItemHelp = new cc.MenuItemSprite(
            new cc.Sprite(res.help_s), // normal state image
            new cc.Sprite(res.help_s), // select state image
            this.onHelp, this);

        var menuHelp = new cc.Menu(menuItemHelp);
        menuHelp.setPosition(centerpos2);
        this.addChild(menuHelp);

        var menuItemHighScore = new cc.MenuItemSprite(
            new cc.Sprite(res.highscores_s), // normal state image
            new cc.Sprite(res.highscores_s), // select state image
            this.onHighScore, this);

        var menuHighScore = new cc.Menu(menuItemHighScore);
        menuHighScore.setPosition(centerpos3);
        this.addChild(menuHighScore);

        if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();
    },

    onPlay : function(){
        cc.log("==onplay clicked");
        cc.director.runScene(new PlayScene(15));
    },
    onHelp :function(){

    },
    onHighScore : function(){

    },
    createBackButtonListener: function(){
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased:function(key, event) {
                if(key == cc.KEY.back){
                    cc.director.end(); //this will close app
                }
            }
        }, this);
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});