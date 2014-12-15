__author__ = 'stanley'

from domain.user import *
from google.appengine.api import users, mail
import webapp2
import json
from util.sanity_check import *


class MessageHandler(webapp2.RequestHandler):
    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'target'):
            return

        if attr_is_not_in_request(self.request, 'msg'):
            return

        target_email = self.request.get('target')

        target = user_key(target_email)

        # if the target user does not exist at all!
        if target is None:
            return

        target = target.get()

        msg = self.request.get('msg')

        prop = usr.get_prop()
        url = 'http://teammate-beta.appspot.com/home?user=' + usr.id

        mail.send_mail(sender="Teammate <info@teammate-beta.appspotmail.com>",
                       to=target_email,
                       subject="New message from " + usr.given_name + ' ' + usr.surname,
                       body="""
{0},

{1} has a new message for you:

{2}

Follow this link to view {3} profile: {4}

The Teammate Team
""".format(target.given_name, usr.given_name + ' ' + usr.surname, msg, prop, url))

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)