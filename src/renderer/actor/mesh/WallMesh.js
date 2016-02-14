function WallMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800,2,50,50);
    config.material = new THREE.MeshLambertMaterial({color: 0xff0000});
    Object.assign(this, config);

}


WallMesh.extend(BaseMesh);
