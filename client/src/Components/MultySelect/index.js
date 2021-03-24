import React, {Component} from 'react'

const MultySelect = ({field, collection}) => {
    return (
        <select name={field} multiple>
        {
            collection.map((el, i) => {
                return <option value={el.value}>{el.label}</option>
            })}
        </select>
    )
}
export default MultySelect