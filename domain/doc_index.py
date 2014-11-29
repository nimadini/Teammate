__author__ = 'stanley'
from google.appengine.api.search import QueryError
from datetime import datetime
from google.appengine.api import search


def create_doc(email, degree):
    return search.Document(
        doc_id=email,
        fields=[
            search.TextField(name='email', value=email),
            search.TextField(name='degree', value=degree),
            search.DateField(name='date', value=datetime.now().date())
        ])


def store_idx(doc, name):
    try:
        index = search.Index(name=name)
        index.put(doc)

    except (search.Error, QueryError) as e:
        print 'Shit!'   # TODO


# updates index in case of higher degree
def update_index(usr, email, name):
    index = search.Index(name=name)
    doc = index.get(email)
    deg = usr.get_highest_degree()
    if deg == doc.field('degree').value:
        return

    doc.fields.remove(doc.field('degree'))
    doc.fields.append(search.TextField(name='degree', value=deg))
    index.put(doc)


#def delete():
#    index = search.Index(name=INDEX_NAME)
#    index.delete('nima.dini@gmail.com')
#    index.delete('kambiz.hosseini@gmail.com')