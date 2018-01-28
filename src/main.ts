module MyGame {

	export class PhaserGame extends Phaser.Game
	{
		constructor()
		{
			super(1000, 600, Phaser.AUTO, 'content', null);

			this.state.add('Boot', BootState);
			this.state.add('Preloader', PreloaderState);
			this.state.add('Game', GameState);
			this.state.add('Instructions', InstructionsState);
			this.state.add('Trace', TraceState);
			this.state.add('Credits', CreditState);

			this.state.start('Boot');
		}

	}

}

var wfconfig = {
 
	active: function() { 
		init();
	},
 
	google: {
		families: ['VT323', 'Ubuntu Mono', 'Space Mono']
	}
 
};
 

function init() {
	var game = new MyGame.PhaserGame();
}

// when the page has finished loading, create our game
window.onload = () => {
	WebFont.load(wfconfig);
}