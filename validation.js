var xmlhttp = new XMLHttpRequest(); 
var url = ''; //webservice link

var validStringRegEx = /^[^\\\/&]*$/;
var validDoubleRegEx = /^\d+.?\d*$/;
var errorList = new Array();

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        //quando o webservice for devidamente chamado, substituir a variável 'obj' por 'myArr'
        //validate(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

var obj = JSON.parse('[{ "sku": "BATMAN-123", "price": "122,99", "name": "Batmobile", "description": "Superhero Car", "size": ["V8", "V12", "V16"], "brand": "Bruce Wayne", "categories": ["Super Heroes", "Flying Cars", "Cars"], "product_image_url": "cdn.gfg.com.br/batmobile.jpg", "special_price": "11.22" }, {"sku": "SPD-99", "price": "1992.99", "name": "Spiderman Suit", "description": "Fancy suit for Spidermen", "size": ["34", "35"], "brand": "Peter Parker", "categories": ["Super Heroes", "Spiderman", "Clothes"], "product_image_url": "http://cdn.gfg.com.br/spider-suite.jpg" }, { "sku": "KRYPT-123", "price": "122.99", "name": "Kryptonite", "description": "Anti Superman material", "size": ["22", "23", "24"], "brand": "Lex Luthor", "categories": ["Super Heroes", "Superman", "Accessories"], "product_image_url": "http://cdn.gfg.com.br/kryptonite.jpg", "special_price": "0.99" }, { "sku": "BATMAN-001", "price": "12323.99", "name": "Batman Suit", "description": "Comfortable Suit for hunt evil criminals", "size": ["38", "39", "40", "41"], "brand": "Bruce Wayne", "categories": ["Super Heroes", "Clothes", "Batman"], "product_image_url": "batman-suite" }, { "sku": "SPD-334", "price": "1.99", "name": "Spidernet refill set", "description": "To refill your net capabilities", "size": "single", "brand": "Peter Parker", "categories": ["Super Heroes", "Spiderman", "Accessories"], "product_image_url": "http://cdn.gfg.com.br/spiderman/spidernet.jpg", "special_price": "1" }]');

function isValidURL(str) {

	if (str.substring(0, 4) != "http") str = "http://" + str;

    var pattern = new RegExp('^((https?:)?\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

function addToErrorList(productId, property) {
	var message = "obj[" + productId + "]." + property + " INVALIDO";

	if (errorList[productId] == null) {
		errorList.push(message)
	} else {
		errorList[productId] = errorList[productId] + " - " + message;
	}
}

function checkPrice(productId) {
	var valid = obj[productId].price.match(validDoubleRegEx);

	if (!valid) 
		addToErrorList(productId, "price");
}

function checkSize(productId) {
	var valid = true;

	if (typeof(obj[productId].size) == "string") {
		valid = obj[productId].size.match(validStringRegEx);
	} else {
		for (var j in obj[productId].size) {
			if (!obj[productId].size[j].match(validStringRegEx)) {
				valid = false;
				break;
			}
		}
	}

	if (!valid) 
		addToErrorList(productId, "size");
}

function checkCategories(productId) {
	var valid = true;

	for (var i in obj[productId].categories) {
		if (!obj[productId].categories[i].match(validStringRegEx)) {
			valid = false;
			break;
		}
	}

	if (!valid) 
		addToErrorList(productId, "categories");
}

function checkProductImageUrl(productId) {
	var valid = isValidURL(obj[productId].product_image_url);

	if (!valid)
		addToErrorList(productId, "product_image_url");
}

function checkSpecialPrice(productId) {

	var valid = obj[productId].special_price == null || obj[productId].special_price.match(validDoubleRegEx);

	if (!valid) 
		addToErrorList(productId, "special_price");
}

function checkStringPropriety(productId, propriety) {
	var valid = obj[productId][propriety].match(validStringRegEx);

	if (!valid) 
		addToErrorList(productId, propriety);
}

function validate(obj) {
	for (var i in obj) {
		checkStringPropriety(i, "sku");
		checkPrice(i);
		checkStringPropriety(i, "name");	
		checkStringPropriety(i, "description");
		checkSize(i);
		checkStringPropriety(i, "brand");
		checkCategories(i);
		checkProductImageUrl(i);
		checkSpecialPrice(i);
	}
}

validate(obj);

document.getElementById("demo").innerHTML = (errorList.length != 0) ? " ERROS ENCONTRADOS: " + errorList : "JSON Válido";
