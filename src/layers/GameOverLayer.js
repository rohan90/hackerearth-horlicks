/**
 * Created by rohan on 20/10/15.
 */
var GameOverLayer = cc.LayerColor.extend({

    score: 0,
    gameTime: 0,
    totalTime: 0,
    accuracy: 0,
    textField: null,
    sentOnce: false,


    // constructor
    ctor: function (score, totaltime, gameTime, accuracy) {
        this._super();
        cc.associateWithNative(this, cc.LayerColor);
        this.score = parseInt(score);
        this.totalTime = parseInt(totaltime);
        this.gameTime = parseInt(gameTime);
        if (accuracy)
            this.accuracy = parseFloat(accuracy * 100).toFixed(2);

        this.init();
    },
    init: function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos0 = cc.p(winSize.width / 2, winSize.height / 2 + 20);
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2 - 100);
        var centerPos2 = cc.p(winSize.width - 100, 50);
        cc.MenuItemFont.setFontSize(30);

        var menuItemRestart = new cc.MenuItemSprite(
            new cc.Sprite(res.gameover_s),
            new cc.Sprite(res.gameover_s),
            this.onRestart, this);
        var menu = new cc.Menu(menuItemRestart);
        menu.setPosition(centerPos2);
        this.addChild(menu);

        var menuItemPostScore = new cc.MenuItemSprite(
            new cc.Sprite(res.post_score_s),
            new cc.Sprite(res.post_score_s),
            this.onPostScore, this);
        var menuPostScore = new cc.Menu(menuItemPostScore);
        menuPostScore.setPosition(centerPos);
        this.addChild(menuPostScore);


        var scoreLabbel = new cc.LabelTTF("Milk: " + this.score + " litres in "
            + this.totalTime + "s\nTime Challenge: " + this.gameTime + "s, Aim: " + this.accuracy + "%"
            , "Arial", 38);
        // position the label on the center of the screen
        scoreLabbel.x = winSize.width / 2;
        scoreLabbel.y = winSize.height - 100;
        // add the label as a child to this layer
        this.addChild(scoreLabbel, 5);

        textField = new ccui.TextField("Your name or a cheeky comment \nbefore posting..");
        textField.setTouchEnabled(true);
        textField.fontName = "Arial";
        textField.fontSize = 30;
        textField.x = centerPos0.x;
        textField.y = centerPos0.y;
        textField.setMaxLengthEnabled(true);
        textField.setMaxLength(50);
        textField.addEventListener(this.textFieldEvent, this);
        this.addChild(textField);

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();
    },
    textFieldEvent: function (sender, type) {
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
        if (textField.string)
            scoreObj.comment = textField.string;
        else scoreObj.comment = "Random guest.";


        this.httpRequest(res.saveScore, JSON.stringify(scoreObj), this.scoreSaved);
        cc.log("sending score..pleasse wait.")
        this.sentOnce = true;
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    //cc.game.restart();
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