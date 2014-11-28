/**
 * Created by stanley on 11/23/14.
 */
var school_tags = [
    'Arizona State University',
    'Boston University',
    'Brown University',
    'California Institute of Technology (Caltech)',
    'Carnegie Mellon University (CMU)',
    'Case Western Reserve University',
    'College of William and Mary',
    'Colorado State University',
    'Columbia University',
    'Cornell University',
    'Dartmouth College',
    'Duke University',
    'Ecole Polytechnique Federale de Lausanne (EPFL)',
    'George Mason University',
    'Georgia Institute of Technology',
    'Harvard University',
    'Imperial College London',
    'Indiana University at Bloomington',
    'Iowa State University',
    'Johns Hopkins University',
    'Massachusetts Institute of Technology (MIT)',
    'Michigan State University',
    'National University of Singapore (NUS)',
    'Naval Postgraduate School',
    'New York University',
    'New York University',
    'North Carolina State University',
    'Northeastern University',
    'Northwestern University',
    'Ohio State University',
    'Oregon State University',
    'Pennsylvania State University at University Park',
    'Politecnico di Milano',
    'Polytechnique Montreal',
    'Princeton University',
    'Princeton University',
    'Purdue University at West Lafayette',
    'Rensselaer Polytechnic Institute',
    'Rice University',
    'Sharif University of Technology',
    'Stanford University',
    'Swiss Federal Institute of Technology (ETH)',
    'Syracuse University',
    'Texas A&M University at College Station',
    'The University of Hong Kong',
    'The University of Melbourne',
    'The University of Queensland',
    'The University of Tokyo',
    'Tufts University',
    'University at Buffalo—​SUNY',
    'University of Arizona',
    'University of British Columbia (UBC)',
    'University of California at Davis (UCD)',
    'University of California at ​Los Angeles (UCLA)',
    'University of California at Riverside',
    'University of California at ​San Diego (UCSD)',
    'University of California at Santa Barbara (UCSB)',
    'University of California at Santa Cruz',
    'University of California at ​Berkeley (UCB)',
    'University of California Irvine (UCI)',
    'University of Cambridge',
    'University of Chicago',
    'University of Colorado at ​Boulder',
    'University of Florida',
    'University of Illinois at Chicago',
    'University of Illinois—​Urbana-​Champaign (UIUC)',
    'University of Iowa',
    'University of Maryland at ​College Park',
    'University of Massachusetts at Amherst',
    'University of Michigan at ​Ann Arbor (UMich)',
    'University of Minnesota at ​Twin Cities',
    'University of North Carolina at Chapel Hill',
    'University of Notre Dame',
    'University of Oregon',
    'University of Oxford',
    'University of Pennsylvania (UPenn)',
    'University of Pittsburgh',
    'University of Rochester',
    'University of Southern California (USC)',
    'University of Tehran',
    'University of Texas at Austin (UT Austin)',
    'University of Toronto',
    'University of Utah',
    'University of Virginia',
    'University of Washington',
    'University of Waterloo',
    'University of Wisconsin at Madison',
    'Vanderbilt University',
    'Virginia Tech',
    'Washington University in St. Louis',
    'Yale University'
];

var field_tags = [
    'Algorithms',
    'Artificial Intelligence',
    'Bioinformatics',
    'Biomedical Engineering',
    'Computational Biology',
    'Computer Architecture',
    'Computer Architecture',
    'Data Mining',
    'Distributed systems',
    'Electromagnetics and Acoustics',
    'Embedded Systems',
    'Energy Systems',
    'Formal Methods',
    'Graphics and Visualization',
    'Integrated Circuits',
    'Machine Learning',
    'Model Driven Engineering',
    'Natural Computation',
    'Networking',
    'Operating systems',
    'Programming Languages',
    'Scientific Computing',
    'Security',
    'Software Engineering',
    'Theoretical Computer Science',
];

$(document.body).on('click', '#edu_add_link', function(e) {
    e.preventDefault();
    if (in_progress == 1)
        return false;
    in_progress = 1;
    $('#edu').load('education', function(data) {
        var deg = 'BS';
        $('.dropdown ul li').on('click', function(e) {
            e.preventDefault();
            deg = $(this).text();
            $('#degree').html(deg + ' <span class="caret"></span>');
        });

        $( "#school" ).autocomplete({
            source: school_tags
        });

        $( "#major" ).autocomplete({
            source: field_tags
        });

        var edu_template = '<div><div name="{{ id }}" class="home-content-wrapper"><div class="home-content"> {{ school }} &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit edu_edit_link"><i class="fa fa-pencil"></i> Edit </a> </div><div class="home-content-small"> {{ degree }} - {{ major }} | {{ gpa }}</div><div class="home-content-tiny">2014 – 2016 (expected)</div></div><div></div></div>';

        $('#update_edu_btn').on('click', function(e) {
            e.preventDefault();

            var $info_msg = $('.info-msg');
            var $school = $('#school');
            var $gpa = $('#gpa');
            var $major = $('#major');

            if ($school.val().trim().length === 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No school name').fadeIn().delay(1500).fadeOut();
                return false;
            }

            if (!is_gpa($gpa.val())) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> Invalid GPA').fadeIn().delay(1500).fadeOut();
                return false;
            }

            var edu = {
                type: '0_0',
                school: $school.val(),
                gpa: $gpa.val(),
                major: $major.val(),
                degree: deg
            };

            $.ajax({
                type: 'POST',
                url: 'home',
                data: edu,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();
                        edu.id = msg.id;
                        $('#edu').after(Mustache.render(edu_template, edu));
                        $('.home-content-wrapper').hover(function() {
                            if (in_progress == 0)
                                $(this).find('.edit').css('visibility', 'visible');

                        }, function() {
                            $(this).find('.edit').css('visibility', 'hidden');

                        });
                        refresh_anchor("#edu_sortable");
                    }
                    else {
                        alert("Unsuccess");
                    }
                },
                error: function(msg) {
                    alert("We apologize, but it seems there is problem in communication with the server!");
                }
            });
            $('#edu_add_panel').remove();
            in_progress = 0;
        });
    });
    $('.home-element').find('.add').css('visibility', 'hidden');
});

