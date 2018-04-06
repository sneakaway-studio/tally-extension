"use strict";

$( function() {

    function addBaseHTML(){
        let str =   "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>"+
                        "<div id='tally_click_visual'></div>"+
                            "<div class='tally_monster_sprite'></div>"+
                        "<div id='tally'></div>"+
                    "</div>";
        $('body').append(str);
    }
    addBaseHTML();






});
