import React, { Component } from 'react';
import Styles from './index.module.css'

const TopRow = () => {
   return (<div className={Styles.row}>
            <span className={Styles.cellRegistrationNumber}>Registration Number</span>
            <span className={Styles.cell}>In Parking</span>
            <span className={Styles.cellDate}>Enter Parking Date</span>
            <span className={Styles.cellDate}>Exit Parking Date</span>
            <span className={Styles.cell}>Category</span>
            <span className={Styles.cell}>Discount</span>
            <span className={Styles.cell}>Due Amount</span>
            </div>)
}

export default TopRow