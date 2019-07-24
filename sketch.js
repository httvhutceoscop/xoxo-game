const CANVAS_H = 400;
const CANVAS_W = 400;
const GAP = 20;
const HALF_GAP = GAP / 2;
const COORD_H = CANVAS_H / GAP;
const COORD_W = CANVAS_W / GAP;
const STROCKE_COLOR = 103;
const PIE_COLOR = 'rgb(255, 0, 0)';
const PIE_COLOR_2 = 'rgb(0, 0, 0)';
const PLAYER_1 = 'PLAYER_1';
const PLAYER_2 = 'PLAYER_2';
const COUNT_WIN = 5;

const HORIZONTAL_WIN = 'HORIZONTAL_WIN';
const VERTICAL_WIN = 'VERTICAL_WIN';
const UP_DIAGONAL_WIN = 'UP_DIAGONAL_WIN';
const DOWN_DIAGONAL_WIN = 'DOWN_DIAGONAL_WIN';

let pieColor = PIE_COLOR;
let switchTurn = PLAYER_1;

let arrPies = [];
let player2Pies = [];
let player1Pies = [];

let g_player1Count = 0;
let g_player2Count = 0;
let g_typeWin = '';

let winLineEndHorizontal = [];
let winLineEndVertical = [];
let winLineEndUpDiagonal = [];
let winLineEndDowDiagonal = [];

function setup() {
  let cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.id('canvas-xoxo');
  stroke(STROCKE_COLOR);
  noLoop();

  // Generate array of items
  for (let i = 0; i < COORD_W; i ++) {
    for (let j = 0; j < COORD_H; j ++) {
      arrPies.push([i,j]);
    }
  }
  drawBoard();
}

function draw() {
  // background(0);
  // noFill();
}

function mousePressed() {

  if (mouseX > width || mouseY > height) {
    return false;
  }

  if (g_player1Count == COUNT_WIN || g_player2Count == COUNT_WIN) {
    return false;
  }

  let px = Math.floor(mouseX / GAP);
  let py = Math.floor(mouseY / GAP);

  if (checkExistedPie(arrPies, [px, py])) {
    // remove item in array
    arrPies = arrPies.filter((value, index) => JSON.stringify(value) !== JSON.stringify([px, py]))
  } else {
    return false
  }

  if (pieColor === PIE_COLOR) {
    pieColor = PIE_COLOR_2;
  } else {
    pieColor = PIE_COLOR;
  }

  fill(pieColor);
  drawCircle({x: px * GAP + HALF_GAP, y: py * GAP + HALF_GAP}, HALF_GAP);

  if (switchTurn == PLAYER_1) {
    switchTurn = PLAYER_2;
    player1Pies.push([px, py]);
    checkWinHorizontal(player1Pies, [px, py], PLAYER_1);
    checkWinVertical(player1Pies, [px, py], PLAYER_1);
    checkWinUpDiagonal(player1Pies, [px, py], PLAYER_1);
    checkWinDownDiagonal(player1Pies, [px, py], PLAYER_1);
  } else {
    switchTurn = PLAYER_1;
    player2Pies.push([px, py]);
    checkWinHorizontal(player2Pies, [px, py], PLAYER_2);
    checkWinVertical(player2Pies, [px, py], PLAYER_2);
    checkWinUpDiagonal(player2Pies, [px, py], PLAYER_2);
    checkWinDownDiagonal(player2Pies, [px, py], PLAYER_2);
  }

  checkEndGame();
}

