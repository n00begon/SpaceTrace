
const HEALTHY_BEATS_PER_SCREEN = 2;
const HEALTHY_BPS = 1.17; // 70 BPM
const HEALTHY_MS_PER_SCREEN = HEALTHY_BEATS_PER_SCREEN * HEALTHY_BPS * 1000;
const HEALTHY_MULTIPLIER = 1;
const HEALTHY_AMPLITUDE_MULTIPLIER = 500;
const AMPLITUDE_INCREASE = 250;
const RATE_INCREASE = 1.3;

module MyGame {

export class Signal {

    amplitudeMultiplier: number;
    rateMultiplier: number;
    trace: number[];
    drawWidth: number;
    tracePointIndex: number;
    prevCycleCount: number;
    rateChanger: number;
    hasArrhythmia: boolean;
    leftoverElapsedTime: number;
    hasInversion: boolean;
    hasReversal: boolean;
    defibrillateNeeded: boolean;

    stateAmplitudeIncrease: number;
    stateRateMultiplier: number;
    dead: boolean;

    constructor(trace: number[], drawWidth: number) {
        this.amplitudeMultiplier = 250;
        this.rateMultiplier = trace.length / 1000;
        this.trace = trace;
        this.tracePointIndex = 0;
        this.drawWidth = drawWidth;
        this.prevCycleCount = this.getCycleCount();
        this.rateChanger = this.getMillisecondsPerPoint();
        this.dead = false;

        // diseases
        this.hasArrhythmia = false;
        this.hasInversion = false;
        this.hasReversal = false;

        this.leftoverElapsedTime = 0;

        this.stateAmplitudeIncrease = 0;
        this.stateRateMultiplier = 1;

    }

    getCycleCount() {
        return Math.floor(this.tracePointIndex / this.trace.length * 2);
    } 

    getVelociy() {
        // Using rate increase as the diff because the healthy amount per screen happens normally at the
        // top left of the state grid, while the healthy one should be the middle of it
        return this.drawWidth/(HEALTHY_BPS * HEALTHY_BEATS_PER_SCREEN) / (RATE_INCREASE * RATE_INCREASE);
    }

    updateStateModifiers(pos) {
        this.stateRateMultiplier = 1 * Math.pow(RATE_INCREASE, pos.x);
        this.stateAmplitudeIncrease = (4 - pos.y) * AMPLITUDE_INCREASE;
        this.rateChanger = this.getMillisecondsPerPoint();
    }

    flatline() {
        setTimeout(() => {
            this.dead = true;
        }, 1000);
    }
  

    getMillisecondsPerPoint() {
        return (HEALTHY_MS_PER_SCREEN / this.trace.length) / (this.rateMultiplier * this.stateRateMultiplier); //13.7 at healthy
    }

    getArrhythmiaPulseDistVal(): number {
        const upper = Math.ceil(Math.random());
        const baseVal = (Math.random() + Math.random()) / 2;
        return upper ? 1 - baseVal: baseVal;
    }

    getYForPoint(distanceFromStart: number) {
        if (this.dead) {
            return 0;
        }

        if (this.defibrillateNeeded) {
            return this.trace[Math.floor(Math.random() * this.trace.length)] * HEALTHY_AMPLITUDE_MULTIPLIER;
        }

        const amplitudeMultiplier = this.amplitudeMultiplier + this.stateAmplitudeIncrease;
       
        return this.trace[this.getIndexForPoint(distanceFromStart)] * amplitudeMultiplier * 2;
    }

    getIndexForPoint(distanceFromStart) {
        let pixelsThroughTrace = distanceFromStart * this.rateMultiplier * this.stateRateMultiplier;
        while(pixelsThroughTrace < 0) pixelsThroughTrace += this.trace.length;
       
        const traceIndex = Math.floor(pixelsThroughTrace % this.trace.length);
        return traceIndex;
    }

    rangeContainsPeak(startDistance, endDistance) {
        if (startDistance === -10000) return false;

        const startIndex = this.getIndexForPoint(startDistance);
        const endIndex = this.getIndexForPoint(endDistance);

        const peaksOfData = [0, 87];

        return peaksOfData.some(peakOfData => {
            if (startIndex <= endIndex){
                return peakOfData <= endIndex && peakOfData > startIndex;
            }
            else {
                return peakOfData <= endIndex || peakOfData > startIndex;
            }
        })
    }

    setCurrentDiseases(diseases: Disease[] ) {
        this.hasArrhythmia = false;
        this.hasInversion = false;
        this.hasReversal = false;

        diseases.forEach(disease => {
            switch (disease) {
                case 'triangle':
                    this.hasArrhythmia = true;
                    break;
                case 'circle':
                    this.hasInversion = true;
                    break;
                case 'square':
                    this.hasReversal = true;
                    break;
                default:
                    break;
            }  
        })
    }

    setDefibrillateNeeded(needed: boolean) {
        this.defibrillateNeeded = needed;
    }

}
}