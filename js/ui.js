class UI{
	constructor(){
		this.titleText = [];
		this.elementList = [];

	}
	addSelector(title,listOfOptions){
		// List of options format = 
		// [{value : value to get , text : description about choice},...]
		let baseElem = document.createElement("select");
		
		for(let i of listOfOptions){
			let optionElem = document.createElement("option");
			optionElem.value = i.value;
			optionElem.innerText = i.text;
			baseElem.appendChild(optionElem);
		}
		
		return this.addElement(title,baseElem);


	}
	addElement(t,e){
		this.titleText.push(t);
		this.elementList.push(e);
		return this;
	}
	display(elementToBind){
		elementToBind.innerHTML = "";
		if(this.elementList.length == 0)elementToBind.innerHTML = "No settings";
		for(let i in this.elementList){
			let labelNode = document.createElement("label");
			
			labelNode.innerHTML = this.titleText[i];
			labelNode.appendChild(this.elementList[i]);
			elementToBind.appendChild(labelNode);
		}
		return this;
	}
	getValues(){
		let arr = [];
		for(let i of this.elementList){
			arr.push(i.value);
		}
		return arr;
	}

}