import React from 'react';
import {Modal, Button} from 'react-bootstrap';

export default React.createClass({
    getInitialState() {
        return {
            close: true,
            value: this.props.size
        };
    },

    componentWillReceiveProps(nextProps){
      if(nextProps.show !== undefined){
        this.state.close = !nextProps.show;
        this.setState(this.state);
      }
    },

    onReqHide(){
      this.state.close = true;
      this.setState(this.state);
    },

    render() {

        let showModal = 'static-modal';

        if(this.state.close){
            showModal += ' close';
        }

        return <div className={showModal}>
                
                <Modal onRequestHide={this.onReqHide}>
                  <div className="modal-header">
                    <button type="button" className="close" aria-hidden="true" onClick={this.onReqHide}>&times;</button>
                    <h3>Enter the size of the Board (between 2 to 10)</h3>
                  </div>

                  <div className="modal-body">
                    <input type="text" ref="inputsize" onChange={this.onChange}></input>
                  </div>

                  <div className="modal-footer">
                    <Button bsStyle="success" onClick={this.onSubmit}>Set Size</Button>
                  </div>

                </Modal>
              </div>
    },


    onChange(event){
        let val = event.target.value;
        if(!isNaN(val)){
            if(val < 2) val = 2;
            if(val > 10) val = 10;
            
            this.state.value = val;
        }
    },

    onSubmit(){
        this.props.setSize(this.state.value);
        this.onReqHide();
    }
    
});