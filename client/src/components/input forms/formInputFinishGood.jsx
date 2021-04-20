import React from 'react';
import Joi from 'joi-browser';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import ConfirmAlertInput from './confirmAlertInput';
import userService from '../../services/userService';
import currencyEnums from "../../enums/currency.json";

class formInputFinishGood extends ConfirmAlertInput {

  state = {
    item: {},
    initialItem: {
      name: "",
      description: "",
      qty: 0,
      rawMaterialPrice_value: "",
      rawMaterialPrice_currency: "",
      createdBy: userService.getUserFromJWT().name,
      isReserved: false,
      reservedBy: "",
      closedBy: "",
      isClosed: false
    }
  }
  schema = {
    name: Joi.string().max(30).required().error(() => { return { message: this.errorMessages["name"] }; }),
    description: Joi.string().max(100).required().error(() => { return { message: this.errorMessages["description"] }; }),
    qty: Joi.number().min(1).max(99999).required().error(() => { return { message: this.errorMessages["qty"] }; }),
    rawMaterialPrice_value: Joi.string().allow(''),
    rawMaterialPrice_currency: Joi.string().valid(...Object.values(currencyEnums)),
    createdBy: Joi.string().required(),
    isReserved: Joi.boolean(),
    isClosed: Joi.boolean(),
    reservedBy: Joi.string().allow(''),
    closedBy: Joi.string().allow('')
  };
  errorMessages = {
    name: 'Nazwa nie może być pusta i może mieć maks. 30 znaków',
    description: 'Opis nie może być pusty i może mieć maks. 100 znaków',
    qty: 'Pole "Ilość" nie może być puste a wartość być liczbą z zakresu 1 - 9999'
  }

  isCommonUser = userService.getUserFromJWT().isCommonUser;

  componentDidMount() {
    const initialEmptyItem = {...this.state.initialItem}; 
    this.setState({item: initialEmptyItem})
  }

  resetData() {
    const initialEmptyItem = {...this.state.initialItem}; 
    this.setState({ item: initialEmptyItem })
  }

  async doSubmit(onClose) {
    try{
      const { item } = this.state;
  
      const error = this.validate(item);
      if (error) { toast.error(error); return }
      if(item.rawMaterialPrice_value && !item.rawMaterialPrice_currency){
        toast.error("Określi walutę"); return
      }

      onClose();
      item.rawMaterialPrice_value = item.rawMaterialPrice_value.replace(",", ".");
      this.props.form.action(item);
      this.resetData()

    }
    catch(ex){
      if (ex && ex.response) toast.error(ex.response.data)
    }
  }

  submit = () => {

    confirmAlert({
      customUI: ({ onClose }) => {
        const {
          title,
          p_label_name,
          p_label_description,
          p_label_qty,
          p_label_rawMaterialPrice_value,
        } = this.props.form;
        const currencyOptions = Object.values(currencyEnums);

        const { item } = this.state;
        const rawMaterialPriceInputSettings = {
            input: {
            p_label: p_label_rawMaterialPrice_value,
            name: "rawMaterialPrice_value",
            placeholder: item.rawMaterialPrice_value,
          },
          select: {
            name: "rawMaterialPrice_currency",
            defaultValue: item.rawMaterialPrice_currency,
            options: currencyOptions
          }
        }

        return (
          <div className="confirmAlertInput">
            <h1>{title}</h1>
            <div className="confirmAlertInput__input-box">
              {this.renderInputBoxGroup(p_label_name, "name", "text", item.name, onClose, "autoFocus")}
              {this.renderTextareaBoxGroup(p_label_description, "description", item.description, onClose)}
              {this.renderInputBoxGroup(p_label_qty, "qty", "number", item.qty, onClose)}
              {this.renderInputBoxWithSelectOption(rawMaterialPriceInputSettings, onClose)}
            
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
      <div className="app__header_headerButtons-wrap">
        {this.renderButton(this.props.button.label, this.submit, "btn btn-secondary")}
      </div>
    );
  }
}

export default formInputFinishGood;