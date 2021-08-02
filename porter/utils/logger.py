# -*- coding: UTF-8 -*-
"""
@time:2020-12-21 16:53
@author:zhang
@file:logger.py
"""


import logging
import logging.config
import json
import os as pyos
from porter.utils import trace
from datetime import datetime
from logging.handlers import RotatingFileHandler

NAME2LEVEL = {
    'CRITICAL': logging.CRITICAL,
    'ERROR': logging.ERROR,
    'WARN': logging.WARNING,
    'WARNING': logging.WARNING,
    'INFO': logging.INFO,
    'DEBUG': logging.DEBUG,
    'NOTSET': logging.NOTSET,
}

LEVEL2NAME = {
    logging.CRITICAL: 'CRITICAL',
    logging.ERROR: 'ERROR',
    logging.WARNING: 'WARNING',
    logging.INFO: 'INFO',
    logging.DEBUG: 'DEBUG',
    logging.NOTSET: 'NOTSET',
}


class InvalidMessageError(Exception):
    """
    无效消息异常
    """
    pass


def getLevelName(level):
    return (NAME2LEVEL.get(level) or LEVEL2NAME.get(level) or
            "Level %s" % level)


class DwLogger:
    """
        项目日志输出工具类
    """

    def __init__(self, name="release"):
        """
        日志初始化
        """
        self.__logging = logging.getLogger(name)

        if self.__logging.hasHandlers():
            self.__logging.handlers.clear()

        self.__srcfile = pyos.path.normcase(self.__init__.__code__.co_filename)
        formatter = logging.Formatter(
            '%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s')
        #fileHandler = RotatingFileHandler(filename='logs/out.log',
        #                                  maxBytes=1024 * 1024 * 500, backupCount=5, encoding="utf-8")
        #fileHandler.setFormatter(formatter)
        #fileHandler.setLevel(logging.INFO)
        streamHandler = logging.StreamHandler()
        streamHandler.setFormatter(formatter)
        streamHandler.setLevel(logging.INFO)

        self.__logging.setLevel(logging.INFO)
        #self.__logging.addHandler(fileHandler)
        self.__logging.addHandler(streamHandler)

    def _fillTraceInfo(self, level, msg, event, **kwargs):
        """
        补充当前跟踪信息
        """

        infos = {}

        if event:
            if not isinstance(event, str):
                raise InvalidMessageError("非法的event信息")
            else:
                infos["event"] = event

        if msg:
            if isinstance(msg, dict):
                infos["content"] = json.dumps(msg)
            elif isinstance(msg, list):
                infos["content"] = json.dumps(msg)
            elif isinstance(msg, tuple):
                infos["content"] = json.dumps(msg)
            elif not isinstance(msg, str):
                raise InvalidMessageError("非法的message信息")
            else:
                infos["content"] = msg
        else:
            infos["content"] = infos.get("event")

        if "content" in infos:
            if isinstance(infos["content"], dict) or \
                    isinstance(infos["content"], list) or \
                    isinstance(infos["content"], tuple):
                infos["content"] = json.dumps(infos["content"])

        for key in kwargs:
            filed = str(key).lower()
            if filed in ["num", "duration"] and (
                    isinstance(kwargs.get(key), int) or isinstance(kwargs.get(key), float)):
                infos[filed] = kwargs.get(key)
            else:
                infos["extends.%s" % filed] = kwargs.get(key)

        co_filename, f_lineno, co_name = trace.findCaller(self.__srcfile)

        log_logging = "Level:%s|TS:%s|Filename:%s|Rownum:%d|Func:%s" % (
            level,
            datetime.now().strftime('%Y/%m/%d %H:%M:%S'),
            co_filename,
            f_lineno,
            co_name)
        log_list = [log_logging]
        for (key, value) in infos.items():
            log_content = "[{0}]:{1}".format(key.upper(), value)
            log_list.append(log_content)
        log_logging = '|'.join(log_list)

        return log_logging

    def debug(self, msg=None, event=None, **kwargs):
        """
        debug级别的日志输出
        """

        level = getLevelName(logging.DEBUG)
        log_logging = self._fillTraceInfo(level, msg, event, **kwargs)

        self.__logging.debug(log_logging)

    def info(self, msg=None, event=None, **kwargs):
        """
        info级别的日志输出
        """
        level = getLevelName(logging.INFO)
        log_logging = self._fillTraceInfo(level, msg, event, **kwargs)

        self.__logging.info(log_logging)

    def warn(self, msg=None, event=None, **kwargs):
        """
        warn级别的日志输出
        """

        level = getLevelName(logging.WARN)
        log_logging = self._fillTraceInfo(level, msg, event, **kwargs)

        self.__logging.warning(log_logging)

    def error(self, msg=None, event=None, **kwargs):
        """
        error级别的日志输出
        """

        level = getLevelName(logging.ERROR)
        log_logging = self._fillTraceInfo(level, msg, event, **kwargs)

        self.__logging.error(log_logging)

    def fatal(self, msg=None, event=None, **kwargs):
        """
        fatal级别的日志输出
        """

        level = getLevelName(logging.FATAL)
        log_logging = self._fillTraceInfo(level, msg, event, **kwargs)

        self.__logging.fatal(log_logging)
