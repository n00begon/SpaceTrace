module MyGame {

	const MAX_HEIGHT = 500;
	const MIN_HEIGHT = 100;

	export class TraceState extends Phaser.State {

		traceDot: Phaser.Sprite
		dotIndex: number = 0;

		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
		}

		create() {
			this.traceDot = this.game.add.sprite(0, this.game.world.centerY, 'traceDot');
			this.traceDot.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(this.traceDot, Phaser.Physics.ARCADE);
		}

		update() {
			this.traceDot.body.velocity.x = 500;
			this.traceDot.y = this.game.world.centerY - TraceA[this.dotIndex++ % TraceA.length] * MAX_HEIGHT;


			if (this.traceDot.x > this.game.world.width) {
				this.traceDot.x = 0;
			}
		}

	}

}