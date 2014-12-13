__author__ = 'stanley'
from google.appengine.ext import ndb
from education import Education
from work import Work
from reference import Reference
from location import Location
from term import Term
from project import Project
from honor import Honor
from image import Image
from language import Language
from google.appengine.api import images


class User(ndb.Model):
    id = ndb.StringProperty()
    given_name = ndb.StringProperty()
    surname = ndb.StringProperty()
    gender = ndb.StringProperty()
    eds = ndb.StructuredProperty(Education, repeated=True)
    works = ndb.StructuredProperty(Work, repeated=True)
    followers = ndb.StringProperty(repeated=True)  # emails
    skills = ndb.StringProperty(repeated=True)
    cover_pic = ndb.StructuredProperty(Image)
    profile_pic = ndb.StructuredProperty(Image)
    total_num_of_elems = ndb.IntegerProperty()
    reference = ndb.StructuredProperty(Reference)
    term = ndb.StructuredProperty(Term)
    projects = ndb.StructuredProperty(Project, repeated=True)
    honors = ndb.StructuredProperty(Honor, repeated=True)
    languages = ndb.StructuredProperty(Language, repeated=True)
    views = ndb.IntegerProperty()
    location = ndb.StructuredProperty(Location)
    date = ndb.DateTimeProperty(auto_now_add=True)
    # notif + msg

    def append_edu(self, edu):
        self.eds.insert(0, edu)

    def append_work(self, work):
        self.works.insert(0, work)

    def append_project(self, project):
        self.projects.insert(0, project)

    def append_honor(self, honor):
        self.honors.insert(0, honor)

    def append_language(self, lang):
        self.languages.insert(0, lang)

    def get_cover_url(self):
        if self.cover_pic is None:
            return "assets/images/home/default_cover.jpg"
        return images.get_serving_url(self.cover_pic.img) + '=s0'

    def get_profile_url(self):
        if self.profile_pic is None:
            if self.gender == 'Male':
                return "assets/images/male.png"
            elif self.gender == 'Female':
                return "assets/images/female.png"
            else:
                return "assets/images/no_cover.png"

        return images.get_serving_url(self.profile_pic.img) + '=s0'

    def get_profile_url_mirrored(self):
        if self.profile_pic is None:
            if self.gender == 'Male':
                return "assets/images/male_mir.png"
            elif self.gender == 'Female':
                return "assets/images/female_mir.png"
            else:
                return "assets/images/no_cover.png"

        return images.get_serving_url(self.profile_pic.img) + '=s0'

    def get_views_num_for_print(self):
        if self.views == 0:
            return 'No'
        elif 0 < self.views < 1000:
            return str(self.views)
        elif 999 < self.views < 1000000:
            return str(int(self.views) / 1000) + ',' + str(int(self.views) % 1000)
        else:
            return '+1,000,000'

    def get_highest_degree(self):
        if len(self.eds) == 0:
            return 'None'
        highest_edu = self.eds[0]
        i = 1
        while i < len(self.eds):
            if self.eds[i] > highest_edu:
                highest_edu = self.eds[i]
            i += 1
        return highest_edu.degree

    def get_location(self):
        if self.location is None:
            return "Unknown Location"
        return self.location.city + ', ' + self.location.region + ', ' + self.location.country


def user_key(_id):
    return ndb.Key('User', _id)