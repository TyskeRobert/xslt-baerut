//import data from "../json/data/data.json" assert { type: "json" };
//console.log(data);

$(document).ready(async function() {
    let myData;
    await fetch("./json/data/data.json")
        .then((response) => response.json())
        .then((data) => {
            //console.log(data);
            myData = data;
        })
        .catch((error) => console.error("Error loading JSON file", error));

    console.log(myData);
    $('#content').text("Hallo Welt");
});