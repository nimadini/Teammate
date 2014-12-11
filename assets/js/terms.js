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
                type = 0;
            }
            else if (level == 'Availability') {
                $icon_holder.html('<i class="fa fa-clock-o"></i>');
                $should_know.css('display', 'none');
                $time.css('display', 'table');
                $price.css('display', 'none');
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
                    }
                    else {

                    }
                },
                error: function() {

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