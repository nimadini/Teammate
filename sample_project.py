__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *
from domain.project import Project
from util.sanity_check import*


class SampleProject(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/project.html')
        self.response.write(template.render())

    def put(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        project = Project()
        project.id = usr.total_num_of_elems

        project.title = str(self.request.get('title')).strip()
        if project.title is '':
            return

        project.role = str(self.request.get('role')).strip()
        if project.role is '':
            return

        year = str(self.request.get('year')).strip()

        try:
            project.year = int(year)
        except ValueError:
            return

        project.link = str(self.request.get('url')).strip()
        project.desc = str(self.request.get('desc')).strip()

        usr.append_project(project)
        usr.total_num_of_elems += 1
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'id': project.id})

        self.response.write(result)

    def delete(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'p_id'):
            return

        project_id = self.request.get('p_id').strip()

        try:
            project_id = int(project_id)
        except ValueError:
            return

        desired = None
        for p in usr.projects:
            if p.id == project_id:
                desired = p
                break

        if desired is None:
            return

        usr.projects.remove(desired)
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
        mapping = dict((str(x.id), x) for x in usr.projects)
        usr.projects[:] = [mapping[x] for x in sorted_ids]
        usr.put()
        return 0

    def edit(self, usr):
        if attr_is_not_in_request(self.request, 'p_id'):
            return 1

        p_id = str(self.request.get('p_id')).strip()

        try:
            p_id = int(p_id)
        except ValueError:
            return 1

        desired = None
        for p in usr.projects:
            if p.id == p_id:
                desired = p
                break
        if desired is None:
            return 1

        desired.title = str(self.request.get('title')).strip()
        if desired.title is '':
            return

        desired.role = str(self.request.get('role')).strip()
        if desired.role is '':
            return

        year = str(self.request.get('year')).strip()

        try:
            desired.year = int(year)
        except ValueError:
            return

        desired.link = str(self.request.get('url')).strip()
        desired.desc = str(self.request.get('desc')).strip()
        usr.put()
        return 0