$(document.body).on('click', '.edu_edit_link', function(e) {
    e.preventDefault();
    $('.add').css('visibility', 'hidden');
    $('.edit').css('visibility', 'hidden');
    if (in_progress == 1)
        return false;
    in_progress = 1;
    var $edu_elem = $(this).parent().parent();

    $(this).parent().parent().next().load('education', function(data) {
        $( "#school" ).autocomplete({
            source: school_tags
        });

        $( "#major" ).autocomplete({
            source: field_tags
        });

        var $delete_btn = $('#remove_edu_btn');
        $delete_btn.css('display', 'inline');
        var degree_major_gpa = $edu_elem.find('.home-content-small').text().split('-');
        var degree = degree_major_gpa[0].trim();
        var major_gpa = degree_major_gpa[1].split('|');
        var major = major_gpa[0].trim();
        var gpa = major_gpa[1].trim();

        var $info_msg = $('.info-msg');
        var name = '-1';

        var school = $edu_elem.find('.home-content').html().split('&nbsp;')[0].trim();
        name = $edu_elem.attr('name');
        $('#school').val(school);
        $('#gpa').val(gpa);
        $('#major').val(major);
        $('#degree').html(degree + ' <span class="caret"></span>');
        $edu_elem.css('background-color', '#FFFFDC');

        $('.dropdown ul li').on('click', function(e) {
            e.preventDefault();
            var deg = $(this).text();
            $('#degree').html(deg + ' <span class="caret"></span>');
        });

        $('#update_edu_btn').on('click', function(e) {
            e.preventDefault();
            var $school = $('#school');
            if ($school.val().trim().length === 0) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> No school name').fadeIn().delay(1500).fadeOut();
                return false;
            }
            var $gpa = $('#gpa');
            if (!is_gpa($gpa.val())) {
                $info_msg.css('color', 'darkred');
                $info_msg.html('<i class="fa fa-close"></i> Invalid GPA').fadeIn().delay(1500).fadeOut();
                return false;
            }
            var edu = {
                type: '0_1',
                school: $school.val(),
                gpa: $gpa.val(),
                major: $('#major').val(),
                degree: $('#degree').html().split('<')[0],
                edu_id: name
            };
            $.ajax({
                type: 'POST',
                url: 'home',
                data: edu,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();
                        $edu_elem.find('.home-content').html(edu.school + ' &nbsp; <i class="fa fa-anchor handle edit" style="visibility: hidden;"></i> &nbsp; <a href="#" class="edit edu_edit_link"><i class="fa fa-pencil"></i> Edit </a>');
                        $edu_elem.find('.home-content-small').text(edu.degree + ' - ' + edu.major + ' | ' + edu.gpa);
                        refresh_anchor("#edu_sortable");
                    }
                    else {
                        alert("Unsuccess");
                    }
                },
                error: function(msg) {
                    alert("We apologize, but it seems there is problem in communication with the server!");
                }
            });
            $edu_elem.css('background-color', 'white');
            $('#edu_add_panel').remove();
            in_progress = 0;
        });

        $delete_btn.on('click', function(e) {
            e.preventDefault();
            var edu = {
                type: '0_2',
                edu_id: name
            };

            $.ajax({
                type: 'POST',
                url: 'home',
                data: edu,
                success: function(msg) {
                    if (msg.successful) {
                        $info_msg.css('color', 'green');
                        $info_msg.html('<i class="fa fa-check"></i> Update Successful').fadeIn().delay(1500).fadeOut();
                        $edu_elem.remove();
                    }
                    else {
                        $info_msg.css('color', 'darkred');
                        $info_msg.html('<i class="fa fa-close"></i> Not found').fadeIn().delay(1500).fadeOut();
                        $edu_elem.css('background-color', 'white');
                    }
                },
                error: function(msg) {
                    alert("We apologize, but it seems there is problem in communication with the server!");
                }
            });

            $('#edu_add_panel').remove();
            in_progress = 0;
        });
    });
});

function remove_edu_add_panel() {
    in_progress = 0;
    $('#edu_add_panel').remove();
    $('.home-content-wrapper').css('background-color', 'white');
}

function is_gpa(gpa) {
    if (gpa.trim() == '')
        return true;
    var subs = gpa.split('/');
    if (subs.length != 2)
        return false;
    var value = gpa.split('/')[0].trim();
    var bound = gpa.split('/')[1].trim();

    if (value == undefined || bound == undefined)
        return false;

    if (value.match(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/) == null ||
        bound.match(/^(?:[1-9]\d*|0)?(?:\.\d+)?$/) == null)
        return false;

    value = parseFloat(value);
    bound = parseFloat(bound);
    return value <= bound;
}