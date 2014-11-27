/**
 * Created by stanley on 11/26/14.
 */
function anchor() {
    var $edu = $('#edu_sortable');
    $edu.sortable({
        handle: ".handle",
        axis: "y",
        cursor: "move",
        update: function( event, ui ) {
            console.log('set');
            var sorted_ids = [];
            $edu.find('.home-content-wrapper').each(function() {
                sorted_ids.push($(this).attr('name'));
            });
            var data = {
                sorted_ids: sorted_ids.toString()
            };
            console.log(data);
            $.ajax({
                type: 'POST',
                url: 'education',
                data: data,
                success: function (msg) {

                },
                error: function (msg) {

                }
            });
        }
    });
    $('.handle').css('cursor', 'move');
}

function refresh_anchor() {
    $( "#edu_sortable" ).sortable( "refresh" );
    $('.handle').css('cursor', 'move');
}