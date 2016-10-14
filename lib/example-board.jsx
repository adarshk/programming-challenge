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
            detectCycle: false,
            slowerPos: [],
            fasterPos: []
        };
    },

    componentWillMount() {
        this.makeArrows();
        this.randomStart();

        this.state.trackingArrow = this.getNewArrow(this.state.initialPos);
    },

    randomStart(){
        let x = Math.floor(Math.random() * this.props.size);
        let y = Math.floor(Math.random() * this.props.size);
        this.state.initialPos = [x, y];
        this.state.startPos = [x, y];
        this.state.slowerPos = [x, y];
        this.state.fasterPos = [x, y];

        console.log('startPos', x, y);
    },

    makeArrows() {
        for(let i=0; i < this.props.size * this.props.size; i++){
            this.state.arrows.push('←→↓↑'[Math.floor(Math.random() * 4)]);
        }
    },

    getNewArrow(pos){
        let tArr = (pos[1] * this.props.size) + pos[0];
        let arr = this.state.arrows[tArr];
        console.log('newArrow', arr);
        return arr;
    },

    getNext(currentPos){
        let posx, posy;
        [posx, posy] = currentPos;
        let arr = this.getNewArrow([posx, posy]);
        switch(arr){
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

    isInside(nextPos){
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
            this.state.trackingArrow = this.getNewArrow(this.state.initialPos);
            this.setState(this.state);
        }

    },

    move(){

        if(!this.state.detectCycle && this.isInside(this.state.slowerPos) && this.isInside(this.state.fasterPos)){
            this.state.slowerPos = this.getNext(this.state.slowerPos);
            this.state.fasterPos = this.getNext(this.state.fasterPos);

            if(this.isInside(this.state.fasterPos)){
                this.state.fasterPos = this.getNext(this.state.fasterPos);

                if(this.state.slowerPos[0] == this.state.fasterPos[0] && this.state.slowerPos[1] == this.state.fasterPos[1]){
                    this.state.detectCycle = true;
                }
            }
        }

        if(this.state.detectCycle){

            if(this.state.slowerPos[0] == this.state.initialPos[0] && this.state.slowerPos[1] == this.state.initialPos[1]){
                console.log('Cycle Detected');
                this.props.setModal(true, 'repeat');
                return;
            }
        }
        
        this.keepMoving();
    },

    keepMoving(){
        let newPos = this.getNext(this.state.initialPos);
        console.log('newPos', newPos);
        if(this.isInside(newPos)){
            this.state.initialPos = newPos;    
            this.state.trackingArrow = this.getNewArrow(this.state.initialPos);

            this.setState(this.state);
        }
        else{
            console.log('Outside');
            this.props.setModal(true, 'outside');
        }
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