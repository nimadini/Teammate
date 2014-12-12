/**
 * Created by stanley on 12/1/14.
 */

var project_template_with_link = '<div><div name="{{ p_id }}" class="home-content-wrapper"><div class="home-content"><a href="{{ url }}" target="_blank">{{ title }}</a> | {{ role }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit projects_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div><div class="home-content-small"> {{ desc }} </div> <div class="home-content-tiny"> {{ year }} </div> </div> <div></div> </div>';
var project_template_without_link = '<div><div name="{{ p_id }}" class="home-content-wrapper"> <div class="home-content"> {{ title }} | {{ role }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit projects_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div><div class="home-content-small"> {{ desc }} </div> <div class="home-content-tiny"> {{ year }} </div> </div> <div></div> </div>';

var project_home_content_template_with_link = '<a href="{{ url }}" target="_blank">{{ title }}</a> | {{ role }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit projects_edit_link"><i class="fa fa-pencil"></i> Edit </a>';
var project_home_content_template_without_link = '{{ title }} | {{ role }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit projects_edit_link"><i class="fa fa-pencil"></i> Edit </a>';

function error_msg($info_msg, msg) {
    $info_msg.css('color', 'darkred');
    $info_msg.html('<i class="fa fa-close"></i> ' + msg).fadeIn().delay(1500).fadeOut();
}

$(document.body).on('click', '#projects_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#sample-projects').load('project', function () {
        var $year_picker = $('.year-picker');
        for (var i = 2018; i > 1919; i--)
            $year_picker.append($('<option />').val(i).html(i))

        $('#update_project_btn').on('click', function() {
            var $info_msg = $('#info-msg-projects');

            var title = $('#title').val().trim();
            var role = $('#role').val().trim();
            var year = $('#year').find('option:selected').text();
            var url = $('#url').val().trim();
            var desc = $('#desc').val().trim();

            if (title.length == 0) {
                error_msg($info_msg, 'No title');
                return false;
            }

            if (role.length == 0) {
                error_msg($info_msg, 'No role');
                return false;
            }

            if (url.length != 0 && !valid_url(url)) {
                error_msg($info_msg, 'Invalid URL');
                return false;
            }

            var data = {
                title: title,
                role: role,
                year: year,
                url: url,
                desc: desc
            };

            $.ajax({
                type: 'PUT',
                url: 'project',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item added').fadeIn().delay(1500).fadeOut();
                        data.p_id = msg.id;
                        if (url.length != 0)
                            $('#sample-projects').after(Mustache.render(project_template_with_link, data));
                        else
                            $('#sample-projects').after(Mustache.render(project_template_without_link, data));
                        $('.home-content-wrapper').hover(function () {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');
                        }, function () {
                            $(this).find('.edit').css('visibility', 'hidden');
                        });
                        refresh_anchor('#projects_sortable');
                    }
                    else {
                        error_msg($info_msg, 'Something went wrong :|');
                    }
                    $('#project_panel').remove();
                    in_progress = 0;

                },
                error: function() {
                    $('#project_panel').remove();
                    in_progress = 0;
                    error_msg($info_msg, 'Network Problem :|');
                }
            });
        });
    });
});

$(document.body).on('click', '.projects_edit_link', function(e) {
    e.preventDefault();
    $('.edit').css('visibility', 'hidden');
    $('#projects_link').css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $project_elem = $(this).parent().parent();

    $project_elem.next().load('project', function () {
        var $year_picker = $('.year-picker');
        for (var i = 2018; i > 1919; i--)
            $year_picker.append($('<option />').val(i).html(i))

        var $rm_btn = $('#remove_project_btn');

        $project_elem.css('background-color', '#FFFFDC');
        $rm_btn.css('display', 'inline');

        var $info_msg = $('#info-msg-projects');

        var $title = $('#title');
        var $role = $('#role');
        var $year = $('#year');
        var $url = $('#url');
        var $desc = $('#desc');
        var title_role = $project_elem.find('.home-content').text().split('Edit')[0];
        $title.val(title_role.split('|')[0].trim());
        $role.val(title_role.split('|')[1].trim());
        $year.val($project_elem.find('.home-content-tiny').text().trim());
        var url = $project_elem.find('.home-content a').attr('href').trim();
        if (url != '#')
            $url.val($project_elem.find('.home-content a').attr('href'));
        $desc.val($project_elem.find('.home-content-small').text().trim());

        $('#update_project_btn').on('click', function() {
            var data = {
                title: $title.val(),
                role: $role.val(),
                year: $year.val(),
                url: $url.val(),
                desc: $desc.val(),
                p_id: $project_elem.attr('name')
            };

            $.ajax({
                type: 'POST',
                url: 'project',
                data: data,
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item edited').fadeIn().delay(1500).fadeOut();
                        $project_elem.find('.home-content-small').text(data.desc);
                        $project_elem.find('.home-content-tiny').text(data.year);
                        if (data.url.length != 0)
                            $project_elem.find('.home-content').html(Mustache.render(project_home_content_template_with_link, data));
                        else
                            $project_elem.find('.home-content').html(Mustache.render(project_home_content_template_without_link, data));
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
                    $project_elem.css('background-color', 'white');
                    $('#project_panel').remove();
                    refresh_anchor('#projects_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-close"></i> Network problem :|').fadeIn().delay(1500).fadeOut();
                    $project_elem.css('background-color', 'white');
                    $('#project_panel').remove();
                }
            });
        });

        $rm_btn.on('click', function() {
            p_id = $project_elem.attr('name');
            $.ajax({
                type: 'DELETE',
                url: 'project?p_id='+$project_elem.attr('name'),
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item deleted').fadeIn().delay(1500).fadeOut();
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    }
                    $project_elem.remove();
                    $project_elem.css('background-color', 'white');
                    $('#project_panel').remove();
                    refresh_anchor('#projects_sortable');
                    in_progress = 0;
                },
                error: function (msg) {
                    in_progress = 0;
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-close"></i> Network problem :|').fadeIn().delay(1500).fadeOut();
                    $project_elem.css('background-color', 'white');
                    $('#project_panel').remove();
                }
            });
        });
    });
});

function remove_projects_panel() {
    in_progress = 0;
    $('#project_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}