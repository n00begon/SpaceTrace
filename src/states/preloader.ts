module MyGame {

	export class PreloaderState extends Phaser.State {

		preload() {
			this.game.load.image('logo', 'assets/logo.png');

			this.game.load.spritesheet('button', 'assets/button.png', 100, 100);
		}

		create() {
			this.game.state.start('Trace');
			// this.game.state.start('UI');
		}

	}

}