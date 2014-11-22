__author__ = 'stanley'
import webapp2
from dashboard import Dashboard
from home import Home
from about import About

app = webapp2.WSGIApplication([('/home', Home),
                               ('/dashboard', Dashboard),
                               ('/about', About)], debug=True)