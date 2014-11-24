__author__ = 'stanley'
from google.appengine.ext import ndb


class Doc(ndb.Model):
    name = ndb.StringProperty()
    document = ndb.BlobKeyProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)