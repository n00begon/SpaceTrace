module MyGame {

	export class GameState extends Phaser.State {
		music :Phaser.Sound;
		preload() {}

		create() {
			let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
			logo.anchor.setTo(0.5, 0.5);
			this.music = this.game.add.audio('theme');
			this.music.play();
			this.music.loop = true;
		}

		update() {
			if (this.game.input.activePointer.isDown){
				this.game.state.start('Instructions');
			}
		}

	}

}