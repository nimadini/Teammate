__author__ = 'stanley'
from google.appengine.ext import ndb


class Entity(ndb.Model):
    price = ndb.FloatProperty()
    number = ndb.IntegerProperty()

    def get_avg_price(self):
        if self.number == 0:
            return 0
        return float(self.price)/int(self.number)