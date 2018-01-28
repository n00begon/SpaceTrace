module MyGame {

	export class CreditState extends Phaser.State {
		content = [
			"D o   N o   H a r m",
			" ",
			" ",
			"Developers!, Developers!, Developers!, Developers!",
			" ",
			" ",
			"Tim Bennett",
			"Aaron Jackson",
			"Morgan Lieshout",
			"Tim Neumegen",
			" ",
			" ",
			"Also, Tim Bennett did some music.",
			" ",
			" ",
			"Made at #GGJDunedin for Global Game Jam 2018, #GGJ18",
		];
		preload() {}

		create() {
			let display = new TextDisplay();
			display.create(this.content, this.game, 60);
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