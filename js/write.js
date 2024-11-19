import { getPage } from "./search.js";

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
    const pageArray = getPage(doc, page);
    console.log(pageArray[9000]);
    switch (level) {
        case "facs":
            return `<div class="textBlock">${writeFacsLine(pageArray)}</div`;
        case "dipl":
            return `<div class="textBlock">${writeDipl(pageArray)}</div>`;
        case "norm":
            return `<div class="textBlock">${writeNorm(pageArray)}</div>`;
    }
}

function writeTokenDipl(token) {
    switch (token.t) {
        case "num":
        case "pc":
        case "w":
            const space = token.t != "pc";
            const word = token.dipl
                .replace(/\[lb n=(.*?)\]/g, '<span class="break">$1</span>')
                .replace(/\[[cp]b n=(.*?)\]/g, '<span class="break">$1.</span>')
                .replace(/\[pc:(.*?):pc\]/g, "$1");
            return `${space ? " " : ""}<span class="dipl">${word}</span>`;
        case "lb":
            return ` <span class="break">${token.n}</span>`;
        case "cb":
        case "pb":
            return ` <span class="break">${token.n}.</span>`;
    }
}

function writeTokenFacs(token) {
    switch (token.t) {
        case "num":
        case "pc":
        case "w":
            const space = token.t != "pc";
            const word = token.facs
                .replace(/\[lb n=(.*?)\]/g, '<span class="break">$1</span>')
                .replace(/\[[pb]b n=(.*?)\]/g, '<span class="break">$1.</span>')
                .replace(/\[pc:(.*?):pc\]/g, "$1");
            return `${space ? " " : ""}<span class="facs">${word}</span>`;
        case "lb":
            return ` <span class="break">${token.n}</span>`;
        case "cb":
        case "pb":
            return ` <span class="break">${token.n}.</span>`;
    }
}

function writeTokenNorm(token) {
    switch (token.t) {
        case "pc":
        case "num":
        case "w":
            const space = token.t != "pc";
            const word = token.norm
                .replace(/\[lb n=(.*?)\]/g, '<span class="break">$1</span>')
                .replace(/\[[cp]b n=(.*?)\]/g, '<span class="break">$1.</span>')
                .replace(/\[pc:(.*?):pc\]/g, "$1");
            return `${space ? " " : ""}<span class="norm">${word}</span>`;
        case "lb":
            return ` <span class="break">${token.n}</span>`;
        case "cb":
        case "pb":
            return ` <span class="break">${token.n}.</span>`;
    }
}