/*jslint indent: 2 */
/*global alert: true, console: true, document: true, window: true */

var chess = {}; // namespace
chess.BOARD_SIZE = 8;
chess.squares = [];

function $(id) {
  return document.getElementById(id);
}

chess.canDrop = function (event) {
  var from = chess.dragPiece.parentNode, to = event.target;
  return chess.isSquare(to) && chess.isValidMove(from, to);
};

chess.createBoard = function () {
  var rank, row;
  chess.board = $('board');
  for (rank = 1; rank <= chess.BOARD_SIZE; rank += 1) {
    row = chess.createRow(chess.BOARD_SIZE - rank + 1);
  }

  // Make all descendants (including the squares) be drop targets.
  chess.board.addEventListener('dragenter', function (event) {
    var square, valid = chess.canDrop(event);
    if (valid) {
      square = event.target;
      //console.log('entered ' + chess.getSquareName(square));
      //square.classList.add('over');
    }
    return !valid;
  }, false);

  chess.board.addEventListener('dragleave', function (event) {
    var square, valid = chess.canDrop(event);
    if (valid) {
      square = event.target;
      //console.log('exited ' + chess.getSquareName(square));
      //square.classList.remove('over');
    }
    return !valid;
  }, false);

  chess.board.addEventListener('dragover', function (event) {
    if (chess.canDrop(event)) {
      event.preventDefault();
    }
  }, false);

  chess.board.addEventListener('drop', function (event) {
    if (chess.canDrop(event)) {
      event.preventDefault();
      //var data = event.dataTransfer.getData('text/plain');
      chess.dstSquare = event.target; // used in dragend event handler
    }
  }, false);
};

chess.createKnight = function () {
  var image = document.createElement('img');
  image.setAttribute('src', 'knight.gif');
  image.className = 'piece';
  return image;
};

chess.createSquare = function (row) {
  var square = document.createElement('td');
  row.appendChild(square);
  chess.squares.push(square);
  return square;
};

chess.createRow = function (rank) {
  var file, row, square;
  row = document.createElement('tr');
  chess.board.appendChild(row);
  for (file = 1; file <= chess.BOARD_SIZE; file += 1) {
    square = chess.createSquare(row);
    square.rank = rank; 
    square.file = file; 
    chess.setBackground(square);
  }
  return row;
};

chess.getSquare = function (rank, file) {
  return chess.board.querySelector(
    'tr:nth-of-type(' + (chess.BOARD_SIZE - rank + 1) +
    ') > td:nth-of-type(' + file + ')');
};

chess.getSquareName = function (square) {
  return 'ABCDEFGH'[square.file - 1] + square.rank;
};

chess.getValidMoves = function (piece) {
  var file, from = piece.parentNode, moves = [], rank, to;

  chess.squares.forEach(function (to) {
    if (chess.isValidMove(from, to)) {
      moves.push(to);
    }
  });

  return moves;
};

chess.isSquare = function (element) {
  return element.nodeName === 'TD';
};

chess.isValidMove = function (from, to) {
  var fileChange, rankChange;
  rankChange = Math.abs(to.rank - from.rank);
  fileChange = Math.abs(to.file - from.file);
  return rankChange * fileChange === 2;
};

chess.placeKnight = function (row, column) {
  chess.placePiece(chess.createKnight(), row, column);
};

chess.placePiece = function (piece, rank, file) {
  var square = chess.getSquare(rank, file);
  square.appendChild(piece);
  piece.setAttribute('draggable', 'true');

  piece.addEventListener('dragstart', function (event) {
    chess.validMoves = chess.getValidMoves(piece);
    chess.validMoves.forEach(function (square) {
      square.className = 'validSquare';
    });

    chess.dragPiece = piece;
    //event.dataTransfer.setDragImage(chess.createKnight(), 0, 0);
    //piece.square.removeChild(piece);
    event.dataTransfer.effectAllowed = 'move';
    return true;
  }, false);

  piece.addEventListener('dragend', function (event) {
    var piece = event.target;

    if (chess.dstSquare) {
      piece.parentNode.removeChild(piece);
      chess.dstSquare.appendChild(piece);
    } else {
      //piece.square.appendChild(piece);
    }

    chess.validMoves.forEach(function (square) {
      chess.setBackground(square);
    });

    chess.dragPiece = null;
  }, false);
};

chess.setBackground = function (square) {
  var isDark, oddFile, oddRank;
  oddFile = square.file % 2;
  oddRank = square.rank % 2;
  isDark = oddRank ? oddFile : !oddFile;
  square.className = isDark ? 'darkSquare' : 'lightSquare';
};

window.onload = function () {
  //if (DOMImplementation.hasFeature("Selectors-API", "1.0")) {
  //if (document.isSupported("Selectors-API", "1.0")) {
  if (document.querySelector) {
    chess.createBoard();
    chess.placeKnight(1, 2);
    chess.placeKnight(1, 7);
  } else {
    alert("Your browser doesn't support the Selectors API.");
  }
};