function checkWinHorizontal (a_pies, p, player, bEndLeft = false, count = 1) {
  let lPx = p[0] > 0 ? p[0] - 1 : p[0];
  let rPx = p[0] < CANVAS_W / GAP ? p[0] + 1 : p[0];
  let lPoint = [lPx, p[1]];
  let rPoint = [rPx, p[1]];

  winLineEndHorizontal.push(rPoint);

  if (count == COUNT_WIN) { 
    g_typeWin = HORIZONTAL_WIN;
    if (player == PLAYER_1) {
      g_player1Count = count;
    } else {
      g_player2Count = count;
    }

    return true;
  }

  if (checkExistedPie(a_pies, lPoint) && !bEndLeft && lPoint[0] != 0) {
    checkWinHorizontal(a_pies, lPoint, player, false);
  } else {
    if (checkExistedPie(a_pies, rPoint)) {
      winLineEndHorizontal = [];
      count += 1;
      checkWinHorizontal(a_pies, rPoint, player, true, count);
    }
  }
}

function checkWinVertical (a_pies, p, player, bEndTop = false, count = 1) {
  let tPy = p[1] > 0 ? p[1] - 1 : p[1];
  let bPy = p[1] < CANVAS_H / GAP ? p[1] + 1 : p[1];
  let tPoint = [p[0], tPy];
  let bPoint = [p[0], bPy];

  winLineEndVertical.push(bPoint);

  if (count == COUNT_WIN) { 
    g_typeWin = VERTICAL_WIN;
    if (player == PLAYER_1) {
      g_player1Count = count;
    } else {
      g_player2Count = count;
    }
    console.log(winLineEndVertical);
    return true;
  }

  if (checkExistedPie(a_pies, tPoint) && !bEndTop && tPoint[1] != 0) {
    checkWinVertical(a_pies, tPoint, player, false);
  } else {
    if (checkExistedPie(a_pies, bPoint)) {
      winLineEndVertical = [];
      count += 1;
      checkWinVertical(a_pies, bPoint, player, true, count);
    }
  }
}

function checkWinUpDiagonal (a_pies, p, player, bEndLeft = false, count = 1) {
  let lPx = p[0] > 0 ? p[0] - 1 : p[0];
  let lPy = p[1] < CANVAS_H / GAP ? p[1] + 1 : p[1];

  let rPx = p[0] < CANVAS_W / GAP ? p[0] + 1 : p[0];
  let rPy = p[1] > 0 ? p[1] - 1 : p[1];
  
  let lPoint = [lPx, lPy];
  let rPoint = [rPx, rPy];

  winLineEndUpDiagonal.push(rPoint);

  if (count == COUNT_WIN) { 
    g_typeWin = UP_DIAGONAL_WIN;
    if (player == PLAYER_1) {
      g_player1Count = count;
    } else {
      g_player2Count = count;
    }
    console.log('winLineEndUpDiagonal', winLineEndUpDiagonal);
    return true;
  }

  if (checkExistedPie(a_pies, lPoint) && !bEndLeft && lPoint[0] != 0) {
    checkWinUpDiagonal(a_pies, lPoint, player, false);
  } else {
    if (checkExistedPie(a_pies, rPoint)) {
      winLineEndUpDiagonal = [];
      count += 1;
      checkWinUpDiagonal(a_pies, rPoint, player, true, count);
    }
  }
}

function checkWinDownDiagonal (a_pies, p, player, bEndLeft = false, count = 1) {
  let lPx = p[0] > 0 ? p[0] - 1 : p[0];
  let lPy = p[1] > 0 ? p[1] - 1 : p[1];

  let rPx = p[0] < CANVAS_W / GAP ? p[0] + 1 : p[0];
  let rPy = p[1] < CANVAS_H / GAP ? p[1] + 1 : p[1];
  
  let lPoint = [lPx, lPy];
  let rPoint = [rPx, rPy];

  winLineEndDowDiagonal.push(rPoint);

  if (count == COUNT_WIN) { 
    g_typeWin = DOWN_DIAGONAL_WIN;
    if (player == PLAYER_1) {
      g_player1Count = count;
    } else {
      g_player2Count = count;
    }
    console.log(winLineEndDowDiagonal);
    return true;
  }

  if (checkExistedPie(a_pies, lPoint) && !bEndLeft && lPoint[0] != 0) {
    checkWinDownDiagonal(a_pies, lPoint, player, false);
  } else {
    if (checkExistedPie(a_pies, rPoint)) {
      winLineEndDowDiagonal = [];
      count += 1;
      checkWinDownDiagonal(a_pies, rPoint, player, true, count);
    }
  }
}

function checkEndGame () {
  setTimeout(function(){
    if (arrPies.length == 0) {
      console.log('Draw!');
    }

    if (g_player1Count == COUNT_WIN || g_player2Count == COUNT_WIN) {
      hightLightWin();
    }

    if (g_player1Count == COUNT_WIN) {
      document.getElementById('notification').innerHTML = 'Player 1 won!';
      console.log('PLAYER_1 won!');
    }
    if (g_player2Count == COUNT_WIN) {
      document.getElementById('notification').innerHTML = 'Player 2 won!';
      console.log('PLAYER_2 won!');
    }
  }, 1000)
}

function hightLightWin () {
  let p1 = null;
  let p2 = null;
  switch (g_typeWin) {
    case HORIZONTAL_WIN: {
      p1 = {x: winLineEndHorizontal[0][0] * GAP - HALF_GAP, y: winLineEndHorizontal[0][1] * GAP + HALF_GAP};
      p2 = {
        x: (winLineEndHorizontal[0][0] - COUNT_WIN + 1) * GAP - HALF_GAP, 
        y: winLineEndHorizontal[0][1] * GAP + HALF_GAP
      };
      break;
    }
    case VERTICAL_WIN: {
      p1 = {x: winLineEndVertical[0][0] * GAP + HALF_GAP, y: winLineEndVertical[0][1] * GAP - HALF_GAP};
      p2 = {
        x: winLineEndVertical[0][0] * GAP + HALF_GAP, 
        y: (winLineEndVertical[0][1] - COUNT_WIN) * GAP + HALF_GAP
      };
      break;
    }
    case UP_DIAGONAL_WIN: {
      p1 = {x: (winLineEndUpDiagonal[0][0] - 1) * GAP + HALF_GAP, y: (winLineEndUpDiagonal[0][1] + 2) * GAP - HALF_GAP};
      p2 = {
        x: (winLineEndUpDiagonal[0][0] - COUNT_WIN) * GAP + HALF_GAP, 
        y: (winLineEndUpDiagonal[0][1] + COUNT_WIN) * GAP + HALF_GAP
      };
      break;
    }
    case DOWN_DIAGONAL_WIN: {
      p1 = {x: (winLineEndDowDiagonal[0][0] - 1) * GAP + HALF_GAP, y: (winLineEndDowDiagonal[0][1]) * GAP - HALF_GAP};
      p2 = {
        x: (winLineEndDowDiagonal[0][0] - COUNT_WIN) * GAP + HALF_GAP, 
        y: (winLineEndDowDiagonal[0][1] - COUNT_WIN) * GAP + HALF_GAP
      };
      break;
    }
    default:
      break;
  }
  
  if (p2 != null && p1 != null) {
    strokeWeight(4);
    drawLine(p1, p2);
  }
}

function checkExistedPie (arr, p) {
  // let check = arr.some(a => p.every((v, i) => v === a[i]));
  // return check;

  let a = JSON.stringify(arr);
  let b = JSON.stringify(p);
  let c = a.indexOf(b);

  return c != -1;
}

function drawBoard () {
  for (let i = 0; i <= width; i += GAP) {
    line(0, i, width, i);
  }
  for (let i = 0; i <= height; i += GAP) {
    line(i, 0, i, height);
  }
}

function drawCircle (p = {x : 0, y: 0}, r) {
  noStroke();
  // fill(0);
  ellipse(p.x, p.y, r, r);
}

function drawLine (p1, p2) {
  stroke(255,0,255);
  line(p1.x, p1.y, p2.x, p2.y);
}

class Shape {

}
