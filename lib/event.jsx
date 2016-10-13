import React from 'react';
import {Modal, Button, ButtonToolbar} from 'react-bootstrap';

export default React.createClass({
    getInitialState() {
        return {
          close: true
        };
    },

    componentWillReceiveProps(nextProps){
      if(nextProps.close !== undefined){
        this.state.close = !nextProps.close;
        this.setState(this.state);
      }
    },

    onReqHide(){
      this.state.close = true;
      this.setState(this.state);
    },

    render() {

      let cl = 'static-modal'
      if(this.state.close){
        cl = cl + ' close';
      }

      let reason = '';
      switch(this.props.condition){
        case 'outside':
          reason = 'The checker has moved off the board. Do you want to...';
          break;
        case 'repeat':
          reason = 'The checker has entered into a cycle. Do you want to...';
          break;
        case '':
          break;
        default:
          console.error("Unknown condition");
          break;
      }
      

        return <div className={cl}>
                
                <Modal onRequestHide={this.onReqHide}>
                  <div className="modal-header">
                  <button type="button" className="close" aria-hidden="true" onClick={this.onReqHide}>&times;</button>
                    <h3>{reason}</h3>
                  </div>

                  <div className="modal-body">
                    <ButtonToolbar className="toolbar">
                      <Button bsStyle="danger" onClick={this.onReset}>Restart</Button>
                      <Button bsStyle="success" onClick={this.onStartNew}>Start New Game</Button>
                    </ButtonToolbar>
                  </div>

                </Modal>
              </div>
    },

    onReset() {
        this.props.reset();
    },

    onStartNew(){
        this.props.setSize(this.props.size);
    }
    
});