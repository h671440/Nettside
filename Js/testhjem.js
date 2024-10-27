
document.addEventListener("DOMContentLoaded", function() {

    console.log("JavaScript loaded successfully!");
        const buttons = document.querySelectorAll('.info-button');
        const infoSection = document.getElementById('info-section');

        console.log(document.querySelectorAll('.info-button'));

        // Content for each button
        const contentData = {
            economy: `
                <div class="content-block">
                    <h2>Økonomi</h2>
                    <div class="button-container">
                        <a href="#" class="rounded-button">Økonomiskolen (animasjon)</a>
                        <a href="economy/kalkulatorer/kalkulatorer.html" class="rounded-button">Kalkulatorer</a>
                        <a href="#" class="rounded-button">Økonomisk Trygghet</a>
                        <a href="#" class="rounded-button">Inntekter og kostnader (tips til å redusere kostnader)</a>
                        <a href="sparing/sparing.html" class="rounded-button">Sparing</a>
                        <a href="https://www.nordea.no/privat/vare-produkter/lan-og-kreditt/lanekalkulator.html" class="rounded-button">Lån</a>
                        <a href="#" class="rounded-button">Arv</a>
                        <a href="#" class="rounded-button">Hjelp til selvangivelse</a>
                        <a href="skjema/skjemaer.html" class="rounded-button">Skjema</a>
                    </div>
                </div>
            `,
            health: `
                <div class="content-block">
                    <h2>Helse</h2>
                    <p>Her kommer informasjon om helse...</p>
                </div>
            `,
            memories: `
                <div class="content-block">
                    <h2>Bevare minner</h2>
                    <p>Informasjon om å bevare minner...</p>
                </div>
            `,
            blog: `
                <div class="content-block">
                    <h2>Blogg</h2>
                    <p>Her finner du blogginnlegg...</p>
                </div>
            `
        };

        // Add event listener to all buttons
        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor behavior
                console.log("button clicked", this.getAttribute('data-info'));
                const infoKey = this.getAttribute('data-info');

                // Insert corresponding content into the info section
                if (contentData[infoKey]) {
                    infoSection.innerHTML = contentData[infoKey];
                    infoSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the info section
                }
            });
        });
    });