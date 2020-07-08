import Header from '../src/materials/components/header/header.js';
import Main from '../src/materials/components/header/Main.js';
export default class App {
	constructor() {
		new Header();
		new Main();
	}
}

new App();
