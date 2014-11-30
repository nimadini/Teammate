/**
 * Created by stanley on 11/29/14.
 */

$('#gender_dropdown').find('li a').on('click', function(e) {
    e.preventDefault();
    $('#gender').text($(this).text());
});

$('#accept_btn').on('click', function() {
    var given_name = $('#given_name').val();
    var surname = $('#surname').val();
    var gender = $('#gender').text();
    var checked = false;
    if ($('#contest').is(":checked"))
        checked = true;

    if (given_name == '') {
        notify('No given name');
        return;
    }

    if (surname == '') {
        notify('No surname');
        return;
    }

    if (gender != 'Male' && gender != 'Female' && gender != 'Other') {
        notify('No gender');
        return;
    }

    if (checked == false) {
        notify('No contest');
        return;
    }

    var data = {
        'given_name': given_name,
        'surname': surname,
        'gender': gender,
        'contest': checked
    };

    $.ajax({
        type: 'POST',
        url: 'registration',
        data: data,
        success: function(msg) {
            if (msg.successful) {
                window.location.replace("/home");
            }
            else {
                notify('Something went wrong');
            }
        },
        error: function() {
            notify('Server unreachable');
        }
    });
});

function notify(msg) {
    var $msg = $('.msg');
    var icon = '<i class="fa fa-close"></i>';
    $msg.css('color', 'darkred');
    $msg.html(icon + ' ' + msg).fadeIn().delay(1500).fadeOut();
}


$('#decline_btn').on('click', function() {
    window.location.replace("http://www.google.com");

});