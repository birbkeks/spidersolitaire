class cardRenderer{
	static renderCard(sprite,x,y,size,cardNumber,cardType){
		if(cardType >= 4){
			return cardRenderer.renderBackface(sprite,x,y,size);	
		}
		let actualImageNumber = cardNumber;//(cardNumber + 13 - 1) % 13;
		let actualCardType = (cardType + 1) % 4;
		let ratio = sprite.getRatio();
		let retW = size;
		let retH = size / ratio;

		return [...sprite.getSprite(actualImageNumber,actualCardType) ,x,y, retW,retH];
	}
	static renderEmpty(sprite,x,y,size){

		let ratio = sprite.getRatio();
		let retW = size;
		let retH = size / ratio;
		return [x,y, retW,retH];
	}
	static renderBackface(sprite,x,y,size){
		let ratio = sprite.getRatio();
		let retW = size;
		let retH = size / ratio;
		return [...sprite.getSprite(2,4),x,y,retW,retH];
	}

}