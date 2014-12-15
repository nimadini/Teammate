__author__ = 'stanley'

import webapp2
from google.appengine.api import users, search
from google.appengine.api.search import QueryError, SortExpression
from init import *
from domain.user import *
from domain.statistics.statistics import *

class DashboardHandler(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            self.redirect('/registration')
            return

        gender = self.request.get('gender')
        degree = self.request.get('degree')
        availability = self.request.get('availability')
        price = self.request.get('price')

        query = query_generator(gender, degree, availability, price)

        sort = search.SortExpression(expression='rank', direction=SortExpression.DESCENDING, default_value=0)
        sort_opts = search.SortOptions(expressions=[sort])

        query_options = search.QueryOptions(limit=12, sort_options=sort_opts)
        try:
            query_obj = search.Query(query_string=query, options=query_options)
        except QueryError:
            print "HMMMM"  # TODO
            return

        docs = search.Index(name=INDEX_NAME).search(query=query_obj)
        results = []

        # retrieving actual users from emails
        for desired in docs:
            user_id = desired.field('email').value
            user = User.query(User.id == user_id).get()
            if user is not None:
                results.append(user)

        stat = statistics_key('my_stat').get()

        generate_search_result(results, gender, degree, availability, price, self.response, usr, stat)


def generate_search_result(results, selected_gender, selected_deg, selected_avail, selected_price, response, usr, stat):
    search_results = {
        'results': results,
        'selected_gender': selected_gender,
        'selected_deg': selected_deg,
        'selected_availability': selected_avail,
        'selected_price': selected_price,
        'current_user': usr,
        'stat': stat
    }

    template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
    response.write(template.render(search_results))


def query_generator(gender, degree, availability, price):
    params = []
    if gender != '':
        params.append("gender: " + gender)
    if degree != '':
        params.append("degree: " + degree)
    # dirty code ... can be written with regex much better :|

    availability = gen_availability(availability)

    if availability != '':
        params.append(availability)

    price = gen_price(price)

    if price != '':
        params.append(price)

    return " AND ".join(params)


def gen_availability(availability):
    if availability == '<5':
        availability = 'availability > 0 AND availability < 5'
    elif availability == '5-10':
        availability = 'availability > 5 AND availability < 10'
    elif availability == '10-15':
        availability = 'availability > 10 AND availability < 15'
    elif availability == '15-20':
        availability = 'availability > 15 AND availability < 20'
    elif availability == '>20':
        availability = 'availability > 20'
    else:
        availability = ''

    return availability


def gen_price(price):
    if price == '<5':
        price = 'price > 0 AND price < 5'
    elif price == '5-15':
        price = 'price > 5 AND price < 15'
    elif price == '15-30':
        price = 'price > 15 AND price < 30'
    elif price == '30-60':
        price = 'price > 30 AND price < 60'
    elif price == '>60':
        price = 'price > 60'
    else:
        price = ''

    return price