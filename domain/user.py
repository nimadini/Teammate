__author__ = 'stanley'
from google.appengine.ext import ndb
from education import Education


class User(ndb.Model):
    id = ndb.UserProperty()
    eds = ndb.StructuredProperty(Education, repeated=True)
    followers = ndb.StringProperty(repeated=True)  # emails
    test = ndb.StringProperty()
    cover_pic = ndb.BlobKeyProperty()
    profile_pic = ndb.BlobKeyProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)

    # notif + msg
    def append_edu(self, edu):
        self.eds.insert(0, edu)


def user_key(_id):
    return ndb.Key('User', _id)