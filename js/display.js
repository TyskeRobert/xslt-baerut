import { populatePageSelector } from "./populate.js";
import { writeSource } from "./write.js";

export function displayPage(corpus, id, page, level) {
    const doc = corpus.sources.filter(m => m.id == id)[0];
    const levels = doc.source.header.encodingDesc.editorialDecl.normalization;

    $("#content > div").hide();
    $("#source-select").hide();

    $("#source-level-select > option[value='facs']").attr("disabled", !levels.facs);
    $("#source-level-select > option[value='dipl']").attr("disabled", !levels.dipl);
    $("#source-level-select > option[value='norm']").attr("disabled", !levels.norm);

    populatePageSelector(doc.source.pages);

    $("#source").attr("name", id);
    $("#source-page-select").val(page);
    $("#source-level-select").val(level);
    if (page == "meta") 
        $("#source-level-select").attr("disabled", true);
    else 
        $("#source-level-select").attr("disabled", false);

    $("#source-display-content").html(writeSource(doc, page, level));
    $("#source-display").show();
    $("#source").show();
}