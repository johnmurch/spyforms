(function() {
    // Required for AJAX request to API
    var spyformEvents = [];
    var spyformTransmit = (function() {
        var spyformGap = null;
        return function upload() {
            window.clearTimeout(spyformGap);
            spyformGap = window.setTimeout(function() {
                console.log("EVENTS: ", JSON.stringify(spyformEvents));
                document.getElementById('log').innerHTML = JSON.stringify(spyformEvents);
                // $.post('/api/events', {
                //  events: spyformEvents
                // });
                //spyformEvents = [];
            }, 500);
        };
    }());

    // Required for Logging
    var spyfrm_eventList = ['keyup', 'input']; //, 'change', 'paste',
    for (spyfrm_event of spyfrm_eventList) {
        document.body.addEventListener(spyfrm_event, function(e) {
            if (e.target.name != undefined) {
                spyformEvents.push({
                    element: e.target.name,
                    ts: (new Date()).getTime(),
                    value: document.querySelector('[name="' + e.target.name + '"]').value
                });
            }
            window.setTimeout(function() {
                spyformTransmit();
            }, 5);
        }, false);
    }

    // PLAYBACK
    document.getElementById("play").addEventListener("click", function(e) {
        document.forms[0].reset(); // or document.getElementById("frm").reset();
        var spyfrm_recording = JSON.parse(
            JSON.stringify(spyformEvents)
        );
        var spyfrm_i = 0; // counter
        var spyfrm_diff = 100; // time in ms between updates
        function spyfrm_delayedLoop() {
            if (spyfrm_i >= spyfrm_recording.length) {
                return;
            } else {
                document.querySelector('[name="' + spyfrm_recording[spyfrm_i].element + '"]').value = spyfrm_recording[spyfrm_i].value
                if (spyfrm_i != 0) {
                    // @HACK - only use if ALL events are ordered by ts
                    // var diff = recording[i].ts - recording[i - 1].ts;
                }
                spyfrm_i++;
                window.setTimeout(spyfrm_delayedLoop, spyfrm_diff);
            }
        }
        spyfrm_delayedLoop();
    }, false);

    // PLAYBACK - Clear Logs
    document.getElementById('clear').addEventListener('click', function(e) {
        document.getElementById('log').innerHTML = '';
        spyformEvents = [];
    }, false);
})();
