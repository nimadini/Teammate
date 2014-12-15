__author__ = 'stanley'
from google.appengine.ext import ndb
from entity import Entity

class Statistics(ndb.Model):
    id = ndb.StringProperty()
    BS = ndb.StructuredProperty(Entity)
    BA = ndb.StructuredProperty(Entity)
    MS = ndb.StructuredProperty(Entity)
    MA = ndb.StructuredProperty(Entity)
    PhD = ndb.StructuredProperty(Entity)


def statistics_key(_id):
    return ndb.Key('Statistics', _id)

def update_stat_edu(prev_highest_deg, recent_highest_deg):
    if prev_highest_deg == recent_highest_deg:
        return

    stat = statistics_key('my_stat').get()

    # TODO: some logging would be good...
    if stat is None:
        return

    # prev none but new stuff is added now
    if prev_highest_deg is None and recent_highest_deg is not None:
        recent_entity = getattr(stat, recent_highest_deg)
        recent_entity.number += 1

    # some stuff existed but now is removed
    elif prev_highest_deg is not None and recent_highest_deg is None:
        prev_entity = getattr(stat, prev_highest_deg)
        prev_entity.number -= 1

    # some stuff has changed to something new
    # note that not None - not None is
    # not possible due to previous checks
    elif prev_highest_deg is not None and recent_highest_deg is not None:
        prev_entity = getattr(stat, prev_highest_deg)
        prev_entity.number -= 1
        recent_entity = getattr(stat, recent_highest_deg)
        recent_entity.number += 1

    stat.put()