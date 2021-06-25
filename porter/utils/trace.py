# -*- coding: UTF-8 -*-
"""
@time:2020-12-21 16:53
@author:zhang
@file:trace.py
"""


import sys
import traceback
import os


def currentFrame():
    """Return the frame object for the caller's stack frame."""
    try:
        raise Exception
    except:
        return sys.exc_info()[2].tb_frame.f_back


def findCaller(srcfile):
    """
    Find the stack frame of the caller so that we can note the source
    file name, line number and function name.
    """

    frame = currentFrame()
    # On some versions of IronPython, currentFrame() returns None if
    # IronPython isn't run with -X:Frames.
    if frame is not None:
        frame = frame.f_back
    fln = "(unknown file)", 0, "(unknown function)"
    while hasattr(frame, "f_code"):
        code = frame.f_code
        filename = os.path.normcase(code.co_filename)
        if filename == srcfile:
            frame = frame.f_back
            continue
        fln = (code.co_filename, frame.f_lineno, code.co_name)
        break
    return fln


def gettraceback():
    '''
    获取堆栈
    '''

    return traceback.format_exc()


def printtraceback():
    '''
    打印堆栈
    '''

    traceback.print_exc()
