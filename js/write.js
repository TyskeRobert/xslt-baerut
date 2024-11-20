import { 
    getPage, 
    getPageObject 
} from "./search.js";

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

function writeFacsPage(textArray, page) {
    const pageObject = getPageObject(textArray, page);
    let result = `<table class="facsPage"><tr>`;
    for (const column of pageObject.columns) {
        result += "<td><table>";
        for (const line of column.lines) {
            result += `
                <tr>
                    <td>${writeFacsLine(line.tokens)}</td>
                </tr>
            `;
        }
        result += "</table></td>"
    }
    result += "</tr></table>";
    return result;
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

    console.log(m);
    const editionLine = $("<tr></tr>");
    editionLine.append("<th>Version:</th>");
    const edition = m.fileDesc.editionStmt;
    editionLine.append(`
        <td><b>${edition.number}</b> (${edition.date})</td>
    `);
    result.append(editionLine);

    const licenceLine = $("<tr></tr>");
    licenceLine.append("<th>Licence:</th>");
    const availability = m.fileDesc.publicationStmt.availability
    licenceLine.append(`
        <td>
            <a href="${availability.url}" target="_blank">${availability.licence}</a>
        </td>
    `);
    result.append(licenceLine);

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
    switch (level) {
        case "facs":
            return `<div class="textBlock">${writeFacsPage(pageArray, page)}</div`;
        case "dipl":
            return `<div class="textBlock">${writeTextPage(pageArray, "dipl")}</div>`;
        case "norm":
            return `<div class="textBlock">${writeTextPage(pageArray, "norm")}</div>`;
    }
}

function writeTag(tag) {
    switch (tag.t) {
        case "div":
        case "p":
            return tag.open ? `<${tag.t}>` : `</${tag.t}>`;
        case "head":
            return tag.open ? "<h4>" : "</h4>";
    }
}

function writeTextPage(textArray, level) {
    let result = "";
    const openTags = [];
    for (const token of textArray) switch (token.t) {
        case "cb":
        case "lb":
        case "num":
        case "pb":
        case "pc":
        case "w":
            if (level == "dipl") 
                result += writeTokenDipl(token);
            else if (level == "norm")
                result += writeTokenNorm(token);
            break;
        case "div":
        case "head":
        case "p":
            if (token.open)
                openTags.push(token);
            else {
                if (openTags.length > 0) openTags.pop();
                else result = writeTag(token.openedBy) + result;
            }
            result += writeTag(token);
            break;
    }
    return result;
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
                .replace(/\[[cp]b n=(.*?)\]/g, '<span class="break">$1.</span>')
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