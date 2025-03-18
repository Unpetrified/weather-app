import "./styles.css"

const api_key = "GJTYW2ZM4WRCWAHGFLSBEA6DR";
let f = document.querySelector(".f"),
    c = document.querySelector(".c");

let temps_in_f = {};

async function getWeather(city) {
    let data = {};
    city.replace(" ", "+").toLowerCase();
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${api_key}`;
    
    try {
        blank("load");

        const response = await fetch(url, {mode:"cors"});
        
        const return_data = await response.json();
        
        data["address"] = return_data["address"]
        data["full address"] = return_data["resolvedAddress"]

        data["today"] = {
            "condition" :  return_data["currentConditions"]["conditions"],
            "temp" :  return_data["currentConditions"]["temp"],
            "feelslike" :  return_data["currentConditions"]["feelslike"],
            "humidity" :  return_data["currentConditions"]["humidity"],
            "windspeed" :  return_data["currentConditions"]["windspeed"],
            "icon" :  return_data["currentConditions"]["icon"],
        }
        data["tomorrow"] = {
            "condition" :  return_data["days"][1]["conditions"],
            "temp" :  return_data["days"][1]["temp"],
            "feelslike" :  return_data["days"][1]["feelslike"],
            "humidity" :  return_data["days"][1]["humidity"],
            "windspeed" :  return_data["days"][1]["windspeed"],
            "icon" :  return_data["days"][1]["icon"],
        }

        uiModWeather(data, "today");
        uiModWeather(data, "tomorrow");

        temps_in_f["today"] = {
            "temp" : parseFloat(data["today"]["temp"]).toFixed(1),
            "feel" : parseFloat(data["today"]["feelslike"]).toFixed(1)
        }

        temps_in_f["tomorrow"] = {
            "temp" : parseFloat(data["tomorrow"]["temp"]).toFixed(1),
            "feel" : parseFloat(data["tomorrow"]["feelslike"]).toFixed(1)
        }

        convertTemp();
        
        blank();
    
    } catch (error) {
        blank("not-found");
    }
    
}

getWeather("lagos");

function blank(activity="") {
    let not_found = document.querySelector(".not-found"),
        loading = document.querySelector(".loading");

    switch (activity) {
        case "load":
            loading.classList.remove("remove");
            not_found.classList.add("remove");
            break;
    
        case "not-found":
            not_found.classList.remove("remove");
            loading.classList.add("remove");
            break;

        default:
            loading.classList.add("remove");
            not_found.classList.add("remove");
            break;
    }
    
}

function uiModWeather(data, day) {
    document.querySelector(`#${day} .cond`).textContent = data[`${day}`]["condition"];
    if (day === "today") {
        document.querySelector(`#${day} .address`).textContent = data["address"];
        document.querySelector(`#${day} .full-address`).textContent = data["full address"];
    }
    document.querySelector(`#${day} .temp-value .value`).textContent = data[`${day}`]["temp"];
    document.querySelector(`#${day} .feel .value`).textContent = data[`${day}`]["feelslike"];
    document.querySelector(`#${day} .wind .value`).textContent = data[`${day}`]["windspeed"];
    document.querySelector(`#${day} .humidity .value`).textContent = data[`${day}`]["humidity"];
}

function uiModTemp(converted_temp, unit) {
    let days = Object.keys(converted_temp);

    days.forEach(day => {
        document.querySelector(`#${day} .temp-value .value`).textContent = converted_temp[`${day}`]["temp"];
        document.querySelector(`#${day} .feel .value`).textContent = converted_temp[`${day}`]["feel"];
        document.querySelector(`#${day} .temp-value .unit`).innerHTML = "&deg;"+unit;
        document.querySelector(`#${day} .feel .unit`).innerHTML = "&deg;"+unit;
        
    })
    
}

function convertTemp() {

    let mode = "";
    f.classList.contains("active") ? mode = "F" : mode = "C";

    if (mode === "F") {
        uiModTemp(temps_in_f, mode);
    } else {
        // convert temps
        let today_temp_in_c = (temps_in_f["today"]["temp"] - 32) * 5/9,
            today_feel_in_c = (temps_in_f["today"]["feel"] - 32) * 5/9,
            tomorrow_temp_in_c = (temps_in_f["tomorrow"]["temp"] - 32) * 5/9,
            tomorrow_feel_in_c = (temps_in_f["tomorrow"]["feel"] - 32) * 5/9;

        let temps_in_c = {
            "today" : {
                "temp" : today_temp_in_c.toFixed(1),
                "feel" : today_feel_in_c.toFixed(1)
            },
            "tomorrow" : {
                "temp" : tomorrow_temp_in_c.toFixed(1),
                "feel" : tomorrow_feel_in_c.toFixed(1)
            }
        };

        uiModTemp(temps_in_c, mode)
    }
}

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.querySelector("#city");
    
    getWeather(city.value);

    city.value = "";
    return
});


document.querySelector(".temp").addEventListener("click", () => {
    if (!temps_in_f["today"]) return // check if an api call has been made

    f.classList.toggle("active");
    c.classList.toggle("active");

    convertTemp();
    
});

document.querySelector(".close").addEventListener("click", () => {
    blank();
});