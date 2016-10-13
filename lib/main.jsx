//all import statements must go at the top of the file.
import React from 'react';
import Board from './example-board';
import Controls from './example-controls';
import Event from './event';
import Sound from 'react-sound';

//get the content DOMElemet create in index.html
let content = document.getElementById('content');

//This is a React class. It's main methods are 'getInitialState', and 'render'.
let Main = React.createClass({

    getInitialState() {
        return {
            size: this.props.size,
            squareSize: this.props.squareSize,
            play: false,
            next: false,
            reset: false,
            key: 0,
            interval: null,
            showModal: false,
            conditionType: ''
        };
    },

    componentDidUpdate(){
        this.state.next = false;
        this.state.reset = false;
    },

    componentWillUnmount(){
        this.clearInt();
    },

    render() {
        
        let moveSound = this.state.next || this.state.play ? Sound.status.PLAYING : Sound.status.STOPPED;
        let eventSound = this.state.showModal ? Sound.status.PLAYING : Sound.status.STOPPED;

        return <div key={this.state.key}>
            <Controls control={this} size={this.state.size}/>
            <Board size={this.state.size} 
                   squareSize={this.state.squareSize} 
                   next={this.state.next} 
                   play={this.state.play} 
                   reset={this.state.reset}
                   setModal={this.setModal}/>
            
            <Event close={this.state.showModal} 
                     reset={this.reset} 
                     setSize={this.setSize} 
                     size={this.state.size}
                     condition={this.state.conditionType}/>

            <Sound
                url="./assets/move.wav"
                playStatus={moveSound}/>
            <Sound
                url="./assets/event.wav"
                playStatus={eventSound}/>
            </div>;
    },

    play() {
        console.log("Play");
        this.state.play = !this.state.play;        

        if(this.state.play){
            this.startInterval();
        }
        else{
            this.stop();
        }

        this.setState(this.state);
    },

    next() {
        console.log('Next');
        this.state.next = true;
        this.setState(this.state);
    },

    stop() {
        console.log("Stop");
        this.state.play = false;
        this.clearInt();
        this.setState(this.state);
    },

    reset() {
        console.log("Reset");
        this.state.play = false;
        this.state.next = false;
        this.state.reset = true;
        this.clearInt();
        this.setModal(false)
        this.setState(this.state);
    },

    setKey(){
        this.state.key = this.state.key == 0 ? 1 : 0;
    },

    startInterval(){
        this.state.interval = setInterval(()=>{this.setState(this.state)}, 800);
    },

    clearInt(){
        clearInterval(this.state.interval);
        this.state.interval = null;
    },    

    setSize(newSize) {
        this.state.play = false;
        this.state.next = false;
        this.setModal(false);
        //we update our internal state.
        this.state.size = newSize || 7;
        this.setKey();
        //setting our state forces a rerender, which in turn will call the render() method
        //of this class. This is how everything gets redrawn and how you 'react' to user input
        //to change the state of the DOM.
        this.setState(this.state);
    },

    setModal(flag, condition){
        if(flag !== undefined){
            this.state.showModal = flag;
        }
        else {
            this.state.showModal = !this.state.showModal;
        }

        if(condition){
            this.state.conditionType = condition;
            this.stop();
        }

        // this.setState(this.state);
    }
});

//this is the entry point into react. From here on out we deal almost exclusively with the
//virtual DOM. Here we tell React to attach everything to the content DOM element.
React.render(<Main squareSize={80} size={5}/>, content, () => {
    console.log("Rendered!");
});
