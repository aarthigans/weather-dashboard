//variable declaration
let world_cities = [];
let saved_cities = [];
const api_key = "db2e0817e0753a4bbbaf3164c30e16ba";
const date = moment().format("ddd, DD/MM/YYYY");

$("img").hide();

// load cities
if (!localStorage.getItem("world_cities")) {
  $.getJSON("cities.json", function (data) {
    localStorage.setItem("world_cities", JSON.stringify(data));
    world_cities = data;
  });
} else {
  world_cities = JSON.parse(localStorage.getItem("world_cities"));
}

// load cities from Local Storage
if (localStorage.getItem("saved_cities")) {
  saved_cities = JSON.parse(localStorage.getItem("saved_cities"));
  for (let city of saved_cities) {
    let new_row = $(`<tr id=row_${city.id}></tr>`);
    let new_data = $(
      `<td class="text-center">${city.City},${city.Country}</td>`
    );
    new_row.append(new_data);
    $("tbody").append(new_row);
  }
}

//show cities when the user enters
$(".form-control").keyup(function () {
  $(".search-results").hide();
  console.clear();
  $(".results-list").empty();
  if ($(this).val().length > 3) {
    let found = false;
    for (let i in world_cities) {
      if (
        world_cities[i].City.toLowerCase().includes($(this).val().toLowerCase())
      ) {
        found = true;
        let new_li = $(
          `<li id=city_${i}>${world_cities[i].City}, ${world_cities[i].Country}</li>`
        );
        $(".results-list").append(new_li);
      }
    }
    found
      ? $(".search-results").slideDown("slow")
      : $(".search-results").slideUp("slow");
  }
});

//add city to local Storage
$("form").submit((e) => {
  e.preventDefault();
  $(".search-results").hide();
  if ($(".results-list li:first-child").attr("id")) {
    save_new_city($(".results-list li:first-child").attr("id").slice(5));
    get_req($(".results-list li:first-child").attr("id").slice(5));
  }
});

//select from the dropdown list
$(document).on("click", ".results-list li", function () {
  $(".search-results").hide();
  save_new_city(this.id.slice(5));
  get_req(this.id.slice(5));
});

//this is the main function
function get_req(city_id, lon, lat) {
  if (city_id !== null) {
    lon = world_cities[city_id].Lng;
    lat = world_cities[city_id].Lat;
  }

  //set URL for One Call API
  //https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=35&lon=139&appid={API key}
  //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial `;
  $.ajax({
    method: "GET",
    url: queryURL,
  })
    .then(function (response) {
      $("img").show();
      $(".main").show();
      if (city_id !== null) {
        $("#city").text(
          `${world_cities[city_id].City}, ${world_cities[city_id].Country} - ${date}`
        );
      } else {
        let city =
          response.timezone.split("/")[1] +
          ", " +
          response.timezone.split("/")[0];
        $("#city").text(`${city} - ${date}`);
      }

      // result page display
      $("#city").append(
        $(
          `<span><img alt="weather image" src="http://openweathermap.org/img/w/${response.current.weather[0].icon}.png" width=80></span>`
        )
      );
      $("#temp").html(`Temp: ${response.current.temp}<sup>0</sup>F`);
      $("#humidity").text(`Humidity: ${response.current.humidity}%`);
      $("#wind").text(`Wind Speed: ${response.current.wind_speed} m/h`);

      //5 day forecast
      for (let i = 1; i < 6; i++) {
        $(`h3.day${i}`).text(`${moment().add(i, "day").format("DD/MM/YY")}`);
        $(`img.day${i}`).attr(
          "src",
          `http://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`
        );
        $(`p.day${i}`).html(
          `Temp.: ${Math.round(
            response.daily[i].temp.day
          )} <sup> o</sup>F<br>Humidity: ${response.daily[i].humidity}%`
        );
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

//Remove city from Saved items
function remove_city(id) {
  for (let i in saved_cities) {
    if (saved_cities[i].id == id) {
      saved_cities.splice(i, 1);
    }
    localStorage.setItem("saved_cities", JSON.stringify(saved_cities));
  }
}

// save the new city
function save_new_city(id) {
  let found = false;
  id = parseInt(id);
  let new_saved_city = {
    id: id,
    City: world_cities[id].City,
    Lng: world_cities[id].Lng,
    Lat: world_cities[id].Lat,
    Country: world_cities[id].Country,
  };
  for (city of saved_cities) {
    if (city.id == new_saved_city.id) {
      found = true;
    }
  }
  if (!found) {
    saved_cities.push(new_saved_city);
    localStorage.setItem("saved_cities", JSON.stringify(saved_cities));
    let new_row = $(`<tr id=row_${new_saved_city.id}></tr>`);
    let new_data = $(
      `<td class="text-center">${new_saved_city.City},${new_saved_city.Country}</td>`
    );
    new_row.append(new_data);
    $("tbody").append(new_row);
  }
}
$(".main").hide();
get_req(null, -74.1725, 40.7245);
