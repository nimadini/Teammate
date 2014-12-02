__author__ = 'stanley'
from google.appengine.ext import ndb


class Project(ndb.Model):
    id = ndb.IntegerProperty()
    title = ndb.StringProperty()
    role = ndb.StringProperty()
    year = ndb.IntegerProperty()
    link = ndb.StringProperty()
    desc = ndb.StringProperty()