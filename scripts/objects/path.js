MyGame.objects.Path = function (board, magic) {
  
  //paths = {}
  queue = [];
  visited = {};
  function findPath(center, end, type) {

    goal = magic.converter.pixelToGrid(end);
    start = magic.converter.pixelToGrid(center);
    
    queue = [];
    visited = {};
    queue.push({ pos: start, lastPos: null })
    while (queue.length > 0) {
      let currCell = queue[0]
      queue.splice(0, 1)
      if(type == "Cursor"){
        if (checkCursorCell(currCell.pos, currCell.lastPos, goal)) { break }
      }
      else if(type == "flying"){
        if (checkFlyCell(currCell.pos, currCell.lastPos, goal)) { break }
      }
      else{
        if (checkGroundCell(currCell.pos, currCell.lastPos, goal)) { break }
      }
    }
    let backpath = [];
    let curPos = goal;
    
    let stringPos = "x:"+ String(curPos.x-1) + "y:" + String(curPos.y-1)
    while (stringPos in visited && visited[stringPos] != null) {
      
      if (curPos != null) {
        backpath.push(curPos);
      }
      curPos = visited[stringPos];
      stringPos = "x:"+ String(curPos.x) + "y:" + String(curPos.y)
    }
    
    backpath = backpath.reverse();
    //let stringGoal = "x:"+ String(goal.x) + "y:" + String(goal.y)
    //paths[stringGoal] = backpath;
    
    if(backpath.length == 0){
      return null
    }
    else{return backpath}
  }
  function checkCursorCell(currentpos, lastPos, goal) {
    
    //console.log(currentpos)
    if(currentpos.x <0 || currentpos.y <0 || currentpos.x > magic.GRID_SIZE-1 || currentpos.y > magic.GRID_SIZE-1){
      //console.log("here 1")
      return false;
    }
    if (board[currentpos.x][currentpos.y].object != null) {
      //console.log("here 2")
      return false;
    }
    let stringPos = "x:"+ String(currentpos.x) + "y:" + String(currentpos.y)
    
    if (stringPos in visited) {
      //console.log("here 3")
      return false;
    }
    visited[stringPos] = lastPos;
    if (currentpos.x == goal.x-1 && currentpos.y == goal.y-1) {
      console.log("here")
      return true;
    }
    queue.push({ pos: { x: currentpos.x + 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y + 1 }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x - 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y - 1 }, lastPos: currentpos });
    return false;
  }
  
  function checkGroundCell(currentpos, lastPos, goal) {
    
    //console.log(currentpos)
    if(currentpos.x <0 || currentpos.y <0 || currentpos.x > magic.GRID_SIZE-1 || currentpos.y > magic.GRID_SIZE-1){
      //console.log("here 1")
      return false;
    }
    if (board[currentpos.x][currentpos.y].object != null && board[currentpos.x][currentpos.y].object != "Cursor") {
      //console.log("here 2")
      return false;
    }
    let stringPos = "x:"+ String(currentpos.x) + "y:" + String(currentpos.y)
    
    if (stringPos in visited) {
      //console.log("here 3")
      return false;
    }
    visited[stringPos] = lastPos;
    if (currentpos.x == goal.x-1 && currentpos.y == goal.y) {
      return true;
    }
    queue.push({ pos: { x: currentpos.x + 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y + 1 }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x - 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y - 1 }, lastPos: currentpos });
    return false;
  }

  function checkFlyCell(currentpos, lastPos, goal) {
    
    //console.log(currentpos)
    if(currentpos.x <0 || currentpos.y <0 || currentpos.x > magic.GRID_SIZE-1 || currentpos.y > magic.GRID_SIZE-1){
      //console.log("here 1")
      return false;
    }
    if (board[currentpos.x][currentpos.y].object == "wall") {
      //console.log("here 2")
      return false;
    }
    let stringPos = "x:"+ String(currentpos.x) + "y:" + String(currentpos.y)
    
    if (stringPos in visited) {
      //console.log("here 3")
      return false;
    }
    visited[stringPos] = lastPos;
    if (currentpos.x == goal.x-1 && currentpos.y == goal.y) {
      return true;
    }
    queue.push({ pos: { x: currentpos.x + 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y + 1 }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x - 1, y: currentpos.y }, lastPos: currentpos });
    queue.push({ pos: { x: currentpos.x, y: currentpos.y - 1 }, lastPos: currentpos });
    return false;
  }
  
  let api = {
    findPath: findPath,
    get paths() { return paths; },
  };

  return api;
}
