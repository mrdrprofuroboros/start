# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-01-20 21:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('table', '0002_auto_20170121_0017'),
    ]

    operations = [
        migrations.AddField(
            model_name='tablerow',
            name='comment',
            field=models.TextField(default='', null=True),
        ),
        migrations.AddField(
            model_name='tablerow',
            name='phone',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
