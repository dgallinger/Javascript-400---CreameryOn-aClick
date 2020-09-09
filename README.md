
## Creamery-On-A-Click
--------------------


`Node.js` is an open-source, cross-stage runtime condition based on Chrome's V8 JavaScript motor. It is utilized to manufacture quick, versatile server-side web applications. The occasion driven, non-blocking I/O display makes Node.js lightweight and effective. These highlights have propelled a great deal of engineers to embrace Node.js.


This project is `CreameryOn-AClick` is basically an online store, an e-commerce project based on NodeJS and Express for everyone’s favorite summer snack, ice cream. 


#### Task:


Our objective is to create an online dessert shopping experience for our clients. 
We will be handling user `authentication` and `authorization` based on the roles. 


**Customer:**

Customers can visit the webpage and browse through the options but will have to login to place an order. They can get the details of the orders they placed in the User Profile. 

Along with order-in options, they can create multiple wishlists to save their favorite product. All the wishlists will also be available in the user Profile. 


**Admin:**

An 'admin' will have full control on the webpage. He can add, edit or delete an item, retrieve all the orders placed.


#### Models:

Completed:

1.	Users: User and Admin information is added to database with Unique ID based on their roles.

2.	Items: Complete products information is stored in this table. This table contains the name, size and price of the item along with some item information. 

3.	Orders: Customer ordered product details is stored in this table. The order model will have the order ID, ID of the user who placed the order, the name and address of the recipient as well as the status and the date when the order was created. 

4. 	Wishlists: Customer can add their favorite items in a wishlist and save it for future reference. Item title and price will be stored in the wishlist. 


To create the orders and the wishlists, the items are first stored in a shopping or a wishlist cart using the `express-sessions` and then added to the mongoDB order / wishlist collections. 



![layout](models.png)
  

#### Routes: 
Some basic routes will be:

1. 	Login
		- Signup: POST /login/signup
		- Login: POST /login
		- Change Password POST /login/password

2.	Items (requires authentication)
		- Create: POST /items - restricted to users with the "admin" role
	    - Update an item: PUT /items/:id - restricted to users with the "admin" role
	    - Get all items: GET /items - open to all users even when no user has logged in. 
	    - Delete an item: DELETE//items/:id - restricted to users with the "admin" role

3.	Orders (requires authentication)
		- Create: POST /orders - open to all users. 
		Takes an array of item _id values (repeat values can appear). Order should be created with a total field with the total cost of all the items from the time the order is placed (as the item prices could change). The order should also have the userId of the user placing the order.
    	- Get my orders: GET /orders - returns all the orders made by the user making the request but should give all orders if requested by users with the "admin" role.
		- Get an order: GET /order/:id - returns an order with the items array containing the full item objects rather than just their _id. If the 'user' is a 'normal user' , he will be able to see only the order id for the orders he created.  An 'admin user' should be able to get any order.
		- Update an order: PUT/orders/:id - an admin can change the status of the order and this change will be visible in the GET my orders for the users. 

4.  Wishlists(requires authentication)
	Wishlist is created and managed by an individual user. 
		- Create: POST /wishlists - any user can create a wishlist. 
	    - Update a wishlist: PUT /wishlists/:id - a user who created a wishlist can change the name or the contents of the wishlist using the update option. 
	    - Get wishlist for a user: GET /wishlists - any user can get access to all the wishlists that he created.  
	    - Delete a wishlist: DELETE//wishlists/:id - a user who created the wishlist can delete it if not needed. 


#### Data Flow Diagram:
![layout](Data_Flow.png)


#### Request and Response Diagram from Front End to Database using Node JS to handle client-server communication.  
![layout](Request_and_Response.png)

### Completed:

 We have successfully completed the following requirements as per the rubrics:

 1. User Authentication and Authorization - user signup, signin, password update and Admin authorization have been stored in the database and have been rendered on the webpage. 

 2. Items: The items are available for the users to browse and the admin can view the items in his admin area with options to create, update and delete. 

 3. Orders: The new user can add items to cart for a new order but on checkout he needs to login and after that the user can place a successful order and can see his orders on the User Profile. An 'admin' can get all orders and can view and update them in the Admin Area of the application. 

 4. Wishlists : Users, once logged in, have an option to create multiple wishlists , name them and save, view  and update them in the user profile. 

 5. The project is deployed on Heroku. The user experience for our shopping application can be enjoyed through the following url:

 	https://vast-inlet-57676.herokuapp.com/
 

#### Future Scope and improvements:

1. Include Payment method using PayPal or Stripe:

- The customer will be able to provide their credit card information which after authentication will confirm the user order and the transaction ID for that payment will be added to the orders model. 

2. Include categories so that there is an option of selling more than one product with smoother functionality and design:

- To make the application more scalable a few more categories like adding an option for ice cream cake flavors or waffles or build your own ice-cream will help in bring in more customers for the store. 

3. Add mechanism for auctions & bids:
-The 'Admin' can create an auction for a limited time, in the application where the items' prices are kept at a minimal cost and customers can login and bid for their choice of product and whosoever makes the highest bid will get the product. The bids will be stored in the separate table along with the user id and the previous bid history for that product. 


 
### Learnings and Challenges:

1. Getting onboard with Passport Authentication - user creation and testing.
2. Creating UI and performing manual front-end testing was very tiresome and laborious.
3. Using GitHub as a team:
	- Branching issues.
	- Resolving merge conflicts. 
	- Making sure that the master has the recent changes so that the same are deployed on Heroku. 
4. Heroku issues:
	- MongoDB data not rendering on Heroku after deployment as we developed on Mac which is a case-insensitive OS but Heroku uses Linux hosts to deploy which have case-sensitive OS.
	- Data caching issues. 
5. Creating unit tests for the multiple user and admin routes. 






