import { displayPage } from "./display.js";

export function populateMain(corpus) {
    for (const s of corpus.sources) {
        const identifier = s.source.header.fileDesc.sourceDesc.msDesc.msIdentifier;
        const link = $("<a></a>");
        link.html(`${identifier?.idno}`);
        link.click(function() {
            displayPage(corpus, s.id, "meta", "dipl");
        });

        let target = "#source-select-manuscript";
        const type = s.source.header.fileDesc.sourceDesc.msDesc.physDesc?.objectDesc?.form;
        if (type) switch (type) {
            case "codex":
            case "fragment":
            case "manuscript":
                break;
            case "charter":
                target = "#source-select-charter";
                break;
            case "beam":
            case "bone":
            case "church-graffiti":
            case "commemorative-inscription":
            case "gravestone":
            case "key":
            case "memorial-stone":
            case "metal":
            case "neck-ring":
            case "oblatjern":
            case "plaster":
            case "plate":
            case "rock_face":
            case "runestone":
            case "stick":
            case "stone":
            case "stone_wall":
            case "tree":
            case "wall-inscription":
            case "wood":
            case "wooden-figure":
            case "wooden_stick":
                target = "#source-select-inscription";
                break;
            default:
                console.log(`Undefined source type: ${type}`);
                break;
        }
        const item = $("<li></li>");
        item.append(link);
        $(target).append(item);
    }
}

export function populatePageSelector(pages) {
    const pageSelector = $("#source-page-select");
    pageSelector.html(`<option value="meta">Metadata</option>`);
    if (pages.length > 0) 
        pages.map(p => {
            pageSelector.append(`<option value="${p}">${p}</option>`)
        });
    else pageSelector.append(`<option value="text">Text</option>`);
}