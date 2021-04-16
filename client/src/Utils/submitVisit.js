import getCookie from './cookie'
const SubmitVisit = async (event, categoryId, discountId, registrationNumber) => {
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

export {SubmitVisit}