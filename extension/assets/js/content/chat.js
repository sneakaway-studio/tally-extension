"use strict";

/*  CORE
 ******************************************************************************/

var Chat = (function() {
	// PRIVATE

	let DEBUG = Debug.ALL.Chat || false,
		chatsObj = DialogueData.data.chats;

// test
	setTimeout(() => {
		// start();
	}, 1000);

	/**
	 *	Start the chat
	 */
	async function start() {
		try {
			// display
			// Dialogue.showData({
			// 	text: "Hey! Let's chat :-)",
			// 	mood: "happy"
			// }, {
			// 	addIfInProcess: true,
			// 	instant: true
			// });

			chatsObj = DialogueData.data.chats;
			console.log(chatsObj);

			populateOptions();

		} catch (err) {
			console.error(err);
		}
	}


	function populateOptions() {
		try {
			for (const chat in chatsObj) {
				console.log(chat);
				$('#tally_chat_select').append($('<option>', {
					value: chat,
					text: chat
				}));
			}

			// Dialogue.showData(Dialogue.getData({
			// 	category: "random",
			// 	subcategory: "conversation"
			// }), {
			// 	addIfInProcess: true,
			// 	instant: true
			// });


		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		start: start

	};
})();


// for node tests
if(typeof process === 'object') module.exports = Chat;
// browser / extension
else window.Chat = Chat;
