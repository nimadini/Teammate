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