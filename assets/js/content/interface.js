"use strict";

$( function() {

    function addBaseHTML(){
        let str =   "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>"+
                        "<div id='tally_click_visual'></div>"+
                        "<div class='tally_monster_sprite_container'>"+
                            "<div class='tally_monster_sprite'>" +
                                "<div class='tally_monster_sprite_inner'></div>"+
                            "</div>"+
                        "</div>"+
                        "<div class='tally_award_monster_wrapper'>"+
                            "<div class='tally_award_monster'></div>"+
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
    addBaseHTML();






});
