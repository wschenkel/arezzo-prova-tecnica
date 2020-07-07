export default class Header {
    constructor() {
        const btnCollapse = document.getElementsByClassName('btn-collapse')[0],
        header = document.querySelector('header'),
        overlay = document.getElementsByClassName('overlay')[0],
        btnCloseCollapse = document.getElementsByClassName('btn-close-collapse')[0];

        btnCollapse.addEventListener('click', () => {
            header.classList.add('show');
            overlay.classList.add('show');
        });

        btnCloseCollapse.addEventListener('click', () => {
            header.classList.remove('show');
            overlay.classList.remove('show');
        });
    }
}
