__author__ = 'stanley'
from google.appengine.ext import ndb
from doc import Doc
from google.appengine.api import images


class Reference(ndb.Model):
    phone = ndb.StringProperty()
    email = ndb.StringProperty()
    skype = ndb.StringProperty()
    github = ndb.StringProperty()
    linkedin = ndb.StringProperty()
    resume = ndb.StructuredProperty(Doc)
    website = ndb.StringProperty()

    def has_resume(self):
        return self.resume is not None

    def get_resume_url(self):
        return images.get_serving_url(self.resume.document)