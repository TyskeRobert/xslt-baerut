import { displayPage } from "./display.js";
import { loadCorpus } from "./loader.js";
import { populateMain } from "./populate.js";

$(document).ready(async function() {
    $("#content > div").hide();
    $("#home").show();

    $("#navigator > button")
        .attr("disabled", true)
        .click(function() {
            const selectedDiv = $(this).val();
            $("#content > div").each(function() {
                if ($(this).attr("id") == selectedDiv) {
                    if (selectedDiv == "source") {
                        $("#source-display").hide();
                        $("#source-select").show();
                    }
                    $(this).show();
                }
                else $(this).hide();
            });
        });

    $("#source-select-button").click(function() {
        $("#source-display").hide();
        $("#source-select").show();
    });

    $("#source-page-select").change(function() {
        displayPage(
            corpus, 
            $("#source").attr("name"), 
            $(this).val(),
            $("#source-level-select").val()
        );
    });

    const corpus = await loadCorpus();
    populateMain(corpus);
    $("#navigator > button").attr("disabled", false);
    console.log("Data loaded.")
});