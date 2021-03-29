const buildCategoriesDropdown = async (dropdownType) =>{
    let serverOptions = await getCategories()
    switch(dropdownType){
        case "Enter vehicle": 
            return [{"value": "", "label": "Select category"}, ...serverOptions]
        case "Filter vehicles":
            return [{"value": "0", "label": "All categories"}, ...serverOptions]
    }
}

const buildDiscountsDropdown = async (dropdownType) =>{
    let serverOptions = await getDiscounts()
    switch(dropdownType){
        case "Enter vehicle": 
            return [{"value": "", "label": "Select discount"}, ...serverOptions]
        case "Filter vehicles":
            return [{"value": "0", "label": "All discounts"}, ...serverOptions, {"value": "999", "label": "No discounts"}]
    }
}

const getCategories = async () => {
    const promise = await fetch('http://localhost:57740/parking/getcategories')
    const categories = await promise.json()
    let options = []
    options = categories.map(c => ({
        "value": c.categoryId,
        "label": c.name + " (Occupied spaces: " + c.parkingSpaces + ")"
    }))

    return options
}

const getDiscounts = async () => {
    const promise = await fetch('http://localhost:57740/parking/getdiscounts')
    const discounts = await promise.json()
    let options = []
    options = discounts.map(d => ({
        "value": d.discountId,
        "label": d.name + " " + d.discountPercentage + "%"
    }))
    return options
}

const getSorting = async () => {
    let options = [
        {"value": "1", "label": "No sorting"},
        {"value": "2", "label": "Due Amount"},
        {"value": "3", "label": "Registration Number"},
        {"value": "4", "label": "Entered Parking Date"}]
    return options
}

const getSortingOrder = async () => {
    let options = [
        {"value": "1", "label": "No sorting"},
        {"value": "2", "label": "Ascending"},
        {"value": "3", "label": "Descending"}]
    return options
}
export {buildCategoriesDropdown, buildDiscountsDropdown, getSorting, getSortingOrder}