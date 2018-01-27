module MyGame {

	export class InstructionsState extends Phaser.State {

		line = [];
			
		lineIndex = 0;
		letterIndex = 0;

		lineDelay = 400;
		letterDelay = 40;

		text
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
			
				this.text = this.game.add.text(32, 32, '', { font: "18px Consolas", fill: "#19de65" });
				this.nextLine();
			}
			
		 nextLine() {
			
				if (this.lineIndex === this.content.length)
				{
					return;
				}

				this.line = this.content[this.lineIndex].split('');
				this.letterIndex = 0;
				this.game.time.events.repeat(this.letterDelay, this.line.length, this.nextLetter, this);
				this.lineIndex++;
			
			}
			
			
			nextLetter() {
				this.text.text = this.text.text.concat(this.line[this.letterIndex] + "");
				this.letterIndex++;
				if (this.letterIndex === this.line.length)
				{
					this.text.text = this.text.text.concat("\n");
					this.game.time.events.add(this.lineDelay, this.nextLine, this);
				}
			}

		update() {
			if (this.game.input.activePointer.isDown){
				this.game.state.start('Trace');
			}
		}

	}

}