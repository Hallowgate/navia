$(document).ready(function () {
    start();
    eventBind();
});

var Count = 3;

function start() {

};

function eventBind() {
    $(".count_down_btn").click(function () {
        $(".count").text(`인원수 ${--Count}`);
        if (Count <= 2) {
            $(".count_down_btn").addClass(" disabled");
        } else {
            $(".count_up_btn").removeClass(" disabled");
        }
        $(`.ladder_txt._${Count + 1}`).hide();
        $(`.ladder_bar._${Count + 1}`).hide();
        $(`.ladder_side._${Count + 1}`).hide();
        $(`.ladder_txt._${Count + 1}`).val("");
    });

    $(".count_up_btn").click(function () {
        $(".count").text(`인원수 ${++Count}`);
        if (Count >= 10) {
            $(".count_up_btn").addClass(" disabled");
        } else {
            $(".count_down_btn").removeClass(" disabled");
        }
        $(`.ladder_txt._${Count}`).show();
        $(`.ladder_bar._${Count}`).show();
        $(`.ladder_side._${Count}`).show();
    });

    $(".start_btn").click(function () {
        CreateSideLadder();
        for (var i = 1; i <= Count; i++) {
            if ($(`.ladder_txt._${i}:visible`)) {
                //console.log($(`.ladder_txt.up._${i}`).val());
                //console.log($(`.ladder_txt.down._${i}`).val());
            }
        }
    });

    // 세로 막대 위의 텍스트 상자에는 기본적으로 placeholder를 통해 숫자를 입력해두고 그대로 진행 할 경우는 숫자가 value로 변경
    // 세로 막대 밑의 텍스트 상자에는 기본적으로는 value 값이 없음 (미입력시 : 결과 때 이어진 막대의 value를 그대로 입력해 줌)
    // 세로 막대 밑의 텍스트 상자에는 당첨자 수를 체크해서 넣어주는 시스템 추가 (나중에 추가)
    // 사다리의 세로 막대의 갯수는 10개까지로 지정
    // 사다리 세로 막대는 사용자가 설정한 갯수 만큼 생성
    // 사다리 가로 선 총 갯수 (세로막대 수 *5) +-1
    // 가로 선은 같은 위치에 그어질 수 없음
    // 두 막대 사이의 가로 선의 갯수는 최종적으로 4개~8개 사이로만 가능
};

function CreateSideLadder() {
    const sides = $(".ladder_side:visible");
    const barCount = $(".ladder_bar:visible").length;
    const lineCount = Math.floor(Math.random() * ((barCount * 5 + 1) - (barCount * 5 - 1)) + (barCount * 5 - 1)); // 사다리 세로 바 갯수 * 5 +-1 갯수
    let baseCount = [];
    let minTotal = 0;

    for (let i = 0; i < sides.length; i++) {
        const random = Math.floor(Math.random() * 4) + 5;
        baseCount.push(random);
        minTotal += random;
    }

    let checkCount = lineCount - minTotal; // 총 갯수 - 추가 한 갯수 (만약 checkCount가 음수일 경우 = 추가를 너무 많이함 빼야함 / 양수일 경우 = 추가가 덜됨 추가를 더 해야함 / 0일 경우 정상) 

    if (checkCount > 0) { // checkCount가 양수인 경우 (선의 갯수가 적을 경우)
        while (checkCount > 0) {
            let idx = Math.floor(Math.random() * sides.length);
            baseCount[idx] += 1;  // 한 개 추가
            checkCount--;
        }
    } else if (checkCount < 0) { // checkCount 음수인 경우 (선의 갯수가 많을 경우)
        while (checkCount < 0) {
            let idx = Math.floor(Math.random() * sides.length);
            baseCount[idx] -= 1;  // 한 개 추가
            checkCount++;
        }
    }

    sides.each(function (i) {
        const side = $(this);
        side.empty();                          // 기존 선 제거
        const sideHeight = side.height();      // 높이 가져오기

        for (let j = 0; j < baseCount[i]; j++) {
            const x = 0;
            const y = Math.random() * (sideHeight - 10);

            // div 생성
            const html = $("<div></div>")
                .addClass("ladder_line")
                .css({
                    left: x + "px",
                    top: y + "px"
                });

            // DOM에 추가
            side.append(html);
        }
    });

}
