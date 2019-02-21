"use strict";

/*  BATTLE EFFECT
 ******************************************************************************/

var BattleEffect = (function() {
	// PRIVATE
	let source, // page source for rumbles
		nodes,  // node string for rumbles
		n = "*", // node elements for rumbles
		monsterPos, tallyPos;

	function setup(){
		setupRumble();
	}

	/**
	 *	Store the nodes, source code, for the battle rumble
	 */
	function setupRumble() {

		// display source code of web page in background
		if (source == null) {
			source = $("body").html();
			source.replace(/[^<]/gi, '&lt;').replace(/[^>]/gi, '&gt;');
			//console.log(source);
		}
		if (nodes == null) {
			// all possible html5 nodes
			nodes = ['a', 'b', 'blockquote', 'br', 'body', 'button', 'canvas', 'code', 'dd', 'div', 'dl', 'dt',
				'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
				'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
				'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'template', 'textarea', 'text', 'u', 'video'
			];
			//console.log(nodes.join(", "));
			// add any exclusions
			for (let i = 0, l = nodes.length; i < l; i++) {
				//console.log(nodes.length, nodes[i], $(nodes[i]).height(), $(nodes[i]).length);
				// remove large divs
				if ($(nodes[i]).length == 0 || $(nodes[i]).height() > 2000 || $(nodes[i]).height() == undefined) {
					//console.log(" --> removed ");
					delete nodes[i];
				} else {
					nodes[i] = nodes[i] + ':not(.tally)';
				}
			}
			// clean empty nodes from array
			nodes = nodes.filter(function(el) {
				return el != null;
			});
			console.log("final node count: " + nodes.length);
			// format for selection
			n = nodes.join(', ');
			//console.log(n);
		}
	}
	function rumble(degree="medium", soundFile="explosions/explode.mp3") {
		// make sure we are ready to rumble!
		if (source == null || nodes == null)
			setupRumble();

		// add div
		// if ($("#battle-background").length == 0)
		// 	$("body").append("<blockquote id='battle-background'></blockquote>");

		// extend rumble and sound time based on degree
		let soundDegrees = [-0.2, 0, 0.2],
			rumbleDegrees = [500, 1200, 1800],
			degreeIndex = 0;
		if (degree == "medium") degreeIndex = 1;
		if (degree == "large") degreeIndex = 2;

		// play sound
		Sound.playFile(soundFile, 0, soundDegrees[degreeIndex]);
		// display background
		//$("#battle-background").text(source).removeClass("battle-background-clear");
		// rumble page elements
		$(n).addClass(degree + '-rumble');
		// after delay set back to normal
		setTimeout(function() {
			$(n).removeClass(degree + '-rumble');
			$("#battle-background").text("").addClass("battle-background-clear");
		}, rumbleDegrees[degreeIndex]);
	}





	/**
	 *	Get center position of object
	 */
	function getCenterPosition(ele) {
		let pos = {
			"left": $(ele).offset().left + $(ele).width() / 2,
			"top": $(ele).offset().top + $(ele).height() / 2
		};
		console.log("getCenterPosition()", ele, $(ele).offset(), pos, $(document).scrollTop());
		return pos;
	}
	/**
	 *	Set center position of object to new pos
	 */
	function setCenterPosition(ele, newPos) {
		// show it
		$(ele).css("opacity", 1);
		// set left/top, adjust by width/height
		$(ele).offset({"left": newPos.left - $(ele).width() / 2});
		$(ele).offset({"top": newPos.top - $(ele).height() / 2});
		console.log("setCenterPosition()", ele, newPos);
	}



	function fireProjectile(at,rumble=false) {
		console.log("fireProjectile() > ", at);

		let end, origin;

		// update positions
		if (monsterPos == null || tallyPos == null){
			monsterPos = getCenterPosition(".tally_monster_sprite");
			tallyPos = getCenterPosition("#tally_character");
		}
		//console.log(tallyPos, monsterPos);

		// if firing from monster > Tally
		if (at == "tally") {
			origin = monsterPos;
			end = tallyPos;
		}
		// else firing from Tally > monster
		else {
			origin = tallyPos;
			end = monsterPos;
		}
		console.log("origin=",origin,"end=",end);

		// set projectile to origin
		setCenterPosition('#battle_projectile', origin);
		// animate projectile
		anime({
			targets: '#battle_projectile',
			left: [origin.left + "px", end.left + "px"],
			top: [origin.top + "px", end.top + "px"],
			scale: [0.5,1],
			rotate: [0,350],
			elasticity: 0,
			duration: 1000,
			easing: 'easeInOutSine',
			// update: function(anim) {
			// 	console.log(anim.progress, anim.animations[0].currentValue, anim.animations[1].currentValue);
			// },
			complete: function(anim) {
				console.log(anim.progress, anim.animations[0].currentValue, anim.animations[1].currentValue);
				// hide projectile
				$('#battle_projectile').css("opacity", 0);
				// show explosion
				showExplosion(null);
				if (rumble)
					BattleEffect.rumble("medium");
			}
		});
	}

	let explosions = [
		'clouds-blue-red-stroke.png',
		'clouds-ltblue-blue-stroke.png',
		'clouds-orange-red-stroke.png',
		//'clouds-red-stroke.png',
		'squares-green-pink.png',
		'squares-green.png',
		'squares-pink.png',
		'squares-red-orange.png',
		'squares-yellow-red-stroke.png',
		'stars-pink.png',
		'water-blue.png',
	];

	function showExplosion(pos,rumble=false) {
		if (rumble)
			rumble("medium","powerups/"+randomObjProperty(Sound.sounds.powerups));

		// if no position received
		if (pos == null)
			pos = getCenterPosition('#battle_projectile');
		// set position
		setCenterPosition('.explosion_sprite_container', pos);

		// reference to image file
		var url = chrome.extension.getURL('assets/img/explosions/' + randomArrayIndex(explosions));
		// set content
		$('.explosion_sprite_inner').css('background-image', 'url("' + url + '")');

		setTimeout(function() {
			$('.explosion_sprite_container').css("opacity", 0);
		}, 1500);

	}






	// PUBLIC
	return {
        setup: setup,
		rumble: function(degree,soundFile) {
			rumble(degree,soundFile);
		},
		fireProjectile: function(at,rumble) {
			fireProjectile(at,rumble);
		},
		showExplosion: function(pos,rumble) {
			showExplosion(pos,rumble);
		},
		getCenterPosition: function(ele){
			return getCenterPosition(ele);
		}
	};
})();
