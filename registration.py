__author__ = 'stanley'

import webapp2
from init import *
from google.appengine.api import users, search
from domain.user import *
from domain.doc_index import *
from util.sanity_check import *
import json


class Registration(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is not None:
            self.redirect('/home')
            return

        template = JINJA_ENVIRONMENT.get_template('templates/registration.html')
        self.response.write(template.render())

    def post(self):
        usr = users.get_current_user()
        if usr is None:  # TODO TODO TODO: Check None
            self.redirect('/registration')
            return

        if attr_is_not_in_request(self.request, 'given_name') or \
                attr_is_not_in_request(self.request, 'surname') or \
                attr_is_not_in_request(self.request, 'gender') or \
                attr_is_not_in_request(self.request, 'contest'):

                self.redirect('/registration')
                return

        usr = User(key=user_key(users.get_current_user().email()))  # TODO: Is parent required? :O
        usr.id = users.get_current_user().email()
        usr.given_name = self.request.get('given_name')
        usr.surname = self.request.get('surname')
        usr.gender = self.request.get('gender')
        usr.total_num_of_elems = 0
        usr.reference = Reference()
        usr.views = 0
        usr.put()
        doc = create_doc(users.get_current_user().email(), 'None')
        store_idx(doc, INDEX_NAME)

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)