import React from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmAlertInput from './confirmAlertInput';
import schemas from "../constans/schemas/schemas";

class FormPartialDelivery extends ConfirmAlertInput {
  state = {};
  schema = schemas.getFormPartialDeliverySchema();
  inputValue = 0;
  originalPartialQty = 0;

  componentDidMount() {
    this.originalPartialQty = this.props.task.partialQty;
    this.setState({ item: this.props.task })
  };
  handleInputOnChange_partialDelivery = ({ currentTarget: input }) => {
    this.inputValue = input.value;
  };
  resetTaskData() {
    this.inputValue = 0;
  }
  doSubmit(onClose) {
    const { item } = this.state;
    const error = this.validate({ partialQty: this.inputValue });
    if (error) { toast.error(error); return null; }

    onClose();
    if (item.qty < item.partialQty + parseInt(this.inputValue)) {
      this.confirmGreaterDeliveryThanOrder(item);
    }
    else {
      item.partialQty += parseInt(this.inputValue);
      this.props.form.action(item);
    }
  }
  confirmGreaterDeliveryThanOrder = (item) => {
    confirmAlert({
      title: "Ostrzeżenie!",
      message: "Łączna dostawa będzie większa niż zamówienie. Zatwierdź dostawę lub ją odrzuć.",
      buttons: [
        {
          label: 'Zatwierdzam',
          onClick: () => { item.partialQty += parseInt(this.inputValue); this.props.form.action(item) }
        },
        {
          label: 'Odrzucam',
          onClick: () => { return }
        }
      ]
    })
  };

  submit = () => {
    this.resetTaskData();
    confirmAlert({
      customUI: ({ onClose }) => {
        const { title } = this.props.form;
        return (
          <div className="confirmAlertInput">
            <h1>{title}</h1>
            <div className="confirmAlertInput__input-box">
              {this.renderInputBoxGroup("Ilość", "partialQty", "number", "Podaj ilość jaką teraz dostarczasz", onClose, "autoFocus", this.handleInputOnChange_partialDelivery)}
            </div>
            <div>
              <p>* Podana wartość zostanie dodana do sumy zrealizowanej dostawy.</p>
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
    return (
      <button
        className={"btn " + this.props.form.btn_css}
        onClick={this.submit}
      >{this.props.form.btn_label}
      </button>
    );
  }
}

export default FormPartialDelivery;