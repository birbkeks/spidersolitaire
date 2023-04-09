class BaseGameClass{
	static gameName = "undefined";
	static gameId = 'undefined';
	static displayName = "undefined";

	constructor(w,h){
		this.w = w;
		this.h = h;
	}
	generate(rng){
		throw "Must Implement Generate it's ";
	}
	click(){
		throw "Must Implement Click it's by yourself";
	}
	render(){
		throw "Must Implement Render it by yourself";
	}
	static showUi(){
		return new UI();
	}
}