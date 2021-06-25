# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:code_generate
"""

import errno
import os
import io
import shutil
import uuid
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

from flask import request, make_response
from flask import send_file
from flask_cors import cross_origin

from porter import settings
from porter.handlers.base import BaseResource
from porter.utils.logger import DwLogger

logger = DwLogger()


class ReceiveGenerateConfig(BaseResource):

    @staticmethod
    def generate(code_type, user_uuid, config_data):
        logger.info("Generate start %s of %s" % (code_type, user_uuid))
        if code_type in settings.CODE_TYPE:
            load_input_model = __import__("porter.handlers.%s_generate" % code_type, fromlist=['object'])

            get_main_class = getattr(load_input_model, code_type.title())
            run_result = get_main_class().run(user_uuid, config_data)
            logger.info("%s of %s execute over,success: %s" % (code_type, user_uuid, run_result))

    @cross_origin()
    def post(self):
        params = request.get_json(force=True)

        code_type = params["type"]
        config_data = params["data"]
        user_uuid = str(uuid.uuid4())

        executor = ThreadPoolExecutor(1)
        executor.submit(self.generate, code_type, user_uuid, config_data)
        # self.generate(code_type, user_uuid, config_data)
        return make_response({"uuid": user_uuid}, 200)


class GetProjectFile(BaseResource):

    @cross_origin()
    def get(self, user_uuid, code_type):

        file_path = os.path.join(get_template_zip_path(), user_uuid + ".zip")
        if os.path.isfile(file_path):

            return_data = io.BytesIO()
            with open(file_path, "rb") as fo:
                return_data.write(fo.read())
            return_data.seek(0)

            os.remove(file_path)
            return send_file(return_data,
                             mimetype="application/zip",
                             attachment_filename="%s_project_%s.zip" % (
                                 code_type, datetime.now().strftime("%Y%m%d%H%M%S")),
                             as_attachment=True)
        else:
            return make_response({"error": "File not exists."}, 200)


def get_template_folder_path(code_type, user_uuid):
    src = os.path.join(os.getcwd(), "template", code_type)
    dst = os.path.join(os.getcwd(), "porter", "temp", "folder", user_uuid)

    try:
        # shutil.rmtree(dst)
        shutil.copytree(src, dst)
    except OSError as exc:
        if exc.errno == errno.ENOTDIR:
            shutil.copy(src, dst)
        else:
            raise

    return dst


def get_template_zip_path():
    return os.path.join(os.getcwd(), "porter", "temp", "zip")
