__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *
from util.sanity_check import*


class WorkExperience(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/workexperience.html')
        self.response.write(template.render())

    def put(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        work = Work()
        work.id = usr.total_num_of_elems
        work.company = str(self.request.get('company')).strip()
        if work.company is '':  # TODO exception E chizi bedam age khali bood. :-?
            return

        work.title = str(self.request.get('title')).strip()
        if work.title is '':  # TODO exception E chizi bedam age khali bood. :-?
            return

        work.desc = self.request.get('desc')

        usr.append_work(work)
        usr.total_num_of_elems += 1
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'id': work.id})

        self.response.write(result)

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'w_id'):
            return

        w_id = str(self.request.get('w_id')).strip()

        try:
            w_id = int(w_id)
        except ValueError:
            return

        desired = None
        for w in usr.works:
            if w.id == w_id:
                desired = w
                break
        if desired is None:
            return

        desired.company = str(self.request.get('company')).strip()
        if desired.company is '':
            return

        desired.title = str(self.request.get('title')).strip()
        if desired.title is '':
            return

        desired.desc = str(self.request.get('desc')).strip()
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)
