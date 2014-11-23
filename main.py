__author__ = 'stanley'
import webapp2
from dashboard import Dashboard
from home import Home
from about import About
from upload import Upload
from upload_url import UploadURL
from education import Education

app = webapp2.WSGIApplication([('/home', Home),
                               ('/dashboard', Dashboard),
                               ('/education', Education),
                               ('/upload', Upload),
                               ('/upload_url', UploadURL),
                               ('/about', About)], debug=True)