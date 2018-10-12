/**
 * FLL Timer
 *
 * @author Clark Winkelmann
 *
 */

$(document).ready(function() {

    var startSound = new Howl({
	src: ['sounds/charge.mp3'],
        preload: true,
        onplay: function(id) {
	    timerInterval = setInterval(tick, 1000);
        }
    });

    var endSound = new Howl({
	src: ['sounds/buzzer.mp3'],
        preload: true,
	onend: function(id) {
	    //console.log(id);
	    timer = settings.timer_seconds;

	    updateGui();
	}
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

    // When to add the danger state to the timer
    var danger_seconds = 10;

    // Settings values
    var settings = {
	timer_seconds: 150
    };

    // Holds the current timer values
    var timer = settings.timer_seconds;

    // Javascript interval timer pointer
    var timerInterval = null;

    /**
     * Resets the values and GUI
     */
    function reset() {
	stop();

	timer = settings.timer_seconds;

	updateGui();
    }

    /**
     * Updates the GUI according to the current values
     */
    function updateGui() {
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;
	$('.js-minutes-10').attr('data-value', Math.floor(minutes / 10));
	$('.js-minutes-1').attr('data-value', minutes % 10);
	$('.js-seconds-10').attr('data-value', Math.floor(seconds / 10));
	$('.js-seconds-1').attr('data-value', seconds % 10);

	if (timer <= danger_seconds) {
	    $('.js-timer-wrapper').addClass('danger');
	} else {
	    $('.js-timer-wrapper').removeClass('danger');
	}
    }

    /**
     * Sets up the gui size according to the window
     */
    function setupGui() {
	$('body').css('font-size', $(window).height()+'px');
    }

    /**
     * Starts or continue the timer
     */
    function start() {
	if (timerInterval == null) {
            // reset the timer, just in case
	    $.extend(timer, settings);

            gameBeginsSound.play();
	    //startSound.play();
	}

	$('.js-start-button').html('Pause');
    }

    /**
     * Stops the timer
     */
    function stop() {
	if (timerInterval != null) {
	    clearInterval(timerInterval);
	    timerInterval = null;
	}

	$('.js-start-button').html('Start');
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

	if (timer == 30) {
            warningSound.play();
	}
	updateGui();
    }

    /**
     * Handles the play/pause button click
     */
    $('.js-start-button').click(function() {
	if (timerInterval == null) {
	    start();
	} else {
	    stop();
	}
    });

    /**
     * Handles the reset button click
     */
    $('.js-reset-button').click(function() {
	reset();
    });

    /**
     * Handles the customize button click
     */
    $('.js-customize-button').click(function() {
	$input = $('.js-customize-input');
	if ($input.css('display') == 'none') {
            var minutes = Math.floor(settings.timer_seconds / 60);
            var seconds = settings.timer_seconds % 60;
	    $input.val(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
	    $input.show();
	    $(this).html('Apply');
	} else {
	    $input.hide();
	    values = $input.val().split(':');
	    if (values.length >= 2) {
		var minutes = values[0] == '' ? 0 : parseInt(values[0]);
		var seconds = values[1] == '' ? 0 : parseInt(values[1]);
                settings.timer_seconds = minutes * 60 + seconds;
	    } else {
		settings.timer_seconds = 150;
	    }
	    $(this).html('Customize');
	    reset();
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
     * Handles a key release event
     */
    $(document).keyup(function(e) {
	switch(e.which) {
	case KEY.SPACE:
	    // Prevents clicking the focused button
	    e.preventDefault();
	case KEY.ESC:
	    $('.js-ready-message').hide();
	    $('.js-start-button').trigger('click');
	    break;
	case KEY.R:
	    $('.js-reset-button').trigger('click');
	    break;
	}
    });

    /**
     * Handles a key down event
     */
    $(document).keydown(function(e) {
	switch(e.which) {
	case KEY.SPACE:
	    // Prevents clicking the focused button
	    e.preventDefault();
	case KEY.ESC:
	    // Only if the timer isn't running
	    if (timerInterval == null) {
		$('.js-ready-message').show();
	    }
	    break;
	}
    });

    /**
     * Handles page resize
     */
    $(window).resize(function() {
	setupGui();
    });

    // Init
    setupGui();
    reset();

});
