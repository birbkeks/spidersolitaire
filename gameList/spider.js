class SpiderSolitaire extends BaseGameClass{
	constructor(w,h,...options){
		super(w,h);
		this.targetCell = new StackController(8,0,0,0.075,0.3,0.05,0.9 - 0.3,0.8);
		this.pileCell = new Stack(0.075,0.05,0,1/800,0.075);
		this.playfieldCell = new StackController(10,20/800,0,0.075,0.075,0.275,0.925 - 0.075,0.8);
		this.clickMode = 0;
		this.clickAt = [""];
		this.cardSuit = Number(options[0]);
	}
	generate(rng){
		let cardDeck = [];
		let suitNumber = [0,1,2,3];
		randUtil.shuffle(suitNumber,rng);
		for(let i=0;i<104;i++){
			cardDeck[i] = card2dto1d(i%13,suitNumber[Math.floor(i/13)%this.cardSuit]);
		}
		randUtil.shuffle(cardDeck,rng);
		let ptr = 103;

		for(let i=0;i<10;i++)
		for(let j=0;j<5;j++){
			this.playfieldCell.push(i,...card1dto2d(cardDeck[ptr--] + 52));
		}
		for(let i=0;i<4;i++)
			this.playfieldCell.push(i,...card1dto2d(cardDeck[ptr--]));
		this.revealCard();

		while(ptr >= 0){
			this.pileCell.push(...card1dto2d(cardDeck[ptr--] + 52));
		}

	}
	click(spr,x,y){
		this["clickMode"+this.clickMode](spr,x,y);

	}
	clickMode0(spr,x,y){
		let pClick = this.pileCell.click(spr,x,y,this.w,this.h);
		if(pClick){
			let valid = this.playfieldCell.arrOfStack.reduce((t,x)=>{return (x.arr.length > 0)&&t;},1);
			if(valid ){
				for(let i=0;i<10;i++){
					let vvv = this.pileCell.pop();
					vvv[1]-=4;
					this.playfieldCell.push(i,...vvv);
				}

			}
			return;
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
				let currType = firstCard[1];

				for(let i = firstNum - 1;i >= 0;i--){
					let currCard = sseek[i];
					let ctype = currCard[1];
					let cnum =  currCard[0];
					if(currType == ctype && nowNum + 1 == cnum){
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

			let len = tmpClickAt[1][0] - tmpClickAt[1][1];
			let top = this.playfieldCell.top(pfClick[2]);
			let sseek = this[tmpClickAt[0]].seek(tmpClickAt[1][1],tmpClickAt[1][2])[0];

			let isCorrect = (!top) || (top[0] - 1 == sseek[0]);

			if(isCorrect){
				let arr = [];
				for(let i=0;i<len;i++){
					let elem = this[tmpClickAt[0]].pop(tmpClickAt[1][2]);
					arr.push(elem);
				}
				for(let i=0;i<len;i++){
					let elem = arr.pop();
					this.playfieldCell.push(pfClick[2],...elem);
				}
				this.revealCard();
			}
			return;
		}
		let tgClick =  this.targetCell.click(spr,x,y,this.w,this.h);
		if(tgClick && !this.targetCell.top(tgClick[2]) ){
			
			let len = tmpClickAt[1][0] - tmpClickAt[1][1];
			if(len == 13){
				for(let i=0;i<13;i++){
					this.targetCell.push(tgClick[2],...this[tmpClickAt[0]].pop(tmpClickAt[1][2]));
				}
				this.revealCard();
			}
			return;
		}
	}
	revealCard(){
		for(let i=0;i<10;i++){
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
		this.targetCell.render(ctx,this.w,this.h,sprite);
		this.pileCell.render(ctx,this.w,this.h,sprite);
		this.playfieldCell.render(ctx,this.w,this.h,sprite);
		if(this.clickAt[0] != "")
		this[this.clickAt[0]].highlight(
			ctx,this.w,this.h,sprite,
			this.clickAt?.[1]?.[2],this.clickAt?.[1]?.[1]
			);
	}
	static showUi(){
		let ui = new UI();
		ui.addSelector("Suit Count ",[{value:1,text:"1 Suit"},{value:2,text:"2 Suit"},{value:4,text:"4 Suit"}]);
		return ui;
	}
	static gameName = "SpiderSolitaire";
	static gameId = 'spider';
	static displayName = "Spider Solitaire";
}
globalArrOfGameList.push(SpiderSolitaire);