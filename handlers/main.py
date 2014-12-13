__author__ = 'stanley'

import webapp2

class Main(webapp2.RequestHandler):
    def get(self):
        self.redirect('/home')
        return