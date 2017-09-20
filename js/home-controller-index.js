/**
 * Created by Dilini Peiris on 9/6/2017.
 */

// function testJS() {
//     var b = document.getElementById("player-1").value;
//     var c = document.getElementById("player-2").value;
//             console.log(b);
//             console.log(c);
//     var url = "chess-game.html?player1=" + encodeURIComponent(b) + "&player2=" + encodeURIComponent(c);
//
//     document.location.href = url;
// }

function testJS(){
    var name1 = $("#player-1").val();
    var name2 = $("#player-2").val();
    localStorage.setItem("player1",name1);
    console.log("set name 1")
    console.log("set name 2")
    localStorage.setItem("player2",name2);
}

$("#start-btn").on("click",testJS);


// var getInput = prompt("Hey type something here: ");
// localStorage.setItem("storageName",getInput);