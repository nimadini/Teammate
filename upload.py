__author__ = 'stanley'
from google.appengine.ext.webapp import blobstore_handlers
from domain.user import *
from google.appengine.api import users
from domain.image import Image
import json


class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        upload_files = self.get_uploads('img')
        if len(upload_files) == 0:
            raise Exception("No file selected!")

        blob_info = upload_files[0]
        img_name = blob_info.filename

        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return  # TODO

        usr.cover_pic = Image(name=img_name, img=blob_info.key())
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})

        self.response.write(result)