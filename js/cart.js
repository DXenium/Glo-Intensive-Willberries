const cart = ()=> {
	const cartBtn = document.querySelector('.button-cart');
	const cart = document.getElementById('modal-cart');
	const cartCloseBtn = cart.querySelector('.modal-close');
	const goodsContainer = document.querySelector('.long-goods-list');
	const cartTable =document.querySelector('.cart-table__goods');
	const modalForm = document.querySelector('.modal-form');

	const deleteCartItem = (id)=>{
		const cart = JSON.parse(localStorage.getItem('cart'))

		const newCart = cart.filter(good=>{
			return good.id !== id
		})

		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
		updateTotalPrice(newCart);
	}

	const plusCartItem = (id)=>{
		const cart = JSON.parse(localStorage.getItem('cart'))

		const newCart = cart.map(good=>{
			if (good.id === id){
				good.count++
			}
			return good
		})

		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
		updateTotalPrice(newCart);
	}

	const minusCartItem = (id)=>{
		const cart = JSON.parse(localStorage.getItem('cart'))

		const newCart = cart.map(good=>{
			if (good.id === id){
				if(good.count > 0){
					good.count--
				}
			}
			return good
		})

		localStorage.setItem('cart', JSON.stringify(newCart))
		renderCartGoods(JSON.parse(localStorage.getItem('cart')))
		updateTotalPrice(newCart);
	}

	// Функция для расчета общей суммы корзины
	const calculateTotalPrice = (goods) => {
		return goods.reduce((total, good) => {
		return total + (good.price * good.count);
		}, 0);
	};

	// Функция для обновления отображения общей суммы
	const updateTotalPrice = (goods) => {
		const totalPriceElement = document.querySelector('.card-table__total');
		if (totalPriceElement) {
			const totalPrice = calculateTotalPrice(goods);
			totalPriceElement.textContent = `${totalPrice}$`;
		}
	};

	const addToCart = (id)=>{
		const goods = JSON.parse(localStorage.getItem('goods'));
		const clickedGood = goods.find(good => good.id === id);
		const cart =localStorage.getItem('cart') ?
			JSON.parse(localStorage.getItem('cart')):[]

		if(cart.some(good=>good.id === clickedGood.id)){
			cart.map(good=>{
				if (good.id === clickedGood.id){
					good.count++
				}
				return good
			})
		} else {
			clickedGood.count = 1
			cart.push(clickedGood)
		}

		localStorage.setItem('cart', JSON.stringify(cart))
	}

	const renderCartGoods = (goods) =>{
		cartTable.innerHTML = ''

		goods.forEach(good => {
			const tr = document.createElement('tr')
			tr.innerHTML =`
				<td>${good.name}</td>
				<td>${good.price}$</td>
				<td><button class="cart-btn-minus"">-</button></td>
				<td>${good.count}</td>
				<td><button class="cart-btn-plus"">+</button></td>
				<td>${+good.price * +good.count}$</td>
				<td><button class="cart-btn-delete"">x</button></td>
			`
			cartTable.append(tr)

			tr.addEventListener('click', (event)=>{
				if(event.target.classList.contains('cart-btn-minus')){
					minusCartItem(good.id)
				} else if (event.target.classList.contains('cart-btn-plus')){
					plusCartItem(good.id)
				} else if (event.target.classList.contains('cart-btn-delete')){
					deleteCartItem(good.id)
				}
			})
		})
		updateTotalPrice(goods);
	}

	const sendForm = ()=> {
		const nameInput = modalForm.querySelector('input[name="nameCustomer"]');
   		const phoneInput = modalForm.querySelector('input[name="phoneCustomer"]');

		if (!nameInput.value.trim() || !phoneInput.value.trim()) {
			alert('Пожалуйста, заполните все поля');
			return;
		}
		const cartArray =localStorage.getItem('cart') ?
			JSON.parse(localStorage.getItem('cart')):[]

		const formData = {
			cart: cartArray,
			name: nameInput.value,
			phone: phoneInput.value
		};

		fetch('https://jsonplaceholder.typicode.com/posts', {
			method:'POST',
			body: JSON.stringify(formData),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(()=>{
			localStorage.removeItem('cart');
			cart.style.display = '';
			renderCartGoods([]);
			modalForm.reset();
		}).catch(error => {
			console.error('Ошибка при отправке формы:', error);
		});
	}

	modalForm.addEventListener('submit', (e)=>{
		e.preventDefault()
		sendForm()
	})

	cartBtn.addEventListener('click', ()=>{
		const cartArray =localStorage.getItem('cart') ?
			JSON.parse(localStorage.getItem('cart')):[]

		renderCartGoods(cartArray);
		updateTotalPrice(cartArray);
		cart.style.display = 'flex';
	})

	cartCloseBtn.addEventListener('click', ()=>{
		cart.style.display = ''
	})

	cart.addEventListener('click', (event)=>{
		if(!event.target.closest('.modal') && event.target.classList.contains('overlay')){
			cart.style.display = '';
		}
	})

	window.addEventListener('keydown', (e)=>{
		if(e.key === 'Escape'){
			cart.style.display = '';
		}
	})

	if(goodsContainer){
		goodsContainer.addEventListener('click', (event)=>{
			if(event.target.closest('.add-to-cart')){
				const buttonToCart = event.target.closest('.add-to-cart')
				const goodId = buttonToCart.dataset.id;

				addToCart(goodId)
			}
		})
	}
}

cart()
