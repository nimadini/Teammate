/**
 * Created by stanley on 11/24/14.
 */
$("#selected_file").change(function () {
    updateCoverGUI(this);
    $('#upload_link').css('display', 'none');
    $('#cover_rej').css('display', 'inline');
    $('#cover_acc').css('display', 'inline');
});

$("#selected_file_profile").change(function () {
    updateProfileGUI(this);
    var data = new FormData();
    var url = $('#upload_profile_form').attr('action');
    var file = $('#selected_file_profile')[0].files[0];
    data.append('file', file);
    data.append('type', '2');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            $.ajax({
                type: 'POST',
                url: 'upload_url',
                success: function (msg) {
                    if (msg.successful) {
                        $('#upload_profile_form').attr('action', msg.cover_upload_url);
                    }
                    else {
                        alert("There is problem in communication with the server!"); // TODO
                    }
                },
                error: function (msg) {
                    alert("We apologize, but it seems there is problem in communication with the server! Please reload the page and continue.");
                }
            });
        } else {
            alert('An error occurred!');
        }
    };
    xhr.send(data);
});

$("#selected_resume").change(function () {
    $('#upload_resume_link').css('display', 'none');
    $('#upload_resume_cancel_link').css('display', 'inline');
    $('#upload_resume_confirm_link').css('display', 'inline');
});

$('#cover_rej').on('click', function (e) {
    e.preventDefault();
    $('#upload_link').css('display', 'inline');
    $('#cover_rej').css('display', 'none');
    $('#cover_acc').css('display', 'none');
    $('#cover_image').css('background-image', original_cover);
});

$('#cover_acc').on('click', function (e) {
    e.preventDefault();

    $('#cover_rej').css('display', 'none');
    $('#cover_acc').css('display', 'none');
    $('#spinner_cover').css('display', 'inline');
    $('#cover_image').css('opacity', '0.8');

    var data = new FormData();
    var url = $('#upload_cover_form').attr('action');
    var file = $('#selected_file')[0].files[0];
    data.append('file', file);
    data.append('type', '0');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            $.ajax({
                type: 'POST',
                url: 'upload_url',
                success: function (msg) {
                    if (msg.successful) {
                        $('#upload_cover_form').attr('action', msg.cover_upload_url);
                        original_cover = $('#cover_image').css('background-image');
                    }
                    else {
                        alert("There is problem in communication with the server!"); // TODO
                    }
                },
                error: function (msg) {
                    alert("We apologize, but it seems there is problem in communication with the server! Please reload the page and continue.");
                }
            });
        } else {
            alert('An error occurred!');
        }
        $('#spinner_cover').css('display', 'none');
        $('#upload_link').css('display', 'inline');
        $('#cover_image').css('opacity', '1');
    };
    xhr.send(data);
});

var original_cover = $('#cover_image').css('background-image');
var feature = 0;
var phone_template = '<tr><td><div class="phone"></div></td><td id="phone_elem">{{ ref }}</td></tr>';
var email_template = '<tr><td><div class="email"></div></td><td id="email_elem"><a href="mailto:{{ ref }}">{{ ref }}</a></td></tr>';
var skype_template = '<tr><td><div class="skype"></div></td><td id="skype_elem"><a href="callto:{{ ref }}">{{ ref }}</a></td></tr>';
var github_template = '<tr><td><div class="github"></div></td><td id="github_elem"><a href="{{ ref }}" target="_blank">{{ ref }}</a></td></tr>';
var linkedin_template = '<tr><td><div class="linked_in"></div></td><td id="linkedin_elem"><a href="{{ ref }}" target="_blank">{{ ref }}</a></td></tr>';
var website_template = '<tr><td><div class="website"></div></td><td id="website_elem"><a href="{{ ref }}" target="_blank">{{ ref }}</a></td></tr>';
var resume_template = '<tr><td><div class="resume"></div></td><td id="resume_elem"><a id="show_resume" name="{{ url }}" href="#" target="_blank">{{ name }}</a></td></tr>';

