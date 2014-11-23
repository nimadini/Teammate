__author__ = 'stanley'
from google.appengine.ext import ndb


class Education(ndb.Model):
    id = ndb.IntegerProperty()
    school = ndb.StringProperty()
    gpa = ndb.StringProperty()
    major = ndb.StringProperty()
    degree = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)