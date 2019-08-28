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
			if (DEBUG) console.log("🧨 BattleEffect.startAttackEffects() > ", attack,
				BattleAttack.getOutcomeDetails().outcomes, selfStr, oppStr, rumbleSize);

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let addToDuration = 0;

			// 1. get positions
			let startPos, endPos;
			// if firing from monster > Tally
			if ((attack.type === "attack" && selfStr == "monster") ||
				(attack.type === "defense" && selfStr == "tally")
			) {
				startPos = Core.getCenterPosition(".tally_monster_sprite_container");
				endPos = Core.getCenterPosition("#tally_character");
				if (BattleAttack.getOutcomeDetails().outcomes === "missed") {
					// add to pos and time
					endPos.left = -200;
					addToDuration = 500;
				}
			}
			// else firing from Tally > monster
			else if ((attack.type === "attack" && selfStr == "tally") ||
				(attack.type === "defense" && selfStr == "monster")
			) {
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
			// 2-2. or show a defense animation
			else if (attack.type === "defense") {
				// show defnese
				showExplosion(attack, endPos, rumbleSize);
				// then pass control back to BattleAttack...
				BattleAttack.handleAttackOutcomes(attack, selfStr, oppStr);
			}

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
				showRumble("medium");

			if (attack.sound) {
				// play specific
				Sound.playFile("attacks/" + attack.sound);
			} else {
				// play random
				Sound.playFile("powerups/" + FS_Object.randomObjProperty(Sound.sounds.powerups));
			}


			// if no position received
			if (endPos == null)
				endPos = Core.getCenterPosition('#battle_projectile');
			// set position
			Core.setCenterPosition('#explosion_sprite_container', endPos);
			Core.showElement('#explosion_sprite_container');

			// default explosion
			let file = "stars-pink.gif";
			if (attack.type === "defense") file = "stars-orange.gif";
			// unless attack has a specific one
			if (prop(attack["animation-name"]) && attack["animation-name"] !== "") file = attack["animation-name"];

			// reference to image file
			var url = chrome.extension.getURL('assets/img/battles/explosions/' + file + "?a=" + Math.random());
			// set content to none to reset GIF
			$('#explosion_sprite_inner').css('background-image', 'none');
			// set content
			$('#explosion_sprite_inner').css('background-image', 'url("' + url + '")');

			setTimeout(function() {
				Core.hideElement('#explosion_sprite_container');
			}, 2500);
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




	let monsterAwardElements = '.monster_capture_banner_top' +
		',.monster_capture_banner_bottom' +
		',.monster_capture_taxonomy' +
		',.monster_capture_tracker' +
		',.monster_capture_cage';

	function showCapturedMonster() {
		try {

			let gradient, palette;
			// if this one has gradient defined
			if (GradientsByMid.data[Battle.details.mid]) {
				gradient = GradientsByMid.data[Battle.details.mid];
			}
			// else if the tier1 for this one is defined
			else if (GradientsByMid.data[MonstersById.data[Battle.details.mid].tier1id]) {
				gradient = GradientsByMid.data[MonstersById.data[Battle.details.mid].tier1id];
			}
			// if a palette is defined for this one
			if (PalettesByTier1Id.data[MonstersById.data[Battle.details.mid]]) {
				palette = PalettesByTier1Id.data[MonstersById.data[Battle.details.mid]];
			} else if (PalettesByTier1Id.data[MonstersById.data[Battle.details.mid].tier1id]) {
				palette = PalettesByTier1Id.data[MonstersById.data[Battle.details.mid].tier1id];
			}

			// console.log(gradient, Monster.current());

			// placeholder taxonomy
			let taxonomy = "";
			if (MonstersById.data[Battle.details.mid].tier1)
				taxonomy += MonstersById.data[Battle.details.mid].tier1;
			if (MonstersById.data[Battle.details.mid].tier2)
				taxonomy += " > " + MonstersById.data[Battle.details.mid].tier2;
			if (MonstersById.data[Battle.details.mid].tier3)
				taxonomy += " > " + MonstersById.data[Battle.details.mid].tier3;
			if (MonstersById.data[Battle.details.mid].tier4)
				taxonomy += " > " + MonstersById.data[Battle.details.mid].tier4;


			let str =
				`<style type="text/css">
					.default {fill:none;}

					.capture_banner_text, .capture_banner_text a { fill:#fff; font-family:'Monaco'; font-size:17px !important; }
					.capture_banner_text a { font-weight:bold; }
					.capture_banner { fill: ` + gradient.hex2 + `}

					.tracker_award_seal { fill:` + palette.tier4 + `;}
					.tracker_award_seal_text { fill:#fff; font-family:'Monaco'; font-size:34px !important;}
					.tracker_award_seal_tracker_name { fill:` + palette.tier1 + `; font: bold 40px 'Monaco' !important;}


					.cage_svg { fill: ` + gradient.hex1 + `; }
				</style>
				` +

				// banner - top
				`<svg version="1.1" class="tally monster_capture_banner_top" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					 x="0px" y="0px" viewBox="0 0 462.7 53.2" style="enable-background:new 0 0 462.7 53.2;" xml:space="preserve">
				<polygon class="tally capture_banner" points="23.1,2 438.8,2 431.6,44 30.1,44 "/>
				<polygon class="tally capture_banner" points="419.1,51.3 420,46.3 433.9,46.3 440.3,8.4 462.7,8.4 455.3,16.5 462.7,23.5 454.9,29.6 462.7,37.6 455.5,43.2
					462.7,51.3 "/>
				<polygon class="tally capture_banner" points="43.5,51.3 42.6,46.3 28.8,46.3 22.4,8.4 0,8.4 7.4,16.5 0,23.5 7.7,29.6 0,37.6 7.2,43.2 0,51.3 "/>
				<rect class="tally default capture_banner" x="37.7" y="14.3" width="390.3" height="21.3"/>
				<text transform="matrix(1 0 0 1 74.7075 27.7292)" class="tally capture_banner_text">
					Tally caught a product monster!
				</text>
				</svg>` +

				// banner - bottom
				`<svg version="1.1" class="tally monster_capture_banner_bottom" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					 x="0px" y="0px" viewBox="0 0 462.7 53.2" style="enable-background:new 0 0 462.7 53.2;" xml:space="preserve">
				<polygon class="tally capture_banner" points="439.6,51.3 23.9,51.3 31.1,9.3 432.6,9.3 "/>
				<polygon class="tally capture_banner" points="43.6,2 42.7,7 28.8,7 22.4,44.9 0,44.9 7.4,36.8 0,29.8 7.8,23.7 0,15.7 7.2,10.1 0,2 "/>
				<polygon class="tally capture_banner" points="419.2,2 420.1,7 433.9,7 440.3,44.9 462.7,44.9 455.3,36.8 462.7,29.8 455,23.7 462.7,15.7 455.5,10.1 462.7,2 "/>
				<rect class="tally default capture_banner" x="37.7" y="23.5" width="390.3" height="21.3"/>
				<text transform="matrix(1 0 0 1 78 36)" class="tally capture_banner_text">
					Check out your <a class='tally capture_banner_link tally_profile_link'>TrackerBase</a>
				</text>
				</svg>` +


				"<div class='tally monster_capture_taxonomy'>" + taxonomy + "</div>" +


				// tracker award
				`<svg class="tally monster_capture_tracker" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 viewBox="0 0 700 160" style="enable-background:new 0 0 700 160;" xml:space="preserve">
				<defs>
					<filter x="0" y="0" width="1" height="1" id="solid_background">
						<feFlood flood-color="` + palette.tier2 + `" />
						<feComposite in="SourceGraphic" operator="xor" />
					</filter>
				</defs>
				<polygon class="tally tracker_award_seal" points="0,0 0,160 700,160 640,80 700,0 "/>
				<rect x="14.9" y="21.9" class="default" width="600" height="160"/>
				<text transform="matrix(1 0 0 1 22 60)" class="tracker_award_seal_text">You blocked a tracker from</text>
				<text transform="matrix(1 0 0 1 22 120)" class="tracker_award_seal_text">
					<tspan class="tracker_award_seal_tracker_name">` + Battle.details.monsterTracker + `</tspan>!!!
				</text>

				</svg>` +


				// SVG of cage
				`<svg id="monster_capture_cage" class="tally monster_capture_cage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 388.6">
				    <path class="tally cage_svg" d="M.3.7H470v15.6H.3z"/>
				    <path transform="rotate(-90 14.857 194.5)" class="tally cage_svg" d="M-174 189.4h377.7v10.3H-174z"/>
				    <path transform="rotate(-90 54.857 194.5)" class="tally cage_svg" d="M-134 189.4h377.7v10.3H-134z"/>
				    <path transform="rotate(-90 94.857 194.5)" class="tally cage_svg" d="M-94 189.4h377.7v10.3H-94z"/>
				    <path transform="rotate(-90 134.857 194.5)" class="tally cage_svg" d="M-54 189.4h377.7v10.3H-54z"/>
				    <path transform="rotate(-90 174.857 194.5)" class="tally cage_svg" d="M-14 189.4h377.7v10.3H-14z"/>
				    <path transform="rotate(-90 214.857 194.5)" class="tally cage_svg" d="M26 189.4h377.7v10.3H26z"/>
				    <path transform="rotate(-90 254.857 194.5)" class="tally cage_svg" d="M66 189.4h377.7v10.3H66z"/>
				    <path transform="rotate(-90 294.857 194.5)" class="tally cage_svg" d="M106 189.4h377.7v10.3H106z"/>
				    <path transform="rotate(-90 334.857 194.5)" class="tally cage_svg" d="M146 189.4h377.7v10.3H146z"/>
				    <path transform="rotate(-90 374.857 194.5)" class="tally cage_svg" d="M186 189.4h377.7v10.3H186z"/>
				    <path transform="rotate(-90 414.857 194.5)" class="tally cage_svg" d="M226 189.4h377.7v10.3H226z"/>
				    <path transform="rotate(-90 454.857 194.5)" class="tally cage_svg" d="M266 189.4h377.7v10.3H266z"/>
				    <path class="tally cage_svg" d="M.3 372.1H470v15.6H.3z"/>
				</svg>`;

			$(".battle_monster_capture_wrapper").html(str);

			createTaxonomyCrumbs(
				'.monster_capture_taxonomy',
				MonstersById.data[Battle.details.mid],
				palette
			);

			// set left of each before displaying w/animation
			$(monsterAwardElements).css({
				"left": "55%"
			});

			anime({
				targets: '.monster_capture_cage',
				top: "12%",
				left: "60%",
				rotate: -2,
				opacity: 1,
				elasticity: 0,
				duration: 800,
				easing: 'easeOutCubic',
				delay: 0
			});
			anime({
				targets: '.monster_capture_banner_bottom',
				top: "41%",
				left: "59%",
				rotate: -3,
				opacity: 1,
				elasticity: 0,
				duration: 800,
				easing: 'easeOutCubic',
				delay: 100
			});
			anime({
				targets: '.monster_capture_banner_top',
				top: "7%",
				// left: "58%",
				rotate: -4,
				opacity: 1,
				elasticity: 0,
				duration: 800,
				easing: 'easeOutCubic',
				delay: 200
			});
			anime({
				targets: '.monster_capture_taxonomy',
				top: "37%",
				left: "54%",
				rotate: -7,
				opacity: 1,
				elasticity: 0,
				duration: 800,
				easing: 'easeOutCubic',
				delay: 300
			});
			anime({
				targets: '.monster_capture_tracker',
				top: "15%",
				left: "75%",
				rotate: 3,
				opacity: 1,
				elasticity: 0,
				duration: 800,
				easing: 'easeOutCubic',
				delay: 600
			});
		} catch (err) {
			console.error(err);
		}
	}

	function hideCapturedMonster() {
		try {
			anime({
				targets: monsterAwardElements,
				top: "-500px",
				opacity: 0,
				elasticity: 0,
				duration: 1000,
			});

		} catch (err) {
			console.error(err);
		}
	}




	// return breadcrumb-formatted taxonomy
	function createTaxonomyCrumbs(ele, m, p) {
		try {
			let str = "",
				svg1, svg2, svg3, svg4;
			if (m.tier1) {
				str += "<span class='tally tier1 tier-text' style='background:" + p.tier1 + "'>" + m.tier1 + "</span>";
				str += "<span id='tier1svg'></span>";
			}
			if (m.tier2) {
				str += "<span class='tally tier2 tier-text' style='background:" + p.tier2 + "'>" + m.tier2 + "</span>";
				str += "<span id='tier2svg'></span>";
			}
			if (m.tier3) {
				str += "<span class='tally tier3 tier-text' style='background:" + p.tier3 + "'>" + m.tier3 + "</span>";
				str += "<span id='tier3svg'></span>";
			}
			if (m.tier4) {
				str += "<span class='tally tier4 tier-text' style='background:" + p.tier4 + "'>" + m.tier4 + "</span>";
				str += "<span id='tier4svg'></span>";
			}
			// finish last span
			str += "</span>";
			// add html string
			$(ele).html(str);
			// once elements are on page add svgs
			if (m.tier1) {
				svg1 = SVG('tier1svg').size(20, 30).polygon('0,0 8,15 0,30').fill(p.tier1);
			}
			if (m.tier2) {
				svg2 = SVG('tier2svg').size(20, 30).polygon('0,0 8,15 0,30').fill(p.tier2);
				$('#tier1svg').css({
					'background': p.tier2
				}); // add background color to previous svg
			}
			if (m.tier3) {
				svg3 = SVG('tier3svg').size(20, 30).polygon('0,0 8,15 0,30').fill(p.tier3);
				$('#tier2svg').css({
					'background': p.tier3
				}); // add background color to previous svg
			}
			if (m.tier4) {
				svg4 = SVG('tier4svg').size(20, 30).polygon('0,0 8,15 0,30').fill(p.tier4);
				$('#tier2svg').css({
					'background': p.tier3
				}); // add background color to previous svg
			}


		} catch (err) {
			console.error(err);
		}
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
		},
		showCapturedMonster: showCapturedMonster,
		hideCapturedMonster: hideCapturedMonster
	};
})();
