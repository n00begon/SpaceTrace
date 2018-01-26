module MyGame {

	export class TraceState extends Phaser.State {

        traceDot: Phaser.Sprite

		preload() {}

		create() {
			let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY);
			logo.anchor.setTo(0.5, 0.5);
		}

	}

}