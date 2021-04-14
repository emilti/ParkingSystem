import getCookie from '../Utils/cookie'
const SubmitVisitService = async (event, categoryId, discountId, registrationNumber) => {
    var token = getCookie('x-auth-token')
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ categoryId: categoryId, discountId: discountId, registrationNumber: registrationNumber, token: token })
    };

    event.preventDefault();
    fetch('http://localhost:57740/parking/enter', requestOptions)
    .then(async response => {
        if (!response.ok) {
            // get error message from body or default to response status
            const error = response.status;
            return Promise.reject(error);
        }
        if(response.ok){
            return true
        }
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}

const EditVisitService = async (event, id, registrationNumber, isInParking, categoryId, discountId) => {
    var token = getCookie('x-auth-token')
    var idTransfer = id.toString()
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({id: idTransfer, registrationNumber: registrationNumber, isInParking: JSON.parse(isInParking), categoryId: categoryId, discountId: discountId})
    };
console.log(requestOptions)
    event.preventDefault();
    fetch('http://localhost:57740/parking/EditVehicle', requestOptions)
    .then(async response => {
        if (!response.ok) {
            // get error message from body or default to response status
            const error = response.status;
            return Promise.reject(error);
        }
        if(response.ok){
            return true
        }
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}
export {SubmitVisitService, EditVisitService}