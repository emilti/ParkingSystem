import React, { Component } from 'react';
import Styles from './index.module.css'

const Vehicle = ({registrationNumber, enterParkingDate, categoryName, discountPercentage, dueAmount, index}) => {
   return (<div className={Styles.row}>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{registrationNumber} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{enterParkingDate} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{categoryName} </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{discountPercentage != null ? discountPercentage + "%" : "-" } </span>
        <span className={[Styles.cell, index == 0 ? Styles.topRow : "", index % 2 != 0 ? Styles.evenRow : ""].join(" ")}>{dueAmount}</span></div>)
}

export default Vehicle