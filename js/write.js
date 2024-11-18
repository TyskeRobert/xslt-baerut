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
    return `
        <div>
            ${textArray.map(token => writeTokenDipl(token)).join("")}
        </div>
    `;
}

function writeFullText(doc, level) {
    console.log(doc.source.text);
    switch (level) {
        case "facs":
            return `<div>FACS TEXT</div`;
        case "dipl":
            return writeDipl(doc.source.text);
        case "norm":
            return writeNorm(doc.source.text);
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
    return `
        <div>
            ${textArray.map(token => writeTokenNorm(token)).join("")}
        </div>
    `;
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
    switch (token.t) {
        case "pc":
            return `<span class="dipl">${token.dipl}</span>`;
        case "w":
            return ` <span class="dipl">${token.dipl}</span>`;
    }
}

function writeTokenNorm(token) {
    switch (token.t) {
        case "pc":
            return `<span class="norm">${token.dipl}</span>`;
        case "w":
            return ` <span class="norm">${token.norm}</span>`;
    }
}