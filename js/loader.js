const pat = {
    pb: /\[pb n=(.*?)\]/
};

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
        let page = ""
        for (const token of ms.source.text) {
            if (token.t != "pb") token.page = page;
            switch (token.t) {
                case "num":
                case "pc":
                case "w":
                    const checkword = token.facs || token.dipl || token.norm;
                    const pbMatch = checkword.match(pat.pb);
                    if (pbMatch) {
                        page = pbMatch[1];
                        ms.source.pages.push(page);
                    }
                    break;
                case "pb":
                    page = token.n;
                    ms.source.pages.push(page);
                    break;
            }
        }
    }
    console.log(result.sources[0].source.text);

    return result;
}