__author__ = 'stanley'

import webapp2
from domain.statistics.statistics import *

class Statistics(webapp2.RequestHandler):
    def get(self):
        stat = statistics_key('my_stat').get()
        # TODO: some logging would be good...
        if stat is None:
            return

        result = 'letter\tfrequency\nBS\t' + str(stat.BS.get_avg_price()) + \
                 '\nBA\t' + str(stat.BA.get_avg_price()) + '\nMS\t' + str(stat.MS.get_avg_price()) + \
                 '\nMA\t' + str(stat.MA.get_avg_price()) + '\nPhD\t' + str(stat.PhD.get_avg_price()) + '\n'
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(result)
