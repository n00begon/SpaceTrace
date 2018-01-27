module MyGame {

	export class PreloaderState extends Phaser.State {

		preload() {
			this.game.load.image('logo', 'assets/logo.png');



			this.game.load.spritesheet('button', 'assets/buttonBase.png', 170, 85);
			
			this.game.load.spritesheet('deceasedLogo', 'assets/deceased.png', 400, 100);

			this.game.load.spritesheet('grid', 'assets/grid.png', 20, 20);
			this.game.load.image('background', 'assets/background.png');

		}

		create() {
			this.game.state.start('Game');
		}

	}

}