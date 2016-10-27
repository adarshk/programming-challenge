function makeArrows(size) {
	let arrs = [];
    for(let i=0; i < size * size; i++){
        arrs.push('←→↓↑'[Math.floor(Math.random() * 4)]);
    }

    return arrs;
}


function checkIfInArray(elem, array){

    let arr = array.filter((value, index)=>{
        return elem[0] == value[0] && elem[1] == value[1];
    })

    return arr.length > 0 ? true : false;
}

module.exports = {
	makeArrows: makeArrows,
	checkIfInArray: checkIfInArray
}