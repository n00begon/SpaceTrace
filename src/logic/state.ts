type Disease = 'triangle' | 'square' | 'circle' | 'cross' | 'none';
function pickDisease(): Disease {
    const diseases: Disease[] = ['triangle', 'square', 'circle', 'cross'];
    return diseases[Math.floor(Math.random() * diseases.length)];
}

type Movement = 'left' | 'right' | 'up' | 'down';
interface Pos {
    x: number;
    y: number;
}

const CHANCE_OF_DISEASE = 0.2;
class SpaceNode {
    disease: Disease;
    constructor() {
        this.disease = Math.random() < CHANCE_OF_DISEASE ? pickDisease() : 'none';
    }
}

const MAX_SIZE = 5; // space is 5 x 5
const STARTING_HEALTH = 5;

type PlayerState = 'active' | 'defibrillate' | 'dead';

class Player {
    position: Pos;
    state: PlayerState = 'active';
    diseases: Disease[] = []; // these are the diseases the player hasn't fixed, 
                        // and is 'carrying' around with them
    health: number = STARTING_HEALTH;

    constructor(position: Pos) {
        this.position = position;
    }
}

class State {
    player: Player;
    space: SpaceNode[][] = [];

    constructor() {
        for (let i = 0; i < MAX_SIZE; i++) {
            this.space.push([]);
            for (let j = 0; j < MAX_SIZE; j++) {
                this.space[i][j] = new SpaceNode();
            }
        }
        this.player = new Player({x: 0, y: 0});
        // TODO position player random somewhere that ain't the center
    }

    currentPositionIsValid(): boolean { // are they in the grid?
        const { x, y } = this.player.position;
        return x >= 0 && x < MAX_SIZE && y >= 0 && y < MAX_SIZE;
    }

    // this handles applying the 'special' drugs - ie. circle, triangle etc.
    applyDrug(drug: Disease) {
        const playerHasDisease = this.player.diseases.reduce((memo, cur) => {
            if (cur === drug)
                return true;
        }, false);

        if (playerHasDisease) // remove disease
            this.player.diseases = this.player.diseases.filter(disease => disease !== drug);
        else
            this.player.health--; // otherwise hurt the player
    }

    // this handles applying 'normal' drugs, like to raiser/lower frequency
    // the Movement type is not correct (it is literal in respect to the grid we are moving in)
    // not sure what to call this
    move(movement: Movement) {
        const { position } = this.player;
        switch (movement) {
            case 'left':
                position.x--;
            case 'right':
                position.x++;
            case 'up':
                position.y--;
            case 'down':
                position.y++;
        }

        if (!this.currentPositionIsValid()) // out of bounds, need defibrilliation!
            this.player.state = 'defibrillate';

    }

    defibrillate() {
        this.player.state = 'active';
    }

    patientIsSaved(): boolean {
        const { x, y } = this.player.position;
        const hasReachedCenter = x === 3 && y === 3; // hardcode this for now
        const noDiseases = this.player.diseases.length === 0;
        return hasReachedCenter && noDiseases;
    }

}

const state = new State();
console.log(state);