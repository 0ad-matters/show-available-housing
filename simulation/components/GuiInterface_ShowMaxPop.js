GuiInterface.prototype.SuperGetSimulationState = GuiInterface.prototype.GetSimulationState;

GuiInterface.prototype.GetSimulationState = function() {
    let ret = GuiInterface.prototype.SuperGetSimulationState();

    let numPlayers = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager).GetNumPlayers();
	for (let i = 0; i < numPlayers; ++i)
	{
		let cmpPlayer = QueryPlayerIDInterface(i);
        Object.assign(ret.players[i], { "popLimit": cmpPlayer.GetPopulationBonuses() });
    }
    return ret;
}