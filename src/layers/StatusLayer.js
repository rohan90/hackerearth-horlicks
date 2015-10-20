/**
 * Created by rohan on 20/10/15.
 */

var StatusLayer = cc.Layer.extend({
    _name:"StatusLayer",
    labelScore:null,
    labelTime:null,
    labelHits:null,
    labelMiss:null,
    labelAmmo:null,
    score:0,
    time:0,
    hits:0,
    miss:0,
    ammo:30,
    fired:1,//needed
    isMinuteOver:false,
    minuteCount:1,
    gameTime:7,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        var winsize = cc.director.getWinSize();

        this.labelScore = new cc.LabelTTF("Score:0", "Helvetica", 25);
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
    updateTime:function (px) {
        this.time += px;


        if(parseInt(this.time)/60 >= this.minuteCount && !this.isMinuteOver){
            this.isMinuteOver = true;
            this.minuteCount++;
            this.ammo +=30;
        }else{
            this.isMinuteOver = false;
        }

        this.labelTime.setString("Time: "+ parseInt(this.gameTime)+ " s");
        this.labelAmmo.setString("Horlicks: "+ this.ammo);

        this.gameTime -= px;
        if(this.isTimeOver()){
            cc.log("===gameover")
        }

    },
    addHit:function (num,points) {
        this.hits += num;
        this.ammo +=0.75;
        this.score+=points;

        //TODO modify this formulae
        this.gameTime += this.hits/(this.fired-this.hits);

        this.labelScore.setString("Score:" + this.score);
        this.labelHits.setString("Hits:" + this.hits);
        this.labelMiss.setString("Miss:" + parseInt(this.fired - this.hits));
    },
    addMiss:function (num) {
        this.miss += num;
        this.labelMiss.setString("Miss:" + this.miss);
    },
    updateAmmo:function (num) {
        this.fired += num;
        this.ammo -= num;
        this.labelMiss.setString("Miss:" + parseInt(this.fired - this.hits));
    },
    canFire:function(){
        if(this.ammo >0){
            return true
        }
        return false
    },
    setGameTime:function(num){
        this.gameTime = parseInt(num);
    },
    isTimeOver:function(num){
        if(this.gameTime < 0){
            return true;
        }
        return false;
    }

});

