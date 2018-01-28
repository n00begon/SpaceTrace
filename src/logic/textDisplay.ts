module MyGame {
    export class TextDisplay {
		line = [];
			
		lineIndex = 0;
		letterIndex = 0;

		lineDelay = 400;
		letterDelay = 40;

        text;
        content;
        game: Phaser.Game;

        create(content: string[], game: Phaser.Game) {
            this.game = game;
            this.content = content;
            this.text = this.game.add.text(32, 32, '', {font: "18px Space Mono", fill: "#19de65" });
            this.line = [];
            this.lineIndex = 0;
            this.letterIndex = 0;
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
    }
}