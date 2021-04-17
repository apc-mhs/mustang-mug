from config import Config

def create_app(config_name=Config):
    app = Flask(__name__.split('.')[0])
    app.config.from_object(config_name)
    