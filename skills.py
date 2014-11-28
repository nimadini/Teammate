__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *
from util.sanity_check import*


class Skills(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/skills.html')
        self.response.write(template.render())

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'skills'):
            usr.skills = []
        else:
            usr.skills = map(str.strip, str(self.request.get('skills')).split(','))
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)