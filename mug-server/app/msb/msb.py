from typing import Any, Dict, Optional

import requests

from .types import (
    APIServer,
    BooleanResponse,
    CartPaymentRefundResponse,
    CreateUpdateCartResponse,
    GetCartOrdersResponse,
    GetCartResponse,
    GetCartsResponse,
    ProcessCartResponse,
    SearchDepartmentsResponse,
    SearchGLAccountsResponse,
    SearchPaymentMethodsResponse,
    SearchPaymentsResponse,
    SearchStoresResponse
)


class MsbPayAPI:
    def __init__(self, authorization: str, server: APIServer) -> None:
        """
        :param authorization: Example: demoaccount:EBNF-JNEC-HKHL-EALD-JMFJ-BKOM-PHNA-CKLP
        :param server: The base URL for the MSB Pay API
        """
        self.server = server
        self.session = requests.Session()
        self.session.headers['Authorization'] = authorization

    def _get(self, endpoint: str, params: Dict[str, Any] = {}) -> Any:
        response = self.session.get(
            self.server.value + endpoint, params=params)
        response.raise_for_status()

        json = response.json()
        return json

    def _post(self, endpoint: str, params: Dict[str, Any] = {}, data: Optional[Dict[str, Any]] = None) -> Any:
        response = self.session.post(
            self.server.value + endpoint, params=params, json=data)
        response.raise_for_status()

        json = response.json()
        return json

    def _put(self, endpoint: str, params: Dict[str, Any] = {}, data: Optional[Dict[str, Any]] = None) -> Any:
        response = self.session.put(
            self.server.value + endpoint, params=params, json=data)
        response.raise_for_status()

        json = response.json()
        return json

    def _delete(self, endpoint: str, params: Dict[str, Any] = {}) -> Any:
        response = self.session.delete(
            self.server.value + endpoint, params=params)
        response.raise_for_status()

        json = response.json()
        return json

    def get_system_details(self):
        return self._get('/')

    def get_identity(self) -> Dict[str, Any]:
        return self._get('/whoAmI')

    def get_carts(self, **kwargs: Any) -> GetCartsResponse:
        return self._get('/carts', kwargs)

    def create_cart(self, data: Dict[str, Any]) -> CreateUpdateCartResponse:
        return self._post('/carts', data=data)

    def get_cart(self, cart_id: str) -> GetCartResponse:
        return self._get(f'/carts/{cart_id}')

    def update_cart(self, cart_id: str, data: Dict[str, Any]) -> CreateUpdateCartResponse:
        return self._put(f'/carts/{cart_id}', data=data)

    def delete_cart(self, cart_id: str) -> BooleanResponse:
        return self._delete(f'/carts/{cart_id}')

    def add_items_to_cart(self, cart_id: str, data: Dict[str, Any]) -> CreateUpdateCartResponse:
        return self._post(f'/carts/{cart_id}/addItems', data=data)

    def process_cart(self, cart_id: str) -> ProcessCartResponse:
        return self._post(f'/carts/{cart_id}/process')

    def get_cart_orders(self, cart_id: str) -> GetCartOrdersResponse:
        return self._get(f'/carts/{cart_id}/orders')

    def get_cart_payments(self, cart_id: str) -> SearchPaymentsResponse:
        return self._get(f'/carts/{cart_id}/payments')

    def refund(self, cart_id: str, payment_id: str, data: Dict[str, Any]) -> CartPaymentRefundResponse:
        return self._post(f'/carts/{cart_id}/payments/{payment_id}/refund', data=data)

    def get_payments(self, client_id: str, **kwargs: Any) -> SearchPaymentsResponse:
        return self._get(f'/clients/{client_id}/payments', kwargs)

    def confirm_transfer(self, client_id: str, payment_id: str) -> BooleanResponse:
        return self._post(f'/clients/{client_id}/payments/{payment_id}/confirmtransfer')

    def get_payment_methods(self, client_id: str, **kwargs: Any) -> SearchPaymentMethodsResponse:
        return self._get(f'/clients/{client_id}/paymentMethods', kwargs)

    def get_stores(self, client_id: str, **kwargs: Any) -> SearchStoresResponse:
        return self._get(f'/clients/{client_id}/stores', kwargs)

    def get_departments(self, client_id: str, **kwargs: Any) -> SearchDepartmentsResponse:
        return self._get(f'/clients/{client_id}/departments', kwargs)

    def get_gl_accounts(self, client_id: str, **kwargs: Any) -> SearchGLAccountsResponse:
        return self._get(f'/clients/{client_id}/glAccounts', kwargs)
