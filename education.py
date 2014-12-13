__author__ = 'stanley'

import webapp2
from init import *
from google.appengine.api import users
from domain.user import *
from util.sanity_check import *


class EducationHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/snippets/education.html')
        self.response.write(template.render())

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'sorted_ids'):
            return

        sorted_ids = str(self.request.get('sorted_ids')).strip().split(',')
        mapping = dict((str(x.id), x) for x in usr.eds)
        usr.eds[:] = [mapping[x] for x in sorted_ids]
        usr.put()
