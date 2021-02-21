import React, { Component } from 'react';
import Styles from './index.module.css'
import Moment from 'moment'

const Vehicle = ({registrationNumber, enterParkingDate, categoryName, discountPercentage, dueAmount, index}) => {
   return (<div className={Styles.row}>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{registrationNumber} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{Moment(String(enterParkingDate)).format('MM/DD/YYYY HH:mm:ss')}</span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{categoryName} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{discountPercentage != null ? discountPercentage + "%" : "-" } </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{dueAmount}</span></div>)
}

export default Vehicle