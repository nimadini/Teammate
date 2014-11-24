__author__ = 'stanley'


def user_is_logged_in(usr):
    if usr is None:
        raise False
    return True


def attr_is_not_in_request(req, attr):
    val = str(req.get(attr)).strip()
    if val is '':
        return True
    return False