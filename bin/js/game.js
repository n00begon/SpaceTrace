var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyGame;
(function (MyGame) {
    var PhaserGame = /** @class */ (function (_super) {
        __extends(PhaserGame, _super);
        function PhaserGame() {
            var _this = _super.call(this, 800, 600, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', MyGame.BootState);
            _this.state.add('Preloader', MyGame.PreloaderState);
            _this.state.add('UI', MyGame.UIState);
            _this.state.add('Game', MyGame.GameState);
            _this.state.add('Trace', MyGame.TraceState);
            _this.state.start('Boot');
            return _this;
        }
        return PhaserGame;
    }(Phaser.Game));
    MyGame.PhaserGame = PhaserGame;
})(MyGame || (MyGame = {}));
// when the page has finished loading, create our game
window.onload = function () {
    var game = new MyGame.PhaserGame();
};
var MyGame;
(function (MyGame) {
    var BootState = /** @class */ (function (_super) {
        __extends(BootState, _super);
        function BootState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BootState.prototype.preload = function () { };
        BootState.prototype.create = function () {
            // Use this if you don't need multitouch
            this.input.maxPointers = 1;
            if (this.game.device.desktop) {
                // Desktop specific settings go here
            }
            this.game.state.start('Preloader', true, false);
        };
        return BootState;
    }(Phaser.State));
    MyGame.BootState = BootState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameState.prototype.preload = function () { };
        GameState.prototype.create = function () {
            var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
        };
        return GameState;
    }(Phaser.State));
    MyGame.GameState = GameState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var PreloaderState = /** @class */ (function (_super) {
        __extends(PreloaderState, _super);
        function PreloaderState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreloaderState.prototype.preload = function () {
            this.game.load.image('logo', 'assets/logo.png');
            this.game.load.spritesheet('button', 'assets/button.png', 100, 100);
        };
        PreloaderState.prototype.create = function () {
            this.game.state.start('Trace');
            // this.game.state.start('UI');
        };
        return PreloaderState;
    }(Phaser.State));
    MyGame.PreloaderState = PreloaderState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var MAX_HEIGHT = 100;
    var MIN_HEIGHT = 100;
    var TraceState = /** @class */ (function (_super) {
        __extends(TraceState, _super);
        function TraceState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TraceState.prototype.preload = function () {
            this.game.load.image('traceDot', 'assets/dot.png');
        };
        TraceState.prototype.create = function () {
            this.traceDot = this.game.add.sprite(0, this.game.world.centerY, 'traceDot');
            this.traceDot.anchor.setTo(0.5, 0.5);
            this.game.physics.enable(this.traceDot, Phaser.Physics.ARCADE);
            this.emitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 500);
            this.emitter.setAlpha(1, 0, 2500);
            this.bitmapData = this.game.add.bitmapData(5, 5);
            this.bitmapData.fill(255, 0, 0, 1);
            this.emitter.makeParticles(this.bitmapData);
            this.emitter.start(false, 3000, 0);
            this.emitter.on = true;
            this.emitter.maxParticleSpeed = new Phaser.Point(0, 0);
            this.emitter.minRotation = 0;
            this.emitter.maxRotation = 0;
            this.emitter.setXSpeed(0, 0);
            this.emitter.setYSpeed(0, 0);
            this.emitter.gravity = new Phaser.Point(0, 0);
        };
        TraceState.prototype.update = function () {
            this.traceDot.body.velocity.x = 200;
            this.emitter.x = this.traceDot.x;
            this.emitter.y = this.traceDot.y;
        };
        return TraceState;
    }(Phaser.State));
    MyGame.TraceState = TraceState;
})(MyGame || (MyGame = {}));
var MyGame;
(function (MyGame) {
    var button;
    var UIState = /** @class */ (function (_super) {
        __extends(UIState, _super);
        function UIState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIState.prototype.preload = function () { };
        UIState.prototype.create = function () {
            button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'button', this.actionOnClick, this, 1, 0, 2);
        };
        UIState.prototype.actionOnClick = function () {
            console.log("Hey");
        };
        return UIState;
    }(Phaser.State));
    MyGame.UIState = UIState;
})(MyGame || (MyGame = {}));
//# sourceMappingURL=game.js.map