__author__ = 'stanley'

import webapp2


class Statistics(webapp2.RequestHandler):
    def get(self):
        result = 'letter\tfrequency\nBS\t10\nBA\t8\nMS\t14\nMA\t15\nPhD\t25\n'
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write(result)
