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
from handlers.follow import FollowHandler
from handlers.unfollow import UnfollowHandler
from handlers.message import MessageHandler
from handlers.main import Main
from handlers.stat import StatHandler
from handlers.auto_complete import AutocompleteHandler

app = webapp2.WSGIApplication([('/', Main),
                               ('/home', HomeHandler),
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
                               ('/follow', FollowHandler),
                               ('/unfollow', UnfollowHandler),
                               ('/message', MessageHandler),
                               ('/stat', StatHandler),
                               ('/autocomplete', AutocompleteHandler),
                               ('/about', AboutHandler)], debug=True)