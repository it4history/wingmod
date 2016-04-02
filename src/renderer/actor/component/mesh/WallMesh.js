var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

function WallMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800,2,30,30);
    config.material = new THREE.MeshLambertMaterial({color: 0x505050});
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}


WallMesh.extend(BaseMesh);

module.exports = WallMesh;