# Generated by Django 4.2.3 on 2023-11-29 09:16

import django.db.models.deletion
from django.db import migrations

import ansible_ai_connect.users.models


class Migration(migrations.Migration):
    dependencies = [
        ("organizations", "0001_initial"),
        ("users", "0008_user_external_username"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="organization",
            field=ansible_ai_connect.users.models.NonClashingForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="organizations.organization",
            ),
        ),
    ]
