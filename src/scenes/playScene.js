/**
 * Created by rohan on 20/10/15.
 */
//playscene
var PlayScene = cc.Scene.extend({
    _cows: [],
    _projectiles: [],
    statusLayer: {},
    gameTime: 30,
    gameStarted: false,//default


    //doing this because android is screwing with me
    labelScore: null,
    labelTime: null,
    labelHits: null,
    labelMiss: null,
    labelAmmo: null,
    score: 0,
    time: 0,
    hits: 0,
    miss: 0,
    ammo: 30,
    fired: 1,//needed
    isMinuteOver: false,
    minuteCount: 1,
    gameTime: 30,//default 30
    _gameTime: 30,



    ctor: function () {
        this._super();
    },
    ctor: function (num) {
        cc.log("gameStarted? " + this.gameStarted)
        this._super();
        this.gameTime = num;
        this._gameTime = num;
        cc.log("" + num);
        this.gameStarted = true;
        cc.log(this.gameTime)
    },
    init: function () {
        //add three layer in the right order
        //this.addChild(new BackgroundLayer());
        //this.addChild(new AnimationLayer());
        //this.addChild(new StatusLayer(this.gameTime));
        //cc.log(this.statusLayer);

        var winsize = cc.director.getWinSize();


        //create the background image and position it at the center of screen
        var centerPos = cc.p(winsize.width / 2, winsize.height / 2);
        var spriteBG = new cc.Sprite(res.hello_bg);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);

        var playa = new cc.Sprite(res.cow1);
        playa.attr({x: 80, y: 5});

        //create the move action
        var actionTo = new cc.MoveTo(3, cc.p(300, 5));
        playa.runAction(new cc.Sequence(actionTo));
        this.addChild(playa);

    },
    onEnter: function () {
        this._super();
        this.init();
        this.initStatusLayer();
        var winsize = cc.director.getWinSize();

        var eventListener = cc.EventListener.create({

            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            setTouchEnabled: true,

            onTouchBegan: this.handleTouch.bind(this)
        });

        cc.eventManager.addListener(eventListener, this);


        /*if('touches' in cc.sys.capabilities){
         this.setTouchMode(cc.TOUCHES_ONE_BY_ONE);
         }*/
        {
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
                this.createBackButtonListener();
            }
        }

        //this.statusLayer = this.getChildByName("StatusLayer")
        //cc.log(this.statusLayer);


            this.scheduleUpdate();
            this.schedule(this.gameLogic, 0.5);
    },
    gameLogic: function (dt) {
        this.addCows()
    },
    handleTouch: function (touch, event) {
        this.addProjectile(touch.getLocation())
    },
    addProjectile: function (location) {
        cc.log("Touched at " + location.x + "," + location.y);
        //if (!this.statusLayer.canFire()) {
        if (!this.canFire()) {
            return;
        }
        //this.statusLayer.updateAmmo(1);
        this.updateAmmo(1);

        var winSize = cc.winSize;
        // Set up initial location of the projectile
        var projectile = new Projectile(res.s_projectile,1);
        projectile.setPosition(300, 2);

        // Determine offset of location to projectile
        var offset = cc.pSub(location, projectile.getPosition()); // 1

        this.addChild(projectile);

        // Figure out final destination of projectile
        var realX;
        if (offset.x <= 0) {
            realX = -winSize.width + (projectile.getContentSize().width / 2);
        } else
            realX = winSize.width + (projectile.getContentSize().width / 2);

        var ratio = offset.y / offset.x;
        var realY = (realX * ratio) + projectile.getPosition().y;
        var realDest = cc.p(realX, realY);

        // Determine the length of how far you're shooting
        var offset = cc.pSub(realDest, projectile.getPosition());
        var length = cc.pLength(offset);
        var velocity = 480.0;
        var realMoveDuration = length / velocity;

        // Move projectile to actual endpoint
        projectile.runAction(cc.Sequence.create( // 2
            cc.MoveTo.create(realMoveDuration, realDest),
            cc.CallFunc.create(function (node) {
                cc.arrayRemoveObject(this._projectiles, node);
                node.removeFromParent();
            }, this)
        ));

        // Add to array
        projectile.setTag(2);
        this._projectiles.push(projectile);
    },
    addCows: function () {

        var size = cc.winSize;

        var num = Math.floor(Math.random() * 7) + 1
        var cow;
        switch (num) {
            case 1:
                2
                cow = new Cow(res.cow5, -2);
                break;
            case 3:
                cow = new Cow(res.cow2, 1);
                break;
            case 4:
                cow = new Cow(res.cow3, 1.5);
                break;
            case 5:
                cow = new Cow(res.cow4, 4);
                break;
            default:
                cow = new Cow(res.cow1, 1);
                break;
        }

        var minY = cow.getContentSize().height / 2;
        var maxY = size.height - cow.getContentSize().height / 2 - 50;
        var rangeY = maxY - minY;
        var actualY = (Math.random() * rangeY) + minY; // 1

        if (actualY <= (minY + maxY) / 2) {
            cow.setPosition(size.width + cow.getContentSize().width / 2, actualY);
        } else {
            cow.setPosition(-cow.getContentSize().width / 2, actualY);
        }
        this.addChild(cow); // 2

        // Determine speed of the cow
        var minDuration = 2.0;
        var maxDuration = 4.0;
        var rangeDuration = maxDuration - minDuration;
        var actualDuration = (Math.random() % rangeDuration) + minDuration;

        var actionMove = {};
        // Create the actions
        if (actualY <= (minY + maxY) / 2) {
            actionMove = cc.MoveTo.create(actualDuration, cc.p(-cow.getContentSize().width / 2, (Math.random() * rangeY) + minY)); // 3
        } else {
            actionMove = cc.MoveTo.create(actualDuration, cc.p(size.width + cow.getContentSize().width / 2, (Math.random() * rangeY) + minY)); // 3
        }
        var actionMoveDone = cc.CallFunc.create(function (node) { // 4
            cc.arrayRemoveObject(this._cows, node); // 5
            node.removeFromParent();
        }, this);
        cow.runAction(cc.Sequence.create(actionMove, actionMoveDone));

        // Add to array
        cow.setTag(1);
        this._cows.push(cow); // 6

    },
    update: function (dt) {
        //this.statusLayer.updateTime(dt);
        this.updateTime(dt);

        //if (this.statusLayer.isTimeOver()) {
        if (this.isTimeOver()) {
            cc.log("==game over");
            this.gameStarted = false;
            //var score = this.statusLayer.getScore();
            //var totalTime = parseInt(this.statusLayer.getTotalPlayTime());
            //var gameTime = this.statusLayer.getGameTime();
            var score = this.getScore();
            var totalTime = parseInt(this.getTotalPlayTime());
            var gameTime = this.getGameTime();

            cc.log("Milk: " + score + "litres in " + totalTime + "s\nMilk Challenge:" + gameTime + "s");
            this.addChild(new GameOverLayer(score, totalTime, gameTime));
            this.reset()
            cc.director.pause();
        }

        for (var i = 0; i < this._projectiles.length; i++) {
            var projectile = this._projectiles[i];
            for (var j = 0; j < this._cows.length; j++) {
                var cow = this._cows[j];
                var projectileRect = projectile.getBoundingBox();
                var cowRect = cow.getBoundingBox();
                if (cc.rectIntersectsRect(projectileRect, cowRect)) {
                    cc.log("collision!");
                    //this.statusLayer.addHit(1, cow.getPoints());
                    this.addHit(1, cow.getPoints());
                    cc.arrayRemoveObject(this._projectiles, projectile);
                    projectile.removeFromParent();
                    cc.arrayRemoveObject(this._cows, cow);
                    cow.removeFromParent();
                }
            }
        }
    },
    createBackButtonListener: function () {
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyReleased: function (key, event) {
                if (key == cc.KEY.back) {
                    //cc.director.end;
                    cc.director.runScene(new MenuScene());
                }
            }
        }, this);
    },


    initStatusLayer: function () {
        cc.log("initializing hud")
        var winsize = cc.director.getWinSize();

        this.labelScore = new cc.LabelTTF("Milk:0", "Helvetica", 25);
        //this.labelScore.setColor(cc.color(0,0,0));//black color
        this.labelScore.setPosition(cc.p(70, winsize.height - 25));
        this.addChild(this.labelScore);

        this.labelAmmo = new cc.LabelTTF("Horlicks:0", "Helvetica", 25);
        this.labelAmmo.setPosition(cc.p(90, winsize.height - 60));
        this.addChild(this.labelAmmo);

        this.labelTime = new cc.LabelTTF("Time:0s", "Helvetica", 25);
        this.labelTime.setPosition(cc.p(winsize.width - 70, winsize.height - 25));
        this.addChild(this.labelTime);

        this.labelHits = new cc.LabelTTF("Hits:0", "Helvetica", 25);
        this.labelHits.setPosition(cc.p(winsize.width - 70, winsize.height - 70));
        this.addChild(this.labelHits);

        this.labelMiss = new cc.LabelTTF("Miss:0", "Helvetica", 25);
        this.labelMiss.setPosition(cc.p(winsize.width - 70, winsize.height - 100));
        this.addChild(this.labelMiss);

    },
    updateTime: function (px) {
        this.time += px;


        if (parseInt(this.time) / 60 >= this.minuteCount && !this.isMinuteOver) {
            this.isMinuteOver = true;
            this.minuteCount++;
            this.ammo += 30;
        } else {
            this.isMinuteOver = false;
        }

        this.labelTime.setString("Time: " + parseInt(this.gameTime) + " s");
        this.labelAmmo.setString("Horlicks: " + this.ammo);

        this.gameTime -= px;
        if (this.isTimeOver()) {
            cc.log("===gameover")
        }

    },
    addHit: function (num, points) {
        this.hits += num;
        this.ammo += 0.75 * points;
        this.score += points;

        //TODO modify this formulae
        this.gameTime += this.hits / (this.fired - this.hits) * points;

        this.labelScore.setString("Milk:" + this.score);
        this.labelHits.setString("Hits:" + this.hits);
        this.labelMiss.setString("Miss:" + parseInt(this.fired - this.hits));
    },
    addMiss: function (num) {
        this.miss += num;
        this.labelMiss.setString("Miss:" + this.miss);
    },
    updateAmmo: function (num) {
        this.fired += num;
        this.ammo -= num;
        this.labelMiss.setString("Miss:" + parseInt(this.fired - this.hits));
    },
    canFire: function () {
        if (this.ammo > 0) {
            return true
        }
        return false
    },
    setGameTime: function (num) {
        this.gameTime = parseInt(num);
    },
    isTimeOver: function (num) {
        if (this.gameTime < 0) {
            return true;
        }
        return false;
    },
    getScore: function () {
        return this.score;
    },
    getTotalPlayTime: function () {
        return this.time;
    },
    getGameTime: function () {
        return this._gameTime;
    },
    reset: function () {
        //reseting everything
        this._cows = [],
            this._projectiles = [],
            this.statusLayer = {},
            this.gameTime = 30,
            /*this.labelScore = null,
            this.labelTime = null,
            this.labelHits = null,
            this.labelMiss = null,
            this.labelAmmo = null,*/
            this.score = 0,
            this.time = 0,
            this.hits = 0,
            this.miss = 0,
            this.ammo = 30,
            this.fired = 1,//needed
            this.isMinuteOver = false,
            this.minuteCount = 1,
            this.gameTime = 30,//default 30
            this._gameTime = 30
    }

});