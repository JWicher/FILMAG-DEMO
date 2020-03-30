import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';

class ConfirmAlert extends Component {
  state = {}

  submit = () => {
    const { item, itemRepresentation } = this.props;
    const { title, action } = this.props.form;

    confirmAlert({
      title: title,
      message: this.props.form.message || itemRepresentation,
      buttons: [
        {
          label: 'Potwierdzam',
          onClick: () => action(item)
        },
        {
          label: 'Anuluj',
          onClick: () => { return null }
        }
      ]
    })
  };

  render() {
    const { btn_label, btn_css, isDisabled = false } = this.props.form;
    const { disableButton = false } = this.props;

    if (isDisabled) return <button className={"btn " + btn_css} >{btn_label} </button>;
    return (
      <button
        className={"btn " + btn_css}
        onClick={this.submit}
        disabled={disableButton}
      >{btn_label}
      </button>
    );
  }
}

export default ConfirmAlert;