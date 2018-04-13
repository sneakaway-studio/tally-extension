"use strict";

$( function() {

    function addBaseHTML(){
        let str =   "<div id='tally_wrapper' class='reset-this-root reset-this no-print'>"+
                        "<svg class='monster_path' version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"1280\" height=\"1024\" viewBox=\"0 0 1280 1024\">\n" +
            "<path fill=\"none\" stroke=\"red\" stroke-width=\"1\" d=\"M0.2,501.7c73.1-65.1,128.8-75.8,168.6-70.6\n" +
            "\tc71.9,9.4,87.7,70.1,158.5,72.7c76.2,2.8,92.2-66.3,167.6-62.2c72.1,3.9,83.2,68.4,152.2,67.5c65.4-0.9,74-59.2,141.5-63\n" +
            "\tc74.3-4.3,88.4,64.9,166.8,67.4c77.1,2.4,100.9-63.5,180.1-65.5c60.8-1.5,111.3,35.6,144.9,67.6\"/>\n" +
            "</svg>"+
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
