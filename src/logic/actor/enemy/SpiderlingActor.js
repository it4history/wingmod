var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var RedEnemyBlaster = require('logic/actor/component/weapon/RedEnemyBlaster');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');
var DropMixin = require('logic/actor/mixin/DropMixin');

function SpiderlingActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SPIDERLING);

    this.calloutSound = 'spiderling';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

SpiderlingActor.extend(BaseActor);
SpiderlingActor.mixin(BrainMixin);
SpiderlingActor.mixin(DropMixin);

SpiderlingActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 140
    });
};

SpiderlingActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

SpiderlingActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

SpiderlingActor.prototype.createWeapon = function(){
    return new RedEnemyBlaster({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 0.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 0.5 , fireAngle: 0}
        ]
    });
};

SpiderlingActor.prototype.onDeath = function(){
    this.spawn({
        amount: 5,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.SMALLEXPLOSION
        });
    }, 100);       

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

SpiderlingActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.3,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.playSound(['armorHit1', 'armorHit2'], 1);
};

module.exports = SpiderlingActor;
