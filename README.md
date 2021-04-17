# ParkingSystem

The application purpose is to track the visits in a parking and calculate the amount due for the users of the parking. 

<br/>Prerequisits
* For the server part you must have installed Visual studio, .NET 5 and SQL 
* You must have installed node.js

To run the application follow these steps:

1. Pull the code for the client and the server
2. Open the server solution file in Visual studio. 
3. Open Package-manager-console and type command update-database. 
4. Start the server. When the server is started ParkingSystemDb database should be initialized and seeded. Check in the MS SQL Management Studio for it.
5. Open CMD and navigate to the Client folder.
6. Type npm start or yarn start 

Frontend:
There are everal screens to navigate through the application.
* Register - user registers in the application. Accessible for all users. When user registers he/she receives role "Driver"
* Login - user logs in the application. Accessible for all users.
* Enter new visit - user enters new visit to the parking. Accessible for registered users with the role "Driver"
* Profile - this screen discplays list of all visits of the user to the parking. For the visits for which the user didn't leave the parking a Quit button appear.
* Visits - displays a list of all the visits to the parking. Accessible only to the users with the role "Administrator".
* Edit Visit - when the admisnistrator user click on a row from the visits list he/she is redirected to a page where it can edit the opened visit.

Backend endpoints:
Enter the parking:
```
POST /Parking/Enter HTTP/1.1
Host: localhost:57740
Content-Type: application/json
Content-Length: 83

{
    "CategoryId": 2,
    "DiscountId": 1,
    "RegistrationNumber": "test"
}
```

Exit the parking:
```
POST /Parking/Exit HTTP/1.1
Host: localhost:57740
Content-Type: application/json
Content-Length: 31

{"registrationNumber": "test"}
```

Get available spaces:
```
GET /Parking/GetАvailableSpaces HTTP/1.1
Host: localhost:57740
```

Get list with the vehicles in the parking:
```
GET /Parking/GetVehicles HTTP/1.1
Host: localhost:57740
```

Get due amount for a vehicle in the parking:
```
GET /Parking/GetDueAmount?registrationNumber=test HTTP/1.1
Host: localhost:57740
```