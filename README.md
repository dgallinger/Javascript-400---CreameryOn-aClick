


## CreameryOn-AClick

### Completed:

 We have successfully completed the following requirements as per the rubrics:

 1. User Authentication and Authorization - user signup, signin, password update and Admin  authorization have been stored in the database and have been rendered on the webpage. 

 2. Items: The items are available for the users to browse and the admin can view the items in his admin area with options to create, update and delete. 

 3. Orders: The new user can add items to cart for a new order but on checkout he needs to login and after that the user can place a successful order and can see his orders on the User Profile. 

 4. Wishlists : Users, once logged in, have an option to create multiple wishlists , name them and save and view them in the user profile. 

 5. The project is deployed on Heroku. The user experience for our shopping application can be enjoyed through the following url:

 	https://dashboard.heroku.com/apps/vast-inlet-57676

 Please feel free to login and place an order for your favorite icecream. 



### To be completed:

1. The `create`, `update` and `delete` for the items operations need to be rendered on the front-end. 
2. The `update`, `delete` and `get by Id`  for the orders needs to be compeleted for both front-end and the back-end. 
3. The `update`, `delete` and `get by Id` for the wishlist needs to be compeleted for both front-end and the back-end.
4. Tests are yet to be written and run.


The models and the layouts have been updated as per the updates in the Project. 

The complete Project Proposal is as below:

## Project Proposal


`Node.js` is an open-source, cross-stage runtime condition based on Chrome's V8 JavaScript motor. It is utilized to manufacture quick, versatile server-side web applications. The occasion driven, non-blocking I/O display makes Node.js lightweight and effective. These highlights have propelled a great deal of engineers to embrace Node.js.


This project is `CreameryOn-AClick` is basically an online store for everyone’s favorite summer snack, ice cream. The users can visit the webpage and order their favorite ice-cream and can enjoy it in the pleasure and safety of their homes. 


### Task:


Our objective is to create an online dessert shopping experience for our clients. 
We will be handling user authentication and authorization based on the roles. 


**User:**

A user can visit the webpage and browse through the options but will have to login to place an order. User can get all the orders he placed and can check them under User Profile. 

Also, a user can create multiple wishlists for the items he likes, after he logins. All his wishlits will be available in the user Profile. 


**Admin:**

An 'admin' will have full control on the webpage. He can add, edit or delete an item, retireve all the orders placed.


### Models:

Completed:

1.	Users: User and Admin information is added to database with Unique ID based on their roles.

2.	Items: Complete products information is stored in this table.

3.	Orders: Customer ordered product details is stored in this table.

4. 	Wishlists: Customer can add their favorite items in a wishlist and save it for reference.

**Optional Future upgrades in the application**

5.  Auctions: We are planning to add an auctions page where the admin or the sellerwill put the ice-creams on auction               (starting at 10% of original cost) for the users and the highest bidder will get that item on the                     bidding amount. The auctions table will store all the details for a particular auction created. 
   
5. Bids: Customers placed bids for the auctions will be stored in this table.

6. Transactions: For each product in an order, there will be a transaction ID and all the information related will be stored in this table. 

![layout](models.png)
  

### Routes: 

Some basic routes will be:

1. 	Login
		- Signup: POST /login/signup
		- Login: POST /login
		- Change Password POST /login/password

2.	Items (requires authentication)
		- Create: POST /items - restricted to users with the "admin" role
	    - Update an item: PUT /items/:id - restricted to users with the "admin" role
	    - Get all items: GET /items - open to all users
	    - Delete an itme: DELETE//items/:id - restricted to users with the "admin" role

3.	Orders (requires authentication)
		- Create: POST /orders - open to all users. 
    		 Takes an array of item _id values (repeat values can appear). Order should be created with a total field with the total cost of all the items from the time the order is placed (as the item prices could change). The order should also have the userId of the user placing the order.
		- Get my orders: GET /orders - return all the orders made by the user making the request but should give allorders if requested by users with the "admin" role.
		- Get an order: GET /order/:id - return an order with the items array containing the full item objects rather than just their _id. If the 'user' is a 'normal user' , he will be able to see only the order id for the orders he created.  An 'admin user' should be able to get any order.

**Future Upgrades in the application.** 

4.  Auctions (require authentication)
    	- Create: POST /auctions - restricted to users with the "admin" role
	    - Update an item: PUT /autcions/:id - restricted to users with the "admin" role
	    - Get all items: GET /auctions - open to only admin
	    - Delete an itme: DELETE//auction/:id - restricted to users with the "admin" role

5.  Bids (requires authentication)
		- Create: POST /auctions/:id/bid - a user will create a bid on his id
		- Get all bids: GET/bids - a user can get all the bids he placed

### Data Flow Diagram:
![layout](Data_Flow.png)


### Request and Response Diagram from Front End to Database using Node JS to handle client-server communication.  
![layout](Request_and_Response.png)
 

### Good to Have: 

Our primary plan is to be able to design the front end and the back end for the online icecream store webpage and it would be great if we would be able to add a payment page and connect it to Paypal/ Stripe by the end of this project.





