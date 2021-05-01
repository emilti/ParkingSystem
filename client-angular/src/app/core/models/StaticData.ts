import CategoryInfo from "./CategoryInfo";
import DiscountInfo from "./DiscountInfo";

interface StaticData {
    totalParkingSpaces: number;
    categories: Array<CategoryInfo>
    discounts: Array<DiscountInfo>
}

export default StaticData