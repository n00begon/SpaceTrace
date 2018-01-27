module MyGame {

	const MAX_HEIGHT = 500;
	const MIN_HEIGHT = 100;
	const NUM_DOTS = 200;

	export class TraceState extends Phaser.State {
		screen: Phaser.Sprite;
		filter: Phaser.Filter;
		
		traceDots: Phaser.Sprite[];
		lines: Phaser.Line[] = [];
		emitter: Phaser.Particles.Arcade.Emitter;
		bitmapData: Phaser.BitmapData;
		dotIndex: number = 0;
		leftButton: Phaser.Button;
		rightButton: Phaser.Button;
		upButton: Phaser.Button;
		downButton: Phaser.Button;

		defibrillateButton: Phaser.Button;

		transmission: Transmission;

		gameState: SpaceTraceState;

		signalInfo: Signal;
		gameGrid: Phaser.Sprite[][];

		lastDistanceDrawn: number;
		signalStrength: number;
		consoleActive: boolean;
		style;
		
		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
			var fragmentSrc = [
				"precision mediump float;",
				// Incoming texture coordinates. 
				'varying vec2 vTextureCoord;',
				// Incoming vertex color
				'varying vec4 vColor;',
				// Sampler for a) sprite image or b) rendertarget in case of game.world.filter
				'uniform sampler2D uSampler;',
		
				"uniform vec2      resolution;",
				"uniform float     time;",
				"uniform vec2      mouse;",
		
				"void main( void ) {",
				// colorRGBA = (y % 2) * texel(u,v);
				"gl_FragColor = mod(gl_FragCoord.y,2.0) * texture2D(uSampler, vTextureCoord);",
				"}"
			];
		
			// var fragmentSrc = [

			// 	"precision mediump float;",
		
			// 	"uniform float     time;",
			// 	"uniform vec2      resolution;",
			// 	"uniform vec2      mouse;",
		
			// 	"float noise(vec2 pos) {",
			// 		"return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
			// 	"}",
		
			// 	"void main( void ) {",
		
			// 		"vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
			// 		"float pos = (gl_FragCoord.y / resolution.y);",
			// 		"float distortion = clamp(1.0 - (0.1) * 3.0, 0.0, 1.0);",
		
			// 		"pos -= (distortion * distortion) * 0.1;",
		
			// 		"float c = sin(pos * 400.0) * 0.4 + 0.4;",
			// 		"c = pow(c, 0.2);",
			// 		"c *= 0.2;",
		
			// 		"float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
			// 		"c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",
		
			// 		"c += distortion * 0.08;",
			// 		"// noise",
			// 		"c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
		
		
			// 		"gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );",
			// 	"}"
			//];
			
			this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
			this.game.world.filters = [this.filter];
		}

		create() {
			let background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
			background.anchor.setTo(0.5, 0.5);
			this.traceDots = [];
			this.transmission = Transmission.None;
			//this.createEmitter();
			this.createButtons();
			this.gameState = new SpaceTraceState();
			this.createGameGrid();
			this.signalStrength = 5;
			this.consoleActive = true;
			this.signalInfo = new Signal(TraceA, this.game.width);
			const playerPos = this.gameState.player.position;

			for (let i = 0; i <= playerPos.x; i++) {
				this.signalInfo.increaseRate();
			}

			for (let i = 4; i >= playerPos.y; i--) {
				this.signalInfo.increaseAmplitude();
			}

			for (let i = 0; i < NUM_DOTS; i++) {
				const traceDot = this.game.add.sprite(0, this.game.world.centerY);
				traceDot.anchor.setTo(0.5, 0.5);
				this.game.physics.enable(traceDot, Phaser.Physics.ARCADE);
				//traceDot.body.velocity.x = 0;
				traceDot.x = 0 - i * 4;
				this.traceDots.push(traceDot);

				if ( i > 0) {
					const prevDot = this.traceDots[i - 1];
					//const line = new Phaser.Line(traceDot.x, traceDot.y, prevDot.x, prevDot.y);
					const line = new Phaser.Line().fromSprite(traceDot, prevDot, true);
					this.lines.push(line);
				}
			}

			//this.addText("Patient Deceased", "#ff0044");
			//this.addText("Patient Stable", "#00ff44");
			//this.addText("Signal Lost", "#aaaaff");


		}

		render() {
			this.lines.forEach(line => {
				this.game.debug.geom(line, '#FF0000');
				const above = new Phaser.Line(line.start.x, line.start.y + 1, line.end.x, line.end.y + 1);
				const below = new Phaser.Line(line.start.x, line.start.y - 1, line.end.x, line.end.y - 1);
				this.game.debug.geom(above, '#FF0000'); 
				this.game.debug.geom(below, '#FF0000'); 
			});
		}
		
		update() {
			//this.emitter.x = this.traceDots[this.traceDots.length - 1].x;
			//this.emitter.y = this.traceDots[this.traceDots.length - 1].y;

			const positionFurtherestPoint = Math.floor(this.game.time.totalElapsedSeconds() * this.signalInfo.getVelociy() / 4) * 4;

			const distanceToDraw = positionFurtherestPoint - this.lastDistanceDrawn;
			const prevLastDistanceDrawn = this.lastDistanceDrawn;

			this.lastDistanceDrawn = positionFurtherestPoint;

			const dotsToMove = distanceToDraw / 4;

			let dotsMoved = 0;
			while(dotsMoved < dotsToMove) {
				const traceDot = this.traceDots.shift();
				const absX = prevLastDistanceDrawn + dotsMoved * 4;
				traceDot.x = (absX) % this.game.world.width;
				traceDot.y = this.game.world.centerY - this.signalInfo.getYForPoint( absX);
				this.traceDots.push(traceDot);
				dotsMoved++;
			}

			this.traceDots.forEach((traceDot, i) => {
				if ( i > 0) {
					const prevDot = this.traceDots[i - 1];

					if (prevDot.x > traceDot.x) {
						return;
					}
					const line = new Phaser.Line().fromSprite(traceDot, prevDot, true);
					this.lines[i - 1] = line;
				}
			});

			this.filter.update();
		}

		createEmitter() {
			this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 500);
			this.emitter.setAlpha(1, 0, 1000);

			this.bitmapData = this.game.add.bitmapData(1, 1);
			this.bitmapData.fill(255, 0, 0, 1);

			this.emitter.makeParticles(this.bitmapData);
			this.emitter.start(false,1000,0);
			this.emitter.on = true;
			this.emitter.maxParticleSpeed = new Phaser.Point(0,0);
			this.emitter.minRotation = 0;
			this.emitter.maxRotation = 0;
			this.emitter.setXSpeed(0,0);
			this.emitter.setYSpeed(0,0);
			this.emitter.gravity = new Phaser.Point(0,0);
		}

		createButtons() {
			const offset = 20;
			const size = 170 + offset;
			const buttonX = this.game.world.width/2 - size/2;
			const buttonY = this.game.world.height - offset - 50 - 50;
			this.leftButton = this.game.add.button(buttonX - (2 * size), buttonY, 'button', this.leftClick, this, 0, 2, 1);
			this.rightButton = this.game.add.button(buttonX - size, buttonY, 'button', this.rightClick, this, 0, 2, 1);
			this.defibrillateButton = this.game.add.button(buttonX, buttonY, 'button', this.defibrillateClick, this, 0, 2, 1);
			this.upButton = this.game.add.button(buttonX + size, buttonY, 'button', this.upClick, this, 0, 2, 1);
			this.downButton = this.game.add.button(buttonX + (2 * size), buttonY, 'button', this.downClick, this, 0, 2, 1);
		}

		click(transmission: Transmission) {
			if(!this.consoleActive) {
				return;
			}

			if(transmission === this.transmission) {
				this.transmission = Transmission.None;
			} else {
				this.transmission = transmission;
			}

			//Change this to update based on the player state?
			switch (this.transmission) {
				case 'Left':
					this.signalInfo.decreaseRate();
					break;
				case 'Right':
					this.signalInfo.increaseRate();
					break;
				case 'Up':
					this.signalInfo.increaseAmplitude();
					break;
				case 'Down':
					this.signalInfo.decreaseAmplitude();
					break;
				default:
					break;
			}

			this.signalInfo.setCurrentDiseases(this.gameState.player.diseases);
		

			this.transmitClick();

		}

		leftClick() {
			this.click(Transmission.Left);
		}

		rightClick() {
			this.click(Transmission.Right);
		}

		upClick() {
			this.click(Transmission.Up);
		}

		downClick() {
			this.click(Transmission.Down);
		}

		defibrillateClick() {
			this.click(Transmission.Defibrillate);
		}

		transmitClick() {
			if(this.transmission !== Transmission.None) {
				console.log("Transmitting ", this.transmission);
				this.gameState.receiveTransmission(this.transmission);
				console.log(this.gameState);
				this.click(Transmission.None);
				this.redrawState();
				this.checkStatus();
			}
		}

		createGameGrid() {
			const offset = 20;
			this.gameGrid = [];
			for(let x = 0; x < this.gameState.space.length; ++x) {
				this.gameGrid.push([]);
				for (let y = 0; y < this.gameState.space[0].length; ++y) {
					this.gameGrid[x][y] = this.game.add.sprite(x * offset, y * offset, 'grid');
				}
			}
			this.redrawState();
		}

		checkStatus() {
			if (this.gameState.player.state === 'dead') {
				this.signalInfo.flatline();	
				this.addText("Patient Deceased", "#ff0044");
				this.consoleActive = false;
			} else if (this.gameState.player.state === 'stable') {
				this.addText("Patient Stable", "#00ff44");
				this.consoleActive = false;
			} else if (this.signalStrength <= 0) {
				this.addText("Signal Lost", "#aaaaff");
				this.consoleActive = false;
			}
		}


		addText(input: string, color: string) {
			this.style = { font: "60px Consolas", fill: color, wordWrap: true, wordWrapWidth: this.game.width, align: "center", backgroundColor: "#000000"  };
			let text = this.game.add.text(0, 0, input, this.style);
			text.anchor.set(0.5);
			text.x = this.game.width/2
			text.y = this.game.height/2;
			text.alpha = 0;
			this.game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		}

        createFilter() {
            this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
            this.filter.setResolution(800, 600);
            //  From http://glslsandbox.com/e#18578.0
        
            var fragmentSrc = [
        
                "precision mediump float;",
        
                "uniform float     time;",
                "uniform vec2      resolution;",
                "uniform vec2      mouse;",
        
                "float noise(vec2 pos) {",
                    "return fract(sin(dot(pos, vec2(12.9898 - time,78.233 + time))) * 43758.5453);",
                "}",
        
                "void main( void ) {",
        
                    "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
                    "float pos = (gl_FragCoord.y / resolution.y);",
                    "float mouse_dist = length(vec2((mouse.x - normalPos.x) * (resolution.x / resolution.y) , mouse.y - normalPos.y));",
                    "float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);",
        
                    "pos -= (distortion * distortion) * 0.1;",
        
                    "float c = sin(pos * 400.0) * 0.4 + 0.4;",
                    "c = pow(c, 0.2);",
                    "c *= 0.2;",
        
                    "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
                    "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",
        
                    "c += distortion * 0.08;",
                    "// noise",
                    "c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);",
        
        
                    "gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );",
                "}"
            ];
            this.screen = this.game.add.sprite();
            this.screen.width = 800;
            this.screen.height = 600;
        
            this.screen.filters = [ this.filter ];
        }

		redrawState() {
			for(let x = 0; x < this.gameState.space.length; ++x) {
				for (let y = 0; y < this.gameState.space[x].length; ++y) {
					let disease = this.gameState.space[x][y].disease;
					switch (disease) {
						case 'none':
							this.gameGrid[x][y].frame = 0;
							break;
						case 'square':
							this.gameGrid[x][y].frame = 1;
							break;
						case 'triangle':
							this.gameGrid[x][y].frame = 2;
							break;
						case 'circle':
							this.gameGrid[x][y].frame = 3;
							break;
						case 'cross':
							this.gameGrid[x][y].frame = 4;
							break;
						default:
							return undefined;
						}
				}
			}
			let playerPosition = this.gameState.player.position;
			let playerState = this.gameState.player.state;
			switch (playerState) {
				case 'active':
					this.gameGrid[playerPosition.x][playerPosition.y].frame = 5;
					break;
				case 'defibrillate':
					this.gameGrid[playerPosition.x][playerPosition.y].frame = 6;
					break;
				case 'dead':
					this.gameGrid[playerPosition.x][playerPosition.y].frame = 7;
					break;
				case 'stable':
					this.gameGrid[playerPosition.x][playerPosition.y].frame = 8;
					break;
				}
		}
	}

	
}