__author__ = 'stanley'
from google.appengine.ext import ndb


class Honor(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    issued_by = ndb.StringProperty()
    year = ndb.IntegerProperty()