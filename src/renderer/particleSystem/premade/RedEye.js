module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0,
        colorB: 0,
        scale: Utils.rand(45,50)/10,
        alpha: 0.3,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0.2,
        colorB: 0.2,
        scale: 1,
        alpha: 0.8,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });
};
