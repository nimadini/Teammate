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

def update_stat_edu(prev_highest_deg, recent_highest_deg, price):
    if prev_highest_deg == recent_highest_deg:
        return

    stat = statistics_key('my_stat').get()

    # TODO: some logging would be good...
    if stat is None:
        return

    # prev none but new stuff is added now
    if prev_highest_deg is None and recent_highest_deg is not None:
        recent_entity = getattr(stat, recent_highest_deg)
        if price is not None:
            if price == 'negotiable':
                pass
            else:
                # not a good practice (in case of malicious user casting to float can cause...)
                recent_entity.price += float(price)

        recent_entity.number += 1

    # some stuff existed but now is removed
    elif prev_highest_deg is not None and recent_highest_deg is None:
        prev_entity = getattr(stat, prev_highest_deg)
        prev_entity.number -= 1

        if price is not None:
            if price == 'negotiable':
                pass
            else:
                # not a good practice (in case of malicious user casting to float can cause...)
                prev_entity.price -= float(price)

    # some stuff has changed to something new
    # note that not None - not None is
    # not possible due to previous checks
    elif prev_highest_deg is not None and recent_highest_deg is not None:
        prev_entity = getattr(stat, prev_highest_deg)
        prev_entity.number -= 1
        recent_entity = getattr(stat, recent_highest_deg)
        recent_entity.number += 1

        if price is not None:
            if price == 'negotiable':
                pass
            else:
                # not a good practice (in case of malicious user casting to float can cause...)
                prev_entity.price -= float(price)
                recent_entity.price += float(price)

    stat.put()

def update_stat_price(prev_price, recent_price, highest_deg):
    if prev_price == recent_price:
        return

    # TODO: This can cause a nondeterminism (first add term then add edu)
    if highest_deg is None:
        return

    stat = statistics_key('my_stat').get()

    # TODO: some logging would be good...
    if stat is None:
        return

    entity = getattr(stat, highest_deg)

    if prev_price is None and recent_price is not None:
        if recent_price == 'negotiable':
            entity.price += entity.get_avg_price()
        else:
            # TODO: type-checking and exception handling
            pr = float(recent_price)
            entity.price += pr

    if prev_price is not None and recent_price is not None:
        # both of them can't be nego, because of the first if in this function...
        if prev_price == 'negotiable':
            entity.price += float(recent_price)

        elif recent_price == 'negotiable':
            entity.price -= float(prev_price)
            entity.price += entity.get_avg_price()

        else:
            entity.price -= float(prev_price)
            entity.price += float(recent_price)

    # not none, none does not occur, because of UI (Bad assumption...)

    stat.put()