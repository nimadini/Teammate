__author__ = 'stanley'

import json

import webapp2
from google.appengine.api import users

from init import *
from domain.user import *
from domain.doc_index import *
from util.sanity_check import *


class Registration(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is not None:
            self.redirect('/home?user=' + users.get_current_user().email())
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

        city = self.request.get('city')
        region = self.request.get('region')
        country = self.request.get('country')
        lat = self.request.get('lat')
        _long = self.request.get('long')
        loc = Location(city=city, region=region, country=country, lat=lat, long=_long)

        usr = User(key=user_key(users.get_current_user().email()))  # TODO: Is parent required? :O
        usr.id = users.get_current_user().email()
        usr.given_name = self.request.get('given_name')
        usr.surname = self.request.get('surname')
        usr.gender = self.request.get('gender')
        usr.total_num_of_elems = 0
        usr.reference = Reference()
        usr.term = Term()
        usr.location = loc
        usr.views = 0
        usr.put()
        doc = create_doc(users.get_current_user().email(), 'None')
        store_idx(doc, INDEX_NAME)

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'user': usr.id})
        self.response.write(result)