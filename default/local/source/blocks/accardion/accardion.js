"use strict";
function accordion() {
	const titles = document.querySelectorAll('.accordion__item-title');
	const contents = document.querySelectorAll('.accordion__content');

	titles.forEach(item => item.addEventListener('click', () => {
		const activeContent = document.querySelector('#' + item.dataset.tab);

		if (activeContent.classList.contains('active')) {
			activeContent.classList.remove('active');
			item.classList.remove('active');
			activeContent.style.maxHeight = 0;
		} else {
			contents.forEach(element => {
				element.classList.remove('active');
				element.style.maxHeight = 0;
			});

			titles.forEach(element => element.classList.remove('active'));

			item.classList.add('active');
			activeContent.classList.add('active');
			activeContent.style.maxHeight = activeContent.scrollHeight + 'px';
		}
	}));
	//Если нужно чтобы сразу была открыта один
	document.querySelector('[data-tab="tab-4"]').classList.add('active');
	document.querySelector('#tab-4').classList.add('active');
	document.querySelector('#tab-4').style.maxHeight = document.querySelector('#tab-4').scrollHeight + 'px';
}
accordion();