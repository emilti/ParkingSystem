const getCategories = async () => {
    const promise = await fetch('http://localhost:57740/parking/getcategories')
    const categories = await promise.json()
    let options = [];
    options = categories.map(c => ({
        "value": c.categoryId,
        "label": c.name + " (Occupied spaces: " + c.parkingSpaces + ")"
    }))
   
    return options
}

const getDiscounts = async () => {
    const promise = await fetch('http://localhost:57740/parking/getdiscounts')
    const discounts = await promise.json()
    let options = [];
    options = discounts.map(d => ({
        "value": d.discountId,
        "label": d.name + " " + d.discountPercentage + "%"
    }))
    
    return options
}
export {getCategories, getDiscounts}