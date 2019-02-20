"use strict";

/*  BATTLE
 ******************************************************************************/

var BattleAttack = (function() {
	// PRIVATE
	let monsterPos, tallyPos;



	function returnRandomAttacks(count = 1) {
		let obj = {};
		if (count > 1)
			for (let i = 0; i < count; i++) {
				let attack = randomObjProperty(AttackData.data);
				obj[attack.name] = attack;
			}
		return obj;
	}

	/**
	 *	Get center position of object
	 */
	function getCenterPosition(ele) {
		let pos = {
			"left": $(ele).offset().left + $(ele).width() / 2,
			"top": $(ele).offset().top + $(ele).height() / 2
		};
		console.log("getCenterPosition()", ele, pos);
		return pos;
	}
	/**
	 *	Set center position of object
	 */
	function setCenterPosition(ele, pos) {
		// make sure it is displayed
		$(ele).css({
			"display": "block"
		});
		// set left/top, adjust by width/height
		$(ele).left = pos.left - $(ele).width() / 2;
		$(ele).top = pos.top - $(ele).height() / 2;
		console.log("setCenterPosition()", ele, pos);
	}



	function fireProjectile(at) {
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
			elasticity: 0,
			duration: 1000,
			easing: 'easeInOutSine',
			// update: function(anim) {
			// 	console.log(anim.progress, anim.animations[0].currentValue, anim.animations[1].currentValue);
			// },
			complete: function(anim) {
				// hide projectile
				$('#battle_projectile').css("display", "none");
				// show explosion
				explodeProjectile();
				BattleEffect.rumble("medium");
			}
		});
	}

	let explosions = [
		'clouds-blue-red-stroke.png',
		'clouds-ltblue-blue-stroke.png',
		'clouds-orange-red-stroke.png',
		'clouds-red-stroke.png',
		'squares-green-pink.png',
		'squares-green.png',
		'stars-pink.png',
		'water-blue.png',
	];

	function explodeProjectile() {
		// set position
		setCenterPosition('#battle_explosion', getCenterPosition('#battle_projectile'));

		// reference to image file
		var url = chrome.extension.getURL('assets/img/explosions/' + randomArrayIndex(explosions));
		// set content
		$('.explosion_sprite_inner').css('background-image', 'url("' + url + '")');

		setTimeout(function() {
			$('#battle_explosion').css("display", "none");
		}, 1500);

	}






	// PUBLIC
	return {
		fireProjectile: function(at) {
			fireProjectile(at);
		},
		returnRandomAttacks: function(count) {
			returnRandomAttacks(count);
		}
	};
})();
