import { populatePageSelector } from "./populate.js";
import { writeSource } from "./write.js";

export function displayPage(corpus, id, page, level) {
    $("#content > div").hide();
    $("#source-select").hide();

    $("#source").attr("name", id);
    $("#source-page-select").val(page);
    if (page == "meta") 
        $("#source-level-select").attr("disabled", true);
    else 
        $("#source-level-select").attr("disabled", false);

    const doc = corpus.sources.filter(m => m.id == id)[0];
    populatePageSelector(doc.source.pages, page);

    $("#source-display-content").html(writeSource(doc, page, level));
    $("#source-display").show();
    $("#source").show();
}