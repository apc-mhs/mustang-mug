from enum import Enum
from typing import Any, Dict, Optional, cast

import requests

from .types import BooleanResponse, CartPaymentRefundResponse, GetCartOrdersResponse, GetCartsResponse, MsbPayResponse, ProcessCartResponse, SearchDepartmentsResponse, SearchGLAccountsResponse, SearchPaymentMethodsResponse, SearchPaymentsResponse, SearchStoresResponse


class MSBPayAPIServer(Enum):
    PRODUCTION = 'https://www.myschoolbucks.com/msbpay/v2'
    TEST = 'https://test.www.myschoolbucks.com/msbpay/v2'
    STAGING = 'https://staging.www.myschoolbucks.com/msbpay/v2'


class MSBPayAPI:
    def __init__(self, authorization: str, server: MSBPayAPIServer) -> None:
        """
        :param authorization: Example: demoaccount:EBNF-JNEC-HKHL-EALD-JMFJ-BKOM-PHNA-CKLP
        :param server: The base URL for the MSB Pay API
        """
        self.server = server
        self.session = requests.Session()
        self.session.headers['Authorization'] = authorization

    def _get(self, endpoint: str, params: Dict[str, Any]) -> MsbPayResponse:
        response = self.session.get(self.server.value + endpoint, params=params)
        response.raise_for_status()

        json = response.json()
        return json

    def _post(self, endpoint: str, params: Dict[str, Any], data: Optional[Dict[str, Any]] = None) -> MsbPayResponse:
        response = self.session.post(self.server.value + endpoint, params=params, json=data)
        response.raise_for_status()

        json = response.json()
        return json

    def _put(self, endpoint: str, params: Dict[str, Any], data: Dict[str, Any]) -> MsbPayResponse:
        response = self.session.put(self.server.value + endpoint, params=params, json=data)
        response.raise_for_status()

        json = response.json()
        return json

    def _delete(self, endpoint: str, params: Dict[str, Any]) -> MsbPayResponse:
        response = self.session.delete(self.server.value + endpoint, params=params)
        response.raise_for_status()

        json = response.json()
        return json

    def get_system_details(self, **kwargs: Any):
        return self._get('/', kwargs)

    def get_who_am_i(self, **kwargs: Any) -> object:
        res = self._get('/whoAmI', kwargs)
        return cast(object, res)

    def get_carts(self, **kwargs: Any) -> GetCartsResponse:
        res = self._get('/carts', kwargs)
        return cast(GetCartsResponse, res)

    def process_cart(self, cart_id: str, **kwargs: Any) -> ProcessCartResponse:
        res = self._post(f'/carts/{cart_id}/process', kwargs)
        return cast(ProcessCartResponse, res)
    
    def get_cart_orders(self, cart_id: str, **kwargs: Any) -> GetCartOrdersResponse:
        res = self._get(f'/carts/{cart_id}/orders', kwargs)
        return cast(GetCartOrdersResponse, res)

    def get_cart_payments(self, cart_id: str, **kwargs: Any) -> SearchPaymentsResponse:
        res = self._get(f'/carts/{cart_id}/payments', kwargs)
        return cast(SearchPaymentsResponse, res)

    def refund(self, cart_id: str, payment_id: str, data: Dict[str, Any], **kwargs: Any) -> CartPaymentRefundResponse:
        res = self._post(f'/carts/{cart_id}/payments/{payment_id}/refund', kwargs, data=data)
        return cast(CartPaymentRefundResponse, res)

    def get_payments(self, client_id: str, **kwargs: Any) -> SearchPaymentsResponse:
        res = self._get(f'/clients/{client_id}/payments', kwargs)
        return cast(SearchPaymentsResponse, res)

    def confirm_transfer(self, client_id: str, payment_id: str, **kwargs: Any) -> BooleanResponse:
        res = self._post(f'/clients/{client_id}/payments/{payment_id}/confirmtransfer', kwargs)
        return cast(BooleanResponse, res)

    def get_payment_methods(self, client_id: str, **kwargs: Any) -> SearchPaymentMethodsResponse:
        res = self._get(f'/clients/{client_id}/paymentMethods', kwargs)
        return cast(SearchPaymentMethodsResponse, res)

    def get_stores(self, client_id: str, **kwargs: Any) -> SearchStoresResponse:
        res = self._get(f'/clients/{client_id}/stores', kwargs)
        return cast(SearchStoresResponse, res)

    def get_departments(self, client_id: str, **kwargs: Any) -> SearchDepartmentsResponse:
        res = self._get(f'/clients/{client_id}/departments', kwargs)
        return cast(SearchDepartmentsResponse, res)

    def get_gl_accounts(self, client_id: str, **kwargs: Any) -> SearchGLAccountsResponse:
        res = self._get(f'/clients/{client_id}/glAccounts', kwargs)
        return cast(SearchGLAccountsResponse, res)