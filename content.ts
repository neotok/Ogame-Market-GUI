/// <reference path="node_modules/@types/chrome/index.d.ts"/>

const tauxArray: number[] = [2, 1.5, 1];
const debugEnabled: boolean = true;

const ressType: string[] = [
	"Métal",
	"Cristal",
	"Deutérium"
];

class ships {

}
const shipArray: string[] = [
	"Chasseur léger",
	"Chasseur lourd",
	"Croiseur",
	"Vaisseau de bataille",
	"Traqueur",
	"Bombardier",
	"Destructeur",
	"Étoile de la mort",
	"Faucheur",
	"Éclaireur",
	"Petit transporteur",
	"Grand transporteur",
	"Vaisseau de colonisation",
	"Recycleur",
	"Sonde d`espionnage",
	"Satellite solaire",
	"Foreuse"];


const priceShipArray = {
	"Chasseur léger": [3000, 1000, 0],
	"Chasseur lourd": [6000, 4000, 0],
	"Croiseur": [20000, 7000, 2000],
	"Vaisseau de bataille": [45000, 15000, 0],
	"Traqueur": [30000, 40000, 15000],
	"Bombardier": [50000, 25000, 15000],
	"Destructeur": [60000, 50000, 15000],
	"Étoile de la mort": [5000000, 4000000, 1000000],
	"Faucheur": [85000, 55000, 20000],
	"Éclaireur": [8000, 15000, 8000],
	"Petit transporteur": [2000, 2000, 0],
	"Grand transporteur": [6000, 6000, 0],
	"Vaisseau de colonisation": [10000, 20000, 10000],
	"Recycleur": [10000, 6000, 2000],
	"Sonde d`espionnage": [0, 1000, 0],
	"Satellite solaire": [0, 2000, 500],
	"Foreuse": [2000, 2000, 1000]
}

/*
functions
*/
function getPriceShipMetal(ship) {
	return priceShipArray[ship][0];
}
function getPriceShipCristal(ship) {
	return priceShipArray[ship][1];
}
function getPriceShipDeut(ship) {
	return priceShipArray[ship][2];
}
function getUSM() {
	console.log('tauxArray', tauxArray);
}



function getTaux(): number[] {
	var localTaux: string = localStorage.getItem('taux');
	if (localTaux) {
		let splited: number[] = Array.from(localTaux.split(':')).map(item => Number(item));
		return splited;
	} else {
		return tauxArray;
	}


}
function setTaux(metal, cristal, deut) {
	localStorage.setItem('taux', [metal, cristal, deut].join(':'));
}
function removeTaux() {
	localStorage.removeItem('taux');
}
getUSM();


function nFormatter(num, digits) {
	if (num == 0)
		return '-';
	var si = [
		{ value: 1, symbol: "" },
		{ value: 1E3, symbol: "k" },
		{ value: 1E6, symbol: "M" },
		{ value: 1E9, symbol: "G" },
		{ value: 1E12, symbol: "T" },
		{ value: 1E15, symbol: "P" },
		{ value: 1E18, symbol: "E" }
	];
	var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

/*
/functions
*/







function transfo(strings, ...values) {
	let str = '';
	strings.forEach((string, i) => {
		if (values[i]) str += string + values[i];
	});
	return str;
}
if (document.querySelectorAll('#marketplacecomponent .items .item')) {
	initSuperMarket();
}
function initSuperMarket() {
	let items = document.querySelectorAll('#marketplacecomponent .items .item');
	let itemsHeader = document.querySelector('#marketplacecomponent .content-wrapper .head');

	if (itemsHeader && itemsHeader.querySelector('.marketHeaderDetails'))
		itemsHeader.querySelector('.marketHeaderDetails').remove();

	let itemsHeaderBlock = document.createElement("div");
	if (itemsHeader && itemsHeaderBlock) {
		itemsHeaderBlock.classList.add('marketHeaderDetails');
		itemsHeaderBlock.innerHTML = "détails [" + getTaux()[0] + ":" + getTaux()[1] + ":" + getTaux()[2] + "]";
		let editIcon = chrome.runtime.getURL('images/edit.svg');
		itemsHeaderBlock.innerHTML += '<object id="iconEdit" type="image/svg+xml" data="' + editIcon + '"></object>';
		itemsHeader.appendChild(itemsHeaderBlock);
		var settings = itemsHeader.querySelector('#iconEdit');
		console.log('settings', settings);
		settings.addEventListener("click", tauxSetting);
	}
	function tauxSetting() {
		console.log('here');
	}
	items.forEach((item) => {
		var itemType = item.querySelector('.details h3');
		var itemTypeStr: string = itemType.textContent;

		var itemPriceElement: HTMLElement = item.querySelector('.details .quantity');
		var itemPriceStr: number = parseInt(itemPriceElement.textContent.replace(/\./g, ''));

		var wantedTypeElement: HTMLElement = item.querySelector('.price h3');
		var wantedTypeStr: string = wantedTypeElement.textContent;

		var wantedPrice = item.querySelector('.price .quantity');
		var wantedPriceStr:number = parseInt(wantedPrice.textContent.replace(/\./g, ''));

		let infoBox = document.createDocumentFragment();
		let infoBoxDiv = document.createElement("div");
		infoBoxDiv.classList.add('marketDetails');
		//ressource VS ressource
		//on affiche le taux
		if (ressType.includes(itemTypeStr)) {
			let taux: number = parseFloat((itemPriceStr / wantedPriceStr).toFixed(2));
			var newH3 = document.createElement('h3');
			newH3.textContent = "taux";
			infoBoxDiv.appendChild(newH3);

			var newP = document.createElement('p');
			newP.classList.add("taux");
			if (taux >= 1) {
				newP.textContent = taux + ' ' + itemTypeStr + ' = 1 ' + wantedTypeStr;
			}
			else {
				taux = parseFloat((wantedPriceStr / itemPriceStr).toFixed(2));
				newP.textContent = '1 ' + itemTypeStr + ' = ' + taux + wantedTypeStr;
			}

			infoBoxDiv.appendChild(newP);
		}
		if (shipArray.includes(itemTypeStr)) {
			let currentMetal = '50000';
			let currentCristal = '20000';
			let currentDeut = '2000';

			let shipPriceMetal = getPriceShipMetal(itemTypeStr);
			let shipPriceCristal = getPriceShipCristal(itemTypeStr);
			let shipPriceDeut = getPriceShipDeut(itemTypeStr);


			var usm_real = parseInt(shipPriceMetal + shipPriceCristal * (tauxArray[0] / tauxArray[1]) + shipPriceDeut * (tauxArray[0] / tauxArray[2]));
			var usm_real_str = nFormatter(parseInt(shipPriceMetal + shipPriceCristal * (tauxArray[0] / tauxArray[1]) + shipPriceDeut * (tauxArray[0] / tauxArray[2])),1);
			
			let localTaux:number;
			if(wantedTypeStr == "Métal")
				localTaux = tauxArray[0];

			if(wantedTypeStr == "Cristal")
				localTaux = tauxArray[1];

			if(wantedTypeStr == "Deutérium")
				localTaux = tauxArray[2];
			
			var ship_buyable:number = ( wantedPriceStr / localTaux * tauxArray[0] / usm_real);
			

			var metal_real = nFormatter(shipPriceMetal, 1);
			var cristal_real = nFormatter(shipPriceCristal, 1);
			var deut_real = nFormatter(shipPriceDeut, 1);

			let metal_wanted = nFormatter((shipPriceMetal * ship_buyable)/itemPriceStr,1);
			let cristal_wanted = nFormatter((shipPriceCristal * ship_buyable)/itemPriceStr,1);
			let deut_wanted = nFormatter((shipPriceDeut * ship_buyable)/itemPriceStr,1);

			var usm_wanted = ((parseInt(metal_wanted) + parseInt(cristal_wanted) * (tauxArray[0] / tauxArray[1]) + parseInt(deut_wanted) * (tauxArray[0] / tauxArray[2]))*1000);
			var usm_wanted_str = nFormatter(usm_wanted,1);
			var message = transfo`
			<table class="detailsTable">
				<tbody>
					<tr>
						<th colspan="3">
						<div>
							Prix réel <span class="usm">USM: <span class="value">${usm_real_str}</span></span>
						</div>
						</th>
					</tr>
					<tr>
						<td class="metal">M : <span class="value">${metal_real}</span></td>
						<td class="cristal">C : <span class="value">${cristal_real}</span></td>
						<td class="deut">D : <span class="value">${deut_real}</span></td>
					</tr>
					<tr>
						<th colspan="3">
						<div>
							Prix demandé <span class="usm">USM: <span class="value">${usm_wanted_str}</span></span>
						</div>
						</th>
					</tr>
						<tr>
						<td class="metal">M : ${metal_wanted}</td>
						<td class="cristal">C : ${cristal_wanted}</td>
						<td class="deut">D : ${deut_wanted}</td>
					</tr>
			  	</tbody>
			</table>`;
			infoBoxDiv.innerHTML = message;
		}
		//inject new element 
		infoBox.appendChild(infoBoxDiv);
		item.appendChild(infoBox);
	});
}

class marketTool {

	private rawURL: URL;
	private page: string;

	constructor() {

		this.rawURL = new URL(window.location.href);
		this.page = this.rawURL.searchParams.get('component') || this.rawURL.searchParams.get('page');

		this.main()
	}

	private main() {
		console.log('this.page', this.page);
	}

}

let market = new marketTool();
