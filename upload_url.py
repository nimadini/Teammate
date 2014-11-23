__author__ = 'stanley'
from domain.user import *
from google.appengine.api import users
from google.appengine.ext import blobstore
import webapp2
import json


class UploadURL(webapp2.RequestHandler):
    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return  # TODO

        cover_upload_url = blobstore.create_upload_url('/upload')

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'cover_upload_url': cover_upload_url})
        self.response.write(result)