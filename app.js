const API_URL = "https://script.google.com/macros/s/AKfycbwh_Ia6UctrF7sZdu7kmUNbA3Db-6O2nwuN-FoNHrC-LRzTsUWr2SrouRrHybNepvWkjw/exec?action=dashboard";

const cardsContainer = document.getElementById("cardsContainer");
const totalCounter = document.getElementById("totalCounter");
const lastUpdated = document.getElementById("lastUpdated");
const searchInput = document.getElementById("search");

let dashboardData = [];

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        dashboardData = data.colleges || [];

        animateValue(
            totalCounter,
            parseInt(totalCounter.dataset.value || 0),
            data.total || 0,
            1000
        );

        totalCounter.dataset.value = data.total || 0;

        lastUpdated.textContent =
            "Last Updated • " +
            new Date(data.lastUpdated).toLocaleString();

        renderCards(searchInput.value);

    } catch (err) {

        cardsContainer.innerHTML =
        `<div class="no-results">
            Unable to load dashboard.
        </div>`;

    }

}

function renderCards(search=""){

    cardsContainer.innerHTML="";

    const keyword=search.trim().toLowerCase();

    const filtered=dashboardData.filter(c=>
        c.college.toLowerCase().includes(keyword)
    );

    if(!filtered.length){

        cardsContainer.innerHTML=
        `<div class="no-results">
            No colleges found.
        </div>`;

        return;

    }

    filtered.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`

            <h2>${item.college}</h2>

            <div class="small">
                Registrations
            </div>

            <div
                class="number"
                data-target="${item.registrations}">
                0
            </div>

            <div class="extra">

                <div>
                    <strong>POC</strong><br>
                    ${item.poc}
                </div>

                <div style="margin-top:16px;">
                    <strong>Vertical</strong><br>
                    ${item.vertical}
                </div>

            </div>

        `;

        card.onclick=function(){

            document.querySelectorAll(".card.expanded").forEach(c=>{

                if(c!==card){
                    c.classList.remove("expanded");
                }

            });

            card.classList.toggle("expanded");

        };

        cardsContainer.appendChild(card);

    });

    animateCardCounters();

}

function animateCardCounters(){

    document.querySelectorAll(".number").forEach(counter=>{

        animateValue(
            counter,
            0,
            Number(counter.dataset.target),
            900
        );

    });

}

function animateValue(element,start,end,duration){

    if(start===end){

        element.textContent=end.toLocaleString();

        return;

    }

    const range=end-start;

    const startTime=performance.now();

    function update(currentTime){

        const progress=Math.min((currentTime-startTime)/duration,1);

        const value=Math.floor(
            start+range*(1-Math.pow(1-progress,3))
        );

        element.textContent=value.toLocaleString();

        if(progress<1){

            requestAnimationFrame(update);

        }

    }

    requestAnimationFrame(update);

}

searchInput.addEventListener("input",()=>{

    renderCards(searchInput.value);

});

loadDashboard();

setInterval(loadDashboard,30000);
