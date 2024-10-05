document.addEventListener("DOMContentLoaded", function () {
    // Select the SVG element directly by its ID
    const svgDoc = document.getElementById("norway-map");
  
    if (svgDoc) {
      console.log("SVG loaded and accessible", svgDoc);
  
      // Select all the counties (fylker) by their class 'land'
      svgDoc.querySelectorAll('.land').forEach(county => {
        // Ensure a default fill style is applied
        county.style.fill = "#CCCCCC";
  
        // Add hover effect to each county
        county.addEventListener('mouseenter', function (event) {
          const name = event.target.getAttribute('title'); // Fetch county name
          console.log(`Hovered over: ${name}`);
          event.target.style.fill = "#888888";  // Change color on hover
        });
  
        county.addEventListener('mouseleave', function (event) {
          event.target.style.fill = "#CCCCCC";  // Revert color on mouse leave
        });
      });
    } else {
      console.error("Failed to access SVG document");
    }
  });
  