export default class Main {
    constructor() {
        console.log('main');

        let xhr = new XMLHttpRequest();
		xhr.open('GET', `http://${window.location.host}/api/products.json`, false);

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
