import React from 'react';
import Styles from './index.module.css'
import Moment from 'moment'

const Visit = ({registrationNumber, isInParking, enterParkingDate, exitParkingDate, categoryName, discountPercentage, dueAmount, index}) => {
   return (<div key={index} className={Styles.row}>
        <span className={[Styles.cellRegistrationNumber, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{registrationNumber} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{isInParking == true ? "Yes" : "No"} </span>
        <span className={[Styles.cellDate, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{Moment(String(enterParkingDate)).format('MM/DD/YYYY HH:mm:ss')}</span>
        <span className={[Styles.cellDate, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{exitParkingDate != null ? Moment(String(exitParkingDate)).format('MM/DD/YYYY HH:mm:ss') : "-"}</span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{categoryName} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{discountPercentage != null ? discountPercentage + "%" : "-" } </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{dueAmount}</span></div>)
}

export default Visit