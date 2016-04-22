S = (n) ->
	scale = 1
	device = Framer.Device.deviceType
	if device.slice(0, "apple-iphone".length) is "apple-iphone"
		scale = Screen.width / 375
	else if device.slice(0, "google-nexus".length) is "google-nexus"
		scale = Screen.width / 360
	return n * scale

class Line extends Layer
	constructor: (size, thickness, color)->
		super width: size, height: size, backgroundColor: null

		# Left half
		@leftHalfWrapper = new Layer
			backgroundColor: null
			width: @width / 2, height: @width
			parent: @
			clip: yes
			force2d: yes
		@leftHalfClip = new Layer
			backgroundColor: null
			x: @width / 2
			width: @width / 2, height: @width
			originX: 0, originY: 0.5
			parent: @leftHalfWrapper
			clip: yes
			force2d: yes
		@leftHalf = new Layer
			backgroundColor: null
			x: -@width / 2
			width: @width, height: @width
			borderRadius: @width / 2
			borderWidth: thickness
			borderColor: color
			parent: @leftHalfClip
			force2d: yes
			
		# Right half
		@rightHalfWrapper = new Layer
			backgroundColor: null
			x: @width / 2
			width: @width / 2, height: @width
			parent: @
			clip: yes
			force2d: yes
		@rightHalfClip = new Layer
			backgroundColor: null
			x: -@width / 2
			width: @width / 2, height: @width
			originX: 1, originY: 0.5
			parent: @rightHalfWrapper
			clip: yes
			force2d: yes
		@rightHalf = new Layer
			backgroundColor: null
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

class exports.Spinner extends Layer
	colors: ["#DB4437", "#4285F4", "#0F9D58", "#F4B400"] # default
	constructor: (@options={}) ->
		@options.size? = 48
		@options.thickness? = 4
		@options.color? = "#4285f4"
		@options.changeColor = yes if typeof @options.changeColor is "undefined"
		
		super width: S(@options.size), height: S(@options.size), backgroundColor: null
		@line = new Line S(@options.size), S(@options.thickness), @options.color
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
	
	_counter: 0
	_animate: ->
		rotate = new Animation
			layer: @
			properties: rotation: 360
			time: 1.9
			curve: "linear"
		lineIn = new Animation
			layer: @line
			properties: value: 0.75
			time: 0.64
			curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
		lineOut = new Animation
			layer: @line
			properties:
				value: 0.03
				rotation: 360
			time: 0.78
			curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
		
		rotate.on Events.AnimationEnd, =>
			@rotation = 0
			rotate.start() if @_started
		lineIn.on Events.AnimationEnd, =>
			lineOut.start() if @_started
		lineOut.on Events.AnimationEnd, =>
			@line.rotation = 0
			lineIn.start() if @_started
			
			if @options.changeColor
				@line.leftHalf.animate
					properties: borderColor: @colors[@_counter]
					time: 0.2
					colorModel: "rgb"
				@line.rightHalf.animate
					properties: borderColor: @colors[@_counter]
					time: 0.2
					colorModel: "rgb"
				@_counter++
				@_counter = 0 if @_counter >= @colors.length
		
		rotate.start()
		lineIn.start()