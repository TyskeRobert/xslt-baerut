export async function loadCorpus() {
    let msList;
    await fetch("./json/data/corpus.json")
        .then((response) => response.json())
        .then((data) => {
            msList = data;
        })
        .catch((error) => console.error("Error loading source list: ", error));
        
    const result = {
        date: msList.date,
        sources: []
    };

    for (const ms of msList.sources) {
        await fetch(`./json/data/corpus/${ms}.json`)
            .then((response) => response.json())
            .then((data) => {
                result.sources.push(data)
            })
            .catch((error) => console.error(`Error loading source file ${ms}.json:`, error));
    }

    for (const ms of result.sources) {
        ms.source.pages = [];
    }

    return result;
}