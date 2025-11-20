$(document).ready(function(){
    start();
    eventBind();
});

var count = 5;

function start() {
    $(".main_screen").load("html/ladder.html");
    $(".tit_name").text("사다리타기");
};

function eventBind() {
    $("#ladder").click(function() {
        $(".tit_name").text("사다리타기");
        $(".main_screen").load("html/ladder.html");
    });

    $("#mine").click(function() {
        $(".tit_name").text("지뢰찾기");
        $(".main_screen").load("html/mine.html");
    });

    $("#dice").click(function() {
        $(".tit_name").text("랜덤주사위");
        $(".main_screen").load("html/dice.html");
    });

    // $(".count_down_btn").click(function() {
    // });

    // $(".count_up_btn").click(function() {
    // });


    // 세로 막대 위의 텍스트 상자에는 기본적으로 placeholder를 통해 숫자를 입력해두고 그대로 진행 할 경우는 숫자가 value로 변경
    // 세로 막대 밑의 텍스트 상자에는 기본적으로는 value 값이 없음 (미입력시 : 결과 때 이어진 막대의 value를 그대로 입력해 줌)
    // 세로 막대 밑의 텍스트 상자에는 당첨자 수를 체크해서 넣어주는 시스템 추가 (나중에 추가)
    // 사다리의 세로 막대의 갯수는 10개까지로 지정
    // 사다리 세로 막대는 사용자가 설정한 갯수 만큼 생성
    // 사다리 가로 선 총 갯수 (세로막대 수 *5) +-1
    // 가로 선은 같은 위치에 그어질 수 없음
    // 두 막대 사이의 가로 선의 갯수는 최종적으로 4개~8개 사이로만 가능
};
