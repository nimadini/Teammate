__author__ = 'stanley'

import webapp2
import json
from google.appengine.api import users
from domain.user import *


class ReferenceHandler(webapp2.RequestHandler):
    def post(self):
        feature = self.request.get('feature')
        if feature == '':
            return  # TODO

        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return False  # TODO: report error ba -1 che konim?

        ref = self.request.get('ref')

        if ref == '':
            return  # TODO

        if feature == '0':     # phone
            usr.reference.phone = ref.strip()

        elif feature == '1':     # email
            usr.reference.email = ref.strip()

        elif feature == '2':     # skype
            usr.reference.skype = ref.strip()

        elif feature == '3':     # github
            usr.reference.github = ref.strip()

        elif feature == '4':     # linkedin
            usr.reference.linkedin = ref.strip()

        elif feature == '5':     # website
            usr.reference.website = ref.strip()

        else:
            return

        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)