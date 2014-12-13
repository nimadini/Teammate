/**
 * Created by stanley on 12/12/14.
 */

function follow(email, func) {
    return dispatch(email, 'follow', func);
}

function unfollow(email, func) {
    return dispatch(email, 'unfollow', func);
}

function dispatch(email, url, func) {
    var data = {
        target: email
    };

    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function(msg) {
            if (msg.successful)
                $(func);
        },
        error: function() {
            // TODO: maybe we should do something here...
        }
    });
}