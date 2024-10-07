// Poverty data for counties
const povertyData = {
    "Akershus": {
        percentage: "12%",
        facts: "Akershus has seen an increase in people living below the poverty line over the last 5 years."
    },
    "Oslo": {
        percentage: "15%",
        facts: "Oslo has the highest percentage of people living below the poverty line in Norway."
    },
    // Add data for all counties
};


document.addEventListener("DOMContentLoaded", function () {
    // Select the SVG element directly by its ID
    const svgDoc = document.getElementById("norway-map");

    if (svgDoc) {
        const countyNameBox = document.getElementById('county-name-box');
        const countyNameText = document.getElementById('county-name'); // County name in info box
        const povertyInfoText = document.getElementById('poverty-info'); // Poverty information in info box

        svgDoc.querySelectorAll('.land').forEach(county => {
            county.style.fill = "#CCCCCC";

            // Add hover effect to each county
            county.addEventListener('mouseenter', function (event) {
                const name = event.target.getAttribute('title'); // Fetch county name
                event.target.style.fill = "#888888";  // Change color on hover

                // Update the county name in the info box
                countyNameText.textContent = `${name}`;
                countyNameBox.style.display = 'block'; 
                
                if (povertyData[name]) {
                    povertyInfoText.textContent = `Poverty: ${povertyData[name].percentage}. ${povertyData[name].facts}`;
                } else {
                    povertyInfoText.textContent = "No data available.";
                   }
                 
            });
               

            county.addEventListener('mousemove', function (event) {
                // Position the text box near the mouse pointer
                countyNameBox.style.left = event.pageX + 10 + 'px';  // Offset for positioning
                countyNameBox.style.top = event.pageY + 10 + 'px';   // Offset for positioning
            });

            county.addEventListener('mouseleave', function (event) {
                event.target.style.fill = "#CCCCCC";  // Revert color on mouse leave

                // Hide the text box when the mouse leaves the county
                countyNameBox.style.display = 'none';
            });
        });
    } else {
        console.error("Failed to access SVG document");
    }
});
