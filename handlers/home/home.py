__author__ = 'stanley'

import json
import re

import webapp2
from google.appengine.api import users
from google.appengine.ext import blobstore

from init import *
from domain.user import *
from util.sanity_check import*
from domain.doc_index import *


class HomeHandler(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        # user is not registered
        if usr is None:
            self.redirect('/registration')
            return

        # we assume the user is not the owner
        owner = False

        # no specific user is mentioned. Desired must be the logged in person him/herself...
        if attr_is_not_in_request(self.request, 'user'):
            owner = True
            desired_user = usr

        # a user is mentioned. Can be either the owner or another one.
        else:
            user_email = str(self.request.get('user')).strip()

            pattern = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
            prog = re.compile(pattern)
            # the email is not even a valid email!
            if prog.match(user_email) is None:
                self.response.set_status(400)
                return

            qry = User.query(User.id == user_email)
            # the desired user does not exist
            if qry.get() is None:
                self.response.set_status(400)
                return

            desired_user = qry.get()

            if users.get_current_user().email() == user_email:
                owner = True

        cover_upload_url = blobstore.create_upload_url('/upload')
        profile_img_upload_url = blobstore.create_upload_url('/upload')
        resume_upload_url = blobstore.create_upload_url('/upload')

        #   in jash inja nist! (tooye user bayad bashe!)
        skills = []
        for skill in desired_user.skills:
            skills.append(skill)

        skills = ",".join(skills)

        user_prop = {
            'user': desired_user,
            'cover_upload_url': cover_upload_url,
            'profile_img_upload_url': profile_img_upload_url,
            'resume_upload_url': resume_upload_url,
            'skills': skills,
            'owner': owner
        }

        # usr.get_highest_degree()

        template = JINJA_ENVIRONMENT.get_template('templates/home.html')
        self.response.write(template.render(user_prop))

        # for the sake of efficiency (do this after rendering the response)
        if not owner:
            desired_user.views += 1
            desired_user.put()

    def post(self):
        req_type = self.request.get('type')
        if req_type == '':
            return  # TODO

        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        status = False
        elem_id = -1

        if req_type == unicode('0_0'):
            status, elem_id = self.add_edu(self.request, usr)

        elif req_type == unicode('0_1'):
            status, elem_id = self.modify_edu(self.request, usr)

        elif req_type == unicode('0_2'):
            status, elem_id = self.remove_edu(self.request, usr)

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': status, 'id': elem_id})

        self.response.write(result)

    def add_edu(self, req, usr):
        edu = Education()
        edu.id = usr.total_num_of_elems
        edu.school = str(req.get('school')).strip()
        if edu.school is '':  # TODO exception E chizi bedam age khali bood. :-?
            return False, -1
        edu.gpa = req.get('gpa')
        edu.major = req.get('major')
        edu.degree = req.get('degree')
        usr.append_edu(edu)
        usr.total_num_of_elems += 1
        usr.put()

        update_index(usr, users.get_current_user().email(), INDEX_NAME)
        return True, edu.id

    def modify_edu(self, req, usr):
        if attr_is_not_in_request(req, 'edu_id'):
            return False, -1

        edu_id = str(req.get('edu_id')).strip()

        try:
            edu_id = int(edu_id)
        except ValueError:
            return
        desired = None
        for ed in usr.eds:
            if ed.id == edu_id:
                desired = ed
                break
        if desired is None:
            return False, -1

        desired.school = str(req.get('school')).strip()
        if desired.school is '':  # TODO exception E chizi bedam age khali bood. :-?
            return False, -1
        desired.gpa = req.get('gpa')
        desired.major = req.get('major')
        desired.degree = req.get('degree')
        usr.put()
        update_index(usr, users.get_current_user().email(), INDEX_NAME)

        return True, desired.id

    def remove_edu(self, req, usr):
        if attr_is_not_in_request(req, 'edu_id'):
            return False, -1
        edu_id = str(req.get('edu_id')).strip()

        try:
            edu_id = int(edu_id)
        except ValueError:
            return
        desired = None
        for ed in usr.eds:
            if ed.id == edu_id:
                desired = ed
                break
        if desired is None:
            return False, -1

        usr.eds.remove(desired)
        usr.put()
        update_index(usr, users.get_current_user().email(), INDEX_NAME)

        return True, desired.id


