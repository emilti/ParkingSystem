import React, { Component } from 'react';
import Styles from './index.module.css'

const Vehicle = ({registrationNumber, enterParkingDate, categoryName, discountPercentage, dueAmount, index}) => {
   return (<div>
        <span className={[Styles.row, index == 0 ? Styles.topRow : ""].join(" ")}>{registrationNumber} </span>
        <span className={[Styles.row, index == 0 ? Styles.topRow : ""].join(" ")}>{enterParkingDate} </span>
        <span className={[Styles.row, index == 0 ? Styles.topRow : ""].join(" ")}>{categoryName} </span>
        <span className={[Styles.row, index == 0 ? Styles.topRow : ""].join(" ")}>{discountPercentage != null ? discountPercentage + "%" : "-" } </span>
        <span className={[Styles.row, index == 0 ? Styles.topRow : ""].join(" ")}>{dueAmount}</span></div>)
}

export default Vehicle