module MyGame {

	export class DeadState extends Phaser.State {

		preload() {}

		create() {
			let logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
			logo.anchor.setTo(0.5, 0.5);
		}

		update() {
			if (this.game.input.activePointer.isDown){
				this.game.state.start('Trace');
			}
		}

	}

}