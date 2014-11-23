__author__ = 'stanley'
from google.appengine.ext import ndb


class Image(ndb.Model):
    name = ndb.StringProperty()
    img = ndb.BlobKeyProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)