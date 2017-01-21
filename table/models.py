from __future__ import unicode_literals

from django.db import models

class TableRow(models.Model):
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)
    email = models.EmailField(max_length=100, null=True)
    phone = models.CharField(max_length=100, null=True)
    comment = models.TextField(default='', null=True)

    def __unicode__(self):
        return '%s %s' % (self.first_name, self.last_name)