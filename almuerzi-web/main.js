let mealsState = [];
let ruta = 'login' // login, register, orders
let user = {}

const stringToHTML = (s) =>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(s, 'text/html');
    return doc.body.firstChild;
}


const renderItem = (item) =>{
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`)
    element.addEventListener('click', () => {
        const mealsList = document.getElementById('meals-list');
        Array.from(mealsList.children).forEach(x => x.classList.remove('selected'));
        element.classList.add('selected');
        document.getElementById('meals-id').value = item._id;

    })
    return element

}

const renderOrder = (order, meals) =>{
    const meal = meals.find(meal => meal._id === order.meal_id);
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`);

    return element;
}

const initData = () =>{
    fetch('http://localhost:3000/api/meals')
        .then( response => response.json())
        .then(data =>{
            mealsState = data;
            const mealsList = document.getElementById('meals-list');
            const submit = document.getElementById("submit");
            const listItems = data.map(renderItem);

            mealsList.removeChild(mealsList.firstElementChild);
            listItems.forEach(element => mealsList.appendChild(element));
            submit.removeAttribute("disabled");

            fetch('http://localhost:3000/api/orders')
                .then(response => response.json())
                .then(ordersData => {
                    const ordersList = document.getElementById('orders-list');
                    const listOrders = ordersData.map(orderData => renderOrder(orderData, data));

                    ordersList.removeChild(ordersList.firstElementChild);
                    listOrders.forEach(x=> ordersList.appendChild(x))
                });


        })
}

const initForm = () => {
    const orderForm = document.getElementById('order');
    orderForm.onsubmit = (e) => {
        e.preventDefault();
        document.getElementById('submit').setAttribute('disabled', true);
        const mealID = document.getElementById('meals-id').value;
        if (!mealID){
            alert("You must select a meal!");
            document.getElementById('submit').removeAttribute('disabled');
            return
        }

        //object order
        const order = {
            meal_id: mealID,
            user_id: user._id,
        }
        const tokenOrder = localStorage.getItem('token');

        fetch('http://localhost:3000/api/orders',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: tokenOrder,
            },
            body: JSON.stringify(order),

        }).then(x=>x.json())
            .then(respuesta => {
                const renderedOrder = renderOrder(respuesta, mealsState);
                document.getElementById('orders-list').appendChild(renderedOrder);
                document.getElementById('submit').removeAttribute('disabled');
            });
    }
}

const renderApp = () => {
    const token = localStorage.getItem('token');
    if (token){
        user = JSON.parse(localStorage.getItem('user'));
        return renderOrders();
    }
    renderLogin();
}

const renderOrders = () => {

    const orderView = document.getElementById('orders-view');
    document.getElementById('app').innerHTML = orderView.innerHTML;

    initForm();
    initData();
}

const renderLogin = () =>{
    const loginTemplate =  document.getElementById('login-view');
    document.getElementById('app').innerHTML = loginTemplate.innerHTML

    const loginForm = document.getElementById('loginForm')
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/api/auth/login',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, password: password})
        }).then(x => x.json())
            .then(res => {
                localStorage.setItem('token', res.token);
                ruta = 'order'
                return res.token;
            }).then(token => {
                return fetch('http://localhost:3000/api/auth/me',{
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                })
            }).then(x => x.json())
            .then(fetchedUser => {
                user = fetchedUser;
                localStorage.setItem('user', JSON.stringify(fetchedUser));
                renderOrders();
            })

    }
}

window.onload = () =>{
    renderApp();


}