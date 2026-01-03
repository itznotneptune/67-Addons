registerWhen(register('renderOverlay', () => {
	if (Settings.crystalHUD) {
		drawStringWithShadow(
			`§cPlace Crystal!`,
			data.crystalCoords.x,
			data.crystalCoords.y
		)
	}


}), () => Settings.crystalHUD)