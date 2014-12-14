__author__ = 'stanley'

import webapp2
from google.appengine.api import users, search
from google.appengine.api.search import QueryError
from init import *
from domain.user import *

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

        query_options = search.QueryOptions(limit=5)
        try:
            query_obj = search.Query(query_string=query, options=query_options)
        except QueryError:
            print "HMMMM"   # TODO
            return

        docs = search.Index(name=INDEX_NAME).search(query=query_obj)
        results = []

        # retrieving actual users from emails
        for desired in docs:
            user_id = desired.field('email').value
            user = User.query(User.id == user_id).get()
            if user is not None:
                results.append(user)

        generate_search_result(results, self.response, degree, usr)


def generate_search_result(results, response, current_deg, usr):
    search_results = {
        'results': results,
        'current_deg': current_deg,
        'current_user': usr
    }

    template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
    response.write(template.render(search_results))

def query_generator(gender, degree, availability, price):
    params = []
    if gender != '':
        params.append("gender: " + gender)
    if degree != '':
        params.append("degree: " + degree)
    if availability != '':
        params.append("availability: " + availability)
    if price != '':
        params.append("price: " + price)

    return " and ".join(params)