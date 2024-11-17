$(document).ready(async function() {
    const corpus = loadCorpus();
    console.log(corpus);
    
    const list = document.createElement("ul");
    for (const ms of corpus.sources) {
        const item = document.createElement("li");
        item.textContent = ms;
        list.append(item);
    }
    
    $('#page').append(list);
});

async function loadCorpus() {
    let result;
    await fetch("./json/data/corpus.json")
        .then((response) => response.json())
        .then((d) => {
            result = d;
        })
        .catch((error) => console.error("Error loading JSON file", error));
    return result;
}