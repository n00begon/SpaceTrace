module MyGame {

	export class CreditState extends Phaser.State {
		content = [
			"Credits",
			" ",
			" ",
			"Game by Aaron Jackson, Morgan Lieshout, Tim Bennett and Tim Neumegen ",
			" ",
			" ",
			" ",
			"Music by Tim Bennett",
			" ",
			" ",
			" ",
			" ",
			" ",
			" ",
			"Made at #GGJdunedin for Global Gam Jam 2018",
		];
		preload() {}

		create() {
			let display = new TextDisplay();
			display.create(this.content, this.game);
		}

		update() {
			if (this.game.input.activePointer.isDown){
				this.game.sound.stopAll();
	
				this.game.state.clearCurrentState();
				this.game.state.start('Game');
			}
		}

	}

}