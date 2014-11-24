__author__ = 'stanley'
import webapp2
from dashboard import DashboardHandler
from home import HomeHandler
from about import AboutHandler
from upload import UploadHandler
from upload_url import UploadURLHandler
from education import EducationHandler
from reference import ReferenceHandler
from references import ReferencesHandler

app = webapp2.WSGIApplication([('/home', HomeHandler),
                               ('/dashboard', DashboardHandler),
                               ('/education', EducationHandler),
                               ('/references', ReferencesHandler),
                               ('/upload', UploadHandler),
                               ('/upload_url', UploadURLHandler),
                               ('/reference', ReferenceHandler),
                               ('/about', AboutHandler)], debug=True)