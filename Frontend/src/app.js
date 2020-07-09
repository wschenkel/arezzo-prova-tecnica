import Header from '../src/materials/components/header/header.js';
export default class App {
	constructor() {
		new Header();

		var responseProducts = this.getProducts();
		const arrProducts = {
			products: responseProducts,
			total: responseProducts.length,
			pages: Math.ceil(responseProducts.length / 24),
			perPage: 24,
			currentPage: 1,
			previousPage: 1,
			nextPage: 2,
			initialSlice: 0,
			finalSlice: 24
		}

		// Initialize ordenation by price.
		this.orderProducts('highest', arrProducts);
		this.createPagination(arrProducts);
		
		this.initializeEvents(arrProducts);
	}

	initializeEvents(arrProducts) {
		// Select
		const selOrder = document.getElementsByClassName('selOrderProducts')[0];
		selOrder.addEventListener('change', () => {
			arrProducts.currentPage = 1;
			arrProducts.nextPage = 2;
			arrProducts.previousPage = 1;
			arrProducts.initialSlice = 0;
			arrProducts.finalSlice = 24;
			this.setAnchorActive(arrProducts);
			this.orderProducts(selOrder.value, arrProducts);
		});

		// Pagination
		document.querySelectorAll('.page-anchor').forEach(page => {
			page.addEventListener('click', event => {
				let page = event.target.getAttribute('data-page');
				this.changePage(page, arrProducts);
				this.setAnchorActive(arrProducts);
			});
		});

		const btnPrevious = document.getElementsByClassName('btn-previous-page')[0];
		btnPrevious.addEventListener('click', () => {
			this.changePage(arrProducts.previousPage, arrProducts);
			this.setAnchorActive(arrProducts);
		});

		const btnNext = document.getElementsByClassName('btn-next-page')[0];
		btnNext.addEventListener('click', () => {
			this.changePage(arrProducts.nextPage, arrProducts);
			this.setAnchorActive(arrProducts);
		});
	}

	setAnchorActive(arrProducts) {

		document.querySelectorAll('.page-anchor').forEach(anchor => {
			anchor.classList.remove('active');
			if (anchor.getAttribute('data-page') == arrProducts.currentPage) {
				anchor.classList.add('active');
			}
		});

		if (arrProducts.pages === arrProducts.currentPage) {
			document.getElementsByClassName('btn-next-page')[0].classList.add('blocked');
		} else {
			document.getElementsByClassName('btn-next-page')[0].classList.remove('blocked');
		}

		if (arrProducts.currentPage === arrProducts.previousPage) {
			document.getElementsByClassName('btn-previous-page')[0].classList.add('blocked');
		} else {
			document.getElementsByClassName('btn-previous-page')[0].classList.remove('blocked');
		}	
	}

	changePage(page, arrProducts) {

		arrProducts.currentPage = parseInt(page, 10);
		if (page === 1) {
			arrProducts.initialSlice = 0;
			arrProducts.finalSlice = arrProducts.perPage;
			arrProducts.nextPage = page + 1;
			arrProducts.previousPage = page;
		} else {
			arrProducts.initialSlice = (page * arrProducts.perPage) - arrProducts.perPage;
			
			let finalSlice = page * arrProducts.perPage;
			arrProducts.finalSlice = finalSlice;
			if (finalSlice > arrProducts.total) {
				arrProducts.finalSlice = arrProducts.total;
			}	

			arrProducts.previousPage = parseInt(page) - 1;
			if ((parseInt((page)) - 1) === 0) {
				arrProducts.previousPage = 1;
			}

			arrProducts.nextPage = parseInt(page) + 1;
			if ((parseInt((page)) + 1) > arrProducts.pages) {
				arrProducts.nextPage = parseInt(arrProducts.pages, 10);
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
            	<a data-page="${i}" class="page-anchor ${ arrProducts.currentPage == i ? 'active' : ''}" href="javascript:void(0);">${i}</a>
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
		xhr.open('GET', `https://arezzo-frontend-test.netlify.app/api/products.json`, false);

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
