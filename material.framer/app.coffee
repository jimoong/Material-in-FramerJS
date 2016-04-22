Material = require "material"
bg = new BackgroundLayer
spinners = []

# Default spinner
spinners.push new Material.Spinner

# Custom spinner #2
spinners.push a = new Material.Spinner
a.colors = ["#eee", "#4285f4"]

# Custom spinner
spinners.push new Material.Spinner
	size: 96
	thickness: 2
	color: "#28AFFA"
	changeColor: no

# Start
for s, i in spinners
	s.midY = Screen.height / (spinners.length + 1) * (i + 1)
	s.centerX()
	s.start()

bg.on Events.Click, ->
	if spinners[0]._started then s.stop() for s in spinners
	else s.start() for s in spinners
	
