
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

    constructor(trace: number[], drawWidth: number) {
        this.amplitudeMultiplier = 250;
        this.rateMultiplier = trace.length / 1000;
        this.trace = trace;
        this.tracePointIndex = 0;
        this.drawWidth = drawWidth;
        this.prevCycleCount = this.getCycleCount();
        this.rateChanger = this.getMillisecondsPerPoint();

        // diseases
        this.hasArrhythmia = false;
        this.hasInversion = false;
        this.hasReversal = false;

        this.leftoverElapsedTime = 0;

    }

    getCycleCount() {
        return Math.floor(this.tracePointIndex / this.trace.length * 2);
    } 

    getVelociy() {
        return this.drawWidth/(HEALTHY_BPS * HEALTHY_BEATS_PER_SCREEN);
    }

    increaseAmplitude() {
        if (this.amplitudeMultiplier < AMPLITUDE_INCREASE) {
            this.amplitudeMultiplier = AMPLITUDE_INCREASE;
        }
        else {
            this.amplitudeMultiplier += AMPLITUDE_INCREASE;
        }
    }

    decreaseAmplitude() {
        if (this.amplitudeMultiplier < AMPLITUDE_INCREASE) {
            this.amplitudeMultiplier = HEALTHY_AMPLITUDE_MULTIPLIER;
        }
        else {
            this.amplitudeMultiplier -= AMPLITUDE_INCREASE;
        }
    }

    increaseRate() {
        this.rateMultiplier *= RATE_INCREASE;
        this.rateChanger = this.getMillisecondsPerPoint();

    }

    decreaseRate() {
        if (this.rateMultiplier > 0) {
            this.rateMultiplier /= RATE_INCREASE;
            this.rateChanger = this.getMillisecondsPerPoint();
        }
    }

    flatline() {
        this.amplitudeMultiplier = 0;
    }
  

    getMillisecondsPerPoint() {
        return (HEALTHY_MS_PER_SCREEN / this.trace.length) / this.rateMultiplier; //13.7 at healthy
    }

    getArrhythmiaPulseDistVal(): number {
        const upper = Math.ceil(Math.random());
        const baseVal = (Math.random() + Math.random()) / 2;
        return upper ? 1 - baseVal: baseVal;
    }

    getNextYPoints(elapsedTime: number, numPrevPoints: number): number[] {
        let innerElapsedTime = elapsedTime + this.leftoverElapsedTime; 

        let resultPoints = [];
 
        while (innerElapsedTime > this.rateChanger) {
            resultPoints.push(this.trace[this.tracePointIndex++ % this.trace.length] * this.amplitudeMultiplier);
            innerElapsedTime -= this.rateChanger;

            let newCycleCount = this.getCycleCount();
            if (newCycleCount > this.prevCycleCount && this.hasArrhythmia) {
                this.rateChanger = this.getMillisecondsPerPoint() * (this.getArrhythmiaPulseDistVal());
                this.prevCycleCount = newCycleCount;
            }
        }

        this.leftoverElapsedTime = innerElapsedTime;

        //return resultPoints;
        return this.getPreviousYPoints(this.tracePointIndex - resultPoints.length, numPrevPoints - resultPoints.length).concat(resultPoints);
    }

    getPreviousYPoints(initialIndex: number, num: number): number[] {
        let index = initialIndex - 1;
        const resultPoints = [];
        for (let i = 0; i < num; i++) {
            const traceIndex = index % this.trace.length;
            resultPoints.unshift(this.trace[traceIndex] * this.amplitudeMultiplier);
            index--;
            if (index < 0)
                index = this.trace.length - 1;
        }
        return resultPoints;
    }

    getYForPoint(distanceFromStart: number) {
        if (this.defibrillateNeeded) {
            return this.trace[Math.floor(Math.random() * this.trace.length)] * HEALTHY_AMPLITUDE_MULTIPLIER;
        }

        let pixelsThroughTrace = distanceFromStart * this.rateMultiplier;
        while(pixelsThroughTrace < 0) pixelsThroughTrace += this.trace.length;
       
        const traceIndex = Math.floor(pixelsThroughTrace % this.trace.length);
        return this.trace[traceIndex] * this.amplitudeMultiplier;
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