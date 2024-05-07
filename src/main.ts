const appBody = document.querySelector('#app') as HTMLDivElement;

const cellSizeX = 50
const cellSizeY = 50
const canvasWidth = 800
const canvasHeight = 800

let playerDirection : string = '';


const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = '5px solid black';
  appBody.appendChild(canvas);
  return canvas;
}


const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


const createGrid = (width: number, height: number, rows: number, cols: number) => {
  const matrix: any[][]  = []

  let originX = 0
  let originY = 0

  ctx.fillStyle = 'black';
  
  for(let i = 0; i < rows; i++) {
    matrix.push([])
    // console.log(matrix)
  }

  for(let arr of matrix) {
    for(let i = 0; i < cols; i++) {    
      arr.push(0)
      originX += width
    }
    originY += height
    originX = 0
  }  
  
  return matrix
};

const mainGrid = createGrid(cellSizeX, cellSizeY, canvasHeight/cellSizeY,canvasWidth/cellSizeX)







// updateGrid()

let currentX = 6
let currentY = 6

// Have an array the previous cell gets pushed into and vary the amount allowed by snake length

let playerLength = 1
let playerCells : Array<[number, number]>= []
// playerCells.push([currentY, currentX])  
const updateLength = function() {
  if(playerCells.length > playerLength){
    mainGrid[playerCells[0][0]].fill(0, playerCells[0][1], playerCells[0][1]+1)
    playerCells = playerCells.splice(1,playerLength,)
  }
}
console.log(playerCells)




// Controls and Movment

let canMove : Boolean = true

const moveRight = () => {
  if (currentX <= (mainGrid[currentY].length - 2)) {
    playerCells.push([currentY, currentX]);
    if(mainGrid[currentY][currentX + 1] === 17) {
      playerLength += 1
      console.log(`player len increased ${playerLength}`)
      spawnFood()
    }
    currentX += 1;
    mainGrid[currentY][currentX] = 15;
    console.log(`${currentX},${currentY}`);
  }
};

const moveLeft = () => {
  if (currentX >= (1)) {
    playerCells.push([currentY, currentX]);
    if(mainGrid[currentY][currentX - 1] === 17) {
      playerLength += 1
      console.log(`player len increased ${playerLength}`)
      spawnFood()
    }
    currentX -= 1;
    mainGrid[currentY][currentX] = 15;
    console.log(`${currentX},${currentY}`);
  }
};

const moveDown = () => {
  if (currentY <= (mainGrid.length - 2)) {
    playerCells.push([currentY, currentX]);
    if(mainGrid[currentY + 1 ][currentX] === 17) {
      playerLength += 1
      console.log(`player len increased ${playerLength}`)
      spawnFood()
    }
    currentY += 1;
    mainGrid[currentY][currentX] = 15;
    console.log(`${currentX},${currentY}`);
  }
};

const moveUp = () => {
  if (currentY >= (1)) {
    playerCells.push([currentY, currentX]);
    if(mainGrid[currentY - 1 ][currentX] === 17) {
      playerLength += 1
      console.log(`player len increased ${playerLength}`)
      spawnFood()
    }
    currentY -= 1;
    mainGrid[currentY][currentX] = 15;
    console.log(`${currentX},${currentY}`);
  }
};


window.addEventListener('keydown', (Event) => {
  if(Event.key === 'w' && canMove){playerDirection = 'up'}
  if(Event.key === 's' && canMove){playerDirection = 'down'}
  if(Event.key === 'a' && canMove){playerDirection = 'left'}
  if(Event.key === 'd' && canMove){playerDirection = 'right'}


  if(Event.key === 'c') {
    console.log(mainGrid)
    console.log(playerCells)
  }
})


//###################   ADDS STOPPING FUNCTIONALITY ##############//

// window.addEventListener('keyup', (Event) => {
//   if(Event.key === 'w' || Event.key === 's' || Event.key === 'a' || Event.key === 'd' && canMove) {
//     playerDirection = ''
//   }
// })

let mouseX : number
let mouseY : number
let colIndex : number
let rowIndex : number

canvas.addEventListener('mousedown', function(Event) {

  const boundingBox = canvas.getBoundingClientRect()

  mouseX = Event.clientX - boundingBox.left
  mouseY = Event.clientY - boundingBox.top

  rowIndex = Math.floor(mouseY / cellSizeY)
  colIndex = Math.floor(mouseX / cellSizeX)

  if(mainGrid[rowIndex][colIndex] === 0) {
    mainGrid[rowIndex][colIndex] = 10
  }


  console.log(mouseX, mouseY)
  console.log(rowIndex, colIndex)
})




const playerDirectionControl = function() {
  switch(playerDirection) {
    case 'up':
      moveUp()
      break;
    case 'down':
      moveDown()
      break;
    case 'left':
      moveLeft()
      break;
    case 'right':
      moveRight()
      break;
    default:
      ''
  }
}

const updateGrid = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  let originY = 0 
  for(let cell of mainGrid) {
    let originX = 0
    for(let i = 0; i < cell.length; i++) {

      // Making the train behind the snake head blue
      for(let [a,b] of playerCells) {
        mainGrid[a].splice(b,1,15)
      }

      if(cell[i] === 15) {
        ctx.fillStyle = 'blue'
        ctx.fillRect(originX, originY, 50, 50);
      }
      if(cell[i] === 10) {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(originX, originY, 50, 50);
      }
      if(cell[i] === 17) {
        ctx.fillStyle = 'red'
        ctx.fillRect(originX, originY, 50, 50);
      }
      if(cell[i] === 0) {
        ctx.fillStyle = 'white'
        ctx.strokeRect(originX, originY, 50, 50);
      }
      originX += 50
    }
    originY += 50
    // console.log(mainGrid)
  }
  canMove = true
}

//Player start pos render
mainGrid[currentY].fill(15, currentX, currentX + 1)

// Food Render
const spawnFood = function() {

  const newSpawnY = Math.floor(Math.random() * canvasHeight/cellSizeY)
  const newSpawnX = Math.floor(Math.random() * canvasWidth/cellSizeX)

  
  for(let [a,b] of playerCells) {
    if (a === newSpawnY && b === newSpawnX) {
      spawnFood()
      console.log('Match')
    }
  }
  mainGrid[newSpawnY].fill(17, newSpawnX, newSpawnX + 1)

}
spawnFood()


// const circleSnake = () => {
//   setInterval(moveDown,2000)
//   setInterval(moveLeft,6000)

// }

// circleSnake()


let playerSpeed : number = 10

setInterval(function() {
  playerDirectionControl()
  console.log(playerDirection)
},1000/playerSpeed)





const gameLoop = function() {


  if(canMove) {  
    canMove = false
    updateGrid()

    updateLength()

    requestAnimationFrame(gameLoop)
  } else {

    requestAnimationFrame(gameLoop)
  }

};
gameLoop();

// console.log(maindGrid[6][4])


