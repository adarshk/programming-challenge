import React from 'react';
import Square from './example-square';
import Minimap from './minimap';
import constants from './constants';
import utils from './utils';
import SecondaryBoard from './secondary-board';

export default React.createClass({
    getInitialState() {
        return {
            arrows: [],
            initialPos: [],
            startPos: [],
            trackingArrow: '',
            slowerPos: [],
            fasterPos: [],
            detectCycle: false,
            selected: false,
            visitedBlocks: [],
            targetBlock: []
        };
    },

    componentWillMount() {
        this.state.arrows = utils.makeArrows(this.props.size);
        // this.randomStart();

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

        if (!this.state.selected) return;

        if(nextProps.next || nextProps.play){
            this.move();   
        }

        if(nextProps.reset){
            this.state.initialPos = this.state.startPos.slice(0);
            this.state.slowerPos = this.state.startPos.slice(0);
            this.state.fasterPos = this.state.startPos.slice(0);
            this.state.detectCycle = false;
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
                    this.state.slowerPos = this.state.startPos.slice();
                }
            }
        }
        else if(this.state.detectCycle){
            this.state.slowerPos = this.getNext(this.state.slowerPos);
            this.state.fasterPos = this.getNext(this.state.fasterPos);

            if(this.state.slowerPos[0] == this.state.fasterPos[0] && this.state.slowerPos[1] == this.state.fasterPos[1]){
                console.log('Cycle Detected');
                this.keepMoving();
                // this.props.setModal(true, 'repeat');
                return;
            }
        }
        
        this.keepMoving();
    },

    keepMoving(){
        let newPos = this.getNext(this.state.initialPos);
        console.log('newPos', newPos);
        if(this.isInside(newPos)){
            if (!utils.checkIfInArray(this.state.initialPos, this.state.visitedBlocks)) {
                this.state.visitedBlocks.push(this.state.initialPos);
            }
            
            this.state.initialPos = newPos;    
            this.state.trackingArrow = this.getNewArrow(this.state.initialPos);

            this.setState(this.state);
        }
        else{
            console.log('Outside');
            this.props.setModal(true, 'outside');
        }
    },

    onSelect(selectedPos){
        if (this.state.selected) return;
        
        let x = selectedPos[0];
        let y = selectedPos[1];
        this.state.initialPos = [x, y];
        this.state.startPos = [x, y];
        this.state.slowerPos = [x, y];
        this.state.fasterPos = [x, y];
        this.state.selected = true;

        console.log('startPos', x, y);


        let distLeftTop = Math.sqrt(Math.pow((0 - x),2) + Math.pow((0 - y),2));
        let distRightTop = Math.sqrt(Math.pow((this.props.size-1 - x),2) + Math.pow((0 - y),2));
        let distLeftBottom = Math.sqrt(Math.pow((0 - x),2) + Math.pow((this.props.size-1 - y),2));
        let distRightBottom = Math.sqrt(Math.pow((this.props.size-1 - x),2) + Math.pow((this.props.size-1 - y),2));

        let distances  = [distLeftTop, distRightTop, distLeftBottom, distRightBottom];
        let index = distances.indexOf(Math.max.apply(Math, distances));

        switch(index){
            case 0:
                this.state.targetBlock = [0, 0];
                break;
            case 1:
                this.state.targetBlock = [this.props.size-1, 0];
                break;
            case 2:
                this.state.targetBlock = [0, this.props.size-1];
                break;
            case 3:
                this.state.targetBlock = [this.props.size-1, this.props.size-1];
                break;
            default:
                this.state.targetBlock = [0, 0];
                break;
        }

        this.setState(this.state);
    },

    render() {
        //this example just creates a row of squares. Use CSS styling to
        //get the checkers into a mxm size board

        //create a new array of squares
        let squares = [];
        let key = 0;
        for(let i = 0; i < this.props.size; i++) {
            for(let j = 0; j < this.props.size; j++) {
                let color = key++ % 2 == 0 ? constants.boardEvenColor : constants.boardOddColor;
                let arrow = this.state.arrows[key-1];
                let pos = [j, i];
                
                if(utils.checkIfInArray(pos, this.state.visitedBlocks)){
                    color = constants.visitedColor;
                }

                if(j === this.state.initialPos[0] && i === this.state.initialPos[1]){
                    color = constants.selectedColor;
                }

                if (this.state.targetBlock.length > 0) {
                    if(j === this.state.targetBlock[0] && i === this.state.targetBlock[1]){
                        arrow = '{}';
                    }
                }

                squares.push(<Square 
                                key={key} 
                                size={this.props.squareSize} 
                                color={color} 
                                arrow={arrow} 
                                select={this.onSelect} 
                                pos={pos}
                                isSelected={this.state.selected}/>
                            )

            }
        }
        let size = (this.props.squareSize + 2) * this.props.size;
        let style = {
            width: size,
            height: size
        };
        let boardType = 'checkerboard ' + this.props.type
        return <div>
                    <div className={boardType} style={style}>
                    {squares}
                    </div>

                    <Minimap positions={this.state.visitedBlocks} size={this.props.squareSize}></Minimap>
                    <SecondaryBoard
                       size={this.props.size} 
                       squareSize={this.props.squareSize} 
                       type={'right'}
                       positions={this.state.visitedBlocks}
                       clearVisited={this.setVisitedBlocks}/>
                </div>
    },

    setVisitedBlocks(arrs){

        for(let i=0; i < arrs.length; i++){
            let updatedArr = arrs[i];
            let index = this.state.visitedBlocks[i][1] * this.props.size + this.state.visitedBlocks[i][0];
            this.state.arrows[index] = updatedArr;
        }

        this.state.visitedBlocks = [];
        this.state.initialPos = this.state.startPos.slice();
        this.setState(this.state);
    }
});