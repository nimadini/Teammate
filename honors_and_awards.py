__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *
from util.sanity_check import*


class HonorsAndAwards(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/honor.html')
        self.response.write(template.render())

    def put(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        honor = Honor()
        honor.id = usr.total_num_of_elems

        honor.title = str(self.request.get('title')).strip()
        if honor.title is '':
            return

        honor.issued_by = str(self.request.get('issuer')).strip()
        if honor.issued_by is '':
            return

        year = str(self.request.get('year')).strip()
        if year is '':
            return

        try:
            honor.year = int(year)
        except ValueError:
            return

        usr.append_honor(honor)
        usr.total_num_of_elems += 1
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'id': honor.id})

        self.response.write(result)

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'extra_param'):
            status = self.edit(usr)
        else:
            status = self.sort(usr)

        if status > 0:
            return

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)

    def sort(self, usr):
        if attr_is_not_in_request(self.request, 'sorted_ids'):
            return 1

        sorted_ids = str(self.request.get('sorted_ids')).strip().split(',')
        mapping = dict((str(x.id), x) for x in usr.honors)
        usr.honors[:] = [mapping[x] for x in sorted_ids]
        usr.put()
        return 0

    def edit(self, usr):
        if attr_is_not_in_request(self.request, 'h_id'):
            return 1

        h_id = str(self.request.get('h_id')).strip()

        try:
            h_id = int(h_id)
        except ValueError:
            return 1

        desired = None
        for h in usr.honors:
            if h.id == h_id:
                desired = h
                break
        if desired is None:
            return 1

        desired.title = str(self.request.get('title')).strip()
        if desired.title is '':
            return 1

        desired.issued_by = str(self.request.get('issuer')).strip()
        if desired.issued_by is '':
            return 1

        year = str(self.request.get('year')).strip()
        if year is '':
            return 1

        try:
            desired.year = int(year)
        except ValueError:
            return 1

        usr.put()
        return 0

    def delete(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'h_id'):
            return

        honor_id = self.request.get('h_id').strip()

        try:
            honor_id = int(honor_id)
        except ValueError:
            return

        desired = None
        for h in usr.honors:
            if h.id == honor_id:
                desired = h
                break

        if desired is None:
            return

        usr.honors.remove(desired)
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)