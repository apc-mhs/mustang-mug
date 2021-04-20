import os

class Config(object):
    APP_NAME = 'Mustang Mug'
    SECRET_KEY = os.environ.get('SECRET_KEY')
    