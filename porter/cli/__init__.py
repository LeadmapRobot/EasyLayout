# -*- coding: UTF-8 -*-
"""
@time:2021/6/23
@author:zhangwei
@file:__init__.py
"""
import click
from flask import current_app
from porter.app import create_app
from flask.cli import FlaskGroup, run_command


def create(group):
    app = current_app or create_app()
    group.app = app
    return app


@click.group(cls=FlaskGroup, create_app=create)
def cli():
    """Management script for the Wiki application."""


cli.add_command(run_command, "runserver")
