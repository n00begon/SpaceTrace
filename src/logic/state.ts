module MyGame {

    function pickOne(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    export type Disease = 'triangle' | 'square' | 'circle' | 'cross' | 'none';
    function pickDisease(): Disease {
        const diseases: Disease[] = ['triangle', 'square', 'circle', 'cross'];
        return pickOne(diseases);
    }

    interface Pos {
        x: number;
        y: number;
    }

    //const CHANCE_OF_DISEASE = 0.2;
    const CHANCE_OF_DISEASE = 0;
    class SpaceNode {
        disease: Disease;
        constructor() {
            this.disease = Math.random() < CHANCE_OF_DISEASE ? pickDisease() : 'none';
        }
    }

    const MAX_SPACE_SIZE = 5; // space is 5 x 5
    const SPACE_CENTER = 2;

    const STARTING_HEALTH = 3;

    type PlayerState = 'active' | 'defibrillate' | 'stable' | 'dead';

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
            this.position = {
                x: pickOne(legalPositions),
                y: pickOne(legalPositions)
            };
        }

        fibrillate() {
            if (this.state === 'active') {
                this.state = 'defibrillate';
            }
        }

        move(movement: Transmission) {
            switch (movement) {
                case 'Left':
                    if (this.position.x === 0) {
                        this.fibrillate();
                    } else {
                        this.position.x--;
                    }
                    break;
                case 'Right':
                    if (this.position.x === MAX_SPACE_SIZE - 1) {
                        this.fibrillate();
                    } else {
                        this.position.x++;
                    }
                    break;
                case 'Up':
                    if (this.position.y === 0) {
                        this.fibrillate();
                    } else {
                        this.position.y--;
                    }
                    break;
                case 'Down':
                    if (this.position.y === MAX_SPACE_SIZE - 1) {
                        this.fibrillate();
                    } else {
                        this.position.y++;
                    }
                    break;
            }
        }

        hasDisease(disease: Disease) {
            return this.diseases.reduce((memo, cur) => {
                if (cur === disease)
                    return true;
            }, false);
        }

        giveDisease(disease: Disease) {
            if (!this.hasDisease(disease)) {
                this.diseases.push(disease);
            }
        }

        hurt() {
            this.health--;
            if (this.health <= 0)
                this.state = 'dead';
        }

        cure(drug: Disease) {
            this.diseases = this.diseases.filter(disease => disease !== drug);
        }
    }

    export class SpaceTraceState {
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

        receiveTransmission(transmission: Transmission) {
            if (this.player.state === 'dead') {
                return;
            }

            if (this.player.state === 'stable') {
                return;
            }

            if (transmission === 'Defibrillate') {
                if (this.player.state === 'defibrillate') {
                    this.player.state = 'active';
                    return;
                }
                this.player.state = 'dead'; // nice job, idiot!
                return;
            }

            if (this.player.state === 'defibrillate') {
                this.player.hurt(); // the player needed to defibrillate, hurt them!
                return;
            }

            this.player.move(transmission);

            if (this.isStable()) {
                this.player.state = 'stable';
            }
        }

        defibrillate() {
            this.player.hurt(); //OUCH!
            this.player.state = 'active';
        }

        isStable(): boolean {
            const { x, y } = this.player.position;
            const hasReachedCenter = x === SPACE_CENTER && y === SPACE_CENTER;
            const noDiseases = this.player.diseases.length === 0;
            return hasReachedCenter && noDiseases;
        }

        getCurrentSpaceContainDisease() {
            const { x, y } = this.player.position;
            return this.space[x][y].disease;
        }

    }

    const state = new SpaceTraceState();
    console.log(state);
    // const test = new Player();
    // console.log(test.position)
    // test.move('left');
    // console.log(test.position)

}