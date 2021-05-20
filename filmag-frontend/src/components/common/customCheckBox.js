import React from 'react';

const CustomCheckBox = ({ action, item, isChecked, isDisabled = false }) => {

  const faClass = isChecked ? "fa fas fa-check fa-check-yes" : "fa fas fa-check fa-check-no";

  return (
    <button
      className="custom-checkbox common-customCheckBox"
      disabled={isDisabled}
      onClick={() => action(item)}
    >
      <i className={faClass} > </i>
    </button>
  )
}

export default CustomCheckBox;