/**
 * Created by Dilini Peiris on 9/6/2017.
 */

$(document).ready(function () {
    clearScope();

    $("body > div:last").remove();
});

window.onload = function () {
    var name1 = localStorage.getItem("player1");
    var name2 = localStorage.getItem("player2");
    $("#pl-1").text(name1);
    $("#pl-2").text(name2);
    console.log("set headings")
    localStorage.removeItem("player1");
    localStorage.removeItem("player2");
}



var scopeOfWP = [];
var scopeOfBP = [];
var scopeOfPiece = [];
var scopes = [scopeOfPiece, scopeOfWP, scopeOfBP];
var sqNotation = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];

var moveNum = 0;
var script = "";
// var side = 1;


//make pieces able to be dragged
$(".piece").draggable({
    revert: "invalid",
    scope: "accept"
});

//make pawns able to be dragged
$(".wP,.bP").draggable({
    revert: "invalid",
    scope: "accept"
});

// set default scope settings for droppable
$(".white,.black").droppable({
    // tolerance: "fit",
    drop: move
});

//moving the piece
function move(event, ui) {
    var droppableID = $(this).attr("id");
    console.log("dropped" + droppableID);
    ui.draggable.css("top", 0);
    ui.draggable.css("left", 0);

    var draggableID = ui.draggable.attr("id");
    var draggableHomePos = $("#" + draggableID.toString()).parent().attr("id");
    var piece = draggableID.charAt(1);
    var pieceColor = draggableID.charAt(0);

    if ($("#" + droppableID).children().length == 0) {
        $("#" + droppableID).children().remove();
        $("#" + droppableID).append(ui.draggable);
        if (piece === "P") {
            writeOnScoreSheet(pieceColor, sqNotation[droppableID - 1]);
        } else {
            writeOnScoreSheet(pieceColor, piece.toString().concat(sqNotation[droppableID - 1]));
        }
    } else {
        $("#" + droppableID).children().remove();
        $("#" + droppableID).append(ui.draggable);
        // if ($("#" + droppableID).children().first().charAt(1) != "K") {
        //
        // }
        if (piece === "P") {
            writeOnScoreSheet(pieceColor, sqNotation[draggableHomePos - 1].charAt(0).concat("x").concat(sqNotation[droppableID - 1]));
        } else {
            writeOnScoreSheet(pieceColor, piece.concat("x").concat(sqNotation[droppableID - 1]));
        }
    }
}

function writeOnScoreSheet(color, record) {
    if (color === "w") {
        moveNum++;
        script += (moveNum + ". \t");
    }
    script += record;
    if (color === "b") {
        script += "\n";
    } else if (color === "w") {
        script += ", \t"
    }
    $("#sheet").text(script.toString());
}

