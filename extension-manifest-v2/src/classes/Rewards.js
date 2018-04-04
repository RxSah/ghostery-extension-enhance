/**
 * Rewards Class
 *
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2018 Ghostery, Inc. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

/* eslint consistent-return: 0 */

import conf from './Conf';
import tabInfo from './TabInfo';
import Policy from './Policy';
import globals from './Globals';
import { log } from '../utils/common';
import { sendMessage, injectScript } from '../utils/utils';
import * as accounts from '../utils/accounts';

const t = chrome.i18n.getMessage;
/**
 * Class for handling Ghostery Rewards Box overlay.
 * @memberOf  BackgroundClasses
 * @todo  make it a Singelton
 */
class Rewards {
	/**
	 * Build the rewards container.  Called from webNavigation.onCommitted handler
	 *
	 * @param  {number} tab_id		tab id
	 * @return {Promise}		resolves to true or false (success/failure)
	 */
	showCircle(tab_id) {
		// console.log('showCircle HOT DOG');
		const tab = tabInfo.getTabInfo(tab_id);
		// console.log(tab);
		// If the tab is prefetched, we can't add purplebox to it.
		if (!conf.enable_offers ||
			!tab || tab.rewards) {
			return Promise.resolve(false);
		}

		/* @TODO continue rewrite of purplebox after here: */

		// Inject script cannot handle errors properly, but we call createBox after verifying that the tab is OK
		// So update hotdog status for this tab
		tabInfo.setTabInfo(tab_id, 'rewards', true);

		// console.log('INJECT REWARDS');
		return injectScript(tab_id, 'dist/rewards.js', 'dist/css/purplebox_styles.css', 'document_start').then(() => {
			// console.log('REWARDS INJECTED');
		}).catch((err) => {
			log('rewards injectScript error', err);
			return false;
		});
	}
}

export default Rewards;