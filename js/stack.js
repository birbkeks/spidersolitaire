class StackController{
	constructor(count,zoffset,rOffset,size,x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.count = count;
		this.size = (size == 0 ? 6 / 80 : size);
		
		this.arrOfStack = [];
		
		for(let i=0;i<count;i++){
			this.arrOfStack[i] = new Stack(
				map(i,0,count-1,x,x+w),
				y,
				zoffset,
				rOffset,
				this.size
				);
		}
	}
	top(xarr){
		
		return this.arrOfStack[xarr].top();
	}
	seek(startPos,xarr){
		return this.arrOfStack[xarr].seek(startPos);
	}
	push(xarr,cardNum,cardType){
		this.arrOfStack[xarr].push(cardNum,cardType); 
	}
	pop(xarr){
		return this.arrOfStack[xarr].pop();
	}
	highlight(ctx,W,H,spr,xarr,startPos){
		return this.arrOfStack[xarr].highlight(ctx,W,H,spr,startPos);
	}
	click(spr,x,y,w,h){
		let xpos = map(x,this.x,this.x+this.w,0,this.count-1);
		let ixpos = Math.round(xpos);
		if(ixpos < 0 || ixpos >= this.count){
			return false;
		}
		let tarr = this.arrOfStack[ixpos].click(spr,x,y,w,h);
		if(tarr != undefined)
			return [...tarr,ixpos];
		else
			return 0;
	}
	render(ctx,W,H,spr){
		for(let i of this.arrOfStack){
			i.render(ctx,W,H,spr);
		}

	}
}
class Stack{
	constructor(x,y,zOffset,rOffset,size){
		this.arr = [];
		this.x = x;
		this.y = y;
		this.size = size;
		this.zOffset = zOffset;
		this.rOffset = rOffset;

	}
	top(){
		let len = this.arr.length;
		if(len == 0)return ;
		return card1dto2d(this.arr[len-1]);
	}
	seek(startPos = this.arr.length - 1){
		return this.arr.slice(startPos).map((x)=>{return card1dto2d(x);});
	}
	push(cardNum,cardType){
		
		this.arr.push(card2dto1d(cardNum,cardType));
	}
	pop(){
		if(this.arr.length == 0)return;
		return card1dto2d(this.arr.pop());
	}
	highlight(ctx,W,H,spr,startPos=this.arr.length-1){
		ctx.strokeStyle = "#ff0";
		let len = this.arr.length;
		let ilen = len - startPos;
		let ssize = this.size * W / H / spr.getRatio();
		let boxOffsetY = ((len - 1 ) * this.zOffset) + ssize;
		let boxH = ((ilen-1) * this.zOffset) + ssize;
		let boxOffsetX = ((len - 1) * this.rOffset);
		ctx.strokeRect(
			(this.x-this.size*0.5 + boxOffsetX)*W,
			(this.y + boxOffsetY)*H,
			this.size*W,
			-boxH*H);
	}
	render(ctx,W,H,spr){

		ctx.strokeStyle = "#444";
		ctx.strokeRect(...cardRenderer.renderEmpty(spr,
					(this.x-this.size*0.5)  * W,
					(this.y)* H,
					this.size * W)
		);

		for(let i=0,len=this.arr.length;i<len;i++){
			let [cardNum,cardType] =card1dto2d( this.arr[i] );
			ctx.drawImage( 
				...cardRenderer.renderCard( 
					spr,
					(this.x-this.size*0.5 + this.rOffset * i)  * W,
					(this.y + this.zOffset * i)* H,
					this.size * W,
					cardNum,
					cardType
					)
				);
		}
	}
	click(spr,x,y,w,h){
		let ratio = spr.getRatio();
		let len = this.arr.length;

		let xpos = x - this.x;
		let absX =  xpos + this.size * 0.5;
		if(absX >= 0 && absX < this.size + (len-1)*this.rOffset){
			
			let ypos = y - this.y;
			
			if(ypos >= 0){
				if((this.zOffset < 1e-8 || len == 0) && ypos < this.size * w / h / ratio){
					return [len,0]; 
				}else{
					let iypos = clamp(Math.floor(map(ypos,0,this.zOffset,0,1)),0,Math.max(len-1,0));
					let boxH = ((len-1) * this.zOffset) + this.size * w / h / ratio;
					if(ypos < boxH){
						return [len,iypos];
					} 
				}
			}

		}
		
	}
	

}