__author__ = 'stanley'
from google.appengine.ext.webapp import blobstore_handlers
from domain.user import *
from google.appengine.api import users
from domain.image import Image
from domain.doc import Doc
import json


class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        req = self.request.get('type')
        if req is '':
            return

        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            return

        upload_files = self.get_uploads('file')
        if len(upload_files) == 0:
            raise Exception("No file selected!")    # TODO! :D

        blob_info = upload_files[0]
        file_name = blob_info.filename

        # cover
        if req == '0':
            usr.cover_pic = Image(name=file_name, img=blob_info.key())
            usr.put()

        # resume
        elif req == '1':
            usr.reference.resume = Doc(name=file_name, document=blob_info.key())
            usr.put()

        # profile
        elif req == '2':
            usr.profile_pic = Image(name=file_name, img=blob_info.key())
            usr.put()

        else:
            return

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)