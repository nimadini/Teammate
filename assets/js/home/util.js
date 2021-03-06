/**
 * Created by stanley on 11/26/14.
 */
function anchor(sortable_elem, url, extra_param) {
    var $edu = $(sortable_elem);
    $edu.sortable({
        handle: ".handle",
        axis: "y",
        cursor: "move",
        update: function( event, ui ) {
            var sorted_ids = [];
            $edu.find('.home-content-wrapper').each(function() {
                sorted_ids.push($(this).attr('name'));
            });
            var data = {
                sorted_ids: sorted_ids.toString(),
                extra_param: extra_param
            };
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function (msg) {},
                error: function (msg) {}
            });
        }
    });
    $('.handle').css('cursor', 'move');
}

function valid_url(url) {
    if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url))
        return true;
    else
        return false;
}

function refresh_anchor(sortable_elem) {
    $(sortable_elem).sortable("refresh");
    $('.handle').css('cursor', 'move');
}

function skills_tags(id, readOnly, items) {
    return $(id).tags({
        promptText: 'Enter skills…',
        readOnly: readOnly,
        tagData: items,
        caseInsensitive: true,
        maxNumTags: 30,
        suggestions: [
            'Alloy',
            'Android',
            'Antlr',
            'C',
            'C#',
            'C++',
            'CSS',
            'DirectX',
            'FLTK',
            'git',
            'Grinder',
            'Hibernate',
            'HTML',
            'iOS',
            'J2EE',
            'Java',
            'Javascript',
            'jQuery',
            'Latex',
            'Linux',
            'Lisp',
            'Matlab',
            'ML',
            'ModelSim',
            'NodeJS',
            'OpenGL',
            'Pascal',
            'Photoshop',
            'Python',
            'Quartus',
            'Ruby',
            'Scala',
            'SDL',
            'Selenium',
            'SimpleScalar',
            'Software Testing',
            'Traceroute',
            'Visual Basic',
            'Web Programming',
            'Weka',
            'Wicket',
            'Wicket',
            'Wireshark'
        ]
    });
}
