/**
 * Created by stanley on 11/24/14.
 */

var work_template = '<div><div name="{{ w_id }}" class="home-content-wrapper"><div class="home-content">{{title}} at {{company}} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit work_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div><div class="home-content-small"> {{desc}} </div></div><div></div></div>';
var home_content_template = '{{title}} at {{company}} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit work_edit_link"><i class="fa fa-pencil"></i> Edit </a>';

$(document.body).on('click', '#work_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#work').load('workexperience', function () {
        $('#update_work_btn').on('click', function() {
            var $company = $('#company');
            var $title = $('#title');
            var $desc = $('#desc');
            var $info_msg = $('#info-msg-work');
            if ($company.val().trim().length == 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No company').fadeIn().delay(1500).fadeOut();
                return false;
            }

            if ($title.val().trim().length == 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No title').fadeIn().delay(1500).fadeOut();
                return false;
            }

            var data = {
                company: $company.val(),
                title: $title.val(),
                desc: $desc.val()
            };

            $.ajax({
                type: 'PUT',
                url: 'workexperience',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();
                        data.w_id = msg.id;
                        $('#work').after(Mustache.render(work_template, data));
                        $('.home-content-wrapper').hover(function () {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');
                        }, function () {
                            $(this).find('.edit').css('visibility', 'hidden');
                        });
                        refresh_anchor('#work_sortable');
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $('#work_panel').remove();
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    alert("We apologize, but it seems there is problem in communication with the server!");
                    $('#work_panel').remove();
                }
            });

        });
    });
});

$(document.body).on('click', '.work_edit_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    $('#work_link').css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $work_elem = $(this).parent().parent();

    $work_elem.next().load('workexperience', function() {
        var $rm_btn = $('#remove_work_btn');
        var $company = $('#company');
        var $title = $('#title');
        var $desc = $('#desc');
        var $info_msg = $('#info-msg-work');

        $work_elem.css('background-color', '#FFFFDC');
        $rm_btn.css('display', 'inline');

        var title_company = $work_elem.find('.home-content').html().split('&nbsp;')[0].trim().split('at');
        var title = title_company[0].trim();
        var company = title_company[1].trim();
        var desc = $work_elem.find('.home-content-small').text().trim();
        var w_id = $work_elem.attr('name').trim();

        $company.val(company);
        $title.val(title);
        $desc.val(desc);

        $('#update_work_btn').on('click', function(e) {
            var company = $('#company').val();
            var title = $('#title').val();
            var desc = $('#desc').val();

            var data = {
                company: company,
                title: title,
                desc: desc,
                w_id: w_id
            };

            $.ajax({
                type: 'POST',
                url: 'workexperience',
                data: data,
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item edited').fadeIn().delay(1500).fadeOut();
                        $work_elem.find('.home-content').html(Mustache.render(home_content_template, data));
                        $work_elem.find('.home-content-small').text(data.desc);
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
                    $work_elem.css('background-color', 'white');
                    $('#work_panel').remove();
                    refresh_anchor('#work_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    alert("We apologize, but it seems there is a problem in communication with the server!");
                    $work_elem.css('background-color', 'white');
                    $('#work_panel').remove();
                }
            });
        });

        $rm_btn.on('click', function(e) {
            w_id = $work_elem.attr('name');
            $.ajax({
                type: 'DELETE',
                url: 'workexperience?w_id='+$work_elem.attr('name'),
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item deleted').fadeIn().delay(1500).fadeOut();
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $work_elem.remove();
                    $work_elem.css('background-color', 'white');
                    $('#work_panel').remove();
                    refresh_anchor('#work_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    alert("We apologize, but it seems there is a problem in communication with the server!");
                    $work_elem.css('background-color', 'white');
                    $('#work_panel').remove();
                }
            });
        });
    });
});

function remove_work_panel() {
    in_progress = 0;
    $('#work_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}