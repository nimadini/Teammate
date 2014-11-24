__author__ = 'stanley'

import webapp2
from init import *


class DashboardHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/dashboard.html')
        self.response.write(template.render())

