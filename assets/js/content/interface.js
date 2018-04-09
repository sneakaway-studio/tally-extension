"use strict";

$( function() {

    function addBaseHTML(){
        let str =   "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>"+
                        "<div id='tally_click_visual'></div>"+
                        "<div class='tally_monster_sprite'></div>"+
                        "<div class='tally_award_monster'></div>"+
                        "<div class='tally_award_text'></div>"+
                        "<div class='tally_award_background'></div>"+
                        "<div id='tally'></div>"+
                    "</div>";
        $('body').append(str);
    }
    addBaseHTML();






});
