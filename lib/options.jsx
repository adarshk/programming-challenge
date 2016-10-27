import React from 'react';
import {Button, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap';
import Input from './modal-input';

export default React.createClass({
    getInitialState() {
        return {
            modalVisible: false,
        };
    },

    render() {
         
        return <div className="options">
            <ButtonToolbar className="toolbar">
                <i className="fa fa-cog fa-2x" aria-hidden="true"></i>
                <DropdownButton title="Settings" onSelect={this.onSelect} id="bg-nested-dropdown">
                  <MenuItem eventKey="1">3x3</MenuItem>
                  <MenuItem eventKey="2">5x5</MenuItem>
                  <MenuItem eventKey="3">7x7</MenuItem>
                  <MenuItem eventKey="4">Random</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="5">Custom Size</MenuItem>
                </DropdownButton>
                </ButtonToolbar>
                <Input show={this.state.modalVisible} setSize={this.onSetSize} size={this.props.size}></Input>
            </div>
    },

    onSetSize(newSize) {
        this.props.control.setSize(newSize);
    },

    onSelect(eventKey){

        console.log('Selected key', eventKey)

        switch(eventKey){
            case "1":
                this.onSetSize(3);
                break;
            case "2":
                this.onSetSize(5);
                break;
            case "3":
                this.onSetSize(7);
                break;
            case "4":
                let num = 2 + Math.floor(Math.random() * 8)
                this.onSetSize(num);
                break;
            case "5":
                this.state.modalVisible = true;
                this.setState(this.state);
                break;
            default:
                this.onSetSize(7);
                break;
        }
    }
});