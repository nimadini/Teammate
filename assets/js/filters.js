/**
 * Created by stanley on 11/28/14.
 */

$('#degree').find('ul li').on('click', function (e) {
    e.preventDefault();
    var degree = $(this).text();
    var $degree_label = $('#degree_label');
    $degree_label.text(degree);
    window.location.replace("/dashboard?degree="+degree);
});