
const weatherResult = document.getElementById("weather-result");
let timeShow = document.querySelector(".showTime")
let cityList = document.querySelector(".cityList")
let input = document.querySelector('input')


async function fetchWeather(city) {
  const apiKey = "9bade0df4597cab62c28ef60d199912c"; 
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json(); 
    // console.log(data);
    displayWeather(data);
    localStorage.setItem("lastCity", input.value);
  }
  catch (error) {
    console.log(error);
    weatherResult.innerHTML = `<p class="text-white">Something went wrong... or Refresh browser</p>`;
  }
};

window.onload = function () {
  const lastCity = localStorage.getItem("lastCity") || "dhaka"; 
  document.getElementById("city-input").value = lastCity;
  fetchWeather(lastCity); 
};

const displayWeather = (data) => {
  document.querySelector(".country").innerHTML = `${data.name}, ${data.sys.country}`;
  document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°`;
  document.querySelector(".weatherDesc").innerHTML = `${data.weather[0].description}`;
  document.querySelector(".feelsLike").innerHTML = `<span class="text-[#b9b8b8]">Feels like</span>  &nbsp ${Math.round(data.main.feels_like)}°`;
  document.querySelector(".lastFastTemp").innerHTML = `<p>Today was min Temp ${Math.round(data.main.temp_min)}°. Today was max temp ${Math.round(data.main.temp_max)}°</p>`;
  document.querySelector(".wind").innerHTML = `${(data.wind.speed * 3.6).toFixed(2)} km/h`;
  document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
  document.querySelector(".visibility").innerHTML = `${(data.visibility)/1000} km`;
  document.querySelector(".Pressure").innerHTML = `${data.main.pressure} mb`;
};
  

document.getElementById("search-button").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    weatherResult.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
  }
  // localStorage.setItem("lastCity", city);
  cityList.classList.remove("opacity-100", "visible");
  cityList.classList.add("opacity-0", "invisible");
});

function showTime(){
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let date = new Date()
  let hour = date.getHours()
  let ampm = hour>=12 ? "PM":"AM"
      hour = hour % 12 || 12;
     
      timeShow.innerHTML = `${months[date.getMonth()]}, ${weekDays[date.getDay()]}, <span class="bg-red-500 px-1">${hour}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${ampm}</span>`;
}
setInterval(showTime, 1000)


async function fetchCities() {
  try {
    let response = await fetch(`https://countriesnow.space/api/v0.1/countries/population/cities`)
    let data = await response.json()
    data = data.data;
    cityList.innerHTML = ""; 

    data.forEach(item => {
      let cityButton = document.createElement("button")
        cityButton.classList.add("py-2", "bg-[#204c84]", "cursor-pointer")
        cityButton.innerHTML = item.city

        cityButton.addEventListener("click", function(){
          input.value = item.city
          fetchWeather(item.city)
          cityList.classList.remove("opacity-100", "visible");
          cityList.classList.add("opacity-0", "invisible");

          // localStorage.setItem("lastCity", input.value);
        })

        cityList.append(cityButton)
    })

  } 
  catch (error) {
    console.log(error);
    cityList.innerHTML="Something is wrong....."
  }
}


input.addEventListener("input", (e)=>{
  let inputValue = e.target.value.toLowerCase();
  if(inputValue.length > 0){
    cityList.classList.add("opacity-100", "visible");
    cityList.classList.remove("opacity-0", "invisible");
  }
  else{
    cityList.classList.remove("opacity-100", "visible");
    cityList.classList.add("opacity-0", "invisible");
  }

  let filterAllButton = document.querySelectorAll(".cityList button")

  filterAllButton.forEach(item =>{
    if(item.innerHTML.toLowerCase().includes(inputValue)){
      item.classList.remove("hidden")
    }
    else{
      item.classList.add("hidden")
    }
  })
})

fetchCities()

