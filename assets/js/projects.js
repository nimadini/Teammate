/**
 * Created by stanley on 12/1/14.
 */

var project_template = '';


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
        for (var i = 2018; i > 1959; i--)
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

            if (!valid_url(url)) {
                error_msg($info_msg, 'Invalid URL');
                return false;
            }

            var data = {
                'title': title,
                'role': role,
                'year': year,
                'url': url,
                'desc': desc
            };

            $.ajax({
                type: 'PUT',
                url: 'project',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Item added').fadeIn().delay(1500).fadeOut();
                        data.w_id = msg.id;
                        //$('#sample-projects').after(Mustache.render(project_template, data));
                        /*$('.home-content-wrapper').hover(function () {
                         if (in_progress == 0)
                         $(this).find('.edit').css('visibility', 'visible');
                         }, function () {
                         $(this).find('.edit').css('visibility', 'hidden');
                         });
                         refresh_anchor('#work_sortable');*/
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

function remove_projects_panel() {
    in_progress = 0;
    $('#project_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}