/**
 * Class representing the player.
 * @extends Phaser.GameObjects.Sprite
 */
class Player extends Phaser.GameObjects.Sprite {

    /**
     * Create the player.
     * @param {object} scene - scene creating the player.
     * @param {number} x - Start location x value.
     * @param {number} y - Start location y value.
     * @param {number} [frame] -
     */
    constructor(scene, x, y, frame) {
        super(scene, x, y, frame);

        this.scene = scene;
        this.currentRoom = 1; // Set start room so room change flag doens't fire.
        this.previousRoom = null;
        this.roomChange = false;
        this.canMove = true;

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setTexture('player');
        this.setPosition(x, y);

        this.body.setCollideWorldBounds(true);
        this.body.setOffset(7, 16);
        this.body.setCircle(3);

        this.lastAnim = null;
        this.vel = 200;
        this.onStairs = false;
        this.direction = null;
        
        // Boolean to control if the player cant move
        this.movement = true;
        this.numberMov = 0;

        config = {
            key: 'stand-down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 0,
                end: 0
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 4,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 8,
                end: 8
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);


        var config = {
            key: 'walk-down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 4,
                end: 7
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 8,
                end: 11
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

    }

    //LEFT
    moveLeft(numOfMovs, assign=true) {
        if(assign){
            this.numberMov = numOfMovs;
        }
        if (this.canMove && this.numberMov > 0) {
            this.direction = 'left';
            this.body.setVelocityX(-this.vel);
            this.animationName = "walk-right";
            this.setFlipX(true);
            //this.lastAnimation();
            this.vel = 100;
            this.body.velocity.normalize().scale(this.vel);
            this.numberMov -= 1;
        } else{
            this.canMove = false;
            this.direction = null;
            this.numberMov = 0;
        }
    }

    //RIGHT
    moveRight(numOfMovs, assign=true) {
        if(assign){
            this.numberMov = numOfMovs;
        }
        
        if (this.canMove && this.numberMov > 0) {
            this.direction = 'right';
            this.body.setVelocityX(this.vel);
            this.animationName = "walk-right";
            this.setFlipX(false);
            this.numberMov -= 1;
           // this.lastAnimation();
        } else{
            this.canMove = false;
            this.direction = null;
            this.numberMov = 0;
        }
    }

    //UP
    moveUp(numOfMovs, assign=true) {
        if(assign){
            this.numberMov = numOfMovs;
        }
        if (this.canMove && this.numberMov > 0) {
            this.direction = 'up';
            this.body.setVelocityY(-this.vel);
            this.animationName = 'walk-up';
            this.numberMov -= 1;
            //this.lastAnimation();
        } else{
            this.canMove = false;
            this.direction = null;
            this.numberMov = 0;
        }
    }

    //DOWN
    moveDown(numOfMovs, assign=true) {
        if(assign){
            this.numberMov = numOfMovs;
        }
        if (this.canMove && this.numberMov > 0) {
            this.direction = 'down';
            this.body.setVelocityY(this.vel);
            this.animationName = 'walk-down';
            this.numberMov -= 1;
            //this.lastAnimation();
        } else{
            this.canMove = false;
            this.direction = null;
            this.numberMov = 0;
        }
    }

    /*lastAnimation() {
        if (this.lastAnim !== this.animationName) {
            this.lastAnim = this.animationName;
            this.anims.play(this.animationName, true);
        }
    }*/

    /**
     * Called before Update.
     * @param {object} time
     * @param {number} delta
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // movement and animation
        this.body.setVelocity(0);
        this.animationName = null;

        if(this.canMove){
            // standing
            let currentDirection = this.direction;
            if (this.direction === 'left') {
                currentDirection = 'right';
            } //account for flipped sprite
            this.animationName = 'stand-' + currentDirection;
            
            // switch movement
            switch(this.direction) {
                case 'up':
                    console.log(this.numberMov, false);
                    this.moveUp(this.numberMov, false);
                break;
                case 'down':
                    console.log(this.numberMov, false);
                    this.moveDown(this.numberMov, false);
                break;
                case 'left':
                    console.log(this.numberMov, false);
                    this.moveLeft(this.numberMov, false);
                break;
                case 'right':
                    console.log(this.numberMov, false);
                    this.moveRight(this.numberMov);
                break;
            }
            
            // diagnoal movement
            this.body.velocity.normalize().scale(this.vel);

            // Check for room change.
            this.getRoom();
        }
}


    /** Returns player's current and previous room, flags rooms player has entered. */
    getRoom() {

        // place holder for current room.
        let roomNumber;

        // loop through rooms in this level.
        for (let room in this.scene.rooms) {
            let roomLeft = this.scene.rooms[room].x;
            let roomRight = this.scene.rooms[room].x + this.scene.rooms[room].width;
            let roomTop = this.scene.rooms[room].y;
            let roomBottom = this.scene.rooms[room].y + this.scene.rooms[room].height;

            // Player is within the boundaries of this room.
            if (this.x > roomLeft && this.x < roomRight &&
                this.y > roomTop && this.y < roomBottom) {

                roomNumber = room;

                // Set this room as visited by player.
                let visited = this.scene.rooms[room].properties.find(function (property) {
                    return property.name === 'visited';
                });

                visited.value = true
            }
        }

        // Update player room variables.
        if (roomNumber != this.currentRoom) {
            this.previousRoom = this.currentRoom;
            this.currentRoom = roomNumber;
            this.roomChange = true;
        } else {
            this.roomChange = false;
        }
    }
}