$(document.body).on('click', '.references_panel', function (e) {
    e.preventDefault();
    $(this).css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#references').load('references', function (data) {

        var $icon_holder = $(this).find('#icon_holder');
        var $ref_in = $('#ref_in');
        $ref_in.val($('#phone_elem').text());
        $('.dropdown ul li').on('click', function (e) {
            e.preventDefault();
            var ref = $(this).text();

            if (ref == "Resume") {
                $ref_in.css('display', 'none');
                $('#upload_resume_link').css('display', 'inline');
                $ref_in.parent().css('margin-left', '-5px');
                $icon_holder.html('<div class="resume_tiny"></div>');
                $('.my_tooltip').tooltip({
                    track: true,
                    content: function () {
                        return $(this).prop('title');
                    }
                });
                $('#update_ref_btn').prop("disabled", true);
            }
            else {
                $('#update_ref_btn').prop("disabled", false);

                $ref_in.css('display', 'inline');
                $('#upload_resume_link').css('display', 'none');
                $('#upload_resume_cancel_link').css('display', 'none');
                $('#upload_resume_confirm_link').css('display', 'none');
                $ref_in.parent().css('margin-left', '-25px');

                if (ref == 'Phone') {
                    $icon_holder.html('<div class="phone_tiny"></div>');
                    $ref_in.attr('placeholder', '512-965-8090');
                    $ref_in.val($('#phone_elem').text());
                    feature = 0;
                }
                else if (ref == 'Email') {
                    $icon_holder.html('<div class="email_tiny"></div>');
                    $ref_in.attr('placeholder', 'nima.dini@utexas.edu');
                    $ref_in.val($('#email_elem').text());
                    feature = 1;
                }
                else if (ref == 'Skype ID') {
                    $icon_holder.html('<div class="skype_tiny"></div>');
                    $ref_in.attr('placeholder', 'nimadini92');
                    $ref_in.val($('#skype_elem').text());
                    feature = 2;
                }
                else if (ref == 'GitHub') {
                    $icon_holder.html('<div class="github_tiny"></div>');
                    $ref_in.attr('placeholder', 'https://github.com/nimadini');
                    $ref_in.val($('#github_elem').text());
                    feature = 3;
                }
                else if (ref == 'LinkedIn') {
                    $icon_holder.html('<div class="linked_in_tiny"></div>');
                    $ref_in.attr('placeholder', 'https://www.linkedin.com/in/nimadini');
                    $ref_in.val($('#linkedin_elem').text());
                    feature = 4;
                }
                else if (ref == 'Homepage') {
                    $icon_holder.html('<div class="website_tiny"></div>');
                    $ref_in.attr('placeholder', 'http://www.nimadini.net/');
                    $ref_in.val($('#website_elem').text());
                    feature = 5;
                }
            }
        });

        var $info_msg_ref = $('.info-msg-ref');

        $('#update_ref_btn').on('click', function (e) {
            e.preventDefault();
            var $ref_in = $('#ref_in');
            if ($ref_in.val().trim().length === 0) {
                $info_msg_ref.css('color', 'darkred');
                $info_msg_ref.html('<i class="fa fa-close"></i> No reference').fadeIn().delay(1500).fadeOut();
                return false;
            }
            if (feature == 1 && !is_email($ref_in.val().trim())) {
                $info_msg_ref.css('color', 'darkred');
                $info_msg_ref.html('<i class="fa fa-close"></i> Invalid email').fadeIn().delay(1500).fadeOut();
                return false;
            }
            if (feature == 5 && !valid_url($ref_in.val().trim())) {
                $info_msg_ref.css('color', 'darkred');
                $info_msg_ref.html('<i class="fa fa-close"></i> Invalid URL').fadeIn().delay(1500).fadeOut();
                return false;
            }
            var _ref = {
                feature: feature,
                ref: $ref_in.val()
            };
            $.ajax({
                type: 'POST',
                url: 'reference',
                data: _ref,
                success: function (msg) {
                    if (msg.successful) {
                        $info_msg_ref.css('color', 'green');
                        $info_msg_ref.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();

                        if (feature == 0) {
                            var $phone_elem = $("#phone_elem");
                            if ($phone_elem.length) {
                                $phone_elem.text(_ref.ref);
                            }
                            else {
                                $('#anchor1').after(Mustache.render(phone_template, _ref));
                            }
                        }
                        else if (feature == 1) {
                            var $email_elem = $("#email_elem");
                            if ($email_elem.length) {
                                $email_elem.html('<a href="mailto:' + _ref.ref + '">' + _ref.ref + '</a>');
                            }
                            else {
                                $('#anchor2').after(Mustache.render(email_template, _ref));
                            }
                        }
                        else if (feature == 2) {
                            var $skype_elem = $("#skype_elem");
                            if ($skype_elem.length) {
                                $skype_elem.html('<a href="callto:' + _ref.ref + '">' + _ref.ref + '</a>');
                            }
                            else {
                                $('#anchor3').after(Mustache.render(skype_template, _ref));
                            }
                        }
                        else if (feature == 3) {
                            var $github_elem = $("#github_elem");
                            if ($github_elem.length) {
                                $github_elem.html('<a href="' + _ref.ref + '" target="_blank">' + _ref.ref + '</a>');
                            }
                            else {
                                $('#anchor4').after(Mustache.render(github_template, _ref));
                            }
                        }
                        else if (feature == 4) {
                            var $linkedin_elem = $("#linkedin_elem");
                            if ($linkedin_elem.length) {
                                $linkedin_elem.html('<a href="' + _ref.ref + '" target="_blank">' + _ref.ref + '</a>');
                            }
                            else {
                                $('#anchor5').after(Mustache.render(linkedin_template, _ref));
                            }
                        }
                        else if (feature == 5) {
                            var $website_elem = $("#website_elem");
                            if ($website_elem.length) {
                                $website_elem.html('<a href="' + _ref.ref + '" target="_blank">' + _ref.ref + '</a>');
                            }
                            else {
                                $('#anchor6').after(Mustache.render(website_template, _ref));
                            }
                        }
                    }
                    else {
                        alert("Unsuccess");
                    }
                },
                error: function (msg) {
                    alert("We apologize, but it seems there is problem in communication with the server!");
                }
            });
        });
        $('#upload_resume_link').on('click', function (e) {
            e.preventDefault();
            $('#selected_resume').click();
        });

        $('#upload_resume_cancel_link').on('click', function (e) {
            e.preventDefault();
            $('#upload_resume_link').css('display', 'inline');
            $('#upload_resume_cancel_link').css('display', 'none');
            $('#upload_resume_confirm_link').css('display', 'none');
        });

        $('#upload_resume_confirm_link').on('click', function (e) {
            e.preventDefault();

            $('#upload_resume_cancel_link').css('display', 'none');
            $('#upload_resume_confirm_link').css('display', 'none');

            var data = new FormData();
            var url = $('#upload_resume_form').attr('action');
            var file = $('#selected_resume')[0].files[0];
            data.append('file', file);
            data.append('type', '1');
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    $.ajax({
                        type: 'POST',
                        url: 'resume_current_url',
                        success: function (msg) {
                            if (msg.resume_current_url == 'NONE') {
                                return;
                            }
                            var $resume_elem = $("#resume_elem");
                            if ($resume_elem.length) {
                                $resume_elem.html('<a id="show_resume" name="' + msg.resume_current_url + '" href="#" target="_blank">' + msg.pdf_name + '</a>');
                            }
                            else {
                                var resume_info = {};
                                resume_info.url = msg.resume_current_url;
                                resume_info.name = msg.pdf_name;
                                $('#_anchor_').after(Mustache.render(resume_template, resume_info));
                            }

                            // Duplicate code! Needs Refactoring...
                            $("#show_resume").click(function (e) {
                                e.preventDefault();
                                $("#dialog").dialog("open");
                            });

                            $('#dialog_iframe').attr("src", msg.resume_current_url);
                        },
                        error: function (msg) {
                            alert("We apologize, but it seems there is problem in communication with the server! Please reload the page and continue.");
                        }
                    });
                    $.ajax({
                        type: 'POST',
                        url: 'upload_url',
                        success: function (msg) {
                            if (msg.successful) {
                                $('#upload_resume_form').attr('action', msg.cover_upload_url); // TODO: change esme cover_upload_url

                            }
                            else {
                                alert("There is problem in communication with the server!"); // TODO
                            }
                        },
                        error: function (msg) {
                            alert("We apologize, but it seems there is problem in communication with the server! Please reload the page and continue.");
                        }
                    });
                } else {
                    alert('An error occurred!');
                }
                $('#upload_resume_link').css('display', 'inline');
            };
            xhr.send(data);
        });
    });
});

function updateCoverGUI(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#cover_image').css('background-image', 'url('+e.target.result+')');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateProfileGUI(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#profile_wrapper').attr('href', e.target.result);
            $('#profile_picture').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function remove_refs_add_panel() {
    in_progress = 0;
    $('#references_panel').remove();
}

function is_email(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}