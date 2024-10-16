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
    "Østfold": {
        percentage: "11%",
        facts: "Østfold has a moderate poverty rate, especially in urban areas."
    },
    "Hedmark": {
        percentage: "8%",
        facts: "Hedmark has a relatively low poverty rate, though some rural areas struggle with economic challenges."
    },
    "Oppland": {
        percentage: "9%",
        facts: "Oppland has experienced a slight decrease in poverty due to improvements in rural support programs."
    },
    "Buskerud": {
        percentage: "10%",
        facts: "Buskerud has stable poverty rates, with urban areas seeing some challenges."
    },
    "Vestfold": {
        percentage: "9%",
        facts: "Vestfold has maintained a relatively low poverty rate, thanks to its proximity to Oslo and job availability."
    },
    "Telemark": {
        percentage: "12%",
        facts: "Telemark has a higher poverty rate compared to neighboring counties, with rural areas being the most affected."
    },
    "Aust-Agder": {
        percentage: "8%",
        facts: "Aust-Agder has one of the lowest poverty rates in the country, largely due to effective local support programs."
    },
    "Vest-Agder": {
        percentage: "7%",
        facts: "Vest-Agder has seen a decrease in poverty, driven by growth in local industries."
    },
    "Rogaland": {
        percentage: "7%",
        facts: "Rogaland has benefited from the oil and gas industry, resulting in a low poverty rate."
    },
    "Hordaland": {
        percentage: "10%",
        facts: "Hordaland has a mixed economic landscape, with some coastal areas experiencing higher poverty rates."
    },
    "Sogn og Fjordane": {
        percentage: "9%",
        facts: "Sogn og Fjordane has a stable economy, but remote areas still face economic challenges."
    },
    "Møre og Romsdal": {
        percentage: "8%",
        facts: "Møre og Romsdal benefits from strong local industries, which help maintain a lower poverty rate."
    },
    "Sør-Trøndelag": {
        percentage: "8%",
        facts: "Sør-Trøndelag has a balanced economy, with Trondheim contributing significantly to low poverty rates."
    },
    "Nord-Trøndelag": {
        percentage: "10%",
        facts: "Nord-Trøndelag has a slightly higher poverty rate compared to Sør-Trøndelag, particularly in rural areas."
    },
    "Nordland": {
        percentage: "11%",
        facts: "Nordland has a slightly elevated poverty rate, with isolated communities experiencing economic difficulties."
    },
    "Troms": {
        percentage: "12%",
        facts: "Troms has a moderate poverty rate, especially in more remote parts of the county."
    },
    "Finnmark": {
        percentage: "14%",
        facts: "Finnmark has one of the highest poverty rates in Norway, largely due to its remote location and limited economic opportunities."
    }
};



document.addEventListener("DOMContentLoaded", function () {
    // Select the SVG element directly by its ID
    const svgDoc = document.getElementById("norway-map");

    if (svgDoc) {
        const countyNameBox = document.getElementById('county-name-box');
        const countyNameText = document.getElementById('county-name'); // County name in info box
        const povertyInfoText = document.getElementById('poverty-info'); // Poverty information in info box


        countyNameBox.style.position = 'absolute';
        countyNameBox.style.display = 'none'; 

        svgDoc.querySelectorAll('.land').forEach(county => {
            county.style.fill = "#CCCCCC";

            // Add hover effect to each county
            county.addEventListener('mouseenter', function (event) {
                const name = event.target.getAttribute('title'); // Fetch county name
                event.target.style.fill = "#888888";  // Change color on hover

                // Update the county name in the info box
                countyNameText.textContent = `${name}`;
                
                
                if (povertyData[name]) {
                    povertyInfoText.textContent = `Poverty: ${povertyData[name].percentage}. ${povertyData[name].facts}`;
                } else {
                    povertyInfoText.textContent = "No data available.";
                   }

                 countyNameBox.style.display = 'block'; 
                 countyNameBox.textContent = name;

                 
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

                countyNameText.textContent = "Norway";
                povertyInfoText.textContent = "Poverty: 10%. Norway has one of the lowest poverty rates in the world.";
            });
        });
    } else {
        console.error("Failed to access SVG document");
    }
});
