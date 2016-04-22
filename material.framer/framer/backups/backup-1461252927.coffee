Framer.Defaults.Layer.backgroundColor = null
Framer.Defaults.Animation.curve = "cubic-bezier(0.4, 0.0, 0.2, 1)"

class Line extends Layer
	constructor: (size, thickness, color)->
		super width: size, height: size

		@leftHalfWrapper = leftWrapper = new Layer
			width: @width / 2, height: @width
			parent: @
			clip: yes
			force2d: yes
		@leftHalfClip = leftClip = new Layer
			x: @width / 2
			width: @width / 2, height: @width
			originX: 0, originY: 0.5
			parent: @leftHalfWrapper
			clip: yes
			force2d: yes
		@leftHalf = left = new Layer
			x: -@width / 2
			width: @width, height: @width
			borderRadius: @width / 2
			borderWidth: thickness
			borderColor: color
			parent: @leftHalfClip
			force2d: yes
			
		@rightHalfWrapper = rightWrapper = new Layer
			x: @width / 2
			width: @width / 2, height: @width
			parent: @
			clip: yes
			force2d: yes
		@rightHalfClip = rightClip = new Layer
			x: -@width / 2
			width: @width / 2, height: @width
			originX: 1, originY: 0.5
			parent: @rightHalfWrapper
			clip: yes
			force2d: yes
		@rightHalf = right = new Layer
			width: @width, height: @width
			borderRadius: @width / 2
			borderWidth: thickness
			borderColor: color
			parent: @rightHalfClip
			force2d: yes

	_v: 0	# min: 0, max: 1	
	@define "value",
		get: -> @_v
		set: (v) ->
			@_v = v
			if v < 0.5
				@rightHalfClip.rotationZ = 360 * v
				@leftHalfClip.rotationZ = 0
			else
				@rightHalfClip.rotationZ = 180
				@leftHalfClip.rotationZ = 360 * v - 180
			
			@listener()

	listener: ()-> # print @value

class Spinner extends Layer
	constructor: (size, thickness, color) ->
		super width: size, height: size
		@line = line = new Line size, thickness, color
		@line.parent = @

	_started: false
	start: ->
		@rotation = @line.value = 0
		@opacity = 1
		@_started = true
		@_animate()
	stop: ->
		@_started = false
		@animate
			properties: opacity: 0
			time: 0.2
		
	_animate: ->
		rotate = new Animation
			layer: @
			properties: rotation: 360
			time: 1.5
			curve: "linear"
		lineIn = new Animation
			layer: @line
			properties: value: 1
		lineOut = new Animation
			layer: @line
			properties:
				value: 0.05
				rotation: 360
		
		rotate.on Events.AnimationEnd, =>
			@rotation = 0
			rotate.start() if @_started
		lineIn.on Events.AnimationEnd, =>
			lineOut.start() if @_started
		lineOut.on Events.AnimationEnd, =>
			@line.rotation = 0
			lineIn.start() if @_started
		
		rotate.start()
		lineIn.start()




##############################
bg = new BackgroundLayer backgroundColor: "#fff"
spinner = new Spinner 96, 8, "#4285f4"
spinner.center()
spinner.start()
spinner.on Events.Click, ->
	if spinner._started then spinner.stop()
	else spinner.start()