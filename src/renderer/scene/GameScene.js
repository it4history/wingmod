var ChunkStore = require('renderer/assetManagement/level/ChunkStore');
var ChunkMesh = require('renderer/map/ChunkMesh');
var BaseScene = require('renderer/scene/BaseScene');
var Camera = require('renderer/Camera');

function GameScene(config) {

    if (!config.inputListener) throw new Error ('no Input Listener specified for GameScene!');

    Object.assign(this, config);
    this.lightCounter = 0;

    BaseScene.apply(this, arguments);
}

GameScene.extend(BaseScene);

GameScene.prototype.create = function() {
    this.initialColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.currentColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.directionalLight = new THREE.DirectionalLight( 0xdddddd, 1 );
    this.directionalLight.position.set( 0, 0, 200 );
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = true;

    var shadowCamera = this.directionalLight.shadow.camera;

    shadowCamera.near = 1;
    shadowCamera.far = Constants.RENDER_DISTANCE;
    shadowCamera.left = Constants.RENDER_DISTANCE;
    shadowCamera.right = -Constants.RENDER_DISTANCE;
    shadowCamera.top = Constants.RENDER_DISTANCE;
    shadowCamera.bottom = -Constants.RENDER_DISTANCE; 
  
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.bias = -0.0075;

    this.threeScene.add( this.directionalLight );

    this.spotLight = new THREE.SpotLight( 0xffffff, 1);
    this.spotLight.position.set( 15, 40, 15 );
    this.spotLight.castShadow = true;
    this.spotLight.angle = Math.PI / 8;
    this.spotLight.penumbra = 0.4;
    this.spotLight.decay = 1;
    this.spotLight.distance = 400;
    this.spotLight.shadow.mapSize.width = 512;
    this.spotLight.shadow.mapSize.height = 512;
    this.spotLight.shadow.camera.near = 1;
    this.spotLight.shadow.camera.far = 400;

    this.threeScene.add(this.spotLight);

    this.ambientLight = new THREE.AmbientLight( 0x404040, 1 );
    this.threeScene.add( this.ambientLight );

    this.threeScene.fog = new THREE.Fog( 0x000000, Constants.RENDER_DISTANCE-150, Constants.RENDER_DISTANCE );
};

GameScene.prototype.customUpdate = function(){
    if(this.actor){
        let position = this.actor.getPosition();
        this.directionalLight.position.x = position[0] + 100;
        this.directionalLight.position.y = position[1] + 150;
        this.directionalLight.target.position.x = position[0];
        this.directionalLight.target.position.y = position[1];
        this.directionalLight.target.updateMatrixWorld();
        
        let offsetPosition = this.actor.getOffsetPosition(60);
        this.spotLight.position.x = position[0];
        this.spotLight.position.y = position[1];
        this.spotLight.target.position.x = position[0] + offsetPosition[0];
        this.spotLight.target.position.y = position[1] + offsetPosition[1];
        this.spotLight.target.updateMatrixWorld();
    }
    this.handleFlash();

    this.directionalLight.color = this.currentColor;
};

GameScene.prototype.flashRed = function(){
    this.currentColor = {
        r: this.initialColor.r + 3,
        g: this.initialColor.g,
        b: this.initialColor.b
    };
};

GameScene.prototype.flashWhite = function(){
    this.currentColor = {
        r: this.initialColor.r + 1.5,
        g: this.initialColor.g + 1.5,
        b: this.initialColor.b + 1.5
    };
};

GameScene.prototype.handleFlash = function(){
    if (this.currentColor.r > this.initialColor.r) this.currentColor.r -= 0.3;
    if (this.currentColor.g > this.initialColor.g) this.currentColor.g -= 0.3;
    if (this.currentColor.b > this.initialColor.b) this.currentColor.b -= 0.3;

    if (this.currentColor.r < this.initialColor.r) this.currentColor.r = this.initialColor.r;
    if (this.currentColor.g < this.initialColor.g) this.currentColor.g = this.initialColor.g;
    if (this.currentColor.b < this.initialColor.b) this.currentColor.b = this.initialColor.b;
};

GameScene.prototype.doUiFlash = function(type){
    switch(type) {
    case 'red':
        this.flashRed();
        break;
    default:
        this.flashWhite();
    }
};

GameScene.prototype.createMap = function(layoutData){
    for (let i = 0, l = layoutData.length; i < l; i++) {
        var config = layoutData[i];
        var chunk = new ChunkMesh({
            geometry: ChunkStore.get(config.name).geometry,
            material: ChunkStore.get(config.name).material
        });
        chunk.setPosition(config.position);

        //layout data comes from logic, thus it requires 'angle' instead of 'rotation'
        chunk.setRotation(config.angle);
        this.threeScene.add(chunk);
    }
};

GameScene.prototype.createCamera = function(){
    var camera = new Camera({inputListener: this.inputListener});
    camera.position.z = 800;
    camera.setMovementZ(80, 20);
    camera.rotation.x = 1;
    return camera;
};

GameScene.prototype.resetCamera = function(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

GameScene.prototype.onPlayerActorAppeared = function(actor){
    this.camera.actor = actor;
    this.actor = actor;
};

module.exports = GameScene;
