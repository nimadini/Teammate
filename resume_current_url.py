__author__ = 'stanley'
from domain.user import *
from google.appengine.api import users
import webapp2
import json


class ResumeCurrentURLHandler(webapp2.RequestHandler):
    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return  # TODO

        resume_current_url = 'NONE'

        if usr.reference.has_resume():
            resume_current_url = usr.reference.get_resume_url()

        name = usr.reference.resume.name

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'resume_current_url': resume_current_url, 'pdf_name': name})
        self.response.write(result)