/**
 * Created by rohan on 20/10/15.
 */
var GameOverLayer = cc.LayerColor.extend({

    score: 0,
    gameTime: 0,
    totalTime: 0,
    accuracy: 0,
    sentOnce: false,
    cowTally: null,
    textField: null,
    menuRestart: null,
    menuPostScore: null,
    menuAnalysis: null,
    scoreLabbel: null,


    // constructor
    ctor: function (score, totaltime, gameTime, accuracy, cowTally) {
        this._super();
        cc.associateWithNative(this, cc.LayerColor);
        this.score = parseInt(score);
        this.totalTime = parseInt(totaltime);
        this.gameTime = parseInt(gameTime);
        if (accuracy)
            this.accuracy = parseFloat(accuracy * 100).toFixed(2);
        this.cowTally = JSON.parse(JSON.stringify(cowTally));
        this.init();
    },
    init: function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos0 = cc.p(winSize.width / 2, winSize.height / 2 + 20);
        var centerPos1l = cc.p(winSize.width / 2 - 120, winSize.height / 2 - 100);
        var centerPos1r = cc.p(winSize.width / 2 + 100, winSize.height / 2 - 100);
        var centerPos2 = cc.p(winSize.width - 100, 40);
        cc.MenuItemFont.setFontSize(30);

        var menuItemRestart = new cc.MenuItemSprite(
            new cc.Sprite(res.gameover_s),
            new cc.Sprite(res.gameover_s),
            this.onRestart, this);
        this.menuRestart = new cc.Menu(menuItemRestart);
        this.menuRestart.setPosition(centerPos2);
        this.addChild(this.menuRestart);

        var menuItemPostScore = new cc.MenuItemSprite(
            new cc.Sprite(res.post_score_s),
            new cc.Sprite(res.post_score_s),
            this.onPostScore, this);
        this.menuPostScore = new cc.Menu(menuItemPostScore);
        this.menuPostScore.setPosition(centerPos1r);
        this.addChild(this.menuPostScore);

        var menuItemAnalysis = new cc.MenuItemSprite(
            new cc.Sprite(res.analyse_small),
            new cc.Sprite(res.analyse_small),
            this.onAnalyze, this);
        this.menuAnalysis = new cc.Menu(menuItemAnalysis);
        this.menuAnalysis.setPosition(centerPos1l);
        this.addChild(this.menuAnalysis);


        this.scoreLabbel = new cc.LabelTTF("Milk: " + this.score + " litres in "
            + this.totalTime + "s\nTime Challenge: " + this.gameTime + "s, Aim: " + this.accuracy + "%"
            , "Arial", 38);
        // position the label on the center of the screen
        this.scoreLabbel.x = winSize.width / 2;
        this.scoreLabbel.y = winSize.height - 100;
        // add the label as a child to this layer
        this.addChild(this.scoreLabbel);

        this.textField = new ccui.TextField("Your name or a cheeky comment \nbefore posting..");
        this.textField.setTouchEnabled(true);
        this.textField.fontName = "Arial";
        this.textField.fontSize = 30;
        this.textField.x = centerPos0.x;
        this.textField.y = centerPos0.y;
        this.textField.setMaxLengthEnabled(true);
        this.textField.setMaxLength(50);
        this.textField.addEventListener(this.textFieldEvent, this);
        this.textField.retain();
        this.addChild(this.textField);

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();
    },
    textFieldEvent: function (sender, type) {
    },
    onAnalyze: function () {
        //cc.director.pushScene(new AnalysisScene(this.score, this.totalTime,this.gameTime, this.accuracy, this.cowTally));

        var analysisLayer = new AnalysisLayer(this.score, this.totalTime, this.gameTime, this.accuracy, this.cowTally)
        analysisLayer.setTag(88)
        this.hideMyself()
        this.addChild(analysisLayer, 5)
    },
    hideMyself: function () {
        this.scoreLabbel.setVisible(false)
        this.textField.setVisible(false)
        this.menuAnalysis.setVisible(false)
        this.menuPostScore.setVisible(false)
        this.menuRestart.setVisible(false)
    },
    showHighScoreLayer: function () {
        this.scoreLabbel.setVisible(true)
        this.textField.setVisible(true)
        this.menuAnalysis.setVisible(true)
        this.menuPostScore.setVisible(true)
        this.menuRestart.setVisible(true)
    },
    onRestart: function (sender) {
        //cc.sys.cleanScript("src/scenes/playScene.js");
        //cc.sys.cleanScript("src/scenes/menuScene.js");
        //cc.sys.cleanScript("src/layers/AnimationLayer.js");
        //cc.sys.cleanScript("src/layers/BackgroundLayer.js");
        //cc.sys.cleanScript("src/layers/StatusLayer.js");
        //cc.sys.cleanScript("src/app.js");
        //cc.sys.cleanScript("src/global.js");
        //cc.sys.cleanScript("src/resources.js");
        //cc.sys.cleanScript("main.js");
        //cc.game.restart();
        cc.director.resume()
        cc.director.runScene(new MenuScene());
    },
    onPostScore: function () {
        if (this.sentOnce)
            return;
        var scoreObj = {};
        scoreObj.score = this.score;
        scoreObj.timeChallenge = this.gameTime;
        scoreObj.timePlayed = this.totalTime;
        scoreObj.accuracy = this.accuracy;
        if (this.textField.string)
            scoreObj.comment = this.textField.string;
        else scoreObj.comment = "Random guest.";
        scoreObj.tally = this.cowTally;

        cc.log("sending score.."+JSON.stringify(scoreObj));
        this.httpRequest(res.saveScore, JSON.stringify(scoreObj), this.scoreSaved);
        this.sentOnce = true;
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    //cc.game.restart();
                    this.textField.release();
                    cc.director.resume()
                    cc.director.runScene(new MenuScene());
                    //cc.director.end;
                }
            }
        }, this);
    },
    scoreSaved: function (response) {
        if (response)
            cc.log("received scores respons.." + response);

        cc.log("score saved!.");
        this.sentOnce = false;

        //cc.game.restart();
        this.textField.release();
        cc.director.resume();
        cc.director.runScene(new MenuScene());
    },
    httpRequest: function (url, body, callback) {
        var request = cc.loader.getXMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //get status text
                var httpStatus = request.statusText;

                if (callback != null) {
                    callback(request.responseText);
                }
            }
        };
        request.send(body);
        //cc.director.resume()
    }
});