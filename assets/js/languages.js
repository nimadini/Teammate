/**
 * Created by stanley on 12/9/14.
 */

var lang_template = '<div><div name="{{ l_id }}" class="home-content-wrapper"><div class="home-content">{{ name }}: {{ proficiency }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit lang_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div></div><div></div></div>';
var lang_home_content_template = '{{ name }}: {{ proficiency }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit lang_edit_link"><i class="fa fa-pencil"></i> Edit </a>';

$(document.body).on('click', '#languages_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#language').load('languages', function () {
        var $selected = $('#proficiency');
        $('.dropdown ul li').on('click', function (e) {
            e.preventDefault();
            var level = $(this).text();
            $selected.html(level + ' <span class="caret"></span>');
        });
        $('#update_language_btn').on('click', function() {
            var $info_msg = $('#info-msg-languages');
            var lang_name = $('#lang_name').val().trim();
            var selected = $selected.text().trim();

            if (lang_name.length == 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No language').fadeIn().delay(1500).fadeOut();
                return false;
            }

            if (selected == 'Select') {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No proficiency').fadeIn().delay(1500).fadeOut();
                return false;
            }

            var data = {
                name: lang_name,
                proficiency: selected
            };

            $.ajax({
                type: 'PUT',
                url: 'languages',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item added').fadeIn().delay(1500).fadeOut();
                        data.l_id = msg.id;
                        $('#language').after(Mustache.render(lang_template, data));
                        $('.home-content-wrapper').hover(function () {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');
                        }, function () {
                            $(this).find('.edit').css('visibility', 'hidden');
                        });
                        refresh_anchor('#languages_sortable');
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $('#languages_panel').remove();
                    in_progress = 0;
                },
                error: function(msg) {
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-close"></i> Network problem :|').fadeIn().delay(1500).fadeOut();
                    $('#languages_panel').remove();
                    in_progress = 0;
                }
            });
        });
    });
});

$(document.body).on('click', '.lang_edit_link', function(e) {
    e.preventDefault();
    $('#languages_link').css('visibility', 'hidden');
    $('.edit').css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $lang_elem = $(this).parent().parent();
    var $info_msg = $('#info-msg-languages');

    $lang_elem.next().load('languages', function () {
        var $selected = $('#proficiency');
        $('.dropdown ul li').on('click', function (e) {
            e.preventDefault();
            var level = $(this).text();
            $selected.html(level + ' <span class="caret"></span>');
        });

        var $lang_name = $('#lang_name');
        var $proficiency = $('#proficiency');

        var langname_prof = $lang_elem.find('.home-content').html().split('&nbsp;')[0].split(':');
        var lang = langname_prof[0].trim();
        var proficiency = langname_prof[1].trim();
        $lang_name.val(lang);
        $proficiency.html(proficiency + ' <span class="caret"></span>');

        var $remove_language_btn = $('#remove_language_btn');
        $remove_language_btn.css('display', 'inline');
        $lang_elem.css('background-color', '#FFFFDC');

        var l_id = $lang_elem.attr('name').trim();

        $('#update_language_btn').on('click', function() {
            var lang_name = $('#lang_name').val().trim();
            var selected = $selected.text().trim();

            console.log(l_id);

            var data = {
                name: lang_name,
                proficiency: selected,
                l_id: l_id
            };

            $.ajax({
                type: 'POST',
                url: 'languages',
                data: data,
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item edited').fadeIn().delay(1500).fadeOut();
                        $lang_elem.find('.home-content').html(Mustache.render(lang_home_content_template, data));
                        $('.home-content-wrapper').hover(function () {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');
                        }, function () {
                            $(this).find('.edit').css('visibility', 'hidden');
                        });
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $lang_elem.css('background-color', 'white');
                    $('#languages_panel').remove();
                    refresh_anchor('#languages_sortable');
                    in_progress = 0;
                }
            });
        });
        $remove_language_btn.on('click', function() {
            l_id = $lang_elem.attr('name');
            $.ajax({
                type: 'DELETE',
                url: 'languages?l_id=' + $lang_elem.attr('name'),
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item deleted').fadeIn().delay(1500).fadeOut();
                        $lang_elem.remove();
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $lang_elem.css('background-color', 'white');
                    $('#languages_panel').remove();
                    refresh_anchor('#languages_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-close"></i> Network problem').fadeIn().delay(1500).fadeOut();
                    $lang_elem.css('background-color', 'white');
                    $('#languages_panel').remove();
                }
            });
        });
    });
});

function remove_lang_panel() {
    in_progress = 0;
    $('#languages_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}