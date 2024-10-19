document.addEventListener('DOMContentLoaded', function () {
    const sliders = ['engangstegning', 'manedligsparing', 'spareperiode', 'aarligavkastning'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(`${sliderId}-input`);

        // Update when the slider is adjusted
        slider.addEventListener('input', () => {
            updateValue(sliderId);
            calculateInvestment();  // Recalculate on slider change
        });

        // Update when the input field changes
        input.addEventListener('input', () => {
            updateSlider(sliderId);
            calculateInvestment();  // Recalculate on input change
        });
    });

    calculateInvestment();
});

function updateValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(`${sliderId}-input`);
    const value = slider.value;

    // Sync input field with slider value
    if (document.activeElement !== input) {
        input.value = value;
    }

    if (sliderId === 'spareperiode') {
        document.getElementById('spareperiode-result').innerText = value;
        document.getElementById('spareperiode-result-bank').innerText = value;
    }
}

function updateSlider(sliderId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(`${sliderId}-input`);
    let value = input.value;

    // Sync slider value with input field, ensuring it's within the valid range
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);

    if (isNaN(value) || value === '' || value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }

    slider.value = value;

    if (sliderId === 'spareperiode') {
        document.getElementById('spareperiode-result').innerText = value;
        document.getElementById('spareperiode-result-bank').innerText = value;
    }
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
    let totalBankSavings = engangstegning;
    let totalContributions = engangstegning; // Start with initial deposit
    let bankValues = [totalBankSavings];
    const investmentValues = [totalInvestment];
    const labels = ['0'];

    const bankAnnualRate = 0.03; // 3% annual bank interest

    for (let month = 1; month <= totalMonths; month++) {
        // Apply monthly interest to the investment and add monthly savings
        totalInvestment = totalInvestment * (1 + monthlyRate) + manedligInnskudd;

        // Add monthly savings to total contributions
        totalContributions += manedligInnskudd;

        // Apply annual bank interest and add yearly contributions
        if (month % 12 === 0) {
            let year = month / 12;

            // Bank savings: apply 3% annual interest once per year and add yearly savings
            totalBankSavings = totalBankSavings * (1 + bankAnnualRate) + manedligInnskudd * 12;

            // Add values for the chart
            bankValues.push(totalBankSavings);
            investmentValues.push(totalInvestment);
            labels.push(year.toString());
        }
    }

    // Calculate total earnings from the investment
    const totalEarnings = totalInvestment - totalContributions;

    // Update UI fields
    document.getElementById('total-innskudd').innerText = formatNumber(totalContributions);
    document.getElementById('total-avkastning').innerText = formatNumber(totalEarnings);
    document.getElementById('total-verdi').innerText = formatNumber(totalInvestment); 
    document.getElementById('bank-verdi').innerText = formatNumber(totalBankSavings); 

    // Update the chart
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
                pointRadius: 0,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            },
            {
                label: 'Bankinnskudd over tid (NOK)',
                data: bankData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red fill
                borderColor: 'rgba(255, 99, 132, 1)', // Red line
                borderWidth: 2,
                fill: true,
                pointRadius: 0,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            reponsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'År',
                        color: '#333',
                        font: {
                            size: 16
                            
                    }
                },
                grid: {
                    color: 'rgba(200, 200, 200, 0.1)',
                }
            },
                y: {
                    title: {
                        display: true,
                        text: 'Verdi (NOK)',
                        color: '#333',
                        font: {
                            size: 16
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.1)',
                    },
                    ticks: {
                        callback: function(value) {
                            return value / 1000 + "'";                        }
                    }

                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const year = labels[tooltipItems[0].dataIndex];
                            return `År: ${year}`;
                        },
                        label: function(tooltipItem) {
                            if (tooltipItem.datasetIndex === 0) {
                                const investmentValue = investmentData[tooltipItem.dataIndex];
                                return `Investering: ${investmentValue.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}`;
                            } else if (tooltipItem.datasetIndex === 1) {
                                const bankValue = bankData[tooltipItem.dataIndex];
                                return `Bank: ${bankValue.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}`;
                            }
                            return '';
                        }
                    },
                    position: 'average',
                    yAlign: 'top',
                    displayColors: false
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: '#333',
                        font: {
                            size: 10
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            scaleID: 'y',
                            value: (ctx) => {
                                const tooltipItems = ctx.chart.tooltip.dataPoints;
                                return tooltipItems && tooltipItems.length ? tooltipItems[0].parsed.y : null;

                            },
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            borderWidth: 1,
                            borderdash: [4, 4],
                        }
                    }
                }
            }
        }
    });
}
