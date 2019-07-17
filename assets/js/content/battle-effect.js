"use strict";

/*  BATTLE EFFECT
 ******************************************************************************/

window.BattleEffect = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.BattleEffect,
		source, // page source for rumbles
		nodes, // node string for rumbles
		n = "*", // node elements for rumbles
		monsterPos, tallyPos;

	function setup() {
		setupRumble();
	}

	/**
	 *	Store the nodes, source code, for the battle rumble
	 */
	function setupRumble() {
		try {
			// display source code of web page in background
			if (source == null) {
				source = $("body").html();
				source.replace(/[^<]/gi, '&lt;').replace(/[^>]/gi, '&gt;');
				//if (DEBUG) console.log(source);
			}
			if (nodes == null) {
				// all possible html5 nodes
				nodes = ['a', 'b', 'blockquote', 'br', 'body', 'button', 'canvas', 'code', 'dd', 'div', 'dl', 'dt',
					'em', 'embed', 'footer', 'frame', 'form', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
					'iframe', 'img', 'input', 'label', 'nav', 'ol', 'ul', 'li', 'option', 'p', 'pre', 'section', 'span',
					'strong', 'sup', 'svg', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'template', 'textarea', 'text', 'u', 'video'
				];
				//if (DEBUG) console.log(nodes.join(", "));
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
				//if (DEBUG) console.log("final node count: " + nodes.length);
				// format for selection
				n = nodes.join(', ');
				//if (DEBUG) console.log(n);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function showRumble(degree = "medium", soundFile = "explosions/explode.mp3") {
		try {
			// are we are ready to rumble!?
			if (source == null || nodes == null) setupRumble();

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
		} catch (err) {
			console.error(err);
		}
	}



	function startAttackEffects(attack, selfStr, oppStr, rumbleSize = "small") {
		try {
			if (DEBUG) console.log("🧨 BattleEffect.startAttackEffects() > ", attack, BattleAttack.getOutcomeDetails().outcomes, selfStr, oppStr, rumbleSize);

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let addToDuration = 0;

			// 1. get positions
			let startPos, endPos;
			// if firing from monster > Tally
			if (selfStr == "monster") {
				startPos = Core.getCenterPosition(".tally_monster_sprite_container");
				endPos = Core.getCenterPosition("#tally_character");
				if (BattleAttack.getOutcomeDetails().outcomes === "missed") {
					// add to pos and time
					endPos.left = -200;
					addToDuration = 500;
				}
			}
			// else firing from Tally > monster
			else if (selfStr == "tally") {
				startPos = Core.getCenterPosition("#tally_character");
				endPos = Core.getCenterPosition(".tally_monster_sprite_container");
				if (BattleAttack.getOutcomeDetails().outcomes === "missed") {
					// add to pos and time
					endPos.left = pageData.browser.width + 200;
					addToDuration = 1000;
				}
			}
			if (DEBUG) console.log("🧨 BattleEffect.startAttackEffects() startPos=", startPos, ", endPos=", endPos);


			// 2-1. show projectile?
			if (attack.type === "attack") {

				// set projectile to startPos and show it
				Core.setCenterPosition('#battle_projectile', startPos);
				Core.showElement('#battle_projectile');

				// reference to image file
				var url = chrome.extension.getURL('assets/img/battles/number-ball.gif');
				// set content
				$('#battle_projectile').css('background-image', 'url("' + url + '")');

				// animate projectile
				anime({
					targets: '#battle_projectile',
					left: [startPos.left + "px", endPos.left + "px"],
					top: [startPos.top + "px", endPos.top + "px"],
					scale: [0.5, 1],
					rotate: [0, 350],
					elasticity: 0,
					duration: addToDuration + 500,
					easing: 'linear',
					// testing
					// update: function(anim) {
					// 	if (DEBUG) console.log(anim.progress, anim.animations[0].currentValue, anim.animations[1].currentValue);
					// },
					complete: function(anim) {
						//if (DEBUG) console.log("🧨 BattleEffect.startAttackEffects() projectile done", anim.progress,
						//	anim.animations[0].currentValue, anim.animations[1].currentValue);

						// show explosion
						showExplosion(attack, endPos, rumbleSize);
						// hide projectile
						Core.hideElement('#battle_projectile');
						// pass control back to BattleAttack...
						BattleAttack.handleAttackOutcomes(attack, selfStr, oppStr);
						return;
					}
				});
			}
			// 2-2. or skip straight to handleAttackOutcomes()
			else if (attack.type === "defense")
				BattleAttack.handleAttackOutcomes(attack, selfStr, oppStr);

		} catch (err) {
			console.error(err);
		}
	}

	let explosions = [
		// 'clouds-blue-red-stroke.png',
		// 'clouds-ltblue-blue-stroke.png',
		// 'clouds-orange-red-stroke.png',
		// 'squares-green-pink.png',
		// 'squares-green.png',
		// 'squares-pink.png',
		// 'squares-red-orange.png',
		// 'squares-yellow-red-stroke.png',
		// 'stars-pink.png',
		// 'water-blue.png',

'defense-security-firewall.gif',
'defense-network-packetshield.gif',
'defense-computer.gif',
'attack-social-clickstrike.gif',
'attack-social-emailblitz.gif',
'attack-cryptography-triangulate.gif',
'attack-memory-memoryflare.gif',
'attack-cryptography-cryptcracker.gif',
'attack-computer.gif',

	];



	function showExplosion(attack, endPos, rumbleSize = "") {
		try {
			// make sure attack hit
			if (BattleAttack.getOutcomeDetails().outcomes === "missed" ||
				BattleAttack.getOutcomeDetails().outcomes === "noEffect" ||
				BattleAttack.getOutcomeDetails().outcomes.length <= 0) return;

			if (DEBUG) console.log("🧨 BattleEffect.showExplosion()", attack, BattleAttack.getOutcomeDetails().outcomes, endPos, rumbleSize);

			// make sure attack was not a defense
			if (rumbleSize !== "" && attack.type !== "defense")
				showRumble("medium", "powerups/" + FS_Object.randomObjProperty(Sound.sounds.powerups));

			// if no position received
			if (endPos == null)
				endPos = Core.getCenterPosition('#battle_projectile');
			// set position
			Core.setCenterPosition('#explosion_sprite_container', endPos);
			Core.showElement('#explosion_sprite_container');

			// default explosion
			let file = "stars-pink.gif";
			// unless attack has a specific one
			if (prop(attack["animation-name"]) && attack["animation-name"] !== "") file = attack["animation-name"];

			// reference to image file
			var url = chrome.extension.getURL('assets/img/battles/explosions/' + file);
			// set content
			$('#explosion_sprite_inner').css('background-image', 'url("' + url + '")');

			setTimeout(function() {
				Core.hideElement('#explosion_sprite_container');
			}, 1500);
		} catch (err) {
			console.error(err);
		}
	}

	// set dir = 1 for tally, -1 for monster
	function showAttackLurch(ele, dir = 1) {

		var timeline = anime.timeline({
			targets: ele,
			easing: 'easeOutExpo',
			duration: 250
		});
		timeline
			.add({
				translateX: 20 * dir,
			})
			.add({
				translateX: 0,
			});
	}

	function showDamage(ele, delay = 0) {

		anime({
			targets: ele,
			easing: 'easeOutExpo',
			delay: delay,
			opacity: [{
					value: 1,
					duration: 200,
				},
				{
					value: 0.15,
					duration: 200,
				},
				{
					value: 1,
					duration: 200,
				},
				{
					value: 0.15,
					duration: 200,
				},
				{
					value: 1,
					duration: 200,
				}
			],
		});

	}


	// PUBLIC
	return {
		setup: setup,
		showRumble: function(degree, soundFile) {
			showRumble(degree, soundFile);
		},
		startAttackEffects: function(attack, selfStr, oppStr, rumbleSize) {
			startAttackEffects(attack, selfStr, oppStr, rumbleSize);
		},
		showExplosion: function(attack, endPos, rumbleSize) {
			showExplosion(attack, endPos, rumbleSize);
		},
		showAttackLurch: function(ele, dir) {
			showAttackLurch(ele, dir);
		},
		showDamage: function(ele, delay) {
			showDamage(ele, delay);
		}
	};
})();
