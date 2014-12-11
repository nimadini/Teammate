__author__ = 'stanley'
from google.appengine.ext import ndb

class Term(ndb.Model):
    should_know = ndb.StringProperty()
    availability = ndb.StringProperty()
    price = ndb.StringProperty()