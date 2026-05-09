$(document).ready(function () {
    start();
    eventBind();
});

var Count = 3;
var StartStat = false;
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

        if (StartStat) {
            var confirmflag = confirm("초기화 하고 다시 진행 하시겠습니까?");
            if (confirmflag) {
                $(".ladder_side").empty();
                StartStat = false;
            }
        }

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

        if (StartStat) {
            var confirmflag = confirm("초기화 하고 다시 진행 하시겠습니까?");
            if (confirmflag) {
                $(".ladder_side").empty();
                StartStat = false;
            }
        }

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

    const lineCount = Math.floor(Math.random() * ((barCount * 5 + 1) - (barCount * 5 - 1)) + (barCount * 5 - 1));

    // 4~8개 랜덤 배정 후 총합 맞추기
    let baseCount = [];
    let minTotal = 0;
    for (let i = 0; i < sides.length; i++) {
        const random = Math.floor(Math.random() * 4) + 5; // 5~8
        baseCount.push(random);
        minTotal += random;
    }
    let remain = lineCount - minTotal;
    while (remain !== 0) {
        let idx = Math.floor(Math.random() * sides.length);
        if (remain > 0) { baseCount[idx]++; remain--; }
        else {
            if (baseCount[idx] > 5) { baseCount[idx]--; remain++; }
        }
    }

    // 기존 선 제거
    $(".ladder_side").empty();

    const minGap = 25;

    // -----------------------------------
    // 1) 모든 y를 하나의 배열로 생성(랜덤)
    // -----------------------------------
    let allY = [];
    let allSideIndex = [];

    sides.each(function (i) {
        const h = $(this).height();

        for (let j = 0; j < baseCount[i]; j++) {
            const y = Math.random() * (h - 15);

            allY.push(y);
            allSideIndex.push(i);  // 어떤 side에 넣을 값인지 저장
        }
    });

    // -----------------------------------
    // 2) 전체 정렬
    // -----------------------------------
    allY.sort((a, b) => a - b);

    // -----------------------------------
    // 3) 최소 간격 보정
    // -----------------------------------
    for (let k = 1; k < allY.length; k++) {
        if (allY[k] - allY[k - 1] < minGap) {
            allY[k] = allY[k - 1] + minGap;
        }
    }

    // -----------------------------------
    // 4) 보정된 y를 다시 side 별로 재배치
    // -----------------------------------
    let yMap = [];
    for (let i = 0; i < sides.length; i++) {
        yMap[i] = [];   // side별 배열 초기화
    }

    // allSideIndex 순서를 기준으로 넣기
    // (각 side가 가져야 할 개수는 baseCount에 이미 들어있음)
    let idx = 0;
    for (let i = 0; i < sides.length; i++) {
        for (let j = 0; j < baseCount[i]; j++) {
            yMap[i].push(allY[idx]);
            idx++;
        }
    }

    // -----------------------------------
    // 5) DOM 생성
    // -----------------------------------
    sides.each(function (i) {
        const side = $(this);
        const sideHeight = side.height();
        let yList = [];   // 현재 side에 배치한 top값 기록

        const count = baseCount[i];  // 기존 방식 유지

        for (let j = 0; j < count; j++) {
            let y = 0;
            let loopLimit = 0;
            let safe = false;

            while (!safe && loopLimit < 200) {
                y = Math.random() * (sideHeight - 10);
                safe = true;

                // -------------------------------
                // 1. 같은 side 안에서 간격 체크
                // -------------------------------
                for (let py of yList) {
                    if (Math.abs(py - y) < minGap) {
                        safe = false;
                        break;
                    }
                }

                // -------------------------------
                // 2. 왼쪽 side 체크
                // -------------------------------
                if (i > 0 && safe) {
                    sides.eq(i - 1).find(".ladder_line").each(function () {
                        const ly = parseFloat($(this).css("top"));
                        if (Math.abs(ly - y) < minGap) safe = false;
                    });
                }

                // -------------------------------
                // 3. 오른쪽 side 체크
                // -------------------------------
                if (i < sides.length - 1 && safe) {
                    sides.eq(i + 1).find(".ladder_line").each(function () {
                        const ry = parseFloat($(this).css("top"));
                        if (Math.abs(ry - y) < minGap) safe = false;
                    });
                }

                loopLimit++;
            }

            // 생성 실패 시 안전 fallback 처리
            if (!safe) continue;

            // 현재 side 기록
            yList.push(y);

            // HTML 생성
            const html = $("<div></div>")
                .addClass("ladder_line")
                .css({
                    left: "0px",
                    top: y + "px"
                });

            side.append(html);
            StartStat = true;
        }
    });
}