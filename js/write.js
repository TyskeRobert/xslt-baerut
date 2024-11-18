export function writeSource(doc, page, level) {
    const metadata = doc.source.header;

    const result = $("<div></div>");
    result.append(`<h3>${metadata.fileDesc.titleStmt.title}</h3>`);
    
    if (page == "meta") result.append(writeMetadata(metadata));
    else if (page == "text")
        result.append(writeFullText(doc, level));
    else
        result.append(writeSinglePage(doc, page, level));

    return result;
}

function writeDipl(textArray) {
    return textArray.map(token => writeTokenDipl(token)).join("");
}

function writeFacsLine(textArray) {
    //const text = getFacsArray(textArray);
    return textArray.map(token => writeTokenFacs(token)).join("")
}

function writeFullText(doc, level) {
    switch (level) {
        case "facs":
            return `<div class="textBlock">${writeFacsLine(doc.source.text)}</div>`;
        case "dipl":
            return `<div class="textBlock">${writeDipl(doc.source.text)}</div>`;
        case "norm":
            return `<div class="textBlock">${writeNorm(doc.source.text)}</div>`;
    }
}

function writeMetadata(m) {
    const result = $("<table></table>");

    const editorLine = $("<tr></tr>");
    editorLine.append("<th>Editor(s):</th>");
    editorLine.append(
        `<td>${m.fileDesc.titleStmt.editors.map(e => writeName(e)).join(", ")}</td>`
    );
    result.append(editorLine);

    return result;
}

function writeName(agent) {
    let result = agent.name;
    if (agent.affiliations?.length > 0) {
        result += ` (${agent.affiliations.join(", ")})`
    }
    return result;
}

function writeNorm(textArray) {
    return textArray.map(token => writeTokenNorm(token)).join("");
}

function writeSinglePage(doc, page, level) {
    switch (level) {
        case "facs":
            return `<div>FACS PAGE ${page}</div`;
        case "dipl":
            return `<div>DIPL PAGE ${page}</div>`;
        case "norm":
            return `<div>NORM PAGE ${page}</div>`;
    }
}

function writeTokenDipl(token) {
    const word = token.dipl
        .replace(/\[pc:(.*?):pc\]/g, "$1");
    switch (token.t) {
        case "pc":
            return `<span class="dipl">${word}</span>`;
        case "num":
        case "w":
            return ` <span class="dipl">${word}</span>`;
    }
}

function writeTokenFacs(token) {
    const space = token.t != "pc";
    const word = token.facs
        .replace(/\[pc:(.*?):pc\]/g, "$1");
    switch (token.t) {
        case "num":
        case "pc":
        case "w":
            return `${space ? " " : ""}<span class="facs">${word}</span>`;
    }
}

function writeTokenNorm(token) {
    switch (token.t) {
        case "pc":
            return `<span class="norm">${token.norm}</span>`;
        case "num":
        case "w":
            return ` <span class="norm">${token.norm}</span>`;
    }
}