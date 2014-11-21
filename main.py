__author__ = 'stanley'
import webapp2
from dashboard import Dashboard
from home import Home

app = webapp2.WSGIApplication([('/home', Home),
                               ('/dashboard', Dashboard)], debug=True)