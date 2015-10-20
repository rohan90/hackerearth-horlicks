/**
 * Created by rohan on 20/10/15.
 */
//playscene
var PlayScene = cc.Scene.extend({
    _cows: [],
    _projectiles: [],
    statusLayer:{},

    onEnter: function () {
        this._super();
        var eventListener = cc.EventListener.create({

            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            setTouchEnabled: true,

            onTouchBegan: this.handleTouch.bind(this)
        });

        cc.eventManager.addListener(eventListener, this);

        //add three layer in the right order
        this.addChild(new BackgroundLayer());
        this.addChild(new AnimationLayer());
        this.addChild(new StatusLayer());

        this.statusLayer = this.getChildByName("StatusLayer")


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
        if(!this.statusLayer.canFire()){
            return;
        }
        this.statusLayer.updateAmmo(1);

        var winSize = cc.winSize;
        // Set up initial location of the projectile
        var projectile = cc.Sprite.create(res.s_projectile);
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
        var cow = cc.Sprite.create(res.cow1);

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
        this.statusLayer.updateTime(dt);

        if(this.statusLayer.isTimeOver()){
            cc.log("==game over");
            cc.director.pause();
            this.addChild(new GameOverLayer());
        }

        for (var i = 0; i < this._projectiles.length; i++) {
            var projectile = this._projectiles[i];
            for (var j = 0; j < this._cows.length; j++) {
                var cow = this._cows[j];
                var projectileRect = projectile.getBoundingBox();
                var cowRect = cow.getBoundingBox();
                if (cc.rectIntersectsRect(projectileRect, cowRect)) {
                    cc.log("collision!");
                    this.statusLayer.addHit(1,1);
                    cc.arrayRemoveObject(this._projectiles, projectile);
                    projectile.removeFromParent();
                    cc.arrayRemoveObject(this._cows, cow);
                    cow.removeFromParent();
                }
            }
        }
    }
});