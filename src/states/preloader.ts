module MyGame {

	export class PreloaderState extends Phaser.State {

		preload() {
			this.game.load.image('logo', 'assets/logo.png');

			this.game.load.spritesheet('button', 'assets/button.png', 50, 50);
			this.game.load.spritesheet('circleButton', 'assets/circleButton.png', 50, 50);
			this.game.load.spritesheet('triangleButton', 'assets/triangleButton.png', 50, 50);
			this.game.load.spritesheet('squareButton', 'assets/squareButton.png', 50, 50);
			this.game.load.spritesheet('crossButton', 'assets/crossButton.png', 50, 50);

			this.game.load.spritesheet('transmitButton', 'assets/transmitButton.png', 100, 50);
			this.game.load.spritesheet('defibrillateButton', 'assets/defibrillateButton.png', 100, 50);
			
			this.game.load.spritesheet('deceasedLogo', 'assets/deceased.png', 400, 100);

			this.game.load.spritesheet('grid', 'assets/grid.png', 20, 20);
		}

		create() {
			this.game.state.start('Game');
		}

	}

}