__author__ = 'stanley'
from google.appengine.ext import ndb
from education import Education
from reference import Reference
from image import Image
from google.appengine.api import images


class User(ndb.Model):
    id = ndb.UserProperty()
    eds = ndb.StructuredProperty(Education, repeated=True)
    followers = ndb.StringProperty(repeated=True)  # emails
    test = ndb.StringProperty()
    cover_pic = ndb.StructuredProperty(Image)
    profile_pic = ndb.StructuredProperty(Image)
    total_num_of_elems = ndb.IntegerProperty()
    reference = ndb.StructuredProperty(Reference)
    views = ndb.IntegerProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)

    # notif + msg
    def append_edu(self, edu):
        self.eds.insert(0, edu)

    def get_cover_url(self):
        if self.cover_pic is None:
            return "assets/images/default_cover.jpg"
        return images.get_serving_url(self.cover_pic.img) + '=s0'

    def get_views_num_for_print(self):
        if self.views == 0:
            return 'No'
        elif 0 < self.views < 1000:
            return str(self.views)
        elif 999 < self.views < 1000000:
            return str(int(self.views) / 1000) + ',' + str(int(self.views) % 1000)
        else:
            return '+1,000,000'


def user_key(_id):
    return ndb.Key('User', _id)

