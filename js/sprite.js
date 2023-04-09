class Sprite{
	constructor(countX,countY){
		this.img = document.createElement("img");
		this.countX = countX;
		this.countY = countY;

	}
	loadImage(url){
		let _this = this;
		return new Promise(
			(resolve)=>{
				_this.img.src = url;
				_this.img.onload = function(){

					resolve();
				}
			}
			);
	}
	getRatio(){
		let w = map(1,0,this.countX,0,this.img.width);
		let h = map(1,0,this.countY,0,this.img.height);
		
		return w / h;
	}
	getSprite(imgX,imgY){
		let w = this.img.width;
		let h = this.img.height;
		let sx = map(imgX,0,this.countX,0,w);
		let sw = map(1,0,this.countX,0,w);
		let sy = map(imgY,0,this.countY,0,h);
		let sh = map(1,0,this.countY,0,h);
		return [this.img,sx,sy,sw,sh];
	}
}