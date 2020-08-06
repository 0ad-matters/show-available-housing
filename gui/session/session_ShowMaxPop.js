function updatePlayerDisplay()
{
	let allPlayerStates = GetSimState().players;
	let viewedPlayerState = allPlayerStates[g_ViewedPlayer];
	let viewablePlayerStates = {};
	for (let player in allPlayerStates)
		if (player != 0 &&
			player != g_ViewedPlayer &&
			g_Players[player].state != "defeated" &&
			(g_IsObserver ||
				viewedPlayerState.hasSharedLos &&
				g_Players[player].isMutualAlly[g_ViewedPlayer]))
			viewablePlayerStates[player] = allPlayerStates[player];

	if (!viewedPlayerState)
		return;

	let tooltipSort = +Engine.ConfigDB_GetValue("user", "gui.session.respoptooltipsort");

	let orderHotkeyTooltip = Object.keys(viewablePlayerStates).length <= 1 ? "" :
		"\n" + sprintf(translate("%(order)s: %(hotkey)s to change order."), {
		"hotkey": setStringTags("\\[Click]", g_HotkeyTags),
		"order": tooltipSort == 0 ? translate("Unordered") : tooltipSort == 1 ? translate("Descending") : translate("Ascending")
	});

	let resCodes = g_ResourceData.GetCodes();
	for (let r = 0; r < resCodes.length; ++r)
	{
		let resourceObj = Engine.GetGUIObjectByName("resource[" + r + "]");
		if (!resourceObj)
			break;

		let res = resCodes[r];

		let tooltip = '[font="' + g_ResourceTitleFont + '"]' +
			resourceNameFirstWord(res) + '[/font]';

		let descr = g_ResourceData.GetResource(res).description;
		if (descr)
			tooltip += "\n" + translate(descr);

		tooltip += orderHotkeyTooltip + getAllyStatTooltip(res, viewablePlayerStates, tooltipSort);

		resourceObj.tooltip = tooltip;

		Engine.GetGUIObjectByName("resource[" + r + "]_count").caption = Math.floor(viewedPlayerState.resourceCounts[res]);
	}

	let popLim = Math.min(viewedPlayerState.popMax, viewedPlayerState.popLimit);
	let popExcess = viewedPlayerState.popLimit - viewedPlayerState.popMax;
	if (popExcess < 0) {
		popExcess = 0;
	}
	Engine.GetGUIObjectByName("resourcePop").caption = sprintf(translate("%(popCount)s/%(popLimit)s+%(popExcess)s"),
		{ "popCount": viewedPlayerState.popCount, "popLimit": popLim, "popExcess": popExcess }
	);
	Engine.GetGUIObjectByName("population").tooltip = translate("Population (current / limit+excess)") + "\n" +
		sprintf(translate("Maximum population: %(popCap)s"), { "popCap": viewedPlayerState.popMax }) +
		orderHotkeyTooltip +
		getAllyStatTooltip("pop", viewablePlayerStates, tooltipSort);

	g_IsTrainingBlocked = viewedPlayerState.trainingBlocked;
}