//setting scope for pawns on mousedown
$(".wP, .bP").on("mousedown", function (event) {
    clearScope();
    console.log("event triggered");
    var triggerPiece = event.target.id;
    console.log(triggerPiece);

    var currentPos = parseInt($("#" + triggerPiece.toString()).parent().attr("id"));
    console.log(currentPos);

    var row = $("#" + triggerPiece).parent().parent().attr("id");
    console.log(row);

    //if the pawn is in its starting position
    if (row === "2-row" & triggerPiece.toString().charAt(0) == 'w' & $("#" + (currentPos + 16).toString()).children().length == 0) {
        console.log("nothing two squares ahead");
        scopeOfWP.push(currentPos + 16);
    }
    if (row === "7-row" & triggerPiece.toString().charAt(0) == 'b' & $("#" + (currentPos - 16).toString()).children().length == 0) {
        console.log("nothing two squares ahead");
        scopeOfBP.push(currentPos - 16);
    }

//if there is a piece in front of the pawn, it cant move forward
    if (((triggerPiece.toString().charAt(0) == 'w' & $("#" + (currentPos + 8).toString()).children().length != 0)) | ((triggerPiece.toString().charAt(0) == 'b' & $("#" + (currentPos - 8).toString()).children().length != 0))) {
        console.log("theres a piece in front");
        clearScope();
    } else {
        if (triggerPiece.toString().charAt(0) == 'w') scopeOfWP.push(currentPos + 8);
        if (triggerPiece.toString().charAt(0) == 'b') scopeOfBP.push(currentPos - 8);
    }

//if there is a piece diagonally in front of the pawn and from the opposite side, it can capture it
    if (triggerPiece.toString().charAt(0) == 'w') {
        if ($("#" + (currentPos + 7).toString()).children().length != 0) {
            var frontPiece = $("#" + (currentPos + 7).toString()).children().first().attr("id");
            if (frontPiece.toString().charAt(0) == 'b') scopeOfWP.push(currentPos + 7);
        }
        if (currentPos % 8 != 0) {
            if ($("#" + (currentPos + 9).toString()).children().length != 0) {
                var frontPiece = $("#" + (currentPos + 9).toString()).children().first().attr("id");
                if (frontPiece.toString().charAt(0) == 'b') scopeOfWP.push(currentPos + 9);
            }
        }
    } else {
        if ($("#" + (currentPos - 7).toString()).children().length != 0) {
            var frontPiece = $("#" + (currentPos - 7).toString()).children().first().attr("id");
            if (frontPiece.toString().charAt(0) == 'w') scopeOfBP.push(currentPos - 7);
        }
        if ($("#" + (currentPos - 9).toString()).children().length != 0) {
            var frontPiece = $("#" + (currentPos - 9).toString()).children().first().attr("id");
            if (frontPiece.toString().charAt() == 'w') scopeOfBP.push(currentPos - 9);
        }
    }
    console.log("scope of wP " + scopeOfWP);
    console.log("scope of bP " + scopeOfBP);
    if (scopeOfBP.length > 0) setScope(scopeOfBP);
    if (scopeOfWP.length > 0) setScope(scopeOfWP);
    highlightScope();
})
;

function clearScope() {
    for (var a = 0; a < scopes.length; a++) {
        var scope = scopes[a];
        if (scope.length > 0) {
            for (var b = 0; b < scope.length; b++) {
                var sqNum = scope[b];
                $("#" + sqNum.toString()).removeClass("scope");
                $("#" + sqNum.toString()).droppable("option", "scope", "invalid");
            }
        }
    }
    scopeOfWP = [];
    scopeOfBP = [];
    scopeOfPiece = [];
}

function setScope(scope) {
    for (var i = 0; i < scope.length; i++) {
        $("#" + scope[i]).droppable("option", "scope", "accept");
    }
}

function highlightScope() {
    scopes = [scopeOfPiece, scopeOfWP, scopeOfBP];
    console.log("going to color scope!!");
    for (var a = 0; a < scopes.length; a++) {
        var scope = scopes[a];
        console.log(scope);
        console.log(scope.length);
        if (scope.length > 0) {
            for (var b = 0; b < scope.length; b++) {
                var sqNum = scope[b];
                console.log("coloring square of scope");
                $("#" + sqNum.toString()).addClass("scope");
            }
        }
    }
}


$(".piece").on("mousedown", function (event) {
    clearScope();
    var triggerPiece = event.target.id;
    var currentPos = parseInt($("#" + triggerPiece.toString()).parent().attr("id"));
    var color = triggerPiece.charAt(0);
    var piece = triggerPiece.charAt(1);

    if (piece === "R") {
        console.log("R selected");
        checkingRookScope(currentPos, color);
    }
    if (piece === "B") {
        console.log("B selected");
        checkingBishopScope(currentPos, color);
    }
    if (piece === "Q") {
        console.log("Q selected");
        checkingBishopScope(currentPos, color);
        checkingRookScope(currentPos, color);
    }
    if (piece === "N") {
        checkingKnightScope(currentPos, color);
    }
    if (piece === "K") {
        checkingKingScope(currentPos, color);
    }

    setScope(scopeOfPiece);
    console.log("scope of piece: " + scopeOfPiece);
    highlightScope();
});

