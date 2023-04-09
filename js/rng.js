class RNG{
	constructor(seed){
		this.seed = seed;
		this.originalSeed = seed;
		this._m = 2**32;
		this._a = 1664525;
		this._c = 1013904223;
	}
	discard(){
		this.seed = (this.seed * this._a + this._c) % this._m;
	}
	rand(){
		this.discard();
		return this.seed / this._m;
	}
}
class randUtil{
	static shuffle(arr,rng){
		for(let i=arr.length - 1 ; i > 0 ; i--){
			let val = Math.floor(rng.rand() * i);
			let tmp = arr[i];
			arr[i] = arr[val];
			arr[val] = tmp;
		}
	}
}