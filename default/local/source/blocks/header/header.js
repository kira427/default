"use strict"

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};
if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener('click', function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			})
		}
	}
} else {
	document.body.classList.add('_pc');
}

//--Меню бургер----
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener('click', function () {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	})
}

//--Прокрутка при клике--
// const anchors = document.querySelectorAll('a[href*="#"]');
// for ( let anchor of anchors ) {
// 	anchor.addEventListener('click', function (event) {
// 		event.preventDefault();
// 		const blockId = anchor.getAttribute('href')
// 		document.querySelector('' + blockId).scrollIntoView({
// 			behavior: "smooth",
// 			block: "start"
// 		})
// 	})
// }
const menuLincks = document.querySelectorAll('.menu__link[data-goto]');

if (menuLincks.length > 0) {
	menuLincks.forEach(menuLinck => {
		menuLinck.addEventListener('click', onMenuLinckClick);
	});


	function onMenuLinckClick(e) {
		const menuLinck = e.target;
		if (menuLinck.dataset.goto && document.querySelector(menuLinck.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLinck.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;
			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			// onMenuLinckClick.scrollIntoView({
			// 	behavior: "smooth",
			// 	top: gotoBlockValue
			// })
			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}
