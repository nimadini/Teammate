/**
 * Created by stanley on 12/13/14.
 */
var msg_success_template = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong><i class="fa fa-check"></i> Success!</strong></div>';
var target = '';

function send_msg() {
    var msg = $('#msg-content').val().trim();
    if (msg.length == 0)
        return;

    var data = {
        msg: msg,
        target: target.trim()
    };

    $.ajax({
        type: 'POST',
        url: 'message',
        data: data,
        success: function(message) {
            msg_dialog.dialog('close');
            $('#msg-send-result').html($(Mustache.render(msg_success_template)));
        },
        error: function() {
            msg_dialog.dialog('close');
        }
    });
}

var msg_dialog = $("#msg-dialog").dialog({
    autoOpen: false,
    height: 400,
    width: 720,
    modal: true,
    buttons: {
        "Send": send_msg,
        "Cancel": function () {
            msg_dialog.dialog("close");
        }
    },
    close: function () {
    }
});

$(".message_btn").click(function (e) {
    e.preventDefault();
    target = $(this).attr('href');
    $('#msg-note').text('This message will be sent to ' + $(this).attr('name').trim() + '\'s email address.');
    $("#msg-dialog").dialog("open");
});