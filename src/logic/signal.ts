
const HEALTHY_BEATS_PER_SCREEN = 2;
const HEALTHY_BPS = 1.17; // 70 BPM
const HEALTHY_MS_PER_SCREEN = HEALTHY_BEATS_PER_SCREEN * HEALTHY_BPS * 1000;
const HEALTHY_MULTIPLIER = 1;
const AMPLITUDE_INCREASE = 250;
const RATE_INCREASE = 0.5;

module MyGame {

export class Signal {

    amplitudeMultiplier: number;
    rateMultiplier: number;
    trace: number[];
    drawWidth: number;
    tracePointIndex: number;

    constructor(trace: number[], drawWidth: number) {
        this.amplitudeMultiplier = 1;
        this.rateMultiplier = 1;
        this.trace = trace;
        this.tracePointIndex = 0;
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
            this.amplitudeMultiplier = HEALTHY_MULTIPLIER;
        }
        else {
            this.amplitudeMultiplier -= AMPLITUDE_INCREASE;
        }
    }

    increaseRate() {
        this.rateMultiplier += RATE_INCREASE;
    }

    decreaseRate() {
        if (this.rateMultiplier > 0) {
            this.rateMultiplier -= RATE_INCREASE;
        }
    }

    getMillisecondsPerPoint() {
        return (HEALTHY_BEATS_PER_SCREEN / this.trace.length) * this.rateMultiplier; //13.7 at healthy

    }

    getNextYPoints(elapsedTime: number): number[] {
        const rateChanger = this.getMillisecondsPerPoint();
        
        let resultPoints = [];

        while (elapsedTime > rateChanger) {
            resultPoints.push(this.trace[this.tracePointIndex % this.trace.length] * this.amplitudeMultiplier);
        }

        return resultPoints;
    }

}
}