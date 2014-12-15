__author__ = 'stanley'
from google.appengine.ext import ndb


class Entity(ndb.Model):
    price = ndb.IntegerProperty()
    number = ndb.IntegerProperty()