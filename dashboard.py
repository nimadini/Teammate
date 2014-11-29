__author__ = 'stanley'

import webapp2
from init import *
from google.appengine.api import users, search
from google.appengine.api.search import QueryError
from domain.user import *


class DashboardHandler(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            self.redirect('/registration')
            return

        degree = self.request.get('degree')
        if not degree:
            degree = 'NONE'
            query = ''

        else:
            query = 'degree: ' + degree

        query_options = search.QueryOptions(limit=5)
        try:
            query_obj = search.Query(query_string=query, options=query_options)
        except QueryError:
            print "HMMMM"   # TODO
            return

        docs = search.Index(name=INDEX_NAME).search(query=query_obj)
        results = []

        for desired in docs:
            user_id = desired.field('email').value
            user = User.query(User.id == user_id).get()
            if user is not None:
                results.append(user)

        generate_search_result(results, self.response, degree)


def generate_search_result(results, response, current_deg):
    search_results = {
        'results': results,
        'current_deg': current_deg
    }

    template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
    response.write(template.render(search_results))