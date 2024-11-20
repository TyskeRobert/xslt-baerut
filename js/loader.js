const pat = {
    pb: /\[pb n=(.*?)\]/,
    cb: /\[cb n=(.*?)\]/,
    lb: /\[lb n=(.*?)\]/,
    lbAll: /\[lb n=(.*?)\]/g
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
        const openTags = [];
        let page = "";
        let column = "";
        let line = "";
        for (const token of ms.source.text) {
            if (token.t != "pb") {
                token.page = page;
                if (token.t != "cb") {
                    token.column = column;
                    if (token.t != "lb")
                        token.line = line;
                }
            }
            switch (token.t) {
                case "div":
                case "head":
                case "p":
                    if (token.open) 
                        openTags.push(token);
                    else token.openedBy = openTags.pop();
                    break;
                case "num":
                case "pc":
                case "w":
                    const checkword = token.facs || token.dipl || token.norm;
                    const pbMatch = checkword.match(pat.pb);
                    if (pbMatch) {
                        page = pbMatch[1];
                        ms.source.pages.push(page);
                    }
                    const cbMatch = checkword.match(pat.cb);
                    if (cbMatch) column = cbMatch[1];
                    const lbMatch = checkword.match(pat.lbAll);
                    if (lbMatch) for (const lb of lbMatch) 
                        line = lb.match(pat.lb)[1];
                    break;
                case "pb":
                    page = token.n;
                    ms.source.pages.push(page);
                    break;
                case "cb":
                    column = token.n;
                    break;
                case "lb":
                    line = token.n
            }
        }
    }

    checkdata(result);

    return result;
}

