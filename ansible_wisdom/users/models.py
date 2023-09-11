import logging
import uuid

from django.apps import apps
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.functional import cached_property
from django_prometheus.models import ExportModelOperationsMixin

logger = logging.getLogger(__name__)


class User(ExportModelOperationsMixin('user'), AbstractUser):
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    community_terms_accepted = models.DateTimeField(default=None, null=True)
    commercial_terms_accepted = models.DateTimeField(default=None, null=True)
    organization_id = models.IntegerField(default=None, null=True)

    def is_oidc_user(self) -> bool:
        if not self.social_auth.values():
            return False
        if self.social_auth.values()[0]["provider"] != "oidc":
            return False

        return True

    @cached_property
    def has_seat(self) -> bool:
        # For dev/test purposes only:
        if self.groups.filter(name='Commercial').exists():
            return True

        if not self.is_oidc_user():
            return False

        seat_checker = apps.get_app_config("ai").get_seat_checker()
        if not seat_checker:
            return False
        uid = self.social_auth.values()[0]["uid"]
        rh_org_id = self.organization_id
        return seat_checker.check(uid, self.sso_login(), rh_org_id)

    @cached_property
    def is_org_admin(self) -> bool:
        if not self.is_oidc_user():
            return False

        seat_checker = apps.get_app_config("ai").get_seat_checker()
        if not seat_checker:
            return False
        rh_org_id = self.organization_id
        return seat_checker.is_org_admin(self.sso_login(), rh_org_id)

    @cached_property
    def is_org_lightspeed_subscriber(self) -> bool:
        if not self.is_oidc_user():
            return False

        seat_checker = apps.get_app_config("ai").get_seat_checker()
        if not seat_checker:
            return False
        rh_org_id = self.organization_id
        return seat_checker.is_org_lightspeed_subscriber(rh_org_id)

    def sso_login(self) -> str:
        try:
            extra_data = self.social_auth.values()[0].get('extra_data') or {}
            if not isinstance(extra_data, dict):
                logger.error("Unexpected extra_data=`%s', user=`%s'", extra_data, self.username)
                raise ValueError
        except (KeyError, AttributeError, IndexError, ValueError):
            extra_data = {}
        return extra_data.get('login', '')
