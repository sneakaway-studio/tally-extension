"use strict";

var MonsterAward = (function() {

	let DEBUG = true,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing


	function addAwardHtml(){

		let str = "<div class='tally tally_award_text_wrapper'>" +
						"<div class='tally tally_award_text award_title'></div>" +
						"<div class='tally tally_award_text award_subtitle'></div>" +
						"<div class='tally tally_award_text award_did_you_know'></div>" +
						"<div class='tally tally_award_text award_fact'></div>" +
				  "</div>" +
				  "<div class='tally tally_award_background'></div>" +
				  "<div class='tally_award_explode_background-1'></div>"+
				  "<div class='tally_award_explode_background-2'></div>";
		$(".tally_award_wrapper").append(str);

	}





	/**
	 *	User captures monster
	 */
	function capture(_mid) {
		// tell them they caught it
		Thought.showThought(Thought.getThought(["monster", "captured", 0]), true, true);
		// set vars
		tally_nearby_monsters[_mid].captured = 1;
		tally_nearby_monsters[_mid].missed = 0;
		tally_nearby_monsters[_mid].totalCaptured += 1;
		// move monster and show award
		addAwardHtml();
		moveMonsterToAward(_mid);
		showAward(_mid);
		// save and push results to server
		Monster.saveAndPush(_mid);
	}
	/**
	 *	Move monster down to award area
	 */
	function moveMonsterToAward(_mid) {
		console.log("☆☆☆☆☆ Monster.moveMonsterToAward()", _mid, tally_nearby_monsters[_mid]);

		let _scale = pageData.browser.width > 1200 ? 0.85 : 0.65; // increase scale w/larger screens

		// get monster position
		let pos = $('.tally_monster_sprite_container').position();
		// stop current animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'none',
			'left': (pos.left - 70) + 'px',
			'top': (pos.top - 70) + 'px',
		});
		// add new css keyframe
		addKeyFrames(
			'moveToAward',
			//'from{ background-color: red;}' +
			'to{ transform: scale(' + _scale + ',' + _scale + '); left: 30%; top: ' + (pageData.browser.height - 370) + 'px;}'
		);
		// start animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'moveToAward',
			'animation-duration': '0.5s',
			'animation-delay': '0.25s',
			'animation-direction': 'normal',
			'animation-iteration-count': 1,
			'animation-fill-mode': 'forwards',
			'position': 'fixed'
		});
	}

	/**
	 *	User misses monster
	 */
	function miss(_mid) {
		console.log("!!!!! Monster.miss()", _mid, tally_nearby_monsters[_mid]);
		// tell them they missed
		Thought.showThought(Thought.getThought(["monster", "missed", 0]), true, true);
		// stop current animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'none',
		});
		// remove the click listener
		$('.tally_monster_sprite').unbind();
		// set missed instead of captured
		tally_nearby_monsters[_mid].captured = 0;
		tally_nearby_monsters[_mid].missed = 1;
		// save and push results to server
		Monster.saveAndPush(_mid);
	}




	/**
	 * Play award animation
	 */
	function showAward(_mid) {
		console.log("☆☆☆☆☆ Monster.showAward()", _mid, JSON.stringify(tally_top_monsters[_mid]),tally_nearby_monsters[_mid]);
		if (!prop(tally_top_monsters[_mid])) return;

		// insert text
		$('.award_subtitle').html("You leveled up! <a href='https://tallygame.net/profile'> Check out your score</a>");
		let additional_targets = '';
		let victory_text = "YOU CONTAINED THE MONSTER!!!!!";
		let fact = Thought.getFact("trackers");
		let box_text = "Did you know?";
		let str = fact.fact || "";
		if (fact.url && fact.source) str += " Source: <a href='" + fact.url + "' target='_blank'>" + fact.source + "</a>";
		if (fact.year) str += " (" + fact.year + ")";

		if (!prop(tally_top_monsters[_mid].top))
			console.error(".top is undefined");

		// 1. Are they already at the top of the leaderboard?
		// IOW is the monster level they are at (level-1) >= the top monster level?
		if (tally_nearby_monsters[_mid].totalCaptured > tally_top_monsters[_mid].top) {
			console.log("☆☆☆☆☆ YOU ARE *STILL* IN FIRST PLACE ☆☆☆☆☆");
			additional_targets = ', .tally_award_explode_background-1, .tally_award_explode_background-2';
			victory_text = "YOU ARE STILL IN FIRST!!!";
		}
		// 2. OR, are they just now coming to be on top?
		else if ((tally_nearby_monsters[_mid].totalCaptured) == tally_top_monsters[_mid].top) {
			console.log("☆☆☆☆☆ YOU JUST ARRIVED IN FIRST PLACE !!!! ☆☆☆☆☆");
			Effect.explode();
			additional_targets = ', .tally_award_explode_background-1, .tally_award_explode_background-2';
			victory_text = "YOU BROKE THE INTERNET!!!";
			box_text = "Reset the page";
			str = "";
			// handler for page reset
			$('.award_did_you_know').click(function(){
				location.reload();
			});
		}
		// 3. OR, are they below top
		else {
			console.log("☆☆☆☆☆ YOU ARE:", tally_top_monsters[_mid].top - tally_nearby_monsters[_mid].totalCaptured, "POINTS BEHIND THE LEADER");
		}

		// insert specific text
		$('.award_title').html(victory_text);
		$('.award_did_you_know').html(box_text);
		$('.award_fact').html(str);

		// hide background and text
		var insertTimeline = anime.timeline();
		insertTimeline
			.add({
				targets: '.tally_award_background' + additional_targets,
				rotate: -20,
				translateY: [{
						value: -1400,
						duration: 2000,
						delay: 0,
						elasticity: 100
					},
					{
						value: 1400,
						duration: 2000,
						delay: 12000,
						elasticity: 0
					}
				],
				easing: 'easeInOutCubic',
			})
			.add({
				targets: '.tally_award_text_wrapper',
				translateX: [{
						value: -2020,
						duration: 2000,
						delay: 600,
						elasticity: 0
					},
					{
						value: 1020,
						duration: 3000,
						delay: 10000,
						elasticity: 0
					}
				],
				easing: 'easeOutExpo',
				offset: 900
			});

		Sound.playCategory('awards', 'monster');

		// insert listener to hide award on click (after brief pause to make sure it loaded)
		window.setTimeout(function() {
			$('.tally_award_background, .tally_monster_sprite, .tally_award_text_wrapper' + additional_targets).click(function(){
				$('.tally_award_background, .tally_monster_sprite, .tally_award_text_wrapper' + additional_targets).hide(1000);
			});

		}, 1000);

		// hide monster
		window.setTimeout(function() {
			// TESTING
			// return;

			// get monster position
			let pos = $('.tally_monster_sprite_container').position();
			// stop current animation
			$('.tally_monster_sprite_container').css({
				'animation-name': 'none',
				'left': (pos.left - 70) + 'px',
				'top': (pos.top - 70) + 'px',
			});
			// add new css keyframe
			addKeyFrames(
				'hideBelow', 'to { top: 1000px; }'
			);
			// start animation
			$('.tally_monster_sprite_container').css({
				'animation-name': 'hideBelow',
				'animation-duration': '1.0s',
				'animation-direction': 'normal',
				'animation-iteration-count': 1,
				'animation-fill-mode': 'forwards'
			});
			// add event listener to check when done
			$(".tally_monster_sprite_container")
				.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
					//console.log("animation done", tally_nearby_monsters[_mid]);
					// code to execute after animation ends
					$('.tally_monster_sprite_container').css({
						'display': 'none'
					});
				});
		}, 13000);


	}

	function launchFrom(_mid, _pos) {
		console.log("⊙⊙⊙⊙! Monster.launchFrom()", _mid, _pos, tally_nearby_monsters[_mid]);

		let _duration = ((pageData.browser.width / 15) + 3800) /*+ (tally_nearby_monsters[_mid].level * 100)*/ , // animation duration
			_direction = "normal", // default animation direction
			_scale = pageData.browser.width > 1200 ? 0.65 : 0.5; // increase scale w/larger screens

		// set direction of monster (default is normal, i.e. right)
		if (prop(tally_nearby_monsters[_mid].facing)) {
			// set direction left
			if (tally_nearby_monsters[_mid].facing == -1)
				_direction = "reverse";
			// pick random
			else if (tally_nearby_monsters[_mid].facing == 0) {
				let r = Math.random();
				if (r < 0.5)
					_direction = "reverse";
			}
		}

		// set start / end positions
		// need to add some randomness here
		let coords = {
			speed: 1,
			start: {
				x: -300,
				y: (pageData.browser.height * 0.25) + (Math.random() * (pageData.browser.height * 0.5))
			},
			end: {
				x: pageData.browser.width + 300,
				y: pageData.browser.height / 2 - 200
			}
		};
		//console.log("coords", coords);

		// add animation keyframes
		addKeyFrames(
			'leftToRight',
			'0%{ left: ' + coords.start.x + 'px; top: ' + coords.start.y + 'px;}' +
			'100%{ left: ' + coords.end.x + 'px; top: ' + coords.end.y + 'px;}'
		);
		// start animation
		$('.tally_monster_sprite_container').css({
			'animation-name': 'leftToRight',
			'animation-duration': '4s',
			'animation-iteration-count:': 1,
			'-webkit-animation-iteration-count': ' 1',
			'animation-direction': _direction,
			'animation-fill-mode': 'forwards',
			'display': 'block',
			'opacity': 1
		});
		$('.tally_monster_sprite_container').css({
			'transform': 'scale(' + _scale + ')'
		});

		// add event listener to check when done
		$(".tally_monster_sprite_container")
			.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function() {
				console.log("animation done", tally_nearby_monsters[_mid]);
				// code to execute after animation ends
				if (prop(tally_nearby_monsters[_mid]) && tally_nearby_monsters[_mid].captured == 0)
					MonsterAward.miss(_mid);
			});

		// add click handler
		$(document).on('click', '.tally_monster_sprite', function() {
			if (!prop(tally_nearby_monsters[_mid])) return;
			// remove the click listener from the monster
			$('.tally_monster_sprite').off("click");
			// capture the monster
			MonsterAward.capture(_mid);
		});

		// TESTING
		//MonsterAward.capture(_mid);
	}


	/**
	 *	Reset monster
	 */
	function reset(mid) {
		// reset one
		// if (tally_nearby_monsters[mid])
		// 	delete tally_nearby_monsters[mid];
		// reset them all
		tally_nearby_monsters = {};
		saveNearbyMonsters();
		// set the skin color
		Skin.setStage(0);
	}

	/**
	 *	Save nearby monsters
	 */
	function saveNearbyMonsters() {
		chrome.runtime.sendMessage({
			'action': 'saveNearbyMonsters',
			'data': tally_nearby_monsters
		}, function(response) {
			//console.log('<<<<< > saveNearbyMonsters()',JSON.stringify(response));
		});
		Debug.update();
	}
	/**
	 *	Return current monster MID
	 */
	function getCurrent() {
		return currentMID;
	}

	// PUBLIC
	return {
		miss:function(_mid){
			miss(_mid);
		},
		capture: function(_mid) {
			capture(_mid);
		},
		launchFrom: function(_mid, _pos) {
			launchFrom(_mid, _pos);
		}
	};
}());
