registerWhen(register('renderOverlay', () => {
	if (config.crystalHUD) {
		drawStringWithShadow(
			`§cPlace Crystal!`,
			data.crystalCoords.x,
			data.crystalCoords.y
		)
	}


}), () => config.crystalHUD)