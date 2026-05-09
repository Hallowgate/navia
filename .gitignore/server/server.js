const express = require("express");
const cors = require("cors");

require("dotenv").config({
    path: __dirname + "/.env"
});

const app = express();

var now = new Date();

var hour = now.getHours();
var minute = now.getMinutes();


app.use(cors());
app.use(express.json());


// 환경변수 확인
console.log(process.env.LOSTARK_API_KEY);


// ================================
// 감시 아이템 설정
// ================================

const watchItems = [
    {
        name: "운명의 파편 주머니(대)",
        targetPrice: 600,
        categoryCode: 50000,
        condition: "up"
    },

    {
        name: "위대한 운명의 돌파석",
        targetPrice: 45,
        categoryCode: 50000,
        condition: "up"
    },

    {
        name: "유물 예리한 둔기 각인서",
        targetPrice: 140000,
        categoryCode: 40000,
        condition: "down"
    }
];


// ================================
// 중복 알림 방지
// ================================

const alerted = {};


// ================================
// 디스코드 알림 함수
// ================================

async function sendDiscordMessage(message) {

    try {

        await fetch(process.env.DISCORD_WEBHOOK, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                content: message
            })
        });

        console.log("디스코드 알림 전송 완료");

    } catch (error) {

        console.log("디스코드 오류");
        console.log(error);

    }
}


// ================================
// 거래소 가격 체크 함수
// ================================

async function checkMarketPrice() {

    try {

        console.log("시세 확인중...");

        // 감시 아이템 반복
        for (const target of watchItems) {

            const response = await fetch(
                "https://developer-lostark.game.onstove.com/markets/items",
                {
                    method: "POST",

                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        authorization: `bearer ${process.env.LOSTARK_API_KEY}`
                    },

                    body: JSON.stringify({
                        Sort: "GRADE",
                        CategoryCode: target.categoryCode,
                        CharacterClass: "",
                        ItemTier: 0,
                        ItemGrade: "",
                        ItemName: target.name,
                        PageNo: 1,
                        SortCondition: "ASC"
                    })
                }
            );

            console.log(
                `${target.name} 응답 상태 :`,
                response.status
            );

            const data = await response.json();

            // 검색 결과 없음
            if (!data.Items || data.Items.length === 0) {

                console.log(
                    `${target.name} 검색 결과 없음`
                );

                continue;
            }

            const item = data.Items[0];

            const currentPrice =
                item.CurrentMinPrice;

            console.log(
                `${item.Name} : ${currentPrice} 골드`
            );

            const shouldAlert =
                (
                    target.condition === "up" &&
                    currentPrice >= target.targetPrice
                ) ||
                (
                    target.condition === "down" &&
                    currentPrice <= target.targetPrice
                );

            // 목표 가격 이하
            if (
                shouldAlert &&
                !alerted[target.name]
            ) {

                alerted[target.name] = true;

                await sendDiscordMessage(
                    `${item.Name} : ${currentPrice} 골`
                );
            }

            // 다시 가격 올라가면 초기화
            if (!shouldAlert) {

                alerted[target.name] = false;
            }
        }

    } catch (error) {

        console.log("시세 조회 오류");
        console.log(error);

    }
}


// ================================
// 브라우저 테스트 API
// ================================

app.get("/api/market/:itemName", async (req, res) => {

    try {

        const itemName =
            req.params.itemName;

        const response = await fetch(
            "https://developer-lostark.game.onstove.com/markets/items",
            {
                method: "POST",

                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization:
                        `bearer ${process.env.LOSTARK_API_KEY}`
                },

                body: JSON.stringify({
                    ItemName: itemName
                })
            }
        );

        const data =
            await response.json();

        res.json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ================================
// 1분마다 시세 체크
// ================================

setInterval(async () => {

    await checkMarketPrice();

}, 60000);


// 서버 실행 시 즉시 1회
checkMarketPrice();


// ================================
// 서버 실행
// ================================

app.listen(3000, () => {

    console.log("서버 실행중");

});