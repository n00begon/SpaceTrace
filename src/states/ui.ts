module MyGame {

	export class UIState extends Phaser.State {

		preload() {}

		create() {
			let button = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'button');
			button.anchor.setTo(0.5, 0.5);
		}

	}

}