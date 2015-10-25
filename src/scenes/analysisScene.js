/**
 * Created by rohan on 24/10/15.
 */
var AnalysisLayer = cc.LayerColor.extend({
    cowTally: null,
    totalTime: 0,
    gameTime: 0,
    accuracy: 0,
    score: 0,

    ctor: function (score, totalTime, gameTime, accuracy, cowTally) {
        this._super();
        cc.associateWithNative(this, cc.LayerColor);
        this.cowTally = cowTally;
        this.totalTime = totalTime;
        this.gameTime = gameTime;
        this.accuracy = accuracy;
        this.score = score;
        this.init();
    },
    init: function () {
        this._super(cc.color(0, 0, 0, 180));
        var winsize = cc.director.getWinSize();

        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
            this.createBackButtonListener();


        var positionTop = cc.p(winsize.width / 2, winsize.height - 50);
        var spritebg = new cc.Sprite(res.analyse_small);
        spritebg.setPosition(positionTop);
        this.addChild(spritebg);


        var backButton = new ccui.Button();
        backButton.setTouchEnabled(true);
        backButton.setPosition(cc.p(winsize.width - 50, winsize.height - 50))
        backButton.loadTextureNormal(res.back_big)
        backButton.addTouchEventListener(this.backButtonPressed, this)
        this.addChild(backButton);

        //TODO scroll view
        var llp = new ccui.LinearLayoutParameter();
        llp.setMargin(10, 10, 10, 10)

        var cow_layout = new ccui.Layout();
        cow_layout.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
        cow_layout.setPositionType(ccui.Widget.POSITION_PERCENT);
        cow_layout.setPositionPercent(cc.p(0.25, 0.75));
        cow_layout.setLayoutParameter(llp)

        this.populateCowIcons(cow_layout, winsize)
        this.addChild(cow_layout);

        var cow_score_layout = new ccui.Layout();
        cow_score_layout.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
        cow_score_layout.setPositionType(ccui.Widget.POSITION_PERCENT);
        cow_score_layout.setPositionPercent(cc.p(0.25, 0.60));
        cow_layout.setLayoutParameter(llp)

        this.populateCowIconTexts(cow_score_layout, winsize);
        this.addChild(cow_score_layout);

        //report
        var report = this.getReport()

        var positionReportImg = cc.p(100, winsize.height / 2 - 80);
        var reportSprite = new cc.Sprite(report.img);
        reportSprite.setPosition(positionReportImg);
        this.addChild(reportSprite);

        var reportText1 = new ccui.Text();
        reportText1.attr({
            x: winsize.width / 2,
            y: winsize.height / 2 - 35,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + report.text1,
            font: "Arial",
        });
        reportText1.setFontSize(22)
        this.addChild(reportText1);

        var reportText2 = new ccui.Text();
        reportText2.attr({
            x: winsize.width / 2,
            y: winsize.height / 2 - 150,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + report.text2,
            font: "Arial",
        });
        reportText2.setFontSize(20)
        this.addChild(reportText2);


    },
    getReport: function () {
        var winnerCow = this.getWinner(this.cowTally);
        var report = {img: res.con1, text1: "1", text2: "1analysis"}

        switch (winnerCow) {
            case g_CowTypes.NORMAL:
                report.img = res.con1;
                report.text1 = "Normal, this farm plays\n it safe. No risks..booooring.";
                report.text2 = this.getAnalysisText2();
                break;
            case g_CowTypes.BLUE:
                report.img = res.con2;
                report.text1 = "Swaggity swag!, this farm\n makes milk for those crazy vegans!";
                report.text2 = this.getAnalysisText2();
                break;
            case g_CowTypes.YELLOW:
                report.img = res.con3;
                report.text1 = "Sacre bluh!! I mean yellow, \nthis produce is best for cheese \n and Desi Ghee!";
                report.text2 = this.getAnalysisText2();
                break;
            case g_CowTypes.RED:
                report.img = res.con4;
                report.text1 = "Whoa this farm be nuts, only bulls...\n All world athletes buy their milk from here";
                report.text2 = this.getAnalysisText2();
                break;
            case g_CowTypes.BABY:
                report.img = res.con5;
                report.text1 = "This farm, be CRAZZYY,\n(Someone needs a biology class)\n I guess they import more \nthan they export.";
                report.text2 = this.getAnalysisText2();
                break;
        }
        return report
    },
    getAnalysisText2: function () {
        var multiplier = (this.score * this.gameTime) / this.totalTime;
        cc.log("multipler:" + multiplier);

        var cowTally = this.cowTally;
        var energy = 200 + cowTally.normal * 1 + cowTally.red * 10 + cowTally.blue * 1+cowTally.yellow*1;
        var protein = 9 + cowTally.normal * 1 + cowTally.red * 2 + cowTally.blue * 1+cowTally.yellow*1;
        var carbs = 72 + cowTally.normal * 1 - cowTally.red * 1 - cowTally.blue * 1+cowTally.yellow*1;
        var fat = 3 + cowTally.normal * 1 + cowTally.blue * 1+cowTally.yellow*2;

        var text = "A glassfull of this produce has..\n " +
            "Energy: " + energy + " calories, Protein: " + protein + "g,\n" +
            "Carbs: " + carbs + "g, Fat: " + fat + "g.";

        return text;

    },
    getWinner: function (cowTally) {
        cc.log("tally is.." + JSON.stringify(cowTally))
        var winner = g_CowTypes.NORMAL;
        var max = 0;
        var maxProp = "normal";

        for (var prop in cowTally) {
            if (cowTally[prop] > max) {
                max = cowTally[prop]
                maxProp = prop
            }
        }
        cc.log("winner type " + maxProp)
        if(maxProp === "yellow")
            winner = g_CowTypes.YELLOW
        else if(maxProp === "blue")
            winner = g_CowTypes.BLUE
        else if(maxProp === "red")
            winner = g_CowTypes.RED
        else if(maxProp === "baby")
            winner = g_CowTypes.BABY
        return winner;
    },
    populateCowIcons: function (layout, size) {
        var llp = new ccui.LinearLayoutParameter();
        llp.setMargin(20, 10, 20, 10)

        var cow1 = new ccui.ImageView();
        cow1.loadTexture(res.cow1);
        cow1.setLayoutParameter(llp)
        layout.addChild(cow1)

        var cow2 = new ccui.ImageView();
        cow2.loadTexture(res.cow2);
        cow2.setLayoutParameter(llp)
        layout.addChild(cow2)

        var cow3 = new ccui.ImageView();
        cow3.loadTexture(res.cow3);
        cow3.setLayoutParameter(llp)
        layout.addChild(cow3)

        var cow4 = new ccui.ImageView();
        cow4.loadTexture(res.cow4);
        cow4.setLayoutParameter(llp)
        layout.addChild(cow4)

        var cow5 = new ccui.ImageView();
        cow5.loadTexture(res.cow5);
        cow5.setLayoutParameter(llp)
        layout.addChild(cow5)

    },
    populateCowIconTexts: function (layout, size) {
        var llp = new ccui.LinearLayoutParameter();
        llp.setMargin(30, 10, 50, 10)
        llp.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL)

        var cow1 = new ccui.Text();
        cow1.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + this.cowTally.normal,
            font: "Arial"
        });
        cow1.setLayoutParameter(llp)
        layout.addChild(cow1);



        var cow2 = new ccui.Text();
        cow2.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + this.cowTally.blue,
            font: "Arial"
        });
        cow2.setLayoutParameter(llp)
        layout.addChild(cow2);

        //note this cow3 to lazy to rename
        var cow3 = new ccui.Text();
        cow3.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + this.cowTally.yellow,
            font: "Arial"
        });
        cow3.setLayoutParameter(llp)
        layout.addChild(cow3);

        var cow4 = new ccui.Text();
        cow4.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + this.cowTally.red,
            font: "Arial"
        });
        cow4.setLayoutParameter(llp)
        layout.addChild(cow4);

        var cow5 = new ccui.Text();
        cow5.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: "" + this.cowTally.baby,
            font: "Arial"
        });
        cow5.setLayoutParameter(llp)
        layout.addChild(cow5);


    },
    backButtonPressed: function () {
        this.parent.showHighScoreLayer()
        this.removeFromParent()
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                }
            }
        }, this);
    }
});

/*
 var AnalysisScene = cc.Scene.extend({
 ctor: function () {
 this._super();
 },
 ctor: function (score, totalTime,gameTime, accuracy, cowTally) {
 this._super();
 this.score = score
 this.totalTime = totalTime
 this.gameTime = gameTime
 this.accuracy= accuracy
 this.cowTally=cowTally
 cc.log("" + JSON.stringify(cowTally));
 },
 onEnter: function () {
 this._super();
 var layer = new AnalysisLayer(this.score, this.totalTime,this.gameTime, this.accuracy, this.cowTally);
 layer.init();
 this.addChild(layer);

 }
 });*/
