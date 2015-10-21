/**
 * Created by rohan on 20/10/15.
 */
//menulayer
var MenuLayer = cc.Layer.extend({
    textField: null,

    ctor: function () {
        this._super();
    },
    init: function () {
        this._super();

        var winsize = cc.director.getWinSize();

        var centerpos0 = cc.p(winsize.width / 2, winsize.height / 2 + 160);
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2 + 100);
        var centerpos2 = cc.p(winsize.width / 2, winsize.height / 2);
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

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();

        /*var milkChallengeLabel = new cc.LabelTTF("Milk Challenge: ", "Arial", 30);
        // position the label on the center of the screen
        milkChallengeLabel.x = winsize.width / 2 - 300;
        milkChallengeLabel.y = winsize.height + 160;
        // add the label as a child to this layer
        this.addChild(milkChallengeLabel);*/

        textField = new ccui.TextField();
        textField.setTouchEnabled(true);
        textField.fontName = "Arial";
        textField.placeHolder = "30s";
        textField.setTextColor(cc.color(0,0,0))
        textField.fontSize = 30;
        textField.x = centerpos0.x;
        textField.y = centerpos0.y;
        textField.setMaxLengthEnabled(true);
        textField.setMaxLength(2);
        textField.addEventListener(this.textFieldEvent, this);
        this.addChild(textField);
    },
    textFieldEvent: function () {
        cc.log(textField.string)
    },

    onPlay: function () {
        if (parseInt(textField.string)){
            cc.log(parseInt(textField.string))
            cc.director.runScene(new PlayScene(parseInt(textField.string)));
        }else {
            cc.director.runScene(new PlayScene(5));
        }
    },
    onHelp: function () {
        cc.director.runScene(new HelpScene());
    },
    onHighScore: function () {
        //cc.director.runScene(new HighScoresScene());
        this.httpRequest(res.fetchScores, this.fetchHighScores);
    },
    fetchHighScores: function (response) {
        var jsonData = JSON.parse(response);
        var data = jsonData["data"];

        if (data) {
            cc.director.runScene(new HighScoreScene(data));
        }
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    cc.director.end(); //this will close app
                }
            }
        }, this);
    },
    httpRequest: function (url, callback) {
        var request = cc.loader.getXMLHttpRequest();
        request.open("GET", url, true);
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
        request.send();
    }
});

var MenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});