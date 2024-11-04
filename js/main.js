$(document).ready(async function() {
    let data;
    await fetch("./json/data/data.json")
        .then((response) => response.json())
        .then((d) => {
            data = d;
        })
        .catch((error) => console.error("Error loading JSON file", error));

    $('#content').text(data.text);
});