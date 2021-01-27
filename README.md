# ParkingSystem

Enter the parking
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

Exit the parking
```
POST /Parking/Exit HTTP/1.1
Host: localhost:57740
Content-Type: application/json
Content-Length: 31

{"registrationNumber": "test"}
```

Get available spaces
```
GET /Parking/GetАvailableSpaces HTTP/1.1
Host: localhost:57740
```

Get list with the vehicles in the parking
```
GET /Parking/GetVehicles HTTP/1.1
Host: localhost:57740
```

Get due amount for a vehicle in the parking
```
GET /Parking/GetDueAmount?registrationNumber=test HTTP/1.1
Host: localhost:57740
```