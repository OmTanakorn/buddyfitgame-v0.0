class MainGame extends Phaser.Scene {
    
    constructor() {
        super("MainGame");
    }

    preload() {
        this.load.image("sky", "assets/plx-1.png");
        this.load.image("sky2", "assets/plx-2.png");
        this.load.image("sky3", "assets/plx-3.png");
        this.load.image("sky4", "assets/plx-4.png");
        this.load.image("sky5", "assets/plx-5.png");

        this.load.image("block1", "assets/block1.png");
        this.load.image("block2", "assets/block2.png");
        this.load.image("block3", "assets/block3.png");

        this.load.spritesheet("player" , "assets/mort.png",
                                    {frameWidth:24, frameHeight:24 ,startFrame:0 ,endFrame:23});

        

        // this.load.spritesheet('player', 'assets/player.png',
        //                         { frameWidth : 32, frameHeight : 50, startFrame : 0, endFrame : 19});
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
            frames : this.anims.generateFrameNumbers('player', { start : 18, end : 23}),
            frameRate : 10, repeat : -1
        });

        //Smoothing camera rendering
        this.cameras.main.roundPixels = true;

        this.sky = this.add.tileSprite(250, 250,500,500, 'sky');
        this.sky2 = this.add.tileSprite(250, 150, 500, 500, 'sky2');
        this.sky2.setScale(1.5);
        this.sky3 = this.add.tileSprite(250, 115, 500, 500, 'sky4');
        this.sky3.setScale(1.8);
        this.sky4 = this.add.tileSprite(250, 115, 500, 500, 'sky5');
        this.sky4.setScale(1.8);



        this.platformGroup = this.add.group();
        this.addPlatform(1000, 10, 450, 1);

        this.player = this.physics.add.sprite(100, 10, 'player');
        this.player.setScale(2, 2);
        this.player.setGravityY(800);

        this.player.play('right_anim');
        this.physics.add.collider(this.player, this.platformGroup);

        this.playerJumps = 0;
    }

    update(time, delta) {
        this.player.x = 200;
        
        this.sky2.tilePositionX += 1;
        this.sky3.tilePositionX += 1.5;
        this.sky4.tilePositionX += 2;

        if(this.player.y > 720) {
            // this.bgm.stop();
            // this.sound.stopAll();
            this.scene.start("MainGame");
        }
        let minDistance = 500;
        this.platformGroup.getChildren().forEach( (platform) => {
            let platformDistance = 500 - platform.x - (platform.displayWidth/2);
            minDistance = Math.min(minDistance, platformDistance);

            if(platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);  
            }
        });

        if(minDistance > Phaser.Math.Between(100, 400)) {
            let platformWidth = Phaser.Math.Between(100, 300);
            this.addPlatform(platformWidth, 500, 450 ,Phaser.Math.Between(1, 3));
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