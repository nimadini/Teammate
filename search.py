__author__ = 'stanley'
from google.appengine.api import users, mail, search
from google.appengine.api.search import QueryError
from datetime import datetime
import webapp2
import json
import re
from init import *
import hashlib


def create_doc(degree, email, id):
    return search.Document(
        doc_id=id,
        fields=[
            search.TextField(name='degree', value=degree),
            search.TextField(name='email', value=email),
            search.DateField(name='date', value=datetime.now().date())
        ])


def store_idx(doc, name):
    try:
        index = search.Index(name=name)
        index.put(doc)

    except (search.Error, QueryError) as e:
        print 'Shit!'   # TODO