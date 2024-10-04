document.addEventListener('DOMContentLoaded', function () {
    // Call calculateInvestment initially to paint the first chart
    calculateInvestment();
});

function updateValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(sliderId + '-input');
    const value = parseFloat(slider.value);
    
    // Update the number input
    input.value = value;

    // Update the displayed value
    if (sliderId === 'spareperiode') {
        document.getElementById(sliderId + '-value').innerText = value + ' år';
        document.getElementById('spareperiode-result').innerText = value;
        document.getElementById('spareperiode-result-bank').innerText = value;
    } else if (sliderId === 'aarligavkastning') {
        document.getElementById(sliderId + '-value').innerText = value + '%';
    } else {
        document.getElementById(sliderId + '-value').innerText = formatNumber(value) + ' kr';
    }

    // Recalculate and repaint the chart
    calculateInvestment();
}

function updateSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(sliderId + '-input');
    let value = parseFloat(input.value);

    // Ensure value is within slider's min and max
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);

    if (isNaN(value)) value = min;
    if (value < min) value = min;
    if (value > max) value = max;

    // Update the slider
    slider.value = value;

    // Update the displayed value and recalculate
    updateValue(sliderId);
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
    const investmentValues = [totalInvestment];
    const labels = ['0'];

    for (let month = 1; month <= totalMonths; month++) {
        // Apply interest to existing investment and add monthly savings
        totalInvestment = totalInvestment * (1 + monthlyRate) + manedligInnskudd;
    
        // Record the value at the end of each year
        if (month % 12 === 0) {
            investmentValues.push(totalInvestment);
            labels.push((month / 12).toString());
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
    

    generateGrowthChart(labels, investmentValues);
}

// Function to format numbers as currency
function formatNumber(number) {
    return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(number);
}

function generateGrowthChart(labels, data) {
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
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
                borderColor: 'rgba(54, 162, 235, 1)', // Blue line
                borderWidth: 2,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }]
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
