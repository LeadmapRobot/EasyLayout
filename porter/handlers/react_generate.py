# -*- coding: UTF-8 -*-
"""
@time:2021/6/24
@author:zhangwei
@file:react_generate
"""
import errno
import shutil
import os
import json
from porter.handlers.code_generate import get_template_folder_path, get_template_zip_path

from porter.utils.logger import DwLogger

logger = DwLogger()


class React:
    code_type = "react"

    @staticmethod
    def _create_config_file(temp_path, config_data):
        with open(os.path.join(temp_path, "assets", "config.json"), "w") as outfile:
            json.dump(config_data, outfile)

    @staticmethod
    def _create_component(temp_path, config_data):
        component_path = os.path.join(temp_path, "src", "components")

        template_content = """import React from "react";

export default function %scomponent(props) {

    const { style, title } = props;
    return<div style={style}>{title}</div>
}"""

        for component in config_data["componentTpl"]:
            file_name = component["componentName"]

            component_folder_path = os.path.join(component_path, file_name)
            os.mkdir(component_folder_path)

            with open(os.path.join(component_folder_path, "index.jsx"), "w") as outfile:
                outfile.write(template_content % file_name.title())

    @classmethod
    def run(cls, user_uuid, config_data):
        """
        1.获取模板文件
        2.添加config至assets文件夹下
        3.读取config内容,将componentName转换成文件夹
        4.在componentName的新生成文件夹下,添加index.jsx
        5.打压缩包,删除文件夹
        :param user_uuid:
        :param config_data:
        :return:
        """
        logger.info("Uuid: %s" % user_uuid)
        logger.info("Config data: %s" % json.dumps(config_data))

        # 1
        temp_path = get_template_folder_path(cls.code_type, user_uuid)
        logger.info("%s os %s temp file path: %s" % (cls.code_type, user_uuid, temp_path))

        try:
            # 2
            cls._create_config_file(temp_path, config_data)

            # 3 & 4
            cls._create_component(temp_path, config_data)

            # 5
            zip_store_path = get_template_zip_path()
            shutil.make_archive(os.path.join(zip_store_path, user_uuid), "zip", temp_path)
            shutil.rmtree(temp_path)

            return True
        except Exception as e:
            logger.error(e)
            return False
