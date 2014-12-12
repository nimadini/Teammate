__author__ = 'stanley'
from google.appengine.ext import ndb

class Location(ndb.Model):
    city = ndb.StringProperty()
    region = ndb.StringProperty()
    country = ndb.StringProperty()
    lat = ndb.StringProperty()
    long = ndb.StringProperty()