module MyGame {

	const MAX_HEIGHT = 500;
	const MIN_HEIGHT = 100;
	const NUM_DOTS = 200;

	export class TraceState extends Phaser.State {
		
		traceDots: Phaser.Sprite[];
		lines: Phaser.Line[] = [];
		emitter: Phaser.Particles.Arcade.Emitter;
		bitmapData: Phaser.BitmapData;
		dotIndex: number = 0;
		leftButton: Phaser.Button;
		rightButton: Phaser.Button;
		upButton: Phaser.Button;
		downButton: Phaser.Button;

		triangleButton: Phaser.Button;
		circleButton: Phaser.Button;
		crossButton: Phaser.Button;
		squareButton: Phaser.Button;

		defibrillateButton: Phaser.Button;
		transmitButton: Phaser.Button;

		transmission: Transmission;

		gameState: SpaceTraceState;

		signalInfo: Signal;
		gameGrid: Phaser.Sprite[][];

		lastDistanceDrawn: number;

		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
		}

		create() {
			this.traceDots = [];
			this.transmission = Transmission.None;
			//this.createEmitter();
			this.createButtons();
			this.gameState = new SpaceTraceState();
			this.createGameGrid();
			
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


			if (this.gameState.player.state === 'dead') {
				this.signalInfo.flatline();	
				let endLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'deceasedLogo');

				endLogo.alpha = 0;
				this.game.add.tween(endLogo).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			} 
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
			const offset = 50;
			const moveButtonX = this.game.world.left + offset + 20;
			const moveButtonY = this.game.world.height - offset - 50 - 20;
			this.leftButton = this.game.add.button(moveButtonX - offset, moveButtonY, 'button', this.leftClick, this, 1, 2, 3);
			this.rightButton = this.game.add.button(moveButtonX + offset, moveButtonY, 'button', this.rightClick, this, 1, 2, 3);
			this.upButton = this.game.add.button(moveButtonX, moveButtonY - offset, 'button', this.upClick, this, 1, 2, 3);
			this.downButton = this.game.add.button(moveButtonX, moveButtonY + offset, 'button', this.downClick, this, 1, 2, 3);

			const drugButtonX = moveButtonX + 200;
			const drugButtonY = moveButtonY;
			const drugOffset = 25;

			this.triangleButton = this.game.add.button(drugButtonX - drugOffset, drugButtonY - drugOffset, 'triangleButton', this.triangleClick, this, 1, 2, 3);
			this.circleButton = this.game.add.button(drugButtonX - drugOffset, drugButtonY  + drugOffset, 'circleButton', this.circleClick, this, 1, 2, 3);
			this.crossButton = this.game.add.button(drugButtonX + drugOffset, drugButtonY - drugOffset, 'crossButton', this.crossClick, this, 1, 2, 3);
			this.squareButton = this.game.add.button(drugButtonX + drugOffset, drugButtonY + drugOffset, 'squareButton', this.squareClick, this, 1, 2, 3);

			this.defibrillateButton = this.game.add.button(this.game.world.width - 300, moveButtonY, 'defibrillateButton', this.defibrillateClick, this, 1, 2, 3);

			this.transmitButton = this.game.add.button(this.game.world.width - 200, moveButtonY, 'transmitButton', this.transmitClick, this, 1, 1, 1);
		}

		click(transmission: Transmission) {
			this.leftButton.setFrames(1, 2, 3);
			this.rightButton.setFrames(1, 2, 3);
			this.upButton.setFrames(1, 2, 3);
			this.downButton.setFrames(1, 2, 3);

			this.triangleButton.setFrames(1, 2, 3);
			this.circleButton.setFrames(1, 2, 3);
			this.crossButton.setFrames(1, 2, 3);
			this.squareButton.setFrames(1, 2, 3);

			this.defibrillateButton.setFrames(1, 2, 3);

			if(transmission === this.transmission) {
				this.transmission = Transmission.None;
			} else {
				this.transmission = transmission;
			}

			let activeButton = this.getActiveButton();

			if(activeButton) {
				activeButton.setFrames(0, 0, 0);
				this.transmitButton.setFrames(0, 0, 0);
			} else {
				this.transmitButton.setFrames(1, 1, 1);
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
		

			this.transmitClick(); //debug only

		}

		getActiveButton(): Phaser.Button {
			switch (this.transmission) {
				case 'Left':
					return this.leftButton;
				case 'Right':
					return this.rightButton;
				case 'Up':
					return this.upButton;
				case 'Down':
					return this.downButton;
				case 'Triangle':
					return this.triangleButton;
				case 'Circle':
					return this.circleButton;
				case 'Cross':
					return this.crossButton;
				case 'Square':
					return this.squareButton;
				case 'Defibrillate':
					return this.defibrillateButton;
				default:
					return undefined;
				}
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

		triangleClick() {
			this.click(Transmission.Triangle);
		}

		circleClick() {
			this.click(Transmission.Circle);
		}

		crossClick() {
			this.click(Transmission.Cross);
		}

		squareClick() {
			this.click(Transmission.Square);
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