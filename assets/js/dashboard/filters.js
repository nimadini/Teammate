/**
 * Created by stanley on 11/28/14.
 */

$('#degree').find('ul li').on('click', function (e) {
    e.preventDefault();
    var degree = $(this).text();
    var $degree_label = $('#degree_label');
    $degree_label.text(degree);
    window.location.replace(query_generator());
});

$('#gender').find('ul li').on('click', function (e) {
    e.preventDefault();
    var gender = $(this).text();
    var $gender_label = $('#gender_label');
    $gender_label.text(gender);
    window.location.replace(query_generator());
});

$('#availability').find('ul li').on('click', function (e) {
    e.preventDefault();
    var availability = $(this).text();
    var $availability_label = $('#availability_label');
    $availability_label.text(availability.replace(/\s+/g, ''));
    window.location.replace(query_generator());
});

$('#_price_').find('ul li').on('click', function (e) {
    e.preventDefault();
    var price = $(this).text();
    var $price_label = $('#price_label');
    $price_label.text(price.replace(/\s+/g, ''));
    window.location.replace(query_generator());
});

function query_generator() {
    var degree_label = $('#degree_label').text().replace(/\s+/g, '');
    var gender_label = $('#gender_label').text().replace(/\s+/g, '');
    var availability_label = $('#availability_label').text().replace(/\s+/g, '');
    var price_label = $('#price_label').text().replace(/\s+/g, '');

    var base_url = "/dashboard";

    if (degree_label == 'Add...' && gender_label == 'Add...' &&
        availability_label == 'Add...' && price_label == 'Add...')
        return base_url;

    base_url = '/dashboard?';

    if (degree_label != 'Add...')
        base_url = base_url + 'degree=' + degree_label + "&";

    if (gender_label != 'Add...')
        base_url = base_url + 'gender=' + gender_label + "&";

    if (availability_label != 'Add...')
        base_url = base_url + 'availability=' + availability_label + "&";

    if (price_label != 'Add...')
        base_url = base_url + 'price=' + price_label + "&";

    base_url = base_url.substring(0, base_url.length - 1);

    return base_url
}