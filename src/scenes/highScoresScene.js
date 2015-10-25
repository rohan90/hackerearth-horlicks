/**
 * Created by rohan on 20/10/15.
 */
var HighScoreLayer = cc.Layer.extend({
    listView: null,
    backButton: null,
    data: [],

    ctor: function () {
        this._super();
    },
    ctor: function (data) {
        this._super();
        this.data = data;
        cc.log("inside highscoress..cache chek")
    },
    init: function () {
        var winsize = cc.director.getWinSize();

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();

        var data = this.data;
        this.listView = new ccui.ListView()
        this.listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        this.listView.setTouchEnabled(true)
        this.listView.setBounceEnabled(false)
        this.listView.setBackGroundImage(res.hello_bg)
        this.listView.setContentSize(cc.size(winsize.width, winsize.height - 100))
        this.listView.setAnchorPoint(cc.p(0.5, 0.5))
        this.listView.setPosition(cc.p(winsize.width/2, winsize.height/2))
        this.listView.addEventListener(this.selectedItemEvent,this)

        this.addChild(this.listView);

        for (var i = 0; i < data.length; i++) {
            var text = "Rank " + (i + 1) + " : " + data[i].score + " litres in " + data[i].timeChallenge
                        + "s, aim "+data[i].accuracy+"%, played for " + data[i].timePlayed + "s \n         [" + data[i].comment + "]";
            var score = new ccui.Text(text,"Arial","25");
            score.setColor(cc.color(0,0,0))
            score.setTouchEnabled(true);

            this.listView.pushBackCustomItem(score);

        }

        this.backButton = new ccui.Button();
        this.backButton.setTouchEnabled(true);
        this.backButton.setPosition(cc.p(winsize.width -50,50))
        this.backButton.loadTextureNormal(res.back_big)
        this.backButton.addTouchEventListener(this.backButtonPressed,this)
        this.addChild(this.backButton);

        cc.log("inside highscoress..cache chek")

    },
    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.EVENT_SELECTED_ITEM:
                var listViewEx = sender;
                cc.log("select child index = " + listViewEx.getCurSelectedIndex());
                this.onAnalyze(this.data[listViewEx.getCurSelectedIndex()])
                break;
            default:
                break;
        }
    },
    onAnalyze: function (data) {
        //cc.director.pushScene(new AnalysisScene(this.score, this.totalTime,this.gameTime, this.accuracy, this.cowTally));

        var analysisLayer = new AnalysisLayer(data.score, data.timePlayed, data.timeChallenge, data.accuracy, data.tally)
        analysisLayer.setTag(88)
        this.hideMyself()
        this.addChild(analysisLayer, 5)
    },
    hideMyself: function () {
        this.listView.setVisible(false)
        this.backButton.setVisible(false)
    },
    showHighScoreLayer: function () {
        this.listView.setVisible(true)
        this.backButton.setVisible(true)
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