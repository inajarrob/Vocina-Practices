const widthD = $("#gameContainer").innerWidth()
const heightD = $("#gameContainer").innerHeight()

const config = {
    type: Phaser.AUTO,
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [MainScene, Scene1, Scene2],
    input: {
        keyboard: true,     // Keyboard input configuration. true uses the default configuration and false disables keyboard input.
        mouse: true,        // Mouse input configuration. true uses the default configuration and false disables mouse input.
        gamepad: true,      // Gamepad input configuration. true enables gamepad input.
    },
    // Physics configuration.
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    
    scale: {
        mode: Phaser.Scale.FIT,
        width: 600,
        height: 450,
        zoom: 2
    }
}

const game = new Phaser.Game(config)
