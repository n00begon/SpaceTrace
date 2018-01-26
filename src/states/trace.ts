module MyGame {

	const MAX_HEIGHT = 500;
	const MIN_HEIGHT = 100;

	export class TraceState extends Phaser.State {

        traceDot: Phaser.Sprite
		emitter: Phaser.Particles.Arcade.Emitter;
		bitmapData: Phaser.BitmapData;
		dotIndex: number = 0;

		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
		}

		create() {
			this.traceDot = this.game.add.sprite(0, this.game.world.centerY, 'traceDot');
			this.traceDot.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(this.traceDot, Phaser.Physics.ARCADE);
			this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 500);
			this.emitter.setAlpha(1, 0, 2500);

			this.bitmapData = this.game.add.bitmapData(5, 5);
			this.bitmapData.fill(255, 0, 0, 1);

			this.emitter.makeParticles(this.bitmapData);
			this.emitter.start(false,3000,0);
			this.emitter.on = true;
			this.emitter.maxParticleSpeed = new Phaser.Point(0,0);
			this.emitter.minRotation = 0;
			this.emitter.maxRotation = 0;
			this.emitter.setXSpeed(0,0);
			this.emitter.setYSpeed(0,0);
			this.emitter.gravity = new Phaser.Point(0,0);
		}

		update() {
			this.traceDot.body.velocity.x = 200;
			this.emitter.x = this.traceDot.x;
			this.emitter.y = this.traceDot.y;
			this.traceDot.body.velocity.x = 500;
			this.traceDot.y = this.game.world.centerY - TraceA[this.dotIndex++ % TraceA.length] * MAX_HEIGHT;


			if (this.traceDot.x > this.game.world.width) {
				this.traceDot.x = 0;
			}
		}

	}

}