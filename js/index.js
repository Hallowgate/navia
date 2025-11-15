$(document).ready(function(){
    start();
    eventBind();
});

function start() {
    $(".main_screen").load("/html/ladder.html");
    $(".tit_name").text("사다리타기");
};

function eventBind() {
    $("#ladder").click(function() {
        $(".tit_name").text("사다리타기");
        $(".main_screen").load("/html/ladder.html");
    });

    $("#mine").click(function() {
        $(".tit_name").text("지뢰찾기");
        $(".main_screen").load("/html/mine.html");
    });

    $("#dice").click(function() {
        $(".tit_name").text("랜덤주사위");
        $(".main_screen").load("/html/dice.html");
    });
};