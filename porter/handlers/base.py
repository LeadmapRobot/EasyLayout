# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:base
"""
from flask_restful import Resource, abort


class BaseResource(Resource):
    decorators = []

    def __init__(self, *args, **kwargs):
        super(BaseResource, self).__init__(*args, **kwargs)


# def get_object_or_404(fn, *args, **kwargs):
#     try:
#         rv = fn(*args, **kwargs)
#         if rv is None:
#             abort(404)
#     except NoResultFound:
#         abort(404)
#     return rv