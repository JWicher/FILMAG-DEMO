import React, { Component } from 'react';
import Joi from 'joi-browser';
import utils from '../../services/utils';

class ConfirmAlertInput extends Component {
  state = {}

  handleInputOnChange = ({ currentTarget: input }) => {
    const item = { ...this.state.item };
    item[input.name] = input.value;
    this.setState({ item })
  };

  renderInputBoxGroup(p_label, name, type, placeholder, onClose, autoFocus, onchangeHandler = this.handleInputOnChange) {
    return <div className="confirmAlertInput__input-box_group">
      <p>{p_label}</p>
      <input name={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        onChange={onchangeHandler}
        onKeyPress={(target) => utils.runFunctionAfterPressEnter(target, () => this.doSubmit(onClose))}
      ></input>
    </div>
  }


  renderInputCustomSelect(p_label, options, name, defaultValue = "", onchangeHandler = this.handleInputOnChange) {
    return <div className="confirmAlertInput__input-box_group">
      <p>{p_label}</p>
      <select className="custom-select" data-style="btn-primary"
        name={name}
        onChange={onchangeHandler}
        defaultValue={defaultValue}
      >
        {options.map(option =>
          <option key={option} value={option}>{option}</option>
        )}
      </select>
    </div>
  }

  renderTextareaBoxGroup(p_label, name, placeholder, onClose, autoFocus, onchangeHandler = this.handleInputOnChange) {
    return <div className="confirmAlertInput__input-box_group">
      <p>{p_label}</p>
      <textarea name={name}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        rows="2"
        onChange={onchangeHandler}
        onKeyPress={(target) => utils.runFunctionAfterPressEnter(target, () => this.doSubmit(onClose))}
      ></textarea>
    </div>
  }

  renderInputBoxWithSelectOption(settingsObjects, onClose){

    const {p_label, name: inputName, placeholder } = settingsObjects.input;
    const {name: selectName, defaultValue, options } = settingsObjects.select;

    return (
    <div className="confirmAlertInput__input-box_group">
      <p>{p_label}</p>
      <input name={inputName}
        type="number"
        placeholder={placeholder}
        autoComplete="off"
        onChange={this.handleInputOnChange}
        onKeyPress={(target) => utils.runFunctionAfterPressEnter(target, () => this.doSubmit(onClose))}
      ></input>
      <select className="custom-select confirmAlertInput__input-box_group_InputBoxWithSelectOption-select" data-style="btn-primary"
        name={selectName}
        onChange={this.handleInputOnChange}
        defaultValue={defaultValue}
      >
        {options.map(option =>
          <option key={option} value={option}>{option}</option>
        )}
      </select>
    </div>
    )
  }

  renderButton(label, action, btnStyle) {
    return <button className={btnStyle} onClick={action}>{label}</button>
  }
  validate = (item) => {
    const { error } = Joi.validate(item, this.schema);
    return error ? error.details[0].message : null;
  };
}

export default ConfirmAlertInput;