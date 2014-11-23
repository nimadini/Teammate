__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *


class Home(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            usr = User(key=user_key(users.get_current_user().email()))   # TODO: Is parent required? :O
            usr.id = users.get_current_user()
            usr.put()

        user_prop = {
            'user': usr
        }
        template = JINJA_ENVIRONMENT.get_template('templates/home.html')
        self.response.write(template.render(user_prop))

    def post(self):
        req_type = self.request.get('type')
        if req_type == '':
            return  # TODO

        status = False

        if req_type == unicode('0'):
            status = self.handle_edu(self.request)

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': status})

        self.response.write(result)

    def handle_edu(self, req):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return  # TODO: report error
        edu = Education()
        edu.school = req.get('school')
        if edu.school is '':    # TODO exception E chizi bedam age khali bood. :-?
            return
        edu.gpa = req.get('gpa')
        edu.major = req.get('major')
        edu.degree = req.get('degree')
        usr.append_edu(edu)
        usr.put()
        return True