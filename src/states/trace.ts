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

		gameState: SpaceTraceState;

		signalInfo: Signal;

		preload() {
			this.game.load.image('traceDot', 'assets/dot.png');
		}

		create() {
			this.traceDot = this.game.add.sprite(0, this.game.world.centerY, 'traceDot');
			this.traceDot.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(this.traceDot, Phaser.Physics.ARCADE);

			this.createEmitter();
			this.createButtons();
			this.gameState = new SpaceTraceState();

			this.signalInfo = new Signal(TraceA, this.game.width);
			this.traceDot.body.velocity.x = this.signalInfo.getVelociy();
		}
		
		update() {
			this.emitter.x = this.traceDot.x;
			this.emitter.y = this.traceDot.y;
			
			const elapsedTime = this.game.time.elapsed;
			
			const drawPoints = this.signalInfo.getNextYPoints(elapsedTime);
			
			this.traceDot.y = this.game.world.centerY - drawPoints.pop();
			
			if (this.traceDot.x > this.game.world.width) {
				this.traceDot.x = 0;
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
			this.leftButton = this.game.add.button(centerButtonX - offset, centerButtonY, 'button', this.leftClick, this, 1, 0, 2);
			this.rightButton = this.game.add.button(centerButtonX + offset, centerButtonY, 'button', this.rightClick, this, 1, 0, 2);
			this.upButton = this.game.add.button(centerButtonX, centerButtonY - offset, 'button', this.upClick, this, 1, 0, 2);
			this.downButton = this.game.add.button(centerButtonX, centerButtonY + offset, 'button', this.downClick, this, 1, 0, 2);

		}

		leftClick() {
			this.gameState.move('left');
			console.log("Left Click", this.gameState);
		}

		rightClick() {
			this.gameState.move('right');			
			console.log("Right Click", this.gameState);
		}

		upClick() {
			this.gameState.move('up');						
			console.log("Up Click", this.gameState);
		}

		downClick() {
			this.gameState.move('down');						
			console.log("Down Click", this.gameState);
		}

	}

}