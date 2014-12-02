__author__ = 'stanley'
from google.appengine.ext import ndb


class Education(ndb.Model):
    id = ndb.IntegerProperty()
    school = ndb.StringProperty()
    gpa = ndb.StringProperty()
    major = ndb.StringProperty()
    degree = ndb.StringProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)

    def __gt__(self, other):
        tier1 = ['BS', 'BA']
        tier2 = ['MS', 'MA']
        tier3 = ['PhD']

        if self.degree in tier1:
            return False

        if self.degree in tier2 and (other.degree in tier2 or other.degree in tier3):
            return False

        if self.degree in tier3 and other.degree in tier3:
            return False

        return True

    def __ge__(self, other):
        tier1 = ['BS', 'BA']
        tier2 = ['MS', 'MA']
        tier3 = ['PhD']

        if self.degree in tier1 and other.degree not in tier1:
            return False

        if self.degree in tier2 and other.degree in tier3:
            return False

        return True

    def __le__(self, other):
        return not self.__gt__(other)

    def __lt__(self, other):
        return not self.__ge__(other)