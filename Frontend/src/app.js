import Header from '../src/materials/components/header/header.js';
export default class App {
	constructor() {
		new Header();

		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3004/api/products.json', false);

		try {
			xhr.send();
			if (xhr.status != 200) {
				console.log(`Error ${xhr.status}: ${xhr.statusText}`);
			} else {
				// console.log(xhr.response);
			}
		} catch (err) {
			console.log(err);
			alert('Falha ao carregar os dados.');
		}
	}
}

new App();
