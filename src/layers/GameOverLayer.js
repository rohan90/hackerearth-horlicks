/**
 * Created by rohan on 20/10/15.
 */
var GameOverLayer = cc.LayerColor.extend({
    // constructor
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        var centerPos2 = cc.p(winSize.width / 2, winSize.height / 2- 100);
        cc.MenuItemFont.setFontSize(30);

        var menuItemRestart = new cc.MenuItemSprite(
            new cc.Sprite(res.gameover_s),
            new cc.Sprite(res.gameover_s),
            this.onRestart, this);
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);

        var menuItemPostScore = new cc.MenuItemSprite(
            new cc.Sprite(res.post_score_s),
            new cc.Sprite(res.post_score_s),
            this.onPostScore, this);
        var menuPostScore = new cc.Menu(menuItemPostScore);
        menuPostScore.setPosition(centerPos2);
        this.addChild(menuPostScore);


    },
    onRestart:function (sender) {
        cc.sys.cleanScript("src/scenes/playScene.js");
        cc.sys.cleanScript("src/scenes/menuScene.js");
        cc.sys.cleanScript("src/layers/AnimationLayer.js");
        cc.sys.cleanScript("src/layers/BackgroundLayer.js");
        cc.sys.cleanScript("src/layers/StatusLayer.js");
        cc.sys.cleanScript("src/app.js");
        cc.sys.cleanScript("src/global.js");
        cc.sys.cleanScript("src/resources.js");
        cc.sys.cleanScript("main.js");
        cc.game.restart();
        cc.director.runScene(new MenuScene());
    },
    onPostScore : function(){

    }
});