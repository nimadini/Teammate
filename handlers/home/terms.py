__author__ = 'stanley'
import json

import webapp2
from google.appengine.api import users
from init import *
from domain.user import *
from util.sanity_check import*
from domain.doc_index import *
from domain.statistics.statistics import *

class TermsHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/snippets/terms.html')
        self.response.write(template.render())

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'type'):
            return

        if attr_is_not_in_request(self.request, 'content'):
            return

        _type = str(self.request.get('type')).strip()
        _content = str(self.request.get('content')).strip()

        # !some security bug do exist here!
        if _type == '0':
            usr.term.should_know = _content
        elif _type == '1':
            usr.term.availability = _content
            # TODO: unsafe int conversion... (in case of malicious user who bypasses the Web GUI)
            update_index_availability(float(_content), users.get_current_user().email(), INDEX_NAME)
        elif _type == '2':
            prev_price = usr.term.price
            usr.term.price = _content
            # TODO: unsafe int conversion... (in case of malicious user who bypasses the Web GUI)
            if _content == 'negotiable':
                update_stat_price(prev_price, _content, usr.get_highest_degree())
                update_index_price(-1, users.get_current_user().email(), INDEX_NAME)
            else:
                update_stat_price(prev_price, _content, usr.get_highest_degree())
                update_index_price(float(_content), users.get_current_user().email(), INDEX_NAME)
        else:
            return

        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})

        self.response.write(result)