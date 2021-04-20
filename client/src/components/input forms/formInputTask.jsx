import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import ConfirmAlertInput from './confirmAlertInput';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import authService from '../../services/authService';
import schemas from "../constans/schemas/schemas";

class FormInputTask extends ConfirmAlertInput {
  schema = schemas.getFormInputTaskSchema().standard;
  isCommonUser = userService.getUserFromJWT().isCommonUser;

  componentDidMount() {
    const item = {
      content: this.props.form.content,
      type: this.props.button.type,
      qty: 1,
      location: this.props.localisation.name,
      createdBy: userService.getUserFromJWT().name
    }

    this.setState({ item })
    if (this.isCommonUser) {
      this.schema = schemas.getFormInputTaskSchema().expanded;
    }

  }
  static getDerivedStateFromProps(props, state) {
    const changedLocalisationByURL = state.item && props.localisation.name !== state.item.location.name;
    const isCommonUser = userService.getUserFromJWT().isCommonUser;

    if (changedLocalisationByURL && !isCommonUser) {
      return {
        item: { ...state.item, location: props.localisation.name }
      };
    }

    return null;
  }

  resetOnlyCommonUserData() {
    const item = { ...this.state.item };
    delete item.idCode;
    delete item.pin;

    this.setState({ item })
  }

  resetTaskData() {
    const item = { ...this.state.item };
    item.content = this.props.form.content;
    item.qty = 1;

    if (this.isCommonUser)
      item.location = "";

    this.setState({ item })
  }

  async doSubmit(onClose) {
    const { item } = this.state;
    const error = this.validate(item);

    if (error) { toast.error(error); return null; }

    if (!this.isCommonUser) {
      this.props.form.action(item);
      this.resetTaskData();
      onClose();
    }

    else {
      try {
        onClose();
        item.idCode = item.idCode.toUpperCase()

        const userFromCommonMode = await authService.shortIdentification(item.idCode, item.pin);
        item.createdBy = userFromCommonMode.name;

        delete item.idCode;
        delete item.pin;

        this.props.form.action(item);
        this.resetTaskData();
      }
      catch (ex) {
        if (ex.response) toast.error("Nieprawidłowy kod ID lub PIN")
        this.submit()
      }
    }

  }

  submit = () => {
    this.resetOnlyCommonUserData();

    confirmAlert({
      customUI: ({ onClose }) => {
        const { title, content, p_label, p_label_2 } = this.props.form;
        const { item } = this.state;
        const defaultContent = item.content || content;
        const defaultQty = item.qty;
        const user = userService.getUserFromJWT();
        let localisations = localisationService.getCurrentUserLocalisations();

        if (user.isCommonUser) {
          localisations = localisations.filter(vl => vl.category !== "Magazyn").map(vl => vl.name);
          localisations.unshift(""); // pusty element jako pierwszy w liście rozwijanej input select
        }

        return (
          <div className="confirmAlertInput">
            <h1>{title}</h1>
            <div className="confirmAlertInput__input-box">
              {user.isCommonUser && this.renderInputCustomSelect("Gdzie", localisations, "location", this.state.item.location)}
              {this.renderInputBoxGroup(p_label, "content", "text", defaultContent, onClose, "autoFocus")}
              {p_label_2 && this.renderInputBoxGroup(p_label_2, "qty", "number", defaultQty, onClose)}
              {user.isCommonUser && this.renderInputBoxGroup("Kod ID", "idCode", "text", "Twój kod ID", onClose)}
              {user.isCommonUser && this.renderInputBoxGroup("PIN", "pin", "number", "Podaj PIN", onClose)}

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

export default FormInputTask;