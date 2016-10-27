import React from 'react';

export default React.createClass({
    getInitialState() {
        return {};
    },

    render() {
         
        return <div className="controls">
                <i className="fa fa-chevron-right fa-2x" onClick={this.onNext} aria-hidden="true"></i>
                <i className="fa fa-play fa-2x" onClick={this.onPlay} aria-hidden="true"></i>
                <i className="fa fa-stop fa-2x" onClick={this.onStop} aria-hidden="true"></i>
                <i className="fa fa-random fa-2x" onClick={this.onShuffle} aria-hidden="true"></i>
                <i className="fa fa-step-backward fa-2x" onClick={this.onReset} aria-hidden="true"></i>
            </div>
    },

    onPlay() {
        this.props.control.play();
    },

    onNext() {
        this.props.control.next();
    },


    onStop() {
        this.props.control.stop();
    },


    onReset() {
        this.props.control.reset();
    },

    onShuffle(){
        this.onSetSize(this.props.size);
    },

    onSetSize(newSize) {
        this.props.control.setSize(newSize);
    }
});