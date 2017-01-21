from django.conf.urls import url
from frontend import views


urlpatterns = [
    url(r'^auth/permissions/$', views.permissions, name='permissions'),
]