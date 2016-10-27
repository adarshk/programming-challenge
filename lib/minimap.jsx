import React from 'react';

export default React.createClass({
    getInitialState() {
        return {};
    },

    render() {

        if(this.props.positions.length < 1){
            return <div></div>
        }

        let minimap = [];
        let xPos = 0;
        let yPos = 0;
        let sz = this.props.size / 2;

        let style = {
            width: sz,
            height: sz,
            transform: 'translate('+xPos + 'px, '+ yPos + 'px)'
        }

        for(let i=0; i<this.props.positions.length; i++){
            if (i == 0) {
                
                let elem = <div className='square' style={style} ref='square'></div>
                minimap.push(elem)
                continue;
            }
            
            let prevElem = this.props.positions[i-1];
            let currentElem = this.props.positions[i];

            let diffX = Math.abs(prevElem[0]-currentElem[0]);
            let diffY = Math.abs(prevElem[1]-currentElem[1]);


            if (diffX !== 0 || diffY !== 0) {
                if (diffX !== 0) {
                    if (currentElem[0] > prevElem[0]) {
                        xPos += sz;
                    }
                    else {
                        xPos -= sz;
                    }
                }

                if (diffY !== 0) {
                    if (currentElem[1] > prevElem[1]) {
                        yPos += sz;
                    }
                    else {
                        yPos -= sz;
                    }
                }
            }


            style = {
                width: sz,
                height: sz,
                transform: 'translate('+xPos + 'px, '+ yPos + 'px)'
            }


            let elem = <div className='square mini' style={style} ref='square'></div>
            minimap.push(elem)

        }
         
        return <div className="minimap">
                    {minimap}
                </div>
    },
});