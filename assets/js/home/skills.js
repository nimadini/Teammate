/**
 * Created by stanley on 11/27/14.
 */

var tags;
var tags_template = '<div id="current-tag-list" name="{{skills}}" style="padding-bottom: 24px;" class="tag-list"></div>';

$(document.body).on('click', '#skills_add_link', function(e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');

    var $tags = $('#current-tag-list');
    var skills = $tags.attr('name').split(',');

    $tags.css('display', 'none');

    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $skills_elem = $('#skills');
    $skills_elem.load('skills', function() {
        if (skills[0] == "")
            tags = skills_tags('#my-tag-list', false);
        else
            tags = skills_tags('#my-tag-list', false, skills);
        $('#update_skills_btn').on('click', function() {
            e.preventDefault();
            var sorted_tags = tags.getTags().sort();
            var $info_msg = $('#info-msg-skills');

            var data = {
                skills: sorted_tags.join(",")
            };

            $.ajax({
                type: 'POST',
                url: 'skills',
                data: data,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();
                        $('#skills_add_link').fadeOut(0).delay(2300).fadeIn();

                        $tags.remove(); // remove current tags (editable version)
                        $('#tag_anchor').after(function() {
                            return Mustache.render(tags_template, data);
                        });
                        skills_tags('#current-tag-list', true, sorted_tags);
                        if (sorted_tags.join(",") == '')
                            $('#current-tag-list').css('display', 'none');
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                        $('#skills_panel').remove();
                        $('#current-tag-list').css('display', 'block');
                    }
                    $skills_elem.html("");
                    in_progress = 0;
                },
                error: function(msg) {
                    $info_msg.css('color', 'darkred');
                    $info_msg.html('<i class="fa fa-close"></i> Something went wrong :|').fadeIn().delay(1500).fadeOut();
                    $skills_elem.html("");
                    $('#skills_panel').remove();
                    $('#current-tag-list').css('display', 'block');
                    in_progress = 0;
                }
            });
        });
    });
});

function remove_skills_add_panel() {
    in_progress = 0;
    $('#skills_panel').remove();
    $('#current-tag-list').css('display', 'block');
}