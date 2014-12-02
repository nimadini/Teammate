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

        work.desc = str(self.request.get('desc')).strip()

        usr.append_work(work)
        usr.total_num_of_elems += 1
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'id': work.id})

        self.response.write(result)

    def delete(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'w_id'):
            return

        work_id = self.request.get('w_id').strip()

        try:
            work_id = int(work_id)
        except ValueError:
            return

        desired = None
        for w in usr.works:
            if w.id == work_id:
                desired = w
                break

        if desired is None:
            return

        usr.works.remove(desired)
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
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
        mapping = dict((str(x.id), x) for x in usr.works)
        usr.works[:] = [mapping[x] for x in sorted_ids]
        usr.put()
        return 0

    def edit(self, usr):
        if attr_is_not_in_request(self.request, 'w_id'):
            return 1

        w_id = str(self.request.get('w_id')).strip()

        try:
            w_id = int(w_id)
        except ValueError:
            return 1

        desired = None
        for w in usr.works:
            if w.id == w_id:
                desired = w
                break
        if desired is None:
            return 1

        desired.company = str(self.request.get('company')).strip()
        if desired.company is '':
            return 1

        desired.title = str(self.request.get('title')).strip()
        if desired.title is '':
            return 1

        desired.desc = str(self.request.get('desc')).strip()
        usr.put()
        return 0