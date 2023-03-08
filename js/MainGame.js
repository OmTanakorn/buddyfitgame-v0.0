class MainGame extends Phaser.Scene {
    
    constructor() {
        super("MainGame");
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("block1", "assets/block1.png");
        this.load.image("block2", "assets/block2.png");
        this.load.image("block3", "assets/block3.png");

        this.load.spritesheet('player', 'assets/player.png',
                                { frameWidth : 32, frameHeight : 50, startFrame : 0, endFrame : 19});

        this.load.audio('bgm', 'assets/BGM_01.wav');
    }

    addPlatform(width, x, y, type) {
        let platform;
        if(type == 1) {
            platform = this.add.tileSprite(x+width/2, y, width, 32, "block1");
        }
        else{
            platform = this.add.tileSprite(x+width/2, y, width, 32, "block2");
        }
        if(type == 3) {
            platform = this.add.tileSprite(x+width/2, y, width, 32, "block3");
        }
        this.physics.add.existing(platform);
        platform.body.setVelocityX(-200);
        platform.body.setImmovable(true);
        this.platformGroup.add(platform);
    }

    create() {
        //Prepare Character Animetion
        this.anims.create({
            key : 'right_anim',
            frames : this.anims.generateFrameNumbers('player', { start : 8, end : 11}),
            frameRate : 10, repeat : -1
        });

        //Smoothing camera rendering
        this.cameras.main.roundPixels = true;

        this.add.image(640, 360, "sky");

        this.platformGroup = this.add.group();
        this.addPlatform(1000, 10, 600, 1);

        this.player = this.physics.add.sprite(200, 100, 'player');
        this.player.setScale(1.5, 1.5);
        this.player.setGravityY(800);

        this.player.play('right_anim');
        this.physics.add.collider(this.player, this.platformGroup);

        this.playerJumps = 0;
        // this.input.on("pointerdown", () => {
        //     if(this.player.body.touching.down) {
        //         this.playerJumps = 0;
        //     }
            
        //     if(this.playerJumps >= 0 && this.playerJumps < 2) {
        //         this.player.setVelocityY(-400);
        //         this.playerJumps++;
        //     }
        // });

        //BGM
        this.bgm = this.sound.add('bgm');
        this.bgm.play({loop:true});
    }

    update(time, delta) {
        this.player.x = 200;

        if(this.player.y > 720) {
            this.bgm.stop();
            this.sound.stopAll();
            this.scene.start("MainGame");
        }
        let minDistance = 1280;
        this.platformGroup.getChildren().forEach( (platform) => {
            let platformDistance = 1280 - platform.x - (platform.displayWidth/2);
            minDistance = Math.min(minDistance, platformDistance);

            if(platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);  
            }
        });

        if(minDistance > Phaser.Math.Between(100, 500)) {
            let platformWidth = Phaser.Math.Between(100, 500);
            this.addPlatform(platformWidth, 1280, 600 ,Phaser.Math.Between(1, 3));
        }

        if(count == 1){
            console.log(count);
            if(this.player.body.touching.down) {
                this.playerJumps = 0;
            }        
            if(this.playerJumps >= 0 && this.playerJumps < 2) {
                this.player.setVelocityY(-400);
                this.playerJumps++;
                count++;
            }
        }
    }    
}

const config = {
    type : Phaser.AUTO,
    scale : {
    // parent : "CanvasDiv",
    mode: Phaser.Scale.FIT,
    // autoCenter : Phaser.Scale.CENTER_BOTH,
    width : 1080,
    height : 720,
    // isPortrait : true
    },
    physics : {
    default : "arcade",
    },
    scene : [ MainGame ]
}
const ame = new Phaser.Game(config)