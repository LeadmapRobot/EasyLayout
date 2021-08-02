# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:api
"""
from flask_restful import Api
from porter.handlers.code_generate import ReceiveGenerateConfig, GetProjectFile

api = Api()


api.add_resource(ReceiveGenerateConfig, "/receive_config", endpoint="receive_config")

api.add_resource(GetProjectFile, "/get_project/<user_uuid>/<code_type>", endpoint="get_project")