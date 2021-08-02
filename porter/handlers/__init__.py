# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:__init__.py
"""

from porter.handlers.api import api


def init_app(app):
    api.init_app(app)
