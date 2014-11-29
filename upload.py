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
            return  # TODO

        # cover
        if req == '0':
            upload_files = self.get_uploads('img')
            if len(upload_files) == 0:
                raise Exception("No file selected!")    # TODO! :D

            blob_info = upload_files[0]
            img_name = blob_info.filename

            usr = user_key(users.get_current_user().email()).get()
            if usr is None:
                return  # TODO

            usr.cover_pic = Image(name=img_name, img=blob_info.key())
            usr.put()

        # resume
        elif req == '1':
            upload_files = self.get_uploads('file')
            if len(upload_files) == 0:
                raise Exception("No file selected!")    # TODO! :O
            blob_info = upload_files[0]
            pdf_name = blob_info.filename

            usr = user_key(users.get_current_user().email()).get()
            if usr is None:
                return  # TODO
            usr.reference.resume = Doc(name=pdf_name, document=blob_info.key())
            usr.put()

        # profile
        elif req == '2':
            upload_files = self.get_uploads('img')
            if len(upload_files) == 0:
                raise Exception("No file selected!")    # TODO! :D

            blob_info = upload_files[0]
            img_name = blob_info.filename

            usr = user_key(users.get_current_user().email()).get()
            if usr is None:
                return  # TODO

            usr.profile_pic = Image(name=img_name, img=blob_info.key())
            usr.put()

        else:
            return

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)