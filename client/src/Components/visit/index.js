import React from 'react';
import Styles from './index.module.css'
import Moment from 'moment'
import {Link} from 'react-router-dom'

const Visit = ({id, registrationNumber, isInParking, enterParkingDate, exitParkingDate, categoryId, categoryName, discountId, discountPercentage, dueAmount, index}) => {
   return (<div key={index} className={Styles.row}>
                <Link to={{pathname: "/EditVisit", state: {id: id, registrationNumber: registrationNumber, isInParking: isInParking, categoryId: categoryId, discountId: discountId, enterParkingDate: enterParkingDate, exitParkingDate: exitParkingDate}}}>
                        <span className={[Styles.cellRegistrationNumber, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{registrationNumber} </span>
                        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{isInParking == true ? "Yes" : "No"} </span>
                        <span className={[Styles.cellDate, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{Moment(String(enterParkingDate)).format('MM/DD/YYYY HH:mm:ss')}</span>
                        <span className={[Styles.cellDate, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{exitParkingDate != null ? Moment(String(exitParkingDate)).format('MM/DD/YYYY HH:mm:ss') : "-"}</span>
                        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{categoryName} </span>
                        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{discountPercentage != null ? discountPercentage + "%" : "-" } </span>
                        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{dueAmount}</span>
                </Link>
        </div>)
        
}

export default Visit