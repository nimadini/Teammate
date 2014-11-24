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
from resume_current_url import ResumeCurrentURLHandler

app = webapp2.WSGIApplication([('/home', HomeHandler),
                               ('/dashboard', DashboardHandler),
                               ('/education', EducationHandler),
                               ('/references', ReferencesHandler),
                               ('/upload', UploadHandler),
                               ('/upload_url', UploadURLHandler),
                               ('/reference', ReferenceHandler),
                               ('/resume_current_url', ResumeCurrentURLHandler),
                               ('/about', AboutHandler)], debug=True)