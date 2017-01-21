from django.contrib import admin
from .models import *

@admin.register(TableRow)
class PedalAdmin(admin.ModelAdmin):
    pass