class PerSecondTimer{
	_time;
	clockEvent = function(){};
	constructor(time){
		this._time = time;
	}
	start(){
		setInterval(() => {this._time--; this.clockEvent();}, 1000);
	}
	get time(){
		return this._time;
	}
}