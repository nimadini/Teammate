__author__ = 'stanley'
import webapp2

from init import *


class ReferencesHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/snippets/references.html')
        self.response.write(template.render())

