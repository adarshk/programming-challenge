import React from 'react';
//notice we use the relative path syntax when loading local files
import Square from './example-square';

export default React.createClass({
    getInitialState() {
        return {
            arrows: [],
            initialPos: [],
            startPos: [],
            trackingArrow: '',
            minPos: [],
            maxPos: [],
            numSteps: 0
        };
    },

    componentWillMount() {
        this.makeArrows();
        this.randomStart();

        this.getNewArrow();
    },

    randomStart(){
        let x = Math.floor(Math.random() * this.props.size);
        let y = Math.floor(Math.random() * this.props.size);
        this.state.initialPos = [x, y];
        this.state.startPos = [x, y];
        this.state.minPos = [x, y];
        this.state.maxPos = [x, y];

        console.log('startPos', x, y);
    },

    makeArrows() {
        for(let i=0; i < this.props.size * this.props.size; i++){
            this.state.arrows.push('←→↓↑'[Math.floor(Math.random() * 4)]);
        }
    },

    getNewArrow(){
        let tArr = (this.state.initialPos[1] * this.props.size) + this.state.initialPos[0];
        this.state.trackingArrow = this.state.arrows[tArr];
        console.log('newArrow', this.state.trackingArrow);
    },

    getNext(){
        let posx, posy;
        [posx, posy] = this.state.initialPos;
        switch(this.state.trackingArrow){
            case '←':
                return [posx - 1, posy];
            case '→':
                return [posx + 1, posy];
            case '↓':
                return [posx, posy + 1];
            case '↑':
                return [posx, posy - 1];
            default:
                console.error('arrow not recognized');
                return [posx, posy];
                break; 
        }

        return [posx, posy];
    },

    checkNextIfOutside(nextPos){
        if(nextPos[0] >= 0 && nextPos[0] < this.props.size && nextPos[1] >= 0 && nextPos[1] < this.props.size){
            return true;
        }

        return false;
    },

    componentWillReceiveProps(nextProps){
        console.log('nextProps', nextProps);

        if(nextProps.next || nextProps.play){
            this.move();   
        }

        if(nextProps.reset){
            this.state.initialPos = this.state.startPos.slice(0);
            this.state.numSteps = 0;
            this.getNewArrow();
            this.setState(this.state);
        }

    },

    move(){
        let newPos = this.getNext();
        console.log('newPos', newPos);
        if(this.checkNextIfOutside(newPos)){
            this.getMinMaxPos(newPos);
            this.state.initialPos = newPos;    
            this.getNewArrow();

            this.state.numSteps += 1;

            this.calSteps();

            this.setState(this.state);
        }
        else{
            console.log('Outside');
            this.props.setModal(true, 'outside');
        }
    },

    calSteps(){
        let diffX = (this.state.maxPos[0] + 1) - (this.state.minPos[0]);
        let diffY = (this.state.maxPos[1] + 1) - (this.state.minPos[1]);

        if(this.state.numSteps > diffX * diffY){
            console.log('Repeating');
            this.props.setModal(true, 'repeat');
        }
        
    },

    getMinMaxPos(newPos){
        this.state.minPos[0] = Math.min(this.state.minPos[0], newPos[0]);
        this.state.minPos[1] = Math.min(this.state.minPos[1], newPos[1]);
        this.state.maxPos[0] = Math.max(this.state.maxPos[0], newPos[0]);
        this.state.maxPos[1] = Math.max(this.state.maxPos[1], newPos[1]);

        console.log('Min and Max', this.state.minPos, this.state.maxPos);
    },

    render() {
        //this example just creates a row of squares. Use CSS styling to
        //get the checkers into a mxm size board

        //create a new array of squares
        let squares = [];
        let key = 0;
        for(let i = 0; i < this.props.size; i++) {
            for(let j = 0; j < this.props.size; j++) {
                let color = key++ % 2 == 0 ? '#BEEB9F' : '#79BD8F';
                let arrow = this.state.arrows[key-1];
                let pos = [j, i];
                
                if(j === this.state.initialPos[0] && i === this.state.initialPos[1]){
                    color = '#FF6138';
                }

                squares.push(<Square key={key} size={this.props.squareSize} color={color} arrow={arrow}/>)

            }
        }
        let size = (this.props.squareSize + 2) * this.props.size;
        let style = {
            width: size,
            height: size
        };
        return <div className="checkerboard" style={style}>
            {squares}
        </div>;
    }
});