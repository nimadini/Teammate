__author__ = 'stanley'
from google.appengine.ext import ndb


class Work(ndb.Model):
    id = ndb.IntegerProperty()
    company = ndb.StringProperty()
    title = ndb.StringProperty()
    desc = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)