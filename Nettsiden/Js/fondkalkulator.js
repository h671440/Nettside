document.addEventListener('DOMContentLoaded', function () {
    const sliders = ['engangstegning', 'manedligsparing', 'spareperiode', 'aarligavkastning'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(`${sliderId}-input`);

        slider.addEventListener('input', () => updateValue(sliderId));
        input.addEventListener('change', () => updateSlider(sliderId));
    });

    calculateInvestment();
});

function updateValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(`${sliderId}-input`);
    const value = slider.value;

    // Only update the input if it's not focused
    if (document.activeElement !== input) {
        input.value = value;
    }

    if (sliderId === 'spareperiode') {
        document.getElementById('spareperiode-result').innerText = value;
        document.getElementById('spareperiode-result-bank').innerText = value;
    }

    calculateInvestment();
}

function updateSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(`${sliderId}-input`);
    let value = input.value;

    // Ensure value is within slider's min and max
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);

    if (isNaN(value) || value === '' || value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }

    // Update the slider value only if it differs from the input value
    if (slider.value !== value.toString()) {
        slider.value = value;
    }

    if (sliderId === 'spareperiode') {
        document.getElementById('spareperiode-result').innerText = value;
        document.getElementById('spareperiode-result-bank').innerText = value;
    }

    calculateInvestment();
}

function calculateInvestment() {
    const engangstegning = parseFloat(document.getElementById('engangstegning').value) || 0;
    const manedligInnskudd = parseFloat(document.getElementById('manedligsparing').value) || 0;
    const sparePeriode = parseFloat(document.getElementById('spareperiode').value) || 0;
    const aarligAvkastning = parseFloat(document.getElementById('aarligavkastning').value) || 0;

    if (sparePeriode <= 0 || aarligAvkastning <= 0) {
        alert('Spareperiode og årlig avkastning må være større enn 0');
        return;
    }

    const monthlyRate = aarligAvkastning / 100 / 12;
    const totalMonths = sparePeriode * 12;
    let totalInvestment = engangstegning;
    let bankValues = [engangstegning];
    const investmentValues = [totalInvestment];
    const labels = ['0'];

    const bankAnnualRate = 0.03;

    for (let month = 1; month <= totalMonths; month++) {
        // Apply interest to existing investment and add monthly savings
        totalInvestment = totalInvestment * (1 + monthlyRate) + manedligInnskudd;
        
        // Record the value at the end of each year
        if (month % 12 === 0) {
            let year = month / 12;
            let lastBankValue = bankValues[bankValues.length - 1];
            lastBankValue = lastBankValue * (1 + bankAnnualRate) + manedligInnskudd * 12;
            bankValues.push(lastBankValue);

            investmentValues.push(totalInvestment);
            labels.push(year.toString()); //
        }
    }

    // Calculate total contributions
    const totalContributions = engangstegning + (manedligInnskudd * totalMonths);

    // Calculate total earnings
    const totalEarnings = totalInvestment - totalContributions;

    // Calculate total value (final investment amount)
    const totalValue = totalInvestment;

    // Bank savings for comparison (no growth, only contributions)
    const totalBankSavings = totalContributions;

    // Update data output fields
    document.getElementById('total-innskudd').innerText = formatNumber(totalContributions);
    document.getElementById('total-avkastning').innerText = formatNumber(totalEarnings);
    document.getElementById('total-verdi').innerText = formatNumber(totalValue);
    document.getElementById('bank-verdi').innerText = formatNumber(totalBankSavings);

    generateGrowthChart(labels, investmentValues, bankValues);
}

// Function to format numbers as currency
function formatNumber(number) {
    return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(number);
}

function generateGrowthChart(labels, investmentData, bankData) {
    const ctx = document.getElementById('growthChart').getContext('2d');

    // Clear the previous chart if it exists
    if (window.growthChart && typeof window.growthChart.destroy === 'function') {
        window.growthChart.destroy();
    }

    // Create a new chart
    window.growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investeringens verdi over tid (NOK)',
                data: investmentData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
                borderColor: 'rgba(54, 162, 235, 1)', // Blue line
                borderWidth: 2,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            },
            {
                label: 'Bankinnskudd over tid (NOK)',
                data: bankData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red fill
                borderColor: 'rgba(255, 99, 132, 1)', // Red line
                borderWidth: 2,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)'
            }
        ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'År'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Verdi (NOK)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
