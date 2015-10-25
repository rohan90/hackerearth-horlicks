/**
 * Created by rohan on 20/10/15.
 */
//playscene
var PlayScene = cc.Scene.extend({
    _cows: [],
    _projectiles: [],
    _touches: [],
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
    spawnMultiplier: 1,
    projectileCount: 0, //these two used as ids
    cowCount: 0,
    cowTally: {normal: 0, blue: 0, yellow: 0, red: 0, baby: 0, horlicks: 0},
    horlicksEnabled: false,
    horlicksTime: 5,
    horlicksModeIndicator: null,


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

        this.horlicksModeIndicator = new cc.Sprite(res.horlicks_mode_on);
        this.horlicksModeIndicator.attr({x: winsize.width / 2, y: winsize.height / 2});
        this.horlicksModeIndicator.setVisible(false);
        this.addChild(this.horlicksModeIndicator)

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


        this.horlicksButton = new ccui.Button();
        this.horlicksButton.setTouchEnabled(true);
        this.horlicksButton.setPosition(cc.p(winsize.width - 50, 40))
        this.horlicksButton.loadTextureNormal(res.s_projectile)
        this.horlicksButton.setScale(2)
        this.horlicksButton.addTouchEventListener(this.horlicksMode, this)
        this.horlicksButton.setVisible(false)
        this.addChild(this.horlicksButton);

        this.scheduleUpdate();
        this.schedule(this.gameLogic, g_defaultSpawnTime);
    },
    showHorlicksButton: function () {
        this.horlicksButton.setVisible(true)
    },
    horlicksMode: function () {
        this.horlicksEnabled = true;
        this.horlicksTime = 10;
        this.horlicksButton.setVisible(false)
        this.horlicksModeIndicator.setVisible(true)
    },
    disableHorlicksMode: function () {
        this.horlicksEnabled = false;
        this.horlicksTime = 0;
        this.horlicksButton.setVisible(false)
        this.horlicksModeIndicator.setVisible(false)
    },
    gameLogic: function (dt) {
        for (var i = 0; i < this.spawnMultiplier; i++)
            this.addCows()
    },
    handleTouch: function (touch, event) {
        if (this.horlicksEnabled) {
            this.addTouchPoint(touch.getLocation());
        } else
            this.addProjectile(touch.getLocation())

        return true;
    },
    addTouchPoint: function (location) {
        cc.log("finger at " + location.x + "," + location.y);
        var point = new cc.p(location.x, location.y);
        this._touches.push(point);
    },
    addProjectile: function (location) {
        if (!this.gameStarted)
            return;
        cc.log("Touched at " + location.x + "," + location.y);
        //if (!this.statusLayer.canFire()) {
        if (!this.canFire()) {
            return;
        }
        //this.statusLayer.updateAmmo(1);
        this.updateAmmo(1);

        var winSize = cc.winSize;
        // Set up initial location of the projectile
        var id = this.projectileCount++;
        var projectile = new Projectile(id, res.s_projectile, 1);
        projectile.setPosition(300, 2);

        // Determine offset of location to projectile
        var offset = cc.pSub(location, projectile.getPosition()); // 1

        this.addChild(projectile.getSprite());

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
        var velocity = 480.0; //TODO extract out
        var realMoveDuration = length / velocity;

        // Move projectile to actual endpoint
        projectile.getSprite().runAction(cc.Sequence.create( // 2
            cc.MoveTo.create(realMoveDuration, realDest),
            cc.CallFunc.create(function (node) {
                cc.arrayRemoveObject(this._projectiles, projectile);
                projectile.removeFromParent();
                //var index = this._projectiles.indexOf(projectile);
                //if (index > -1) {
                //    cc.log("reached end.. removing projectile")
                //    this._projectiles.splice(index, 1);
                //}
            }, this)
        ));
        var sprite_action_rotate = cc.RotateBy.create(0.1, 45);
        var repeat_action_rotate = cc.RepeatForever.create(sprite_action_rotate);
        projectile.getSprite().runAction(repeat_action_rotate);

        // Add to array
        projectile.getSprite().setTag(2);
        this._projectiles.push(projectile);
    },
    addCows: function () {

        var size = cc.winSize;

        var num = Math.floor(Math.random() * 12) + 1
        var cow;
        var id = this.cowCount++;
        var scaleCow = 1;
        var numScale = Math.floor(Math.random() * 8) + 1
        if (numScale == 1) {
            var scaleTo = Math.floor(Math.random() * 2) + 1
            switch (scaleTo) {
                case 1:
                    scaleCow += 0.5
                    break;
                case 2:
                    scaleCow += 0.75
                    break;
                default:
                    scaleCow += 1
                    break;
            }
        }
        switch (num) {
            case 1:
                2
                cow = new Cow(id, g_CowTypes.BABY, res.cow5, -2, scaleCow);
                break;
            case 3:
            case 4:
            case 5:
                cow = new Cow(id, g_CowTypes.BLUE, res.cow2, 1.25, scaleCow);
                break;
            case 4:
            case 5:
            case 6:
                cow = new Cow(id, g_CowTypes.YELLOW, res.cow3, 1.5, scaleCow);
                break;
            case 7:
            case 8:
                cow = new Cow(id, g_CowTypes.RED, res.cow4, 5, scaleCow);
                break;
            case 9:
                cow = new Cow(id, g_CowTypes.HORLICKS, res.s_projectile, 1, 1.5);
                break;
            default:
                cow = new Cow(id, g_CowTypes.NORMAL, res.cow1, 1, scaleCow);
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
        this.addChild(cow.getSprite()); // 2

        // Determine speed of the cow
        //TODO configurable?
        var minDuration = 2.0;
        var maxDuration = 4.0;
        if (cow.getCowSize() > 1) {
            minDuration = 2.0;
            maxDuration = 6.0;
        }
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
            cc.arrayRemoveObject(this._cows, cow); // 5
            cow.removeFromParent();

        }, this);
        cow.getSprite().runAction(cc.Sequence.create(actionMove, actionMoveDone));

        // Add to array
        cow.getSprite().setTag(1);
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
            var accuracy = this.accuracy;
            var cowTally = this.cowTally;

            cc.log("Milk: " + score + "litres in " + totalTime + "s\nMilk Challenge:" + gameTime + "s Accuracy " + this.accuracy);
            this.addChild(new GameOverLayer(score, totalTime, gameTime, accuracy, cowTally));
            this.reset()
            cc.director.pause();
        }

        //cc.log("projectiles size " + this._projectiles.length)
        //cc.log("cows size " + this._cows.length)

        if (this.horlicksEnabled) {

            for (var i = 0; i < this._touches.length; i++) {
                var point = this._touches[i]
                for (var j = 0; j < this._cows.length; j++) {

                    var cow = this._cows[j];

                    if (cow.isRemoved() || !cc.sys.isObjectValid(cow.getSprite())) {
                        cc.log("invalid cow should be removed at " + i)
                        continue;
                    }

                    var cowRect = cow.getBoundingBox();

                    if (cc.rectContainsPoint(cowRect,point)) {
                        cc.log("collision by touch!");
                        //this.statusLayer.addHit(1, cow.getPoints());
                        cow.cowHitByTouch(1, 1);
                        this.addHit(0, cow.getPoints());
                        cc.arrayRemoveObject(this._touches, point);
                        this._touches.splice(i, 1);

                        if (cow.isCowCaptured()) {
                            this.updateCowTally(cow.getCowType())
                            cow.removeFromParent();
                            cc.arrayRemoveObject(this._cows, cow);
                            this._cows.splice(j, 1);
                            break;
                        }
                    }
                }
            }


            return;
        }
        for (var i = 0; i < this._projectiles.length; i++) {
            var projectile = this._projectiles[i];
            if (projectile.isRemoved() || !cc.sys.isObjectValid(projectile.getSprite())) {
                cc.log("invalid projectile should be removed at " + i)
                continue;
            }
            for (var j = 0; j < this._cows.length; j++) {

                var cow = this._cows[j];

                if (cow.isRemoved() || !cc.sys.isObjectValid(cow.getSprite())) {
                    cc.log("invalid cow should be removed at " + i)
                    continue;
                }

                var projectileRect = projectile.getBoundingBox();
                var cowRect = cow.getBoundingBox();

                if (cc.rectIntersectsRect(projectileRect, cowRect)) {
                    cc.log("collision!");
                    //this.statusLayer.addHit(1, cow.getPoints());
                    cow.cowHit(projectile.getPoints(), projectile.getStampId());
                    this.addHit(1, cow.getPoints());
                    projectile.removeFromParent();
                    cc.arrayRemoveObject(this._projectiles, projectile);
                    this._projectiles.splice(i, 1);

                    if (cow.isCowCaptured()) {
                        this.updateCowTally(cow.getCowType())
                        cow.removeFromParent();
                        cc.arrayRemoveObject(this._cows, cow);
                        this._cows.splice(j, 1);
                        break;
                    }
                }
            }
        }
    },
    updateCowTally: function (type) {
        switch (type) {
            case g_CowTypes.NORMAL:
                this.cowTally.normal += 1;
                break;
            case g_CowTypes.BLUE:
                this.cowTally.blue += 1;
                break;
            case g_CowTypes.YELLOW:
                this.cowTally.yellow += 1;
                break;
            case g_CowTypes.RED:
                this.cowTally.red += 1;
                break;
            case g_CowTypes.BABY:
                this.cowTally.baby += 1;
                break;
            case g_CowTypes.HORLICKS:
                this.cowTally.horlicks += 1;
                this.showHorlicksButton();
                break;
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

        if (this.horlicksTime < 0) {
            this.disableHorlicksMode()
        }
        if (parseInt(this.time) / 60 >= this.minuteCount && !this.isMinuteOver) {
            this.isMinuteOver = true;
            this.minuteCount++;
            this.spawnMultiplier += 1;
            this.ammo += 30 * this.spawnMultiplier + 30 * this.accuracy;
            this.ammo = parseInt(this.ammo)
        } else {
            this.isMinuteOver = false;
        }

        this.labelTime.setString("Time: " + parseInt(this.gameTime) + " s");
        this.labelAmmo.setString("Horlicks: " + parseFloat(this.ammo).toFixed(2));

        this.gameTime -= px;

        if (this.horlicksEnabled) {
            this.horlicksTime -= px;
        }

        if (this.isTimeOver()) {
            cc.log("===gameover")
            cc.log("spawn rate " + this.spawnMultiplier + " accuracy=" + this.accuracy);
        }

    },
    addHit: function (num, points) {
        this.hits += num;
        this.ammo += 0.75 * points;
        this.score += points;

        //TODO modify this formulae
        this.accuracy = this.hits / (this.fired)
        this.gameTime += this.accuracy * points;

        this.labelScore.setString("Milk:" + parseFloat(this.score).toFixed(2));
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
        return parseFloat(this.score).toFixed(2);
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
            this._touches = [],
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
            this.gameTime = g_defaultGameTime,//default 30
            this._gameTime = g_defaultGameTime,
            this.spawnMultiplier = 1,
            this.projectileCount = 0,
            this.cowCount = 0;

        this.cowTally.baby = 0
        this.cowTally.blue = 0
        this.cowTally.yellow = 0
        this.cowTally.red = 0
        this.cowTally.normal = 0
        this.cowTally.horlicks = 0
        this.horlicksEnabled = false
    }

});