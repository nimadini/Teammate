__author__ = 'stanley'

import json
import webapp2
from google.appengine.api import users
from domain.user import *
from util.sanity_check import*
from domain.doc_index import *

class UnfollowHandler(webapp2.RequestHandler):
    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'target'):
            return

        target_email = self.request.get('target')

        target = user_key(target_email)

        # if the target user does not exist at all!
        if target is None:
            return

        # no one can un/follow him/her self!
        if target_email == usr.id:
            return

        target = target.get()

        # already not following the target
        if usr.id not in target.followers:
            return

        target.remove_follower(usr.id)
        update_rank(target.id, 10, 'minus')
        target.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)