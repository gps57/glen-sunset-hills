const buildButton = document.querySelector("#buildButton");
const whoCanSeeButton = document.querySelector("#whoCanSeeButton");
const buildingsArea = document.querySelector("#buildingsArea");
const buildingHeightsArea = document.getElementById("buildingHeights_id");
const chart = document.querySelector("#myChart");
const ctx = chart.getContext('2d');
let bldgHeights = [];
let bldgColors = [];
let bldgChart;

function buildBuildings() {  
  bldgHeights = getBldgHeights();
  
  if(bldgHeights.length == 0){
    // something is wrong with the data, so can't build chart
    return;
  }  // end if

  // if a chart already exists, destroy it
  if (bldgChart) {
    bldgChart.destroy();
  } // end if

  bldgChart = buildChart();
  chart.scrollIntoView();

}  // end buildBuildings()

function buildChart() {

  // show the building area...
  buildingsArea.classList.remove("d-none");

  // Set up initial bulding (bar) colors
  for (i=0; i<bldgHeights.length; i++) {
    bldgColors[i] = 'rgba(0,0,124,0.5)';
  }

  // use the chart.js bar chart to represent the buildings
  newChart = new Chart(ctx, {
    // type of chart
    type: 'bar',
    // chart data
    data:{
      // labels for the bars
      //    Displaying these labels is disabled, but if I remove
      //    the labels from the data, all the bars for the dataset
      //     are not rendered.  Don't know why that is.
      labels: bldgHeights,
      datasets: [{
        //label: "where?",  // not sure where this shows up
        backgroundColor: bldgColors,
        borderColor: 'rgba(0,0,124,1)',
        borderWidth: 1,
        barThickness: "flex",
        data: bldgHeights
      }]
    },
    options: {
      //legend: legendObj,
      legend: {display:false},
      tooltips: {enable:false},
      events: '[]',
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false,
          ticks: {beginAtZero: true}
        }]
      }
    }
  }); // end new chart

  return (newChart);

}  // end buildChart()

function getBldgHeights() {
  // remove all space characters in heights string
  let heightsStr = buildingHeightsArea.value.replace(/ /g,'');
  let strLength = heightsStr.length;
  let heightsArr = [];
  let regex = RegExp('^[0-9]+(,[0-9]+)*$');

  if(heightsStr.slice(length-1) == ',') {
    // if the last character is a comma, just remove it
    newStr = heightsStr.slice(0,-1);
    heightsStr = newStr;
    buildingHeightsArea.value = newStr;
  }

  if(heightsStr.length > 0) {
    // we have some data in the field
    // make sure we only have whole numbers, separated by commas
    if (regex.test(heightsStr)) {
      // yes, valid data
      heightsArr = heightsStr.trim().split(',');      
    } else {
      // found a character that in not allowed
      buildingHeightsArea.focus();
      showErrorMsg("Only whole numbers separated by a comma are allowed.");
    }
  } else {
    // the string length was 0, so not data is there
    buildingHeightsArea.focus();
    showErrorMsg("You must enter building heights.");
  }
  
  return heightsArr;

} // end getBldgHeights()

function showErrorMsg(msg) {
  let label = document.getElementById("bldgHeightsLabel");

  label.innerHTML = msg
  label.classList.add("text-danger");

} // end showErrorMsg()

function hideErrorMsg() {
  let label = document.getElementById("bldgHeightsLabel");

  label.innerHTML = "Building heights:"
  label.classList.remove("text-danger");

} // end hideErrorMsg()

function whoCanSee() {
  let highest = parseInt(bldgHeights[0]);

  for(i=0; i<bldgHeights.length; i++) {
    if (i == 0) {
      // the first building in the row can always see the sunset
      bldgColors[i] = 'rgba(0,0,124,0.9)';
    } else if (parseInt(bldgHeights[i]) > highest) {
      // this building can see sunset
      highest = parseInt(bldgHeights[i]);
      bldgColors[i] = 'rgba(0,0,124,0.9)';
    } else {
      // this building cannot see sunset
      bldgColors[i] = 'rgba(0,0,124,0.1)';
    }
  }

  bldgChart.update();

} // end whoCanSee()

function validateData() {
  let heightField = document.getElementById("buildingHeights_id")
  let dataStr = heightField.value.trim();
  let length = dataStr.length;
  let regex = RegExp('[0-9]|,');

  // if the field is empty, the placeholder string will be visible.active
  // it should be in italic
  if (heightField.value.length == 0) {
    // turn on italic
    heightField.classList.add("font-italic");
  } else {
    // turn off italic
    heightField.classList.remove("font-italic");
  }
  
  hideErrorMsg();

  if(length > 0 && !regex.test(dataStr[length-1])) {
    showErrorMsg("Enter only whole numbers separated by a comma.");
  }
} // end validateData()

buildButton.addEventListener("click", buildBuildings, false);
whoCanSeeButton.addEventListener("click", whoCanSee, false);
document.getElementById("buildingHeights_id").addEventListener("keyup", validateData, false)
