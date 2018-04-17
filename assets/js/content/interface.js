"use strict";

$( function() {

    function addBaseHTML(){
        let str =   "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>"+
                        "<svg class='monster_path' version='1.1' xmlns='http://www.w3.org/2000/svg'>" +
                            "<g><path></path></g>" +
                        "</svg>"+
                        "<div id='tally_click_visual'></div>"+
                        "<div class='tally_monster_sprite_container shake-vertical shake-constant'>"+
                            "<div class='tally_monster_sprite shake-slow '>" +
                                "<div class='tally_monster_sprite_inner'></div>"+
                            "</div>"+
                        "</div>"+
                        "<div class='tally_award_text_wrapper'>"+
                            "<div class='tally_award_text'>"+
                                "<div class='award_title'></div>" +
                    			"<div class='award_subtitle'></div>" +
                    			"<div class='award_fact_title'></div>" +
                    			"<div class='award_fact'></div>" +
                            "</div>"+
                        "</div>"+
                        "<div class='tally_award_background'></div>"+

                        "<div id='tally'></div>"+
                    "</div>";
        $('body').append(str);
    }


    // if game should be active
    //if (prop(pageData) && pageData.activeOnPage)
        addBaseHTML();

});
