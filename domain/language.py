__author__ = 'stanley'
from google.appengine.ext import ndb


class Language(ndb.Model):
    id = ndb.IntegerProperty()
    name = ndb.StringProperty()
    proficiency = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)