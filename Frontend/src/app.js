import Header from '../src/materials/components/header/header.js';
export default class App {
	constructor() {
		new Header();

		var responseProducts = this.getProducts();
		
		const arrProducts = {
			products: responseProducts,
			total: responseProducts.length,
			pages: Math.ceil(responseProducts.length / 24),
			per_page: 24,
			current_page: 1,
			// next_page: 2,
			initialSlice: 0,
			finalSlice: 24
		}
		
		// Initialize ordenaiton by price.
		this.createPagination(arrProducts);
		this.orderProducts('highest', arrProducts);

		// Select
		const selOrder = document.getElementsByClassName('selOrderProducts')[0];
		selOrder.addEventListener('change', () => {
			arrProducts.current_page = 1;
			arrProducts.initialSlice = 0;
			arrProducts.finalSlice = 24;
			this.setAnchorActive(1);
			this.orderProducts(selOrder.value, arrProducts);
		});

		// Pagination
		document.querySelectorAll('.page-anchor').forEach(page => {
			page.addEventListener('click', event => {
				let page = event.target.getAttribute('data-page');
				this.setAnchorActive(page);
				this.changePage(page, arrProducts);
			});
		});
	}

	setAnchorActive(page) {
		document.querySelectorAll('.page-anchor').forEach(anchor => {
			anchor.classList.remove('active');
			if (anchor.getAttribute('data-page') == page) {
				anchor.classList.add('active');
			}
		});
	}

	changePage(page, arrProducts) {
		arrProducts.current_page = page;
		if (page === 1) {
			arrProducts.initialSlice = 0;
			arrProducts.finalSlice = arrProducts.per_page;
		} else {
			arrProducts.initialSlice = (page * arrProducts.per_page) - arrProducts.per_page;
			
			let finalSlice = page * arrProducts.per_page;
			if (finalSlice > arrProducts.total) {
				arrProducts.finalSlice = arrProducts.total;
			} else {
				arrProducts.finalSlice = finalSlice;
			}	
		}
		this.listBuilder(arrProducts);
	}

	createPagination(arrProducts) {
		const paginationContainer = document.getElementsByClassName('pagination-items')[0];
		
		var itemsBuilder = '';
		for (var i = 1; i <= arrProducts.pages; i++) {
			itemsBuilder += `
			<li>
            	<a data-page="${i}" class="page-anchor ${ arrProducts.current_page == i ? 'active' : ''}" href="javascript:void(0);">${i}</a>
        	</li>
			`;
		}
		paginationContainer.innerHTML = '';
		paginationContainer.insertAdjacentHTML('beforeend', itemsBuilder);
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

	orderByhighest(arrProducts) {
		arrProducts.products = arrProducts.products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).reverse();	
		this.listBuilder(arrProducts);
	}

	orderByLowest(arrProducts) {
		arrProducts.products = arrProducts.products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));		
		this.listBuilder(arrProducts);
	}

	orderByOrderly(arrProducts) { // A-Z
		arrProducts.products = arrProducts.products.sort((a, b) => a.name.localeCompare(b.name));
		this.listBuilder(arrProducts);
	}

	orderByInordinate(arrProducts) { // Z-A
		arrProducts.products = arrProducts.products.sort((a, b) => b.name.localeCompare(a.name));	
		this.listBuilder(arrProducts);
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

	listBuilder(arrProducts) {
		const productContainer = document.getElementsByClassName('list-products')[0];

		let formatedProduct = '';
		arrProducts.products.slice(arrProducts.initialSlice, arrProducts.finalSlice).map((product) => {
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
