function map(x,y,z,u,v){
	let t=(x-y)/(z-y);
	return (1-t)*u+t*v;
}
function clamp(x,y,z){
	if(x < y){
		return y;
	}
	if(x > z){
		return z;
	}
	return x;
}
function checkColor(cardType){
	return Math.floor(cardType / 2);
}
function card2dto1d(cardNumber,cardType){
	return cardType * 13 + cardNumber;
}
function card1dto2d(cardHash){
	return [cardHash % 13 , Math.floor(cardHash / 13)];
}