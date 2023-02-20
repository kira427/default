function ModalPopUp() {
	const openPopUp = document.querySelector('.js-pop-up-btn-open');
	const closePopUp = document.querySelector('.js-pop-up-btn-close');
	const popUp = document.querySelector('.js-pop-up');
	const popUpContainer = document.querySelector('.js-pop-up-container');

	openPopUp.addEventListener('click', function (e) {
		e.preventDefault();
		popUp.classList.add('active')
	})

	closePopUp.addEventListener('click', function () {
		popUp.classList.remove('active')
	})

	popUp.addEventListener('click', (e) => {
		if (e.target == popUp) {
			popUp.classList.remove('active');
		}
	})
	popUpContainer.addEventListener('click', (e) => {
		if (e.target == popUpContainer) {
			popUp.classList.remove('active');
		}
	})
}
ModalPopUp();function ModalPopUp() {
	const openPopUp = document.querySelector('.js-pop-up-btn-open');
	const closePopUp = document.querySelector('.js-pop-up-btn-close');
	const popUp = document.querySelector('.js-pop-up');
	const popUpContainer = document.querySelector('.js-pop-up-container');

	openPopUp.addEventListener('click', function (e) {
		e.preventDefault();
		popUp.classList.add('active')
	})

	closePopUp.addEventListener('click', function () {
		popUp.classList.remove('active')
	})

	popUp.addEventListener('click', (e) => {
		if (e.target == popUp) {
			popUp.classList.remove('active');
		}
	})
	popUpContainer.addEventListener('click', (e) => {
		if (e.target == popUpContainer) {
			popUp.classList.remove('active');
		}
	})
}
ModalPopUp();

