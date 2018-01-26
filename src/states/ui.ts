module MyGame {
	let button;

	export class UIState extends Phaser.State {

		preload() {}

		create() {
			button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 1, 0, 2);
		}

		actionOnClick () {
			console.log("Hey");
		}

	}

}