//variable declaration

let world_cities = []
let saved_cities = []
const api_key = 'db2e0817e0753a4bbbaf3164c30e16ba'
const date = moment().format('ddd, DD/MM/YYYY')

//Display results on click from the dropdown list
$(document).on('click', '.results-list li', function () {
    $('.search-results').hide()
    save_new_city(this.id.slice(5))
    get_req(this.id.slice(5))

})

//Remove item  on double click
$(document).on('dblclick', 'td', function () {
    $('.search-results').hide()
    remove_city(this.parentElement.id.slice(4))
    $(`#${this.parentElement.id}`).remove()
})
//Display results on click from the saved cities list
$(document).on('click', 'td', function () {
    $('.search-results').hide()
    let city_id = this.parentElement.id.slice(4)
    get_req(city_id)
})


function get_req(city_id, lon, lat) {


    if (city_id !== null) { //If null passed , use browser geolocation to get coordinates on first run
        lon = world_cities[city_id].Lng
        lat = world_cities[city_id].Lat
    }

    //set URL for One Call API 
    let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
    //https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=35&lon=139&appid={API key}
    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    $.ajax({
        method: 'GET',
        url: queryURL
    }).then(function (response) {
        $('img').show()
        $('.main').show()
        if (city_id !== null) {
            $('#city').text(`${world_cities[city_id].City}, ${world_cities[city_id].Country} - ${date}`)
        } else {

            let city = response.timezone.split('/')[1] + ', ' + response.timezone.split('/')[0]
            $('#city').text(`${city} - ${date}`)
        }
        //Populate to page the response result
        $('#city').append($(`<span><img alt="weather image" src="http://openweathermap.org/img/w/${response.current.weather[0].icon}.png" width=80></span>`))
        $('#temp').html(`Temp: ${response.current.temp}<sup>0</sup>F`)
        $('#humidity').text(`Humidity: ${response.current.humidity}%`)
        $('#wind').text(`Wind Speed: ${response.current.wind_speed} m/h`)
        $('#uv').text(`UV index: `)

        let uv_color = ""

        //UV Index coloring
        switch (parseInt(response.current.uvi)) {
            case 0:
                uv_color = '#00b050'
                break;
            case 1:
                uv_color = '#00b050'
                break;
            case 2:
                uv_color = '#00b050'
                break;
            case 3:
                uv_color = '#ffff00'
                break;
            case 4:
                uv_color = '#ffff00'
                break;
            case 5:
                uv_color = '#ffff00'
                break;
            case 6:
                uv_color = '#ff9933'
                break;
            case 7:
                uv_color = '#ff9933'
                break
            case 8:
                uv_color = '#c00000'
                break;
            case 9:
                uv_color = '#c00000'
                break;
            case 10:
                uv_color = '#c00000'
                break;
            default:
                uv_color = '#d39dd3'
                break;
        }
        let uvi = $(`<span style="background-color:${uv_color}">${response.current.uvi} </span>`)
        $('#uv').append(uvi)

        //5 Day Forecast 
        for (let i = 1; i < 6; i++) {
            $(`h3.day${i}`).text(`${moment().add(i, 'day').format('DD/MM/YY')}`)
            $(`img.day${i}`).attr('src', `http://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`)
            $(`p.day${i}`).html(`Temp.: ${Math.round(response.daily[i].temp.day)} <sup> o</sup>F<br>Humidity: ${response.daily[i].humidity}%`)

        }
    }).catch(function (error) {
        console.error(error);
    })
}


//Remove city from Saved items
function remove_city(id) {
    for (let i in saved_cities) {
        if (saved_cities[i].id == id) {
            saved_cities.splice(i, 1)
        }
        localStorage.setItem('saved_cities', JSON.stringify(saved_cities))
    }
}



// Add the city into saved items if not found in th existing list
function save_new_city(id) {
    let found = false
    id = parseInt(id)
    let new_saved_city = {
        id: id,
        City: world_cities[id].City,
        Lng: world_cities[id].Lng,
        Lat: world_cities[id].Lat,
        Country: world_cities[id].Country
    }
    for (city of saved_cities) {
        if (city.id == new_saved_city.id) {
            found = true
        }
    }
    if (!found) {
        saved_cities.push(new_saved_city)
        localStorage.setItem('saved_cities', JSON.stringify(saved_cities))
        let new_row = $(`<tr id=row_${new_saved_city.id}></tr>`)
        let new_data = $(`<td class="text-center">${new_saved_city.City},${new_saved_city.Country}</td>`)
        new_row.append(new_data)
        $('tbody').append(new_row)
    }
}