__author__ = 'stanley'
import webapp2
from dashboard import Dashboard
from home import Home
from about import About
from education import Education

app = webapp2.WSGIApplication([('/home', Home),
                               ('/dashboard', Dashboard),
                               ('/education', Education),
                               ('/about', About)], debug=True)