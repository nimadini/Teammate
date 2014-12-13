/**
 * Created by stanley on 12/2/14.
 */

function remove_honors_panel() {
    in_progress = 0;
    $('#honor_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}

function validate(title, issuer, $info_msg) {
    if (title.length == 0) {
        error_msg($info_msg, 'No title');
        return false;
    }

    if (issuer.length == 0) {
        error_msg($info_msg, 'No issuer');
        return false;
    }
    return true;
}

var honor_template = '<div><div name="{{ h_id }}" class="home-content-wrapper"><div class="home-content">{{ title }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit honor_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div> <div class="home-content-small"> {{ issuer }}</div> <div class="home-content-tiny"> {{ year }} </div></div><div></div></div>';
var home_content_template = '{{ title }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit honor_edit_link"><i class="fa fa-pencil"></i> Edit </a>';

$(document.body).on('click', '#honor_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#honor').load('honor', function () {
        var $year_picker = $('.year-picker');
        for (var i = 2018; i > 1919; i--)
            $year_picker.append($('<option />').val(i).html(i));
        $('#update_honor_btn').on('click', function() {
            var $info_msg = $('#info-msg-honor');

            var title = $('#title').val().trim();
            var issuer = $('#issuer').val().trim();
            var year = $('#year').find('option:selected').text();

            if (!validate(title, issuer, $info_msg))
                return false;

            var data = {
                'title': title,
                'issuer': issuer,
                'year': year
            };

            $.ajax({
                type: 'PUT',
                url: 'honor',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item added').fadeIn().delay(1500).fadeOut();
                        data.h_id = msg.id;
                        $('#honor').after(Mustache.render(honor_template, data));
                        $('.home-content-wrapper').hover(function () {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');
                        }, function () {
                            $(this).find('.edit').css('visibility', 'hidden');
                        });
                        refresh_anchor('#honor_sortable');
                    }
                    else {
                        error_msg($info_msg, 'Something went wrong :|');
                    }
                    $('#honor_panel').remove();
                    in_progress = 0;

                },
                error: function() {
                    $('#honor_panel').remove();
                    in_progress = 0;
                    error_msg($info_msg, 'Network Problem :|');
                }
            });
        });
    });
});


$(document.body).on('click', '.honor_edit_link', function(e) {
    e.preventDefault();
    $('#honor_link').css('visibility', 'hidden');
    $('.edit').css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $honor_elem = $(this).parent().parent();

    $honor_elem.next().load('honor', function () {
        var $year_picker = $('.year-picker');
        for (var i = 2018; i > 1919; i--)
            $year_picker.append($('<option />').val(i).html(i));

        var $rm_btn = $('#remove_honor_btn');
        var $title = $('#title');
        var $issuer = $('#issuer');

        $honor_elem.css('background-color', '#FFFFDC');
        $rm_btn.css('display', 'inline');

        var title = $honor_elem.find('.home-content').html().split('&nbsp;')[0].trim();
        var issuer = $honor_elem.find('.home-content-small').text().trim();
        var year = $honor_elem.find('.home-content-tiny').text().trim();
        $title.val(title);
        $issuer.val(issuer);
        $year_picker.val(year);

        var $info_msg = $('#info-msg-honor');

        $('#update_honor_btn').on('click', function() {
            var title = $title.val().trim();
            var issuer = $issuer.val().trim();
            var year = $year_picker.find('option:selected').text();

            if (!validate(title, issuer, $info_msg))
                return false;

            var data = {
                'title': title,
                'issuer': issuer,
                'year': year,
                'h_id': $honor_elem.attr('name')
            };

            $.ajax({
                type: 'POST',
                url: 'honor',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item edited').fadeIn().delay(1500).fadeOut();

                        $honor_elem.find('.home-content').html(Mustache.render(home_content_template, data));
                        $honor_elem.find('.home-content-small').text(data.issuer);
                        $honor_elem.find('.home-content-tiny').text(data.year);
                    }
                    else {
                        error_msg($info_msg, 'Something went wrong :|');
                    }
                    $('#honor_panel').remove();
                    $honor_elem.css('background-color', 'white');
                    in_progress = 0;

                },
                error: function() {
                    $('#honor_panel').remove();
                    in_progress = 0;
                    error_msg($info_msg, 'Network Problem :|');
                    $honor_elem.css('background-color', 'white');
                }
            });
        });

        $rm_btn.on('click', function(e) {
            $.ajax({
                type: 'DELETE',
                url: 'honor?h_id='+$honor_elem.attr('name'),
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item deleted').fadeIn().delay(1500).fadeOut();
                        $honor_elem.remove();
                    }
                    else {
                        error_msg($info_msg, 'Something went wrong :|');
                    }
                    $honor_elem.css('background-color', 'white');
                    $('#honor_panel').remove();
                    refresh_anchor('#honor_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    error_msg($info_msg, 'Network Problem :|');
                    $honor_elem.css('background-color', 'white');
                    $('#honor_panel').remove();
                }
            });
        });
    });
});