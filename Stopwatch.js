class Stopwatch{
    _start;
    _stop;
    _stopped = false;
    _interval;
    updateInterval = 1000;

    constructor(updateInterval){
        this.updateInterval = updateInterval;
    }

    update = function(){};
    start(){
        this._start = new Date().getTime();
        this._stopped = false;
        this._interval = setInterval(this.update, this.updateInterval);
    }
    stop(){
        this._stop = new Date().getTime();
        this._stopped = true;
        clearInterval(this._interval);
    }
    get time(){
        return this._stopped ?
            (this._stop - this._start) / 1000 : 
            (new Date().getTime() - this._start) / 1000;
    }
}
    