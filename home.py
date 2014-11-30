__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users, search
from domain.user import *
from google.appengine.ext import blobstore
from util.sanity_check import*
from domain.doc_index import *


class HomeHandler(webapp2.RequestHandler):
    def get(self):
        usr = user_key(users.get_current_user().email()).get()
        if usr is None:
            self.redirect('/registration')
            return

        cover_upload_url = blobstore.create_upload_url('/upload')
        profile_img_upload_url = blobstore.create_upload_url('/upload')
        resume_upload_url = blobstore.create_upload_url('/upload')

        #   in jash inja nist! (tooye user bayad bashe!)
        skills = []
        for skill in usr.skills:
            skills.append(skill)

        skills = ",".join(skills)

        user_prop = {
            'user': usr,
            'cover_upload_url': cover_upload_url,
            'profile_img_upload_url': profile_img_upload_url,
            'resume_upload_url': resume_upload_url,
            'skills': skills
        }

        # usr.get_highest_degree()

        template = JINJA_ENVIRONMENT.get_template('templates/home.html')
        self.response.write(template.render(user_prop))

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


