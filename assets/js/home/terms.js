/**
 * Created by stanley on 12/10/14.
 */

$('.terms_panel').on('click', function (e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#terms').load('terms', function (data) {
        var $icon_holder = $('#icon_holder');
        var type = 0;
        var primary_txt = $('#shoud_know_content').text().trim();
        if (primary_txt.length != 0)
            $('#should_know').val(primary_txt.split('You should know:')[1].trim());

        $('.dropdown ul li').on('click', function (e) {
            e.preventDefault();
            var $should_know = $('#should_know');
            var $time = $('.time');
            var $price = $('.price');
            var level = $(this).text();

            if (level == 'You should know') {
                $icon_holder.html('<i class="fa fa-users"></i>');
                $should_know.css('display', 'inline');
                $time.css('display', 'none');
                $price.css('display', 'none');
                primary_txt = $('#shoud_know_content').text().trim();
                if (primary_txt.length != 0)
                    $should_know.val(primary_txt.split('You should know:')[1].trim());
                type = 0;
            }
            else if (level == 'Availability') {
                $icon_holder.html('<i class="fa fa-clock-o"></i>');
                $should_know.css('display', 'none');
                $time.css('display', 'table');
                $price.css('display', 'none');
                primary_txt = $('#availability_content p').text().trim();
                if (primary_txt.length != 0) {
                    var raw_price = primary_txt.split('Availability:')[1]
                    $('#free_time').val(raw_price.split('hrs / w')[0].trim());
                }
                type = 1;
            }
            else if (level == 'Price') {
                $icon_holder.html('<i class="fa fa-usd"></i>');
                $should_know.css('display', 'none');
                $time.css('display', 'none');
                $price.css('display', 'table');
                $('#nego').on('click', function() {
                    if ($(this).is(':checked'))
                        $('#price_hr').prop('disabled', true);
                    else
                        $('#price_hr').prop('disabled', false);
                });
                primary_txt = $('#price_content p').text().trim();
                if (primary_txt.length != 0) {
                    var pr = primary_txt.split('Price:')[1].trim();
                    if (pr == 'negotiable') {
                        $('#price_hr').prop('disabled', true);
                        $('#nego').prop('checked', true);
                    }
                    else
                        $('#price_hr').val(pr);
                }
                type = 2;
            }
            else {
                return false;
            }
        });

        $('#update_term_btn').on('click', function() {
            var $info_msg = $('#info-msg-terms');
            var content = "#";
            if (type == 0) {
                content = $('#should_know').val().trim();
            }
            else if (type == 1) {
                content = $('#free_time').val().trim();
            }
            else if (type == 2) {
                if ($('#nego').is(':checked'))
                    content = 'negotiable';
                else
                    content = $('#price_hr').val().trim();
            }
            else
                return false;

            if (content.length == 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No term provided').fadeIn().delay(1500).fadeOut();
                return;
            }

            var data = {
                type: type,
                content: content
            };

            $.ajax({
                type: 'POST',
                url: 'terms',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item updated').fadeIn().delay(1500).fadeOut();
                        if (type == 0) {
                            $('#shoud_know_content').html('<p> <i class="fa fa-users"></i> <strong>You should know:</strong> ' + content + '</p>');
                        }
                        else if (type == 1) {
                            $('#availability_content').html('<p> <i class="fa fa-clock-o"></i> <strong>Availability: </strong>' + content + ' hrs / w </p>');
                        }
                        else if (type == 2) {
                            $('#price_content').html('<p> <i class="fa fa-usd"></i> <strong>Price: </strong>' + content + ' </p>');
                        }
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                },
                error: function() {
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-check"></i> Network error').fadeIn().delay(1500).fadeOut();
                }
            });
        });

    });
});

function remove_terms_panel() {
    in_progress = 0;
    $('#terms_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}