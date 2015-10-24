/**
 * Created by rohan on 20/10/15.
 */
var HighScoreLayer = cc.Layer.extend({
    listView: null,
    data: [],

    ctor: function () {
        this._super();
    },
    ctor: function (data) {
        this._super();
        this.data = data;
    },
    init: function () {
        var winsize = cc.director.getWinSize();

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();

        var data = this.data;
        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        listView.setBackGroundImage(res.hello_bg)
        listView.setContentSize(cc.size(winsize.width, winsize.height - 100))
        listView.setAnchorPoint(cc.p(0.5, 0.5))
        listView.setPosition(cc.p(winsize.width/2, winsize.height/2))

        this.addChild(listView);
        for (var i = 0; i < data.length; i++) {
            var text = "Rank " + (i + 1) + " : " + data[i].score + " litres in " + data[i].timeChallenge
                        + "s, aim "+data[i].accuracy+"%, played for " + data[i].timePlayed + "s \n         [" + data[i].comment + "]";
            var score = new ccui.Text(text,"Arial","25");
            score.setColor(cc.color(0,0,0))
            score.setTouchEnabled(false);
            listView.pushBackCustomItem(score);

        }

        var backButton = new ccui.Button();
        backButton.setTouchEnabled(true);
        backButton.setPosition(cc.p(winsize.width -50,50))
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

var HighScoreScene = cc.Scene.extend({
    data:[],

    ctor: function (data) {
        this._super();
        this.data = data;
    },
    onEnter: function () {
        this._super();
        var layer = new HighScoreLayer(this.data);
        layer.init();
        this.addChild(layer);
    }
});