__author__ = 'stanley'
import webapp2

from handlers.dashboard.dashboard import DashboardHandler
from handlers.home.home import HomeHandler
from handlers.about import AboutHandler
from handlers.home.upload import UploadHandler
from handlers.home.upload_url import UploadURLHandler
from handlers.home.education import EducationHandler
from handlers.home.reference import ReferenceHandler
from handlers.home.references import ReferencesHandler
from handlers.home.resume_current_url import ResumeCurrentURLHandler
from handlers.home.work_experience import WorkExperience
from handlers.home.skills import Skills
from handlers.registration.registration import Registration
from handlers.dashboard.statistics import Statistics
from handlers.home.honors_and_awards import HonorsAndAwards
from handlers.home.sample_project import SampleProject
from handlers.home.language import LanguageHandler
from handlers.home.terms import TermsHandler


app = webapp2.WSGIApplication([('/home', HomeHandler),
                               ('/dashboard', DashboardHandler),
                               ('/education', EducationHandler),
                               ('/references', ReferencesHandler),
                               ('/upload', UploadHandler),
                               ('/upload_url', UploadURLHandler),
                               ('/reference', ReferenceHandler),
                               ('/resume_current_url', ResumeCurrentURLHandler),
                               ('/workexperience', WorkExperience),
                               ('/skills', Skills),
                               ('/statistics', Statistics),
                               ('/project', SampleProject),
                               ('/honor', HonorsAndAwards),
                               ('/terms', TermsHandler),
                               ('/registration', Registration),
                               ('/languages', LanguageHandler),
                               ('/about', AboutHandler)], debug=True)