module MyGame {

	export class PreloaderState extends Phaser.State {

		preload() {
			this.game.load.image('logo', 'assets/logo.png');
			this.game.load.spritesheet('button', 'assets/buttonBase.png', 170, 85);
			this.game.load.spritesheet('grid', 'assets/grid.png', 20, 20);
			this.game.load.image('background', 'assets/background.png');

			this.game.load.audio('theme', ['assets/theme.wav']);
			this.game.load.audio('lost', ['assets/lost.wav']);
			this.game.load.audio('sad', ['assets/sad.wav']);
			this.game.load.audio('stable', ['assets/stable.wav']);
			this.game.load.audio('beep', ['assets/beep.m4a']);
		}

		create() {
			this.game.state.start('Game');
		}

	}

}