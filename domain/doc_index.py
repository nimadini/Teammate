__author__ = 'stanley'

from google.appengine.api.search import QueryError
from datetime import datetime
from google.appengine.api import search

def create_doc(email, gender, degree, availability, price, given_name, surname):
    given_name = ','.join(tokenize_autocomplete(given_name.lower()))
    surname = ','.join(tokenize_autocomplete(surname.lower()))
    return search.Document(
        doc_id=email,
        fields=[
            search.TextField(name='email', value=email),
            search.TextField(name='gender', value=gender),
            search.TextField(name='degree', value=degree),
            search.NumberField(name='availability', value=availability),
            search.NumberField(name='price', value=price),
            search.TextField(name='given_name', value=given_name),
            search.TextField(name='surname', value=surname),
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
def delete():
    index = search.Index(name='user_basic')
    index.delete('nima.dini@example.com')
    index.delete('gitamostafizi@example.com')

def tokenize_autocomplete(phrase):
    a = []
    for word in phrase.split():
        j = 1
        while True:
            for i in range(len(word) - j + 1):
                a.append(word[i:i + j])
            if j == len(word):
                break
            j += 1
    return a