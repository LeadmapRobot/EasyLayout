# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:app
"""
import flask_cors
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix


class Porter(Flask):
    """A custom Flask app for Porter"""

    def __init__(self, *args, **kwargs):
        # kwargs.update(
        #     {
        #         "template_folder": settings.STATIC_ASSETS_PATH,
        #         "static_folder": settings.STATIC_ASSETS_PATH,
        #         "static_url_path": "/static",
        #     }
        # )
        super(Porter, self).__init__(__name__, *args, **kwargs)
        # Make sure we get the right referral address even behind proxies like nginx.
        self.wsgi_app = ProxyFix(self.wsgi_app, x_for=1, x_host=1)
        # Configure Porter using our settings
        self.config.from_object("porter.settings")


def create_app():
    from porter import handlers

    app = Porter()

    handlers.init_app(app)
    flask_cors.CORS(app)

    return app
