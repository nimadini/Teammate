__author__ = 'stanley'

import webapp2
import json
from init import *
from google.appengine.api import users
from domain.user import *
from util.sanity_check import*


class LanguageHandler(webapp2.RequestHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('templates/snippets/languages.html')
        self.response.write(template.render())

    def put(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        language = Language()
        language.id = usr.total_num_of_elems
        language.name = str(self.request.get('name')).strip()
        if language.name is '':  # TODO exception E chizi bedam age khali bood. :-?
            return

        language.proficiency = str(self.request.get('proficiency')).strip()
        if language.proficiency is '':  # TODO exception E chizi bedam age khali bood. :-?
            return

        usr.append_language(language)
        usr.total_num_of_elems += 1
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True, 'id': language.id})

        self.response.write(result)

    def delete(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'l_id'):
            return

        lang_id = self.request.get('l_id').strip()

        try:
            lang_id = int(lang_id)
        except ValueError:
            return

        desired = None
        for l in usr.languages:
            if l.id == lang_id:
                desired = l
                break

        if desired is None:
            return

        usr.languages.remove(desired)
        usr.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)

    def post(self):
        usr = user_key(users.get_current_user().email()).get()
        if not user_is_logged_in(usr):
            return

        if attr_is_not_in_request(self.request, 'extra_param'):
            status = self.edit(usr)
        else:
            status = self.sort(usr)

        if status > 0:
            return

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'successful': True})
        self.response.write(result)

    def sort(self, usr):
        if attr_is_not_in_request(self.request, 'sorted_ids'):
            return 1

        sorted_ids = str(self.request.get('sorted_ids')).strip().split(',')
        mapping = dict((str(x.id), x) for x in usr.languages)
        usr.languages[:] = [mapping[x] for x in sorted_ids]
        usr.put()
        return 0

    def edit(self, usr):
        if attr_is_not_in_request(self.request, 'l_id'):
            return 1

        l_id = str(self.request.get('l_id')).strip()

        try:
            l_id = int(l_id)
        except ValueError:
            return 1

        desired = None
        for l in usr.languages:
            if l.id == l_id:
                desired = l
                break
        if desired is None:
            return 1

        desired.name = str(self.request.get('name')).strip()
        if desired.name is '':
            return 1

        desired.proficiency = str(self.request.get('proficiency')).strip()
        if desired.proficiency is '':
            return 1

        usr.put()
        return 0