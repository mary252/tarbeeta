import React, { Component } from "react";
import { Modal } from "../components/Layout";
import { TButton } from "./Form";

class ConfirmationPopup extends Component {
  state = {
    locale: null,
    is_busy: false,
    item: null,
    error_msg: null
  };

  toggle = item => {
    this.setState({
      item: item
    });
    this.modal.toggle();
  };

    render () {
        const  {
            is_busy,
            item
        }= this.state
        const {
            translation,
            action
        }=this.props
        return (
            <Modal ref={m => (this.modal = m)}>
                <div onClick={(e)=>e.stopPropagation()} className="address-popup">
                    <div className="address-popup-div">
                    <p className="address-popup-header">
                        {translation.confirmation_text}
                    </p>
                    <div className="columns is-mobile">
                        <div className="column is-4">
                        <TButton
                            id={`popup-close-button`}
                            name={`close-button`}
                            text={translation.no}
                            onPress={this.toggle}
                            className="red outline full"
                        />
                        </div>
                        <div className="column is-2 " />
                        <div className="column is-6">
                        <TButton
                            text={translation.yes}
                            onPress={e=> {
                                let res=item!=null?action(item):action
                                
                                this.toggle()
                            }}
                            className="grad-blue full button"
                            loading={is_busy}
                            id={`confirm-button`}
                        />
                        </div>
                    </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ConfirmationPopup;
