// Ross Cameron 2020/07/01
// A basic profiler to time processes

class Profiler {
    constructor() {
        this.report = {}
    }

    startTimer(processId) {
        let time = performance.now();

        if (processId in this.report) {
            this.report[processId].t0 = time;
        }
        else {
            this.report[processId] = {
                totalTime: 0,
                meanTime: 0,
                count: 1,
                t0: time,
            };
        }
    }

    stopTimer(processId) {
        let t1 = performance.now()
        let delta = t1 - this.report[processId].t0;

        this.report[processId].count++;
        this.report[processId].totalTime += delta;
        this.report[processId].meanTime = this.report[processId].totalTime / this.report[processId].count;
    }

    printReport() {
        console.log(this.report);
    }
}