function checkdata(corpus) {
    const cats = {
        "x": {
            name: "part of speech",
            values: {
                "AC": "[undefined]]",
                "AD": "[undefined]",
                "AJ": "adjective",
                "AP": "apposition",
                "AQ": "interrogative adverb",
                "AT": "article",
                "AV": "general adverb",
                "CC": "conjunction",
                "CN": "[undefined]",
                "CS": "subjunction",
                "CU": "[undefined]",
                "CX": "[undefined]",
                "DD": "demonstrative determiner",
                "DP": "possessive determiner",
                "DQ": "quantifier",
                "EX": "[undefined]",
                "EY": "[undefined]",
                "FW": "foreign word",
                "IM": "infinitive marker",
                "IT": "interjection",
                "NA": "cardinal numeral",
                "NC": "common noun",
                "NE": "[undefined]",
                "NO": "ordinal numeral",
                "NP": "proper noun",
                "NU": "[undefined]",
                "PA": "[undefined]",
                "PD": "pronoun/determiner",
                "PE": "personal pronoun",
                "PED": "[undefined]",
                "PI": "indefinite pronoun",
                "PJ": "[undefined]",
                "PN": "[undefined]",
                "PQ": "interrogative pronoun",
                "PR": "[undefined]",
                "RP": "relative particle",
                "UA": "unassigned",
                "VB": "verb",
                "VN": "[undefined]",
                "VP": "[undefined]",
                "XNC": "[undefined]",
                "XX": "[undefined]"
            }
        },
        "1": {
            name: "[undefined]",
            values: {
                "P": "[undefined]"
            }
        },
        "c": {
            name: "case",
            values: {
                "": "[undefined]",
                "A": "accusative",
                "AD": "accusative/dative",
                "AG": "accusative/genitive",
                "AN": "accusative/nominative",
                "AV": "[undefined]",
                "B": "[undefined]",
                "C": "[undefined]",
                "CS": "[undefined]",
                "D": "dative",
                "DA": "[undefined]",
                "DB": "[undefined]",
                "F": "[undefined]",
                "G": "genitive",
                "GD": "genitive/dative",
                "M": "[undefined]",
                "N": "nominative",
                "O": "oblique",
                "P": "[undefined]",
                "U": "unspecified",
                "V": "vocative",
                "?": "[undefined]"
            }
        },
        "d": {
            name: "[undefined]",
            values: {
                "D": "[undefined]"
            }
        },
        "e": {
            name: "enclitic",
            values: {
                "E": "[undefined]",
                "EN": "[undefined]",
                "N": "negation",
                "P": "pronoun"
            }
        },
        "f": {
            name: "finiteness",
            values: {
                "F": "finite",
                "I": "infinitive",
                "P": "participle",
                "U": "[undefined]"
            }
        },
        "g": {
            name: "gender",
            values: {
                "": "undefined",
                "F": "feminine",
                "FN": "feminine/neuter",
                "G": "[undefined]",
                "M": "masculine",
                "MF": "masculine/feminine",
                "MFN": "masculine/feminine/neuter",
                "MN": "masculine/neuter",
                "N": "neuter",
                "U": "unspecified",
                "?": "[undefined]"
            }
        },
        "i": {
            name: "inflectional class",
            values: {
                "PP": "preterito-present",
                "RD": "reduplicating",
                "ST": "strong",
                "WK": "weak",
                "U": "[undefined]"
            }
        },
        "m": {
            name: "mood",
            values: {
                "IN": "indicative",
                "INIM": "indicative/imperative",
                "INSU": "indicative/subjunctive",
                "IP": "imperative",
                "SU": "subjunctive",
                "SUIM": "subjunctive/imperative",
                "U": "unspecified"
            }
        },
        "n": {
            name: "number",
            values: {
                "": "[undefined]",
                "A": "[undefined]",
                "C": "[undefined]",
                "D": "dual",
                "M": "[undefined]",
                "N": "[undefined]",
                "P": "plural",
                "S": "singular",
                "SP": "[undefined]",
                "U": "unspecified",
                "?": "[undefined]"
            }
        },
        "o": {
            name: "[undefined]",
            values: {
                "PINN": "[undefined]"
            }
        },
        "p": {
            name: "person",
            values: {
                "1": "first",
                "2": "second",
                "3": "third",
                "PS": "[undefined]",
                "U": "unspecified"
            }
        },
        "r": {
            name: "grade",
            values: {
                "C": "comparative",
                "P": "positive",
                "S": "superlative",
                "U": "unspecified"
            }
        },
        "s": {
            name: "species",
            values: {
                "": "[undefined]",
                "D": "definite",
                "I": "indefinite",
                "IXE": "[undefined]",
                "N": "[undefined]",
                "S": "[undefined]",
                "U": "unspecified"
            }
        },
        "t": {
            name: "tense",
            values: {
                "PF": "[undefined]",
                "PS": "present",
                "PT": "preterite",
                "U": "unspecified"
            }
        },
        "v": {
            name: "voice",
            values: {
                "A": "active",
                "P": "passive",
                "R": "reflexive"
            }
        },
        "y": {
            name: "government",
            values: {
                "A": "accusative",
                "AD": "[undefined]",
                "AG": "[undefined]",
                "B": "[undefined]",
                "D": "dative",
                "DA": "[undefined]",
                "G": "genitive",
                "IN": "indicative",
                "INSU": "[undefined]",
                "SU": "subjunctive",
                "U": "unspecified",
                "YY": "[undefined]",
                "YYI": "[undefined]"
            }
        },
        "z": {
            name: "[undefined]",
            values: {
                "AV": "[undefined]",
                "NX": "[undefined]"
            }
        },
        "?": {
            name: "[undefined]",
            values: {
                "": "[undefined]"
            }
        },
        "*": {
            name: "[undefined]",
            values: {
                "NP": "[undefined]"
            }
        }
    }
    let stop = false;
    for (const ms of corpus.sources) {
        if (stop) break;
        for (const token of ms.source.text) {
            if (stop) break;
            if (token.t == "w" && token.morph) for (const analysis of token.morph.split(/ ?\| ?/))
                for (const arg of analysis.split(/\s/)) {
                    const cat = arg[0].toLowerCase();
                    const val = arg.substring(1).toUpperCase();
                    if (cats[cat]) {
                        if (!cats[cat].values[val]) {
                            console.log(`Unknown value "${val}" for category "${cats[cat].name}" (${token.morph}).`);
                            console.log(ms.id);
                            stop = true;
                        }
                    } 
                    else {
                        console.log(`Unknown category: "${cat}" (${token.morph}).`);
                        console.log(ms.id);
                        stop = true;
                    }
                }
        }
    }
}