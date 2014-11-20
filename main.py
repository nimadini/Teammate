__author__ = 'stanley'
import webapp2
from dashboard import Dashboard

app = webapp2.WSGIApplication([
                               ('/dashboard', Dashboard)], debug=True)