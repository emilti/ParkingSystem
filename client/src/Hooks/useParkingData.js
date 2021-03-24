import { useState, useEffect } from 'react';
import getCookie from '../Utils/cookie'

export default function  useParkingData(){
   const [availableSpaces, setAvailableSpaces] = useState(null);
   const [totalParkingSpaces, setTotalParkingSpaces] = useState(null);
   const [categories, setCategories] = useState(null);
   const [discounts, setDiscounts] = useState(null);
   const [isLoading, setLoading] = useState(true);
   
    useEffect( () => {
        function getAvailableSpaces() {
        var token = getCookie('x-auth-token')
        const requestOptions = {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            };
        fetch('http://localhost:57740/Parking/GetАvailableSpaces', requestOptions)
        .then(res => {
            if (res.ok) {
                res.json().then((responseJson) => {
                    setAvailableSpaces(responseJson["availableSpaces"])
                })
            }
        }).catch(err => {
        setLoading(false);

        
        });

        fetch('http://localhost:57740/Parking/GetParkingStaticData', requestOptions)
        .then(res => {
            if (res.ok) {
                res.json().then((responseJson) => {
                    setTotalParkingSpaces(responseJson["totalParkingSpaces"])
                    setCategories(responseJson["categories"])
                    setDiscounts(responseJson["discounts"])
                })
            }
        }).catch(err => {
        setLoading(false);

        
        });
  }   getAvailableSpaces();
}, []);

return {
    availableSpaces,
    setAvailableSpaces,
    totalParkingSpaces,
    categories, 
    discounts
   }
}
