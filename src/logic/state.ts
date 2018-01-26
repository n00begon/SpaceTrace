function pickOne(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

type Disease = 'triangle' | 'square' | 'circle' | 'cross' | 'none';
function pickDisease(): Disease {
    const diseases: Disease[] = ['triangle', 'square', 'circle', 'cross'];
    return pickOne(diseases);
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

const MAX_SPACE_SIZE = 5; // space is 5 x 5
const SPACE_CENTER = Math.ceil(MAX_SPACE_SIZE / 2);

const STARTING_HEALTH = 5;

type PlayerState = 'active' | 'defibrillate' | 'dead';

class Player {
    position: Pos;
    state: PlayerState = 'active';
    diseases: Disease[] = []; // these are the diseases the player hasn't fixed, 
                        // and is 'carrying' around with them
    health: number = STARTING_HEALTH;

    constructor() {
        this.reposition();
    }

    reposition() { // anywhere that isn't the center
        const legalPositions = [];
        for (let i = 0; i < MAX_SPACE_SIZE; i++) {
            if (i !== SPACE_CENTER)
                legalPositions.push(i);
        }
        this.position.x = pickOne(legalPositions);
        this.position.y = pickOne(legalPositions);
    }
}

class State {
    player: Player;
    space: SpaceNode[][] = [];

    constructor() {
        for (let i = 0; i < MAX_SPACE_SIZE; i++) {
            this.space.push([]);
            for (let j = 0; j < MAX_SPACE_SIZE; j++) {
                this.space[i][j] = new SpaceNode();
            }
        }
        this.player = new Player();
    }

    private currentPositionIsValid(): boolean { // are they in the grid?
        const { x, y } = this.player.position;
        return x >= 0 && x < MAX_SPACE_SIZE && y >= 0 && y < MAX_SPACE_SIZE;
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

        if (this.player.state === 'defibrillate') {
            this.player.health--; // the player needed to defibrillate, hurt them!
        }

        if (!this.currentPositionIsValid()) // out of bounds, need defibrilliation!
            this.player.state = 'defibrillate';

    }

    defibrillate() {
        this.player.state = 'active';
    }

    patientIsSaved(): boolean {
        const { x, y } = this.player.position;
        const hasReachedCenter = x === SPACE_CENTER && y === SPACE_CENTER;
        const noDiseases = this.player.diseases.length === 0;
        return hasReachedCenter && noDiseases;
    }

}

const state = new State();
console.log(state);