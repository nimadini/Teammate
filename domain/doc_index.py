__author__ = 'stanley'

from google.appengine.api.search import QueryError
from datetime import datetime
from google.appengine.api import search

def create_doc(email, gender, degree, availability, price):
    return search.Document(
        doc_id=email,
        fields=[
            search.TextField(name='email', value=email),
            search.TextField(name='gender', value=gender),
            search.TextField(name='degree', value=degree),
            search.NumberField(name='availability', value=availability),
            search.NumberField(name='price', value=price),
            search.DateField(name='date', value=datetime.now().date())
        ])

def store_idx(doc, name):
    try:
        index = search.Index(name=name)
        index.put(doc)

    except (search.Error, QueryError) as e:
        print 'Shit!'   # TODO

# updates index in case of price
def update_index_price(price, email, name):
    index = search.Index(name=name)
    doc = index.get(email)
    if price == doc.field('price').value:
        return

    doc.fields.remove(doc.field('price'))
    doc.fields.append(search.NumberField(name='price', value=price))
    index.put(doc)

# updates index in case of availability
def update_index_availability(availability, email, name):
    index = search.Index(name=name)
    doc = index.get(email)
    if availability == doc.field('availability').value:
        return

    doc.fields.remove(doc.field('availability'))
    doc.fields.append(search.NumberField(name='availability', value=availability))
    index.put(doc)

# updates index in case of higher degree
def update_index_degree(deg, email, name):
    index = search.Index(name=name)
    doc = index.get(email)
    if deg == doc.field('degree').value:
        return

    doc.fields.remove(doc.field('degree'))
    doc.fields.append(search.TextField(name='degree', value=deg))
    index.put(doc)


# in case necessary uncomment
'''def delete():
    index = search.Index(name='user_basic')
    index.delete('test@example.com')'''