__author__ = 'stanley'
from google.appengine.api import search
from google.appengine.api.search import QueryError
import webapp2
import json
from init import *
from domain.user import User

class AutocompleteHandler(webapp2.RequestHandler):
    def get(self):
        try:
            param = str(self.request.get('term')).strip()
        except UnicodeEncodeError:
            return
        if param == "":
            return

        query = 'given_name: ' + param.lower() + ' OR surname: ' + param.lower()
        query_options = search.QueryOptions(limit=7)
        try:
            query_obj = search.Query(query_string=query, options=query_options)
        except QueryError:
            return
        results = search.Index(name=INDEX_NAME).search(query=query_obj)

        top7_names = []
        for desired in results:
            found = User.query(User.id == desired.fields[0].value).get()
            if found is None:
                pass
            else:
                top7_names.append(found.given_name + ' ' + found.surname)

        top7_names.sort(key=lambda v: v.lower())

        top7 = []
        for desired in top7_names:
            elem = {
                'id': desired,
                'label': desired,
                'value': desired
            }
            top7.append(elem)
        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps(top7)
        self.response.write(result)