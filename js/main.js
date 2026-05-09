async function getMarketPrice() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/market/운명의 파편 주머니(대)"
        );

        const data = await response.json();

        console.log(data);

    } catch (error) {

        console.log(error);

    }
}

getMarketPrice();