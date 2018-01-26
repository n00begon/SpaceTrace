module MyGame {

	export class PreloaderState extends Phaser.State {

		preload() {
			this.game.load.image('logo', 'assets/logo.png');

			this.game.load.image('button', 'assets/button.png');
			this.game.load.image('buttonHover', 'assets/buttonHover.png');
			this.game.load.image('buttonDown', 'assets/buttonDown.png');
		}

		create() {
			//this.game.state.start('Trace');
			this.game.state.start('UI');
		}

	}

}