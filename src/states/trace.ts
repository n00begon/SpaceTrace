module MyGame {

	const MAX_HEIGHT = 500;
	const MIN_HEIGHT = 100;

	export class TraceState extends Phaser.State {
		
        traceDot: Phaser.Sprite
		emitter: Phaser.Particles.Arcade.Emitter;
		bitmapData: Phaser.BitmapData;
		dotIndex: number = 0;
		leftButton: Phaser.Button;
		rightButton: Phaser.Button;
		upButton: Phaser.Button;
		downButton: Phaser.Button;

		transmitButton: Phaser.Button;
		transmission: Transmission;

		gameState: SpaceTraceState;

		signalInfo: Signal;
		gameGrid: Phaser.Sprite[][];

		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
		}

		create() {
			this.traceDot = this.game.add.sprite(0, this.game.world.centerY, 'traceDot');
			this.traceDot.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(this.traceDot, Phaser.Physics.ARCADE);
			this.transmission = Transmission.None;
			this.createEmitter();
			this.createButtons();
			this.gameState = new SpaceTraceState();
			this.createGameGrid();

			this.signalInfo = new Signal(TraceA, this.game.width);
			this.traceDot.body.velocity.x = this.signalInfo.getVelociy();

			const playerPos = this.gameState.player.position;

			for (let i = 0; i <= playerPos.x; i++) {
				this.signalInfo.increaseRate();
			}

			for (let i = 4; i >= playerPos.y; i--) {
				this.signalInfo.increaseAmplitude();
			}
		}
		
		update() {
			this.emitter.x = this.traceDot.x;
			this.emitter.y = this.traceDot.y;
			
			const elapsedTime = this.game.time.elapsed;
			
			const drawPoints = this.signalInfo.getNextYPoints(elapsedTime);
			
			if (drawPoints.length > 0) {
				this.traceDot.y = this.game.world.centerY - drawPoints.pop();
			}
			
			if (this.traceDot.x > this.game.world.width) {
				this.traceDot.x = 0;
			}


			if (this.gameState.player.state === 'dead') {
				// The guy is dead
				// Display some text
				// Click to restart
				this.game.state.start("Game");	
			} 
		}

		createEmitter() {
			this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 500);
			this.emitter.setAlpha(1, 0, 2500);

			this.bitmapData = this.game.add.bitmapData(5, 5);
			this.bitmapData.fill(255, 0, 0, 1);

			this.emitter.makeParticles(this.bitmapData);
			this.emitter.start(false,3000,0);
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
			const centerButtonX = this.game.world.left + offset + 20;
			const centerButtonY = this.game.world.height - offset - 50 - 20;
			this.leftButton = this.game.add.button(centerButtonX - offset, centerButtonY, 'button', this.leftClick, this, 1, 2, 3);
			this.rightButton = this.game.add.button(centerButtonX + offset, centerButtonY, 'button', this.rightClick, this, 1, 2, 3);
			this.upButton = this.game.add.button(centerButtonX, centerButtonY - offset, 'button', this.upClick, this, 1, 2, 3);
			this.downButton = this.game.add.button(centerButtonX, centerButtonY + offset, 'button', this.downClick, this, 1, 2, 3);

			this.transmitButton = this.game.add.button(this.game.world.width - 200, centerButtonY, 'transmitButton', this.transmitClick, this, 1, 1, 1);
		}

		click(transmission: Transmission) {
			this.leftButton.setFrames(1, 2, 3);
			this.rightButton.setFrames(1, 2, 3);
			this.upButton.setFrames(1, 2, 3);
			this.downButton.setFrames(1, 2, 3);

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