from datetime import datetime


DATE_FORMAT = '%Y-%m-%dT%H:%M:%S.%f%Z'


def to_msbpay_string(dt: datetime) -> str:
    return datetime.strftime(dt, DATE_FORMAT)


def from_msbpay_string(dt: str) -> datetime:
   return datetime.strptime(dt, DATE_FORMAT)
