import React from 'react';
import Square from './example-square';
import constants from './constants';
import utils from './utils';

export default React.createClass({
    getInitialState() {
        return {
            arrows: [],
            shadowBlocks: [],
            currentHoverBlock: []
        };
    },

    componentWillMount() {
        this.state.arrows = utils.makeArrows(this.props.size);
    },

    componentWillReceiveProps(){},

    render() {
        
        let squares = [];
        let key = 0;
        for(let i = 0; i < this.props.size; i++) {
            for(let j = 0; j < this.props.size; j++) {
                let color = key++ % 2 == 0 ? constants.boardEvenColor : constants.boardOddColor;
                let arrow = this.state.arrows[key-1];
                let pos = [j, i];

                if(utils.checkIfInArray(pos, this.state.shadowBlocks)){
                    color = constants.visitedColor;
                }

                squares.push(<Square 
                                key={key} 
                                size={this.props.squareSize} 
                                color={color} 
                                arrow={arrow}
                                pos={pos}
                                isSelected={true}
                                type={'secondary'}
                                mouseOver={this.mouseOver}
                                click={this.onClick}/>
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
                </div>
    },

    onClick(){

        let arrVals = [];
        for(let i=0; i < this.state.shadowBlocks.length; i++){
            let sp = this.state.shadowBlocks[i];
            let index = sp[1] * this.props.size + sp[0];
            let ar = this.state.arrows[index];
            arrVals.push(ar);
        }

        this.props.clearVisited(arrVals);
        console.log(this.state.shadowBlocks);
        this.state.shadowBlocks = [];
        this.state.currentHoverBlock = [];
    },

    mouseOver(pos){
        if (!pos.length) return;
        if (!(this.props.positions.length > 1)) return;
        
        if (this.state.currentHoverBlock.length == 0) {
            this.state.currentHoverBlock = pos.slice();
        }
        else if (this.state.currentHoverBlock[0] == pos[0] && this.state.currentHoverBlock[1] == pos[1]) {
            return;
        }
        else{
            this.state.currentHoverBlock = pos.slice();   
        }

        this.state.shadowBlocks = [];
        this.state.shadowBlocks.push(pos);
        let nextBlock = pos.slice();

        for(let i=1; i<this.props.positions.length; i++){
            let prevElem = this.props.positions[i - 1];
            let currentElem = this.props.positions[i];

            let diffX = Math.abs(prevElem[0]-currentElem[0]);
            let diffY = Math.abs(prevElem[1]-currentElem[1]);

                
            if (diffX !== 0 || diffY !== 0) {
                if (diffX !== 0) {
                    if (currentElem[0] > prevElem[0]) {
                        nextBlock[0] += 1;
                    }
                    else {
                        nextBlock[0] -= 1;
                    }
                }

                if (diffY !== 0) {
                    if (currentElem[1] > prevElem[1]) {
                        nextBlock[1] += 1;
                    }
                    else {
                        nextBlock[1] -= 1;
                    }
                }

                if (nextBlock[0] >= 0 && nextBlock[0] < this.props.size && nextBlock[1] >= 0 && nextBlock[1] < this.props.size) {
                    let nB = nextBlock.slice();
                    this.state.shadowBlocks.push(nB);
                }

            }

        }

        this.setState(this.state);
    }
});