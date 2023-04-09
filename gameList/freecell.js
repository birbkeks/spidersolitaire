class FreecellSolitaire extends BaseGameClass{
	constructor(w,h,...options){
		super(w,h);
		
		
		this.freeCell = new StackController(4,0,0,0.1,0.1,0.05,0.3,0.8);
		this.targetCell = new StackController(4,0,0,0.1,0.6,0.05,0.3,0.8);
		this.playfieldCell = new StackController(8,40/800,0,0.1,0.1,0.3,0.8,0.8);
		this.clickMode = 0;
		this.clickAt = [""];

		
	}

	generate(rng){
		let cardDeck = [];
		
		for(let i=0;i<52;i++){
			cardDeck[i] = i ;
		}
		randUtil.shuffle(cardDeck,rng);
		for(let i=0;i<52;i++){
			let rxpos = i % 8;
			this.playfieldCell.push(rxpos,...card1dto2d(cardDeck[i]));
		}
	}
	countEmptyCell(){
		let empPlay = 0;
		let empFree = 0

		for(let cell of this.freeCell.arrOfStack){
			if(!cell.arr[0]){
				empFree++;
			}
		}

		for(let cell of this.playfieldCell.arrOfStack){
			if(!cell.arr[0]){
				empPlay++;
			}
		}
		return Math.pow(2,empPlay) * (empFree + 1);
	}
	click(spr,x,y){
		this["clickMode" + this.clickMode](spr,x,y);
		/*
		if(this.clickMode == 0){
			this.clickMode0(spr,x,y);
		}else if(this.clickMode == 1){
			this.clickMode1(spr,x,y);
		}
		*/
	}
	clickMode0(spr,x,y){
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
		let fcClick = this.freeCell.click(spr,x,y,this.w,this.h);
		if(fcClick){
			if(fcClick[0] == 0){
				return ;
			}
			if(fcClick[0] == 1){
				this.clickAt = ["freeCell",fcClick];
				this.clickMode = 1;
				return;
			}else{
				throw "Error";
			}
		}
	}
	clickMode1(spr,x,y){
		this.clickMode = 0;

		let tmpClickAt = this.clickAt.slice();
		this.clickAt = [""];
		let fcClick = this.freeCell.click(spr,x,y,this.w,this.h);

		if(fcClick && 
			fcClick[0] == 0 && 
			!this.freeCell.top(fcClick[2]) && 
			tmpClickAt[1][0] - tmpClickAt[1][1] == 1){

			let elem = this[tmpClickAt[0]].pop(tmpClickAt[1][2]);
			
			this.freeCell.push(fcClick[2],...elem);
			return ;
		}

		let pfClick = this.playfieldCell.click(spr,x,y,this.w,this.h);
		if(pfClick){
			let stackAllowed = this.countEmptyCell();

			let len = tmpClickAt[1][0] - tmpClickAt[1][1];
			let sseek = this[tmpClickAt[0]].seek(tmpClickAt[1][1],tmpClickAt[1][2])[0];
			let top = this.playfieldCell.top(pfClick[2]);
			
			let isCorrect = (!top )||
			(checkColor( top[1] ) != checkColor( sseek[1]) && 
			top[0] - 1 == sseek[0]);
			
			if(len <= stackAllowed && isCorrect){
				let arr = [];
				for(let i=0;i<len;i++){
					let elem = this[tmpClickAt[0]].pop(tmpClickAt[1][2]);
					arr.push(elem);
				}
				for(let i=0;i<len;i++){
					let elem = arr.pop();
					this.playfieldCell.push(pfClick[2],...elem);
				}
			}
			return;
		}
		let tgClick = this.targetCell.click(spr,x,y,this.w,this.h);
		if(tgClick ){
			let top = this.targetCell.top(tgClick[2]);
			
			let ttop = this[tmpClickAt[0]].top(tmpClickAt[1][2]);
			let ttop_num = ttop[0];
			let ttop_type = ttop[1];

			let isLengthOne = (tmpClickAt[1][0] - tmpClickAt[1][1]) == 1;
			
			if((top && top[0] + 1 == ttop_num && top[1] == ttop_type || !top && ttop_num == 0) && isLengthOne){
				let elem = this[tmpClickAt[0]].pop(tmpClickAt[1][2]);
				this.targetCell.push(tgClick[2],...elem);
				
			}
			return;
		}

	}
	render(ctx,sprite){
		ctx.clearRect(0,0,this.w,this.h);
		this.freeCell.render(ctx,this.w,this.h,sprite);
		this.targetCell.render(ctx,this.w,this.h,sprite);
		this.playfieldCell.render(ctx,this.w,this.h,sprite);
		if(this.clickAt[0] != "")
		this[this.clickAt[0]].highlight(
			ctx,this.w,this.h,sprite,
			this.clickAt[1][2],this.clickAt[1][1]
			);

	}
	static gameName = "FreecellSolitaire";
	static gameId = 'freecell';
	static displayName = "Free-Cell Solitaire";
	
	/*static showUi(){
		let ui = new UI();
		ui.addSelector(
			"Suit count : ",[
				{value : 1,text : "1"},
				{value : 2,text : "2"},
				{value : 4,text : "4"}
			]
		);	
		
		return ui;
	}*/
}
globalArrOfGameList.push(FreecellSolitaire);