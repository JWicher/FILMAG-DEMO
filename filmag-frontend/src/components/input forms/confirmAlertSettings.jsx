import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmAlertInput from './confirmAlertInput';

class ConfirmAlertSettings extends ConfirmAlertInput {
  state = {};

  doSubmit(onClose) {
    const { item } = this.state;
    this.props.form.action(item);
    onClose();
  }
  submit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        const { title, p_label, p_label_2, placeholder_1, placeholder_2, input_1_type = "text", name_1 = "name", name_2 } = this.props.form;
        return (
          <div className="confirmAlertInput">
            <h1>{title}</h1>
            <div className="confirmAlertInput__input-box">
              {this.renderInputBoxGroup(p_label, name_1, input_1_type, placeholder_1, onClose, "autoFocus")}
              {p_label_2 && this.renderInputBoxGroup(p_label_2, name_2, "text", placeholder_2, onClose)}
            </div>
            <div className="confirmAlertInput__button-group">
              {this.renderButton("Dodaj", () => this.doSubmit(onClose))}
              {this.renderButton("Anuluj", onClose)}
            </div>
          </div>
        )
      }
    })
  };

  render() {
    const { btn_css, btn_label } = this.props.form;
    return this.renderButton(btn_label, this.submit, btn_css);
  }
}

export default ConfirmAlertSettings;