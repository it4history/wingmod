var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = PlasmaProjectileActor;
