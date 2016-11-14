(function() {
    // Required for AJAX request to API
    var spyfrm_events = [];
    var spyfrm_transmit = (function() {
        var spyfrm_gap = null;
        return function upload() {
            window.clearTimeout(spyfrm_gap);
            spyfrm_gap = window.setTimeout(function() {
                console.log("EVENTS: ", JSON.stringify(spyfrm_events));
                document.getElementById('log').innerHTML = JSON.stringify(spyfrm_events);
                // $.post('/api/events', {
                //  events: spyfrm_events
                // });
                //events = [];
            }, 500);
        };
    }());

    // Required for Logging
    var spyfrm_eventList = ['keyup', 'input']; //, 'change', 'paste',
    for (spyfrm_event of spyfrm_eventList) {
        document.body.addEventListener(spyfrm_event, function(e) {
            if (e.target.name != undefined) {
                spyfrm_events.push({
                    element: e.target.name,
                    ts: (new Date()).getTime(),
                    value: document.querySelector('[name="' + e.target.name + '"]').value
                });
            }
            window.setTimeout(function() {
                spyfrm_transmit();
            }, 5);
        }, false);
    }

    // PLAYBACK
    document.getElementById("play").addEventListener("click", function(e) {
        document.forms[0].reset();
        //     document.getElementById("frm").reset();
        var spyfrm_recording = JSON.parse(
            JSON.stringify(spyfrm_events)
        );
        var spyfrm_i = 0;
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
    document.getElementById("clear").addEventListener("click", function(e) {
        document.getElementById('log').innerHTML = "";
        spyfrm_events = [];
    }, false);
})();
