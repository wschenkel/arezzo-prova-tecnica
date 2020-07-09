import Header from '../src/materials/components/header/header.js';
export default class App {
	constructor() {
		new Header();

		var responseProducts = this.getProducts();
		this.orderProducts('highest', responseProducts);

		const selOrder = document.getElementsByClassName('selOrderProducts')[0];
		selOrder.addEventListener('change', () => {
			this.orderProducts(selOrder.value, responseProducts);
		});
	}

	orderProducts(selValue, products) {
		switch (selValue) {
			case 'highest': // maior valor
				this.orderByhighest(products);
				break;
			case 'lowest': // menor valor
				this.orderByLowest(products);
				break;
			case 'orderly': // A-Z
				this.orderByOrderly(products);
				break;
			
			case 'inordinate': // Z-A
				console.log('A-Z');
				this.orderByInordinate(products);
				break;
			default:
				console.log(`Valor de ordenação não encontrado. ${selValue}`);
		}
	}

	orderByhighest(products) {
		const orderProducts = products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).reverse();	
		this.listBuilder(orderProducts);
	}

	orderByLowest(products) {
		const orderProducts = products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));		
		this.listBuilder(orderProducts);
	}

	orderByOrderly(products) { // A-Z
		const orderProducts = products.sort((a, b) => a.name.localeCompare(b.name));
		this.listBuilder(orderProducts);
	}

	orderByInordinate(products) { // Z-A
		const orderProducts = products.sort((a, b) => b.name.localeCompare(a.name));	
		this.listBuilder(orderProducts);
	}

	getProducts() {
        const xhr = new XMLHttpRequest();
		xhr.open('GET', `http://${window.location.host}/api/products.json`, false);

		try {
			xhr.send();
			if (xhr.status == 200) {
				const { products } = JSON.parse(xhr.response);
				return products;
			} else {
				console.log(`Error ${xhr.status}: ${xhr.statusText}`);
			}
		} catch (err) {
			console.log(err);
			alert('Falha ao carregar os dados.');
		}
	}

	listBuilder(listProducts) {
		const productContainer = document.getElementsByClassName('list-products')[0];
		
		let formatedProduct = '';
		listProducts.map((product) => {
			formatedProduct += this.productBuilder(product);
		});

		productContainer.innerHTML = '';
		productContainer.insertAdjacentHTML('beforeend', formatedProduct);
	}
	
	productBuilder(product) {
		const template = `<li>
			<a class="box-img" href="javascript:void(0);" title="${product.name}">
				<img src="${product.image}" alt="${product.name}"/>
			</a>
			<strong class="tt-product-name">
				<a href="javascript:void(0);" title="${product.name}">${product.name}</a>
			</strong>
			<strong class="tt-product-price">
				<a href="javascript:void(0);" title="Product">R$ ${product.price}</a>
			</strong>
		</li>`;

		return template;
	}
}

new App();
