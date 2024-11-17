import { loadCorpus } from "./loader.js";
import { writeSource } from "./source-display.js";

$(document).ready(async function() {
    $("#content > div").hide();
    $("#home").show();
    $("#navigator > button")
        .attr("disabled", true)
        .click(function() {
            const selectedDiv = $(this).val();
            $("#content > div").each(function() {
                if ($(this).attr("id") == selectedDiv) 
                    $(this).show();
                else $(this).hide();
            });
        });
    $("#source-select-button").click(function() {
        $("#source-display").hide();
        $("#source-select").show();
    });

    const corpus = await loadCorpus();
    populate(corpus);
    $("#navigator > button").attr("disabled", false);
    console.log(corpus.sources[0]);
});

function populate(corpus) {
    for (const s of corpus.sources) {
        const identifier = s.source.header.fileDesc.sourceDesc.msDesc.msIdentifier;
        const link = $("<a></a>");
        link.html(`${identifier?.idno}`);
        link.click(function() {
            $("#source-select").hide();
            $("#source-display").html(s.id).show();
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
        /*
        item.setAttribute("onclick", function() {
            alert(s.id);
            $("#source-select").hide();
            $("#source-display")
                .html(() => {writeSource(s.id)})
                .show();
        });
        */
        const item = $("<li></li>");
        item.append(link);
        $(target).append(item);
    }
}