module MyGame {

	export class InstructionsState extends Phaser.State {

		content = [
			"Doctor! Astronaut A. Jackson is unconcious in Space Lab 5.",
			"Use the console to remotely administer drugs to get his heart rate back to the normal range",
			" ",
			" ",
			"Hurry, we are losing signal with the Space Lab",
			" ",
			" ",
			" ",
			" ",
			"Click to activate the console"
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
				this.game.state.start('Trace');
			}
		}

	}

}