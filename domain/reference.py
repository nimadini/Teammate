__author__ = 'stanley'
from google.appengine.ext import ndb


class Reference(ndb.Model):
    phone = ndb.StringProperty()
    email = ndb.StringProperty()
    skype = ndb.StringProperty()
    github = ndb.StringProperty()
    linkedin = ndb.StringProperty()
    resume = ndb.BlobKeyProperty()
    website = ndb.StringProperty()


