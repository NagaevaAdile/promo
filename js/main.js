document.addEventListener('DOMContentLoaded', () => {

    const getData = (url, callback) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.addEventListener('readystatechange', () => {
            if (request.readyState !== 4) return;
            if (request.status === 200) {
                const response = JSON.parse(request.response);
                callback(response);
            } else {
                console.error(new Error('Error: ' + request.status));
            }
        })
    }

    const tabs = () => {
        const cardDetailChange = document.querySelectorAll('.card-detail__change');
        const cardDetailsTitle = document.querySelector('.card-details__title');
        const cardImageItem = document.querySelector('.card__image_item');
        const cardDetailsPrice = document.querySelector('.card-details__price');
        const descriptionMemory = document.querySelector('.description__memory');

        const phone = [{
                name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
                img: 'img/iPhone-graphite.png',
                price: 95990,
                memoryROM: 128
            },
            {
                name: 'Смартфон Apple iPhone 12 Pro 256GB Silver',
                img: 'img/iPhone-silver.png',
                price: 110990,
                memoryROM: 256
            },
            {
                name: 'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
                img: 'img/iPhone-blue.png',
                price: 99990,
                memoryROM: 128
            }
        ];

        const deactive = () => {
            cardDetailChange.forEach(btn => btn.classList.remove('active'))
        };

        cardDetailChange.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                if (!btn.classList.contains('active')) {
                    deactive();
                    btn.classList.add('active');

                    cardDetailsTitle.textContent = phone[i].name;
                    cardImageItem.src = phone[i].img;
                    cardImageItem.alt = phone[i].name;
                    cardDetailsPrice.textContent = phone[i].price + '₽';
                    descriptionMemory.textContent = `Встроенная память (ROM) ${phone[i].memoryROM} ГБ`
                }
            });
        });
    };

    const accordion = () => {
        const characteristicsList = document.querySelector('.characteristics__list');
        const characteristicsItem = document.querySelectorAll('.characteristics__item');

        const open = (button, dropDown) => {
            closeAllDrops();
            dropDown.style.height = `${dropDown.scrollHeight}px`
            button.classList.add('active');
            dropDown.classList.add('active');
        };

        const close = (button, dropDown) => {
            button.classList.remove('active');
            dropDown.classList.remove('active');
            dropDown.style.height = '';
        };

        const closeAllDrops = (button, dropDown) => {
            characteristicsItem.forEach((element) => {
                if (element.children[0] !== button && element.children[1] !== dropDown) {
                    close(element.children[0], element.children[1]);
                }
            })
        };

        characteristicsList.addEventListener('click', e => {
            const target = e.target;

            if (target.classList.contains('characteristics__title')) {
                const parent = target.closest('.characteristics__item');
                const description = parent.querySelector('.characteristics__description');
                description.classList.contains('active') ?
                    close(target, description) :
                    open(target, description);
            }
        });

        document.body.addEventListener('click', e => {
            const target = e.target;
            if (!target.closest('.characteristics__list')) {
                closeAllDrops();
            }
        })
    };

    const modal = () => {
        const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
        const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
        const modal = document.querySelector('.modal');
        const cardDetailsTitle = document.querySelector('.card-details__title');
        const modalTitle = document.querySelector('.modal__title');
        const modalSubtitle = document.querySelector('.modal__subtitle');
        const modalTitleSubmit = document.querySelector('.modal__title-submit');


        const openModal = e => {
            const target = e.target;
            modal.classList.add('open');

            modalTitle.textContent = cardDetailsTitle.textContent;
            modalTitleSubmit.value = cardDetailsTitle.textContent;
            modalSubtitle.textContent = target.dataset.btnBuy;
        }

        const closeModal = () => {
            modal.classList.remove('open');
        }

        modal.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('modal__close') || target === modal) {
                closeModal();
            }
        })

        cardDetailsButtonBuy.addEventListener('click', openModal);
        cardDetailsButtonDelivery.addEventListener('click', openModal);
    }

    const renderCrossSell = () => {
        const crossSellList = document.querySelector('.cross-sell__list');
        const crossSellAdd = document.querySelector('.cross-sell__add');
        const allGoods = [];
        const shuffle = arr => arr.sort(() => Math.random() - 0.5);

        const createCrossSellItem = good => {
            const liItem = document.createElement('li');

            const {
                photo,
                name,
                price
            } = good;

            liItem.innerHTML = `
                <article class="cross-sell__item">
					<img class="cross-sell__image" src="${photo}" alt="${name}">
					<h3 class="cross-sell__title">${name}</h3>
					<p class="cross-sell__price">${price}₽</p>
					<button type="button" class="button button_buy cross-sell__button">Купить</button>
				</article>
            `;
            return liItem;
        };

        const render = arr => {
            arr.forEach(item => {
                crossSellList.append(createCrossSellItem(item));
            })
        };

        const createCrossSellList = (goods = []) => {
            allGoods.push(...shuffle(goods))
            const fourItems = allGoods.splice(0, 4);
            render(fourItems);
        };

        crossSellAdd.addEventListener('click', () => {
            render(allGoods);
            crossSellAdd.remove();
        });

        getData('cross-sell-dbase/dbase.json', createCrossSellList)
    };



    const init = () => {
        tabs();
        accordion();
        modal();
        renderCrossSell();
        amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');
    }

    init();
})