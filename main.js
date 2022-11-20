window.onload = () => {
  const tab_switchers = document.querySelectorAll("[data-switcher]");

  for (let i = 0; i < tab_switchers.length; i++) {
    const tab_switcher = tab_switchers[i];
    const page_id = tab_switcher.dataset.tab;

    tab_switcher.addEventListener("click", () => {
      document
        .querySelector(".tabs .tab.is-active")
        .classList.remove("is-active");
      tab_switcher.parentNode.classList.add("is-active");

      SwitchPage(page_id);
    });
  }
};

function SwitchPage(page_id) {
  console.log(page_id);

  const current_page = document.querySelector(".pages .page.is-active");
  current_page.classList.remove("is-active");

  const next_page = document.querySelector(
    `.pages .page[data-page="${page_id}"]`
  );
  next_page.classList.add("is-active");
}
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f3445b3a36msh2275a4e40bd3e3bp1f16e3jsn7fd1cef9e9c8",
    "X-RapidAPI-Host": "covid-193.p.rapidapi.com",
  },
};

fetch("https://covid-193.p.rapidapi.com/statistics", options)
  .then((data) => {
    return data.json();
  })
  .then((objectData) => {
    console.log(objectData.response[0].country);
    let tableData = "";
    objectData.response.map((values) => {
      tableData += `<option id="country">${values.country}</option>
        `;
    });
    document.getElementById("selectCountry").innerHTML = tableData;
  });
var myForm = document.getElementById("myForm");
myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var country = document.getElementById("selectCountry").value;
  fetch(
    "https://covid-193.p.rapidapi.com/statistics?country=" + country,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      var length = res.length;
      var index = length - 1;
      var confirmed = document.getElementById("cases");
      var recovered = document.getElementById("recovered");
      var deaths = document.getElementById("deaths");

      confirmed.innerHTML = "";
      recovered.innerHTML = "";
      deaths.innerHTML = "";

      res.response.map((values) => {
        confirmed.append(values.cases.total);
        recovered.append(values.cases.recovered);
        deaths.append(values.deaths.total);
      });
    });
});

const date = new Date().toISOString().slice(0, 10);
console.log(date);

fetch(
  "https://covid-193.p.rapidapi.com/history?country=all&day=" + date,
  options
)
  .then((res) => res.json())
  .then((res) => {
    console.log(res);

    const ctx = document.getElementById("chart");

    const clabels = [];
    const tlabels = [];
    const dlabels = [];
    const ylabels = [];

    res.response.map((values) => {
      const lab = values.cases.total;
      const labt = values.tests.total;
      const labd = values.deaths.total;
      const ylab = values.time;

      const a = ylab.split("T");
      const time = a[1];

      clabels.push(lab);
      tlabels.push(labt);
      dlabels.push(labd);
      ylabels.push(time);
    });

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ylabels,
        datasets: [
          {
            label: "Total cases",
            data: clabels,
            backgroundColor: "rgba(255, 26, 104, 0.2)",
            borderColor: "rgba(255, 26, 104, 0.2)",
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: "Total tests",
            data: tlabels,
            backgroundColor: "rgba(25, 26, 104, 0.2)",
            borderColor: "rgba(25, 26, 104, 0.2)",
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: "Total Deaths",
            data: dlabels,
            backgroundColor: "rgba(0, 206, 104, 0.2)",
            borderColor: "rgba(0, 26, 104, 0.2)",
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {},
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