function setScopeOfPiece(i, color) {
    if ($("#" + i.toString()).children().length != 0) {
        console.log("has children");
        if ($("#" + i.toString()).children().first().attr("id").charAt(0) != color) {
            console.log("not the same color");
            // if ($("#" + i.toString()).children().first().attr("id").charAt(1) === "K") {
            //     check = 1;
            // } else {
            scopeOfPiece.push(i);
            // }
            return 1;
        } else {
            return 1;
        }
    } else {
        scopeOfPiece.push(i);
        return 0;
    }
}

function checkingRookScope(i, color) {
    for (var sqNum = i + 1; sqNum % 8 != 1; sqNum++) {   //checking the squares horizontally right
        if (setScopeOfPiece(sqNum, color) == 1) {
            console.log("has something in frnot");
            break;
        }
    }
    for (var sqNum = i - 1; sqNum % 8 != 0; sqNum--) {   //checking the squares horizontally left
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
    for (var sqNum = i + 8; sqNum <= 64; sqNum = sqNum + 8) {     //checking the sqaures vertically up
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
    for (var sqNum = i - 8; sqNum > 0; sqNum = sqNum - 8) {       //checking the squares vertically down
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
}
function checkingBishopScope(i, color) {
    for (var sqNum = i + 9; sqNum <= 64; sqNum = sqNum + 9) {   //checking the squares diagonally right-up
        if (sqNum % 8 < i % 8 & sqNum % 8 != 0) {
            break;
        }
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
    for (var sqNum = i - 9; sqNum > 0; sqNum = sqNum - 9) {   //checking the squares diagonally left-down
        if (sqNum % 8 > i % 8 | sqNum % 8 == 0) {
            break;
        }
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
    for (var sqNum = i + 7; sqNum <= 64; sqNum = sqNum + 7) {     //checking the sqaures diagonally left-up
        if (sqNum % 8 == 0) {
            break;
        }
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
    for (var sqNum = i - 7; sqNum > 0; sqNum = sqNum - 7) {       //checking the squares diagonally right-down
        if (sqNum % 8 == 1) {
            break;
        }
        if (setScopeOfPiece(sqNum, color) == 1) {
            break;
        }
    }
}

function checkingKnightScope(i, color) {
    if (i <= 56 & (i % 8 > 2 | i % 8 == 0)) {
        if ((i + 6) <= 64) setScopeOfPiece(i + 6, color);
    }
    if (i > 9 & (i % 8 < 7 | i % 8 != 0)) {
        if ((i - 6) > 0) setScopeOfPiece(i - 6, color);
    }
    if (i <= 48 & (i % 8 >= 2 | i % 8 == 0)) {
        if ((i + 15) <= 64) setScopeOfPiece(i + 15, color);
    }
    if (i >= 17 & i % 8 != 0) {
        if ((i - 15) > 0) setScopeOfPiece(i - 15, color);
    }
    if (i < 56 & i % 8 < 7 & i % 8 != 0) {
        if ((i + 10) <= 64) setScopeOfPiece(i + 10, color);
    }
    if (i > 9 & (i % 8 >= 2 | i % 8 == 0)) {
        if ((i - 10) > 0) setScopeOfPiece(i - 10, color);
    }
    if (i < 48 & i % 8 != 0) {
        if ((i + 17) <= 64) setScopeOfPiece(i + 17, color);
    }
    if (i >= 17 & (i % 8 >= 2 | i % 8 == 0)) {
        if ((i - 17) > 0) setScopeOfPiece(i - 17, color);
    }
}

function checkingKingScope(i, color) {
    var placesKingCanGo = [i + 1, i - 1, i + 8, i - 8, i + 7, i - 7, i + 9, i - 9];
    var placesOppKingCannotBe = [i + 2, i - 2, i + 16, i - 16, i + 14, i - 14, i + 18, i - 18];
    for (var j = 0; j < placesKingCanGo.length; j++) {
        if ($("#" + placesOppKingCannotBe[j].toString()).children().length != 0) {
            var pieceTwoSquaresApart = $("#" + placesOppKingCannotBe[j]).children().first().attr("id");
            if (pieceTwoSquaresApart.charAt(1) == "K" & pieceTwoSquaresApart.charAt(0) != color) {
                continue;
            }
        } else {
            setScopeOfPiece(placesKingCanGo[j], color);
        }
    }
}
