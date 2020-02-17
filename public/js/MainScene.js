class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    preload() {

    }

    create() {
        //Controla las escenas
        console.log("Creando juego")

        this.scene.launch("scene1");
        this.scene.launch("scene2");
    }
}