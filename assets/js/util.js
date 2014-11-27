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

function refresh_anchor(sortable_elem) {
    $(sortable_elem).sortable("refresh");
    $('.handle').css('cursor', 'move');
}