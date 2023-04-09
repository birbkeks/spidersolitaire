class KlondikeSolitaire extends BaseGameClass{
	constructor(w,h,...options){
		super(w,h);
		this.pileCell = new Stack(0.1,0.05,0,1/800,0.1);
		this.dealCell = new Stack(0.25,0.05,0,1/800,0.1);
		this.playfieldCell = new StackController(7,30/800,0,0.1,0.1,0.275,0.9 - 0.1,0.8);
		this.targetCell = new StackController(4,0,0,0.1,0.45,0.05,0.9 - 0.45,0.8);
		this.drawMode = Number(options[0]);
		this.clickMode = 0;
		this.clickAt = [""];
	}
	generate(rng){
		let cardDeck = [];
		for(let i=0;i<52;i++){
			cardDeck[i] = i;
		}
		randUtil.shuffle(cardDeck,rng);
		let ptr = 51;
		for(let i=0;i<7;i++){
			for(let j=0;j<i+1;j++){
				this.playfieldCell.push(i,...card1dto2d(cardDeck[ptr--] + (j == i ? 0 : 52)));
			}
		}
		while(ptr >= 0){
			this.pileCell.push(...card1dto2d(cardDeck[ptr--] + 52));
		}

		

	}
	click(spr,x,y){
		this["clickMode"+this.clickMode](spr,x,y);

	}
	clickMode0(spr,x,y){
		let pileCellClick = this.pileCell.click(spr,x,y,this.w,this.h);
		if(pileCellClick){
			let len = this.pileCell.arr.length;
			let dlen = this.dealCell.arr.length;
			if(len == 0){
				if(dlen > 0)
				for(let i=0;i<dlen;i++){
					let vvv = this.dealCell.pop();
					vvv[1]+=4;
					this.pileCell.push(...vvv);


				}
			}else{
				for(let i=0;i<this.drawMode;i++){
					if(this.pileCell.arr.length == 0){
						break;
					}
					let vvv = this.pileCell.pop();
					vvv[1]-=4;
					this.dealCell.push(...vvv);
				}
			}
			return;
		}

		let dlClick = this.dealCell.click(spr,x,y,this.w,this.h);
		if(dlClick){

			if(this.dealCell.arr.length > 0){
				this.clickAt = ["dealCell"];
				this.clickMode = 1;
				return ;
			}

		}

		let pfClick = this.playfieldCell.click(spr,x,y,this.w,this.h);
		if(pfClick){
			if(pfClick[0] == 0){
				return ; //No point to click Empty plafield
			}
			if(pfClick[0] > 0){
				let sseek = this.playfieldCell.seek(pfClick[1],pfClick[2]);
				let firstNum = sseek.length - 1;
				let firstCard = sseek[firstNum];
				let nowNum = firstCard[0];
				let currType = checkColor(firstCard[1]);

				for(let i = firstNum - 1;i >= 0;i--){
					let currCard = sseek[i];
					let ctype = checkColor(currCard[1]);
					let cnum =  currCard[0];
					if(currType != ctype && nowNum + 1 == cnum){
						currType = ctype;
						nowNum += 1;
						continue;
					}else{
						return ;
					}
				} 

				this.clickAt = ["playfieldCell",pfClick];
				this.clickMode = 1;
				return;
			}
		}

	}
	clickMode1(spr,x,y){

		this.clickMode = 0;

		let tmpClickAt = this.clickAt.slice();
		this.clickAt = [""];

		let pfClick = this.playfieldCell.click(spr,x,y,this.w,this.h);

		if(pfClick){
			let len = 1;
			if(tmpClickAt[1]){
				len = tmpClickAt[1][0] - tmpClickAt[1][1];
			}
			let top = this.playfieldCell.top(pfClick[2]);
			let sseek = this[tmpClickAt[0]].seek(tmpClickAt?.[1]?.[1],tmpClickAt?.[1]?.[2])[0];
			let isCorrect = (!top && sseek[0] == 12 )||
			(top?.[0] - 1 == sseek[0] && checkColor( top?.[1] ) != checkColor( sseek[1])
			);
			if(isCorrect){
				let arr = [];
				for(let i=0;i<len;i++){
					let elem = this[tmpClickAt[0]].pop(tmpClickAt?.[1]?.[2]);
					arr.push(elem);
				}
				for(let i=0;i<len;i++){
					let elem = arr.pop();
					this.playfieldCell.push(pfClick[2],...elem);
				}
				this.revealCard();
			}
			
			return ;

		}
		let tgClick = this.targetCell.click(spr,x,y,this.w,this.h);
		if(tgClick ){
			let top = this.targetCell.top(tgClick[2]);
			
			let ttop = this[tmpClickAt[0]].top(tmpClickAt?.[1]?.[2]);
			let ttop_num = ttop[0];
			let ttop_type = ttop[1];

			let isLengthOne = 1;
			if(tmpClickAt[1])
			isLengthOne = (tmpClickAt[1][0] - tmpClickAt[1][1]) == 1;
			
			if((top && top[0] + 1 == ttop_num && top[1] == ttop_type || !top && ttop_num == 0) && isLengthOne){
				let elem = this[tmpClickAt[0]].pop(tmpClickAt?.[1]?.[2]);
				this.targetCell.push(tgClick[2],...elem);
			}
			this.revealCard();
			return;
		}


	}
	revealCard(){
		for(let i=0;i<7;i++){
			let tempCard = this.playfieldCell.top(i);
			if(tempCard && tempCard[1] >= 4){
				this.playfieldCell.pop(i);
				tempCard[1] -= 4;
				this.playfieldCell.push(i,...tempCard);
			}
		}
	}
	render(ctx,sprite){
		ctx.clearRect(0,0,this.w,this.h);
		this.pileCell.render(ctx,this.w,this.h,sprite);
		this.dealCell.render(ctx,this.w,this.h,sprite);
		this.targetCell.render(ctx,this.w,this.h,sprite);
		this.playfieldCell.render(ctx,this.w,this.h,sprite);
		if(this.clickAt[0] != "")
		this[this.clickAt[0]].highlight(
			ctx,this.w,this.h,sprite,
			this.clickAt?.[1]?.[2],this.clickAt?.[1]?.[1]
			);
	}
	static showUi(){
		let ui = new UI();
		ui.addSelector("Draw Mode ",[{value:1,text:"Draw 1"},{value:3,text:"Draw 3"}]);
		return ui;
	}
	static gameName = "KlondikeSolitaire";
	static gameId = 'klondike';
	static displayName = "Klondike Solitaire";
}
globalArrOfGameList.push(KlondikeSolitaire);