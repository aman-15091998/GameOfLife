const canvas=document.querySelector("#myCanvas");
const startBtn=document.querySelector("#startBtn");
const resetBtn=document.querySelector("#resetBtn");
const randomBtn=document.querySelector("#randomBtn");
const ctx=canvas.getContext("2d");
ctx.lineWidth = 1;
ctx.strokeStyle="rgba(255, 255, 255, 0.1)";
let timerId;            
let pixelSize=15;   
let gridSize=30;
let grid=resetGrid();


// Functions
function handleStart(){
    randomBtn.disabled=true;
    if(!timerId){                   //If timer is not set start the timer (starting the game)
        startBtn.textContent="Stop";
        timerId=setInterval(()=>{
            grid=getNextState(grid);  //Updating the grid with the next state
            fillGrid(grid);             // Rendering the updated grid 
        }, 200);                    
    }
    else {                      //If timer is set reset the timer (pausing the game)
        startBtn.textContent="Start";
        clearInterval(timerId);
        timerId=null;
    }
}
function getNextState(grid){
    let newGrid=[]; //Storing the next state in this grid
    for(let i=0; i<gridSize; i++){
        let subArr=[];
        for(let j=0; j<gridSize; j++){
            subArr.push(0);
        }
        newGrid.push(subArr);
    }
    for(let i=0; i<gridSize; i++){
        for(let j=0; j<gridSize; j++){
            let sum=getNeighbourSum(i, j, grid);    //Getting the count of neighbouring active pixels
            if(sum==3)
                newGrid[i][j]=1;
            else if(sum<2 || sum>3)
                newGrid[i][j]=0;
            else{
                newGrid[i][j]=grid[i][j];
            }
        }
    }
    return newGrid; //Returning the next state
}
function getNeighbourSum(i, j, grid){
    let sum=0;
    for(let row=-1; row<=1; row++){
        for(let col=-1; col<=1; col++){
            if(i+row>=0 && i+row<gridSize && j+col>=0 && j+col<gridSize)   
                sum+=grid[i+row][j+col];
        }
    }
    sum-=grid[i][j];  
    return sum;     
}
function resetGrid(){
    startBtn.disabled=true;
    const grid=[];
    //Generating an empty grid containing all zeros
    for(let i=0; i<gridSize; i++){      
        let subArr=[];
        for(let j=0; j<gridSize; j++){
            subArr.push(0);
        }
        grid.push(subArr);
    }
    makeGrid();
    makeGrid();
    startBtn.textContent="Start";
    if(timerId){                    //Stoping the running game
        clearInterval(timerId);
        timerId=null;
    }
    randomBtn.disabled=false;
    return grid;  //Returning the updating the grid
}
function makeGrid(){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas
    //Adding grid lines in the canvas
    for(let i=0; i<=pixelSize*gridSize; i+=pixelSize){
        // x axis
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 450);
        ctx.stroke();
        // y axis
        ctx.moveTo(0, i);
        ctx.lineTo(450, i);
        ctx.stroke();
    }
}
//Rendering the grid
function fillGrid(grid){
    for(let i=0; i<gridSize; i++){
        for(let j=0; j<gridSize; j++){
            if(grid[i][j]==1){
                ctx.fillStyle = "orange";     // Orange if active(1)
                ctx.fillRect(i*pixelSize+1, j*pixelSize+1, pixelSize-2, pixelSize-2);
            }else{
                ctx.fillStyle = "black";       // black if inactive(0)
                ctx.fillRect(i*pixelSize+1, j*pixelSize+1, pixelSize-2, pixelSize-2);   
            }
        }
        
    }
}
// Creating random grid
function createRandomGrid(grid){
    startBtn.disabled=false;
    for(let i=0; i<gridSize; i++){
        for(let j=0; j<gridSize; j++){
            grid[i][j]=(Math.round(Math.random(2)));    //Populating the grid with random 0 and 1 values
        }
    }
    makeGrid();
    fillGrid(grid);
}
function handleCanvasClick(event, grid){
    startBtn.disabled=false;
           
    let rect = canvas.getBoundingClientRect(); // Getting the canvas bounding rectangle

    // Calculating the mouse position relative to the canvas
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    // Calculating the cordinates in multiples of pixel resolution.
    x=x-(x%pixelSize);
    y=y-(y%pixelSize);
   
    let i=x/pixelSize, j=y/pixelSize;  // Calculating the index i, j for array(grid)
    grid[i][j]=(grid[i][j]==1?0:1);  // Updating the input in the grid with 0 or 1;
    fillGrid(grid);
    
}
// Event Listeners
canvas.addEventListener('click', (event)=>{handleCanvasClick(event, grid)});  // Handles the input in the canvas
randomBtn.addEventListener("click", ()=>{createRandomGrid(grid)});           // Generates a 30 by 30 grid with random 1 and 0 values
resetBtn.addEventListener("click", ()=>{ grid=resetGrid()});            // Resets the grid and timer
startBtn.addEventListener("click", ()=>{ handleStart()})         // Starts timer and calculates the next step      