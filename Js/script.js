// js/script.js

document.getElementById('convertButton').addEventListener('click', convertCurrency);

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('result');
    const apikey = `cur_live_UpeUcW12Hj2VOD7f1iZ6upjhIDPfUxlQES0qIETa`;

    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = '<p>Please enter a valid amount.</p>';
        return;
    }

    if (fromCurrency === toCurrency) {
        resultDiv.innerHTML = `<p>The currencies are the same. ${amount} ${fromCurrency} = ${amount} ${toCurrency}</p>`;
        return;
    }

    try {
        // Make API call to currencyapi.com
        const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apikey}&currencies=${toCurrency}&base_currency=${fromCurrency}`);
        const data = await response.json();

        if (data.data && data.data[toCurrency]) {
            const rate = data.data[toCurrency].value;
            const convertedAmount = (amount * rate).toFixed(2);

            resultDiv.innerHTML = `<p>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</p>`;
        } else {
            resultDiv.innerHTML = '<p>Failed to retrieve exchange rates.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>An error occurred while fetching exchange rates.</p>';
    }
}
