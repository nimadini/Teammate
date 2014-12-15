__author__ = 'stanley'

import webapp2
from domain.statistics.statistics import *
from domain.statistics.entity import Entity
import json

class StatHandler(webapp2.RequestHandler):
    def get(self):
        qry = Statistics.query(Statistics.id == 'Teammate_Statistics')
        if qry.get() is not None:
            self.response.headers['Content-Type'] = 'application/json'
            result = json.dumps({'First Access': False})
            self.response.write(result)
            return

        statistics = Statistics(key=statistics_key('my_stat'))
        statistics.id = 'Teammate_Statistics'
        statistics.BS = Entity(price=0.0, number=0)
        statistics.BA = Entity(price=0.0, number=0)
        statistics.MS = Entity(price=0.0, number=0)
        statistics.MA = Entity(price=0.0, number=0)
        statistics.PhD = Entity(price=0.0, number=0)
        statistics.put()

        self.response.headers['Content-Type'] = 'application/json'
        result = json.dumps({'First Access': True})
        self.response.write(result)