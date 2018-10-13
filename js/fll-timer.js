/**
 * FLL Timer
 *
 * @author Clark Winkelmann
 *
 */

document.addEventListener("DOMContentLoaded", function() {

    // set the sponsor image from a url argument
    var url = new URL(document.location.href);
    var sponsor_image_url = url.searchParams.get("sponsor-image");
    if ( sponsor_image_url != null )
    {
	document.getElementById("sponsor-image").src = sponsor_image_url;
    }
    
    var startSound = new Howl({
	src: ['sounds/charge.mp3'],
        preload: true,
        onplay: function(id) {
            if ( timerInterval == 'starting' )
            {
	        timerInterval = setInterval(tick, 1000);
            }
        }
    });

    var endSound = new Howl({
	src: ['sounds/buzzer.mp3'],
        preload: true,
    });

    var warningSound = new Howl({
	src: ['sounds/timetorun.mp3'],
        preload: true,
    });

    var gameBeginsSound = new Howl({
	src: ['sounds/thegamebegins.mp3'],
        preload: true,
        onend: function(id) {
	    startSound.play();
        }
    });

    var abortSound = new Howl({
	src: ['sounds/foghorn.mp3'],
        preload: true,
    });

    // When to add the danger state to the timer
    var danger_seconds = 10;

    // when to play the "finish up" sound
    var warning_seconds = 30;
    
    // Settings values
    var settings = {
	timer_seconds: 150,
    };

    // Holds the current timer values
    var timer = settings.timer_seconds;

    // Javascript interval timer pointer
    var timerInterval = null;

    /**
     * Updates the GUI according to the current values
     */
    function updateGui() {
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;
	document.getElementById("timer").innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        
	if (timer <= danger_seconds) {
	    document.getElementById("timer").className = 'danger';
	} else {
	    document.getElementById("timer").className = '';
	}
    }

    /**
     * Sets up the gui size according to the window
     */
    function setupGui() {
        var h = window.innerHeight;
        h -= 200;
        h = Math.min(h, 550);
	document.getElementById("timer").style.fontSize = h + 'px';
    }

    /**
     * Starts or continue the timer
     */
    function start() {
	if (timerInterval == null) {
            // timer is not started, but set to not-null so we know it is in process
            timerInterval = 'starting';
            
            // reset the timer, just in case
	    timer = settings.timer_seconds;
            
	    document.getElementById('start-button').innerHTML = 'Abort';

            gameBeginsSound.play();
	    //startSound.play();
	}
        else
        {
            stop();
            gameBeginsSound.stop();
            startSound.stop();
            
            abortSound.play();
        }
    }

    /**
     * Stops the timer
     */
    function stop() {
	if (timerInterval != null) {
	    clearInterval(timerInterval);
	    timerInterval = null;
	}

	document.getElementById('start-button').innerHTML = 'Start';
	timer = settings.timer_seconds;
	updateGui();
    }

    /**
     * Must be triggered every second of the timer
     */
    function tick() {
	if (timer <= 0){
	    endSound.play();
            stop();
	} else {
            timer--;
	}

	if (timer == warning_seconds) {
            warningSound.play();
	}

	updateGui();
    }

    /**
     * Handles the play/pause button click
     */
    document.getElementById('start-button').addEventListener("click", function() {
	start();
    });

    /**
     * Handles the reset button click
     */
    // document.getElementById('reset-button').addEventListener("click", function() {
    //     stop();
    // });

    /**
     * Handles the customize button click
     */
    document.getElementById('customize-button').addEventListener("click", function() {
	var input = document.getElementById('customize-input');
	if (input.style.visibility == 'hidden') {
            var minutes = Math.floor(settings.timer_seconds / 60);
            var seconds = settings.timer_seconds % 60;
	    input.innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	    input.style.visibility = 'visible';
	    document.getElementById('customize-button').innerHTML = 'Apply';
	}
        else
        {
	    values = input.value.split(':');
	    if (values.length >= 2) {
		var minutes = values[0] == '' ? 0 : parseInt(values[0]);
		var seconds = values[1] == '' ? 0 : parseInt(values[1]);
                settings.timer_seconds = minutes * 60 + seconds;
	    } else {
		settings.timer_seconds = 150;
	    }
	    input.style.visibility = 'hidden';
	    document.getElementById('customize-button').innerHTML = 'Customize';
	    stop();
	}
    });

    /**
     * Keycode "constants"
     */
    var KEY = {
	SPACE: 32,
	ESC: 27,
	R: 82
    }

    /**
     * Block <space> from starting the timer
     */
    document.addEventListener('keyup', function(e) {
        switch(e.which) {
        case KEY.SPACE:
            // Prevents clicking the focused button
            e.preventDefault();
        }
    });
    document.addEventListener('keydown', function(e) {
        switch(e.which) {
        case KEY.SPACE:
            // Prevents clicking the focused button
            e.preventDefault();
        }
    });

    /**
     * Handles page resize
     */
    window.addEventListener("resize", function() {
	setupGui();
    });

    // Init
    setupGui();
    stop();
});
