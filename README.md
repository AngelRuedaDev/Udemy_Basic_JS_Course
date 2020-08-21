# Almuerzi

This was a basic project for an Udemy course. I worked on a basic website that allows you to login and then you can select a meal and it loads in `orders-list` showing up in the meal and the `user._id` that has ordered that meal.

## API and MongoDB

I used MongoDB to store the information about Meals, Orders and Users. To access to MongoDB I made a basic API to get and post the information.

### Meals
> * `GET: /` : get all the meals.
> * `GET: /:id` : get an especific meal.
> * `POST: /` : post a meal object.
> * `PUT: /:id` : update the specified meal.
> * `DELETE: /:id` : delete the speecified meal.

### Orders
> * `GET: /` : get all the orders.
> * `GET: /:id` : get an especific order.
> * `POST: /` : post a order object.
> * `PUT: /:id` : update the specified order.
> * `DELETE: /:id` : delete the speecified order.

### Auth
> * `POST: /register` : register a user.
> * `POST: /login` : login as a user, if it is not in the database it will show up an error.
> * `GET: /me` : get the information about the user that you are logged in.
