class Element{
	_name; // protected
	constructor(name){
		this._name = name;
		document.getElementById(name).style.position = "absolute";
		document.getElementById(this.name).style.left = "0px";
		document.getElementById(this.name).style.top = "0px";
	}
	get name(){
		return this._name;
	}
	set name(value){
		document.getElementById(this._name).id = value;
		this._name = value;
	}
	get x(){
		let left = document.getElementById(this.name).style.left;
		return left.length >= 3 ? parseInt(left.substr(0, left.length - 2)) : undefined;
	}
	set x(value){
		document.getElementById(this.name).style.left = value + "px";
	}
	get y(){
		let top = document.getElementById(this.name).style.top;
		return top.length >= 3 ? parseInt(top.substr(0, top.length - 2)) : undefined;
	}
	set y(value){
		document.getElementById(this.name).style.top = value + "px";
	}
}

class Text extends Element{
	constructor(name, text = ""){
		let elem = document.createElement("div");
		elem.id = name;
		document.getElementById("base").appendChild(elem);
		super(name);
		this.text = text;
	}
	get text(){
		return document.getElementById(this.name).innerText;
	}
	set text(value){
		document.getElementById(this.name).innerText = value;
	}
	get color(){
		return document.getElementById(this.name).style.color;
	}
	set color(value){
		document.getElementById(this.name).style.color = value;
	}
}

class Button extends Element{
	constructor(name, text = "", displayed = true){
		let elem = document.createElement("input");
		elem.id = name;
		elem.type = "button";
		document.getElementById("base").appendChild(elem);
		super(name);
		this.text = text;
		this.displayed = displayed;
		this.onClicked = function(){};
	}
	get text(){
		return document.getElementById(this.name).value;
	}
	set text(value){
		document.getElementById(this.name).value = value;
	}
	get displayed(){
		return document.getElementById(this.name).style.display == "";
	}
	set displayed(value){
		document.getElementById(this.name).style.display
			= value ? "" : "none";
	}
	get onClicked(){
		return document.getElementById(this.name).onclick;
	}
	set onClicked(value){
		document.getElementById(this.name).onclick = value;
